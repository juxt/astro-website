---
author: 'fky'
title: 'Parsing routes with clojure spec'
description: 'Speccing out routes'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '27 Jul 2016'
heroImage: 'parsing-routes.jpg'
---

One of the jobs of routing libraries like
[pedestal](https://github.com/pedestal/pedestal),
[bidi](https://github.com/juxt/bidi) or
[tripod](https://github.com/frankiesardo/tripod) is to compile human
readable routes to a format optimised for computation.

For example tripod wants to convert this terse syntax

```clojure
[["/" ^:interceptors [:json-body]
  ["/pets" {:get :retrieve-all-pets
            :post :create-pet}
   ["/:id" ^:constraints {:id #"/d+"} ^:interceptors [:pet-exists]
     {:get :retrieve-pet-by-id
      :put :update-pet-by-id}]]]]
```

Into a routing friendly structure that looks like this

```clj
[{:path "/"
  :interceptors [:json-body]
  :children [{:path "/pets"
              :handlers {:get :retrieve-all-pets
                         :post :create-pet}
              :children [{:path "/:id"
                          :constraints {:id #"/d+"}
                          :interceptors [:pet-exists?]
                          :handlers {:get :retrieve-pet-by-id
                                     :put :update-pet-by-id}}]}
             {:path "/orders"
              :handlers {:get :retrieve-all-orders}}]}]
```

(Which is just an intermediate representation in tripod, but I'm
digressing here)

When you write such a parser for a wide audience your priorities should
be:

1.  Clearly document what are the accepted input values

2.  Deal gracefully with human mistakes (e.g. do not fail with a NPE
    please)

3.  Provide useful error messages

4.  Write the actual parsing code

Most people (including myself) focus on number `4` and deal with
everything else with a `(throw (new Exception "Read the source code"))`.

Let's see if using `clojure.spec` can help us. Let's start with
documenting the simplest specs firsts.

```clj
(s/def ::path string?)
(s/def ::constraints (s/and map? (comp :constraints meta)))
(s/def ::interceptors (s/and vector? (comp :interceptors meta)))
(s/def ::handlers (s/and map? (comp not :constraints meta)))
(s/def ::children (s/and vector? (comp not :interceptors meta) ::route))
```

There isn't much going on here except for the `::route` spec at the end
of the `children` definition. That indicates that our spec is recursive.
Let's write `::route` down:

```clj
(s/def ::route (s/cat :path ::path
                      :constraints (s/? ::constraints)
                      :interceptors (s/? ::interceptors)
                      :handlers (s/? ::handlers)
                      :children (s/* ::children)))
(s/def ::routes (s/coll-of ::route))
```

A route needs a path at the start, then optionally specifies constraints
or interceptors, then has an optional handlers map, and finally can have
any number of nested children routes.

If you've used `clojure.spec` more than a couple of days this should
look pretty self-explanatory. Otherwise you might want to read the
paragraph _Sequences_ here <http://clojure.org/about/spec>.

Now what about parsing?

```clj
(defn expand-terse-routes [routes]
  (s/conform ::routes routes))

(expand-terse-routes
 [["/" ^:interceptors [:json-body]
   ["/pets" {:get :retrieve-all-pets
             :post :create-pet}
    ["/:id" ^:constraints {:id #"/d+"} ^:interceptors [:pet-exists]
      {:get :retrieve-pet-by-id
       :put :update-pet-by-id}]]]])
;; =>
[{:path "/"
  :interceptors [:json-body]
  :children [{:path "/pets"
              :handlers {:get :retrieve-all-pets
                         :post :create-pet}
              :children [{:path "/:id"
                          :constraints {:id #"/d+"}
                          :interceptors [:pet-exists?]
                          :handlers {:get :retrieve-pet-by-id
                                     :put :update-pet-by-id}}]}
             {:path "/orders"
              :handlers {:get :retrieve-all-orders}}]}]
```

Done. All happens magically thanks spec conforming.

It's time to check the error messages. What happens if we forget to
specify the path string at the beginning of a route?

```clj
;; Note the #_ comments out the path string

(expand-terse-routes
 [[#_"/" ^:interceptors [:json-body]
   ["/pets" {:get  :retrieve-all-pets
             :post :create-pet}
    ["/:id" ^:constraints {:id #"/d+"} ^:interceptors [:pet-exists]
     {:get :retrieve-pet-by-id
      :put :update-pet-by-id}]]]])

;; => :clojure.spec/invalid
```

Ok we need to provide some more info. Let's use `s/explain`

```clj
(defn expand-terse-routes [routes]
  (if (s/valid? ::routes routes)
    (s/conform ::routes routes)
    (s/explain ::routes routes)))

(expand-terse-routes
 [[#_"/" ^:interceptors [:json-body]
   ["/pets" {:get  :retrieve-all-pets
             :post :create-pet}
    ["/:id" ^:constraints {:id #"/d+"} ^:interceptors [:pet-exists]
     {:get :retrieve-pet-by-id
      :put :update-pet-by-id}]]]])

;; => In: [0 0] val: [:json-body] fails spec: :tripod.route2/path at: [:path] predicate: string?
```

Not too bad. What if this happens down in the nested routes?

```clj
(expand-terse-routes
 [["/" ^:interceptors [:json-body]
   ["/pets" {:get  :retrieve-all-pets
             :post :create-pet}
    [#_"/:id" ^:constraints {:id #"/d+"} ^:interceptors [:pet-exists]
     {:get :retrieve-pet-by-id
      :put :update-pet-by-id}]]]])

;; => In: [0 2] val: (["/pets" {:get :retrieve-all-pets, :post :create-pet} [{:id #"/d+"} [:pet-exists] {:get :retrieve-pet-by-id, :put :update-pet-by-id}]]) fails spec: :tripod.route2/route predicate: (cat :handlers (? :tripod.route2/handlers) :children (* :tripod.route2/children)),  Extra input
```

Mhmh, not very helpful. What spec is saying is the vector under
`"/pets"` cannot be conformed to `::children` so it reports an error at
the top level saying it has got extra input that cannot be conformed to
anything known. It would be nice it there was a way to tell spec that if
it find that vector then it _has_ to be a children vector and any error
should be relative to that vector alone.

What if we mess up the order of the elements? (e.g. we put interceptors
and constraints after the handlers?)

```clj
(expand-terse-routes
 [["/" ^:interceptors [:json-body]
   ["/pets" {:get  :retrieve-all-pets
             :post :create-pet}
    ["/:id"
     {:get :retrieve-pet-by-id
      :put :update-pet-by-id}
      ^:constraints {:id #"/d+"} ^:interceptors [:pet-exists]
      ]]]])

;; => In: [0 2] val: (["/pets" {:get :retrieve-all-pets, :post :create-pet} ["/:id" {:get :retrieve-pet-by-id, :put :update-pet-by-id} {:id #"/d+"} [:pet-exists]]]) fails spec: :tripod.route2/route predicate: (cat :handlers (? :tripod.route2/handlers) :children (* :tripod.route2/children)),  Extra input
```

Totally unhelpful.

What `clojure.spec` provides though is the very descriptive
`s/explain-data`, which is a data representation of the problem

```clj
(s/explain-data ::routes
 [["/" ^:interceptors [:json-body]
   ["/pets" {:get  :retrieve-all-pets
             :post :create-pet}
    ["/:id"
     {:get :retrieve-pet-by-id
      :put :update-pet-by-id}
      ^:constraints {:id #"/d+"} ^:interceptors [:pet-exists]
      ]]]])

;; => #:clojure.spec{:problems ({:path [], :reason "Extra input", :pred (cat :handlers (? :tripod.route2/handlers) :children (* :tripod.route2/children)), :val (["/pets" {:get :retrieve-all-pets, :post :create-pet} ["/:id" {:get :retrieve-pet-by-id, :put :update-pet-by-id} {:id #"/d+"} [:pet-exists]]]), :via [:tripod.route2/routes :tripod.route2/route], :in [0 2]})}
```

If you'd like to report more precise errors in theory you could use this
structure to explain validations problems given your very specific
domain. Proof is left as an exercise for the reader.

# Summary

1.  `clojure.spec` does provide a clear documentation of accepted
    inputs. You might need to get used to its syntax but it's a massive
    step forwards from simple docstrings.

2.  Using validation we are free from checking for nils and other
    operations that might result in obscure exceptions.

3.  Default spec errors are useful in a very limited number of cases.
    You'll need to write something custom to help your end users (or
    your future self).

4.  Conforming an input to a spec dramatically decreases the amount of
    code you have to write.

3 out of 4. Vote 7+ would use it again.

# Appendix

Full code example

```clj
(require '[clojure.spec :as s])

(s/def ::path string?)
(s/def ::constraints (s/and map? (comp :constraints meta)))
(s/def ::interceptors (s/and vector? (comp :interceptors meta)))
(s/def ::handlers (s/and map? (comp not :constraints meta)))
(s/def ::children (s/and vector? (comp not :interceptors meta) ::route))

(s/def ::route (s/cat :path ::path
                      :constraints (s/? ::constraints)
                      :interceptors (s/? ::interceptors)
                      :handlers (s/? ::handlers)
                      :children (s/* ::children)))
(s/def ::routes (s/coll-of ::route))

(defn expand-terse-routes [routes]
  (if (s/valid? ::routes routes)
    (s/conform ::routes routes)
    (s/explain-data ::routes routes)))

(def terse-routes
 [["/" ^:interceptors [:json-body]
   ["/pets" {:get :retrieve-all-pets
             :post :create-pet}
    ["/:id" ^:constraints {:id #"/d+"} ^:interceptors [:pet-exists]
      {:get :retrieve-pet-by-id
       :put :update-pet-by-id}]]]])

(def verbose-routes
 [{:path "/"
   :interceptors [:json-body]
   :children [{:path "/pets"
               :handlers {:get :retrieve-all-pets
                          :post :create-pet}
               :children [{:path "/:id"
                           :constraints {:id #"/d+"}
                           :interceptors [:pet-exists?]
                           :handlers {:get :retrieve-pet-by-id
                                      :put :update-pet-by-id}}]}
              {:path "/orders"
               :handlers {:get :retrieve-all-orders}}]}])
```
