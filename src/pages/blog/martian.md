---
author: 'oly'
title: 'Martian'
description: 'How to contact aliens'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '29 Sep 2016'
heroImage: 'mock3.jpg'
tags:
  - 'opensource'
---

I've worked quite a lot with APIs and HTTP in particular, and I've come
to some conclusions:

- I feel like I keep writing the same code on every project

- It's still surprisingly hard to get right

- I like defining _what_

- I don't want to have to care about _how_

When creating an API there will normally be two parts to consider: the
interface and the application layer. The interface consists of the
operations, parameters and data that gets returned, and is what makes
your API unique and useful. The application layer is how two processes
talk to each other, HTTP for example, which has its own nomenclature,
idioms and behaviours which are abstract and generic. Layers in
networking - physical, transport etc - should be opaque to each other.
Your interface in turn should be opaque to HTTP, but too often we fall
at the final hurdle and complect the definition of our interface with
implementation details like verbs and distinctions between minutiae like
route parameters and query parameters. It's not something you should
necessarily care about - as an application developer you want that sort
of thing to just work, so you can get on with using data and operations
to do interesting and valuable things.

Fortunately, if you want to _provide_ an API libraries like
[pedestal-api](https://github.com/oliyh/pedestal-api),
[yada](https://yada.juxt.pro) and
[compojure-api](https://github.com/metosin/compojure-api) can take care
of HTTP and let you simply describe your interface using data
structures. With interceptors or middleware you can easily add
cross-cutting aspects like metrics, logging and security. You even get a
flashy Swagger UI for free to show your friends how awesome your API is.
Sweet!

```clojure
(defhandler create-pet
  {:summary     "Create a pet"
   :parameters  {:body-params {:name s/Str
                               :type s/Str
                               :age s/Int}}
   :responses   {201 {:body {:id s/Int}}}}
 (fn [request] ... ))))
```

But what about _consuming_ APIs as a client? Client HTTP libraries like
[httpkit](http://www.http-kit.org/),
[clj-http](https://github.com/dakrone/clj-http) and
[cljs-http](https://github.com/r0man/cljs-http) let you make HTTP calls
but you still have to know what parameters go where in the url, query
string, headers or body, how to serialise and deserialise the body, what
method to use for each request and so on; your concise description of
your API operation has been lost, all complected with HTTP.
Cross-cutting requirements are also hard to implement in a uniform
manner - you'll have to pass your metrics registry or credentials
configuration around to wrap any code that might need to make an HTTP
call.

At this point you reach an interesting dichotomy - how come the Swagger
UI makes using the API easy for a human, but all your code calling it is
messy? Aren't machines meant to be better at talking to other machines
than people?

**[Martian](https://github.com/oliyh/martian)** uses descriptions of
APIs to hide the HTTP application layer and leave behind just the
operations and parameters of the interface. You're back to calling
operations with parameters and getting return values, just like normal
code. Here's a minimal example of using Martian against an API described
by Swagger:

```clojure
(require '[martian.core :as martian]
         '[martian.clj-http :as martian-http])

(let [m (martian-http/bootstrap-swagger "https://pedestal-api.herokuapp.com/swagger.json")]
  (martian/response-for m :create-pet {:name "Doggy McDogFace" :type "Dog" :age 3})
  ;; => {:status 201 :body {:id 123}}

  (martian/response-for m :get-pet {:id 123}))
  ;; => {:status 200 :body {:name "Doggy McDogFace" :type "Dog" :age 3}}
```

Nice and simple, looks like the interface we described on the server
side, and bootstrapping at runtime even allows the underlying HTTP
implementation to be refactored without your code needing to change.
Martian maps the parameters to the right place and chooses the most
efficient serialisation the API supports without any of it leaking into
your code. This is the separation of interface and application layer
that we've been aiming for.

Martian offers a few other features to further speed the progress of
writing your client code:

```clojure
;; explore the endpoints
(explore m)
=> [[:get-pet "Loads a pet by id"]
    [:create-pet "Creates a pet"]]

;; explore the :get-pet endpoint
(explore m :get-pet)
=> {:summary "Loads a pet by id"
    :parameters {:id s/Int}}

;; build the url for a request
(url-for m :get-pet {:id 123})
=> https://pedestal-api.herokuapp.com/pets/123

;; build the request map for a request
(request-for :get-pet {:id 123})
=> {:method :get
    :url "https://pedestal-api.herokuapp.com/pets/123"
    :headers {"Accept" "application/transit+msgpack"
    :as :byte-array}
```

What about those cross-cutting, non-functional aspects like
authentication or metrics? Martian uses `interceptors`, just like
Pedestal, to allow you to customise behaviour of the call either before
the request is made, after the response is received, or both. Let's add
some timing to our requests:

```clojure
(require '[martian.core :as martian]
         '[martian.clj-http :as martian-http])

(def request-timer
  {:name ::request-timer
   :enter (fn [ctx]
            (assoc ctx ::start-time (System/currentTimeMillis)))
   :leave (fn [ctx]
            (->> ctx ::start-time
                 (- (System/currentTimeMillis))
                 (format "Request to %s took %sms" (get-in ctx [:handler :route-name]))
                 (println))
            ctx)})

(let [m (martian-http/bootstrap-swagger
               "https://pedestal-api.herokuapp.com/swagger.json"
               {:interceptors (concat martian/default-interceptors
                                      [martian-http/encode-body
                                       (martian-http/coerce-response)
                                       request-timer
                                       martian-http/perform-request])})]

        (martian/response-for m :all-pets {:id 123}))
        ;; Request to :all-pets took 38ms
        ;; => {:status 200 :body {:pets []}}
```

Martian uses interceptors for everything, including the making of the
request, and allows you to write your own and configure them as you
wish. As a result, you can use any HTTP library you please if you don't
like the implementations provided for httpkit, clj-http and cljs-http.
For testing, you may even want to mock out HTTP and use schema
validation and generative responses - `martian-test` does just this, and
is covered in the next article, along with mapping APIs without Swagger
and more advanced composition. Continue reading at [Advanced
Martian](https://juxt.pro/blog/posts/advanced-martian.html) and [watch a
talk I gave at ClojureX
Bytes](https://skillsmatter.com/skillscasts/8843-clojure-bytes#video)
explaining the rationale.

[Martian is on Github](https://github.com/oliyh/martian), feedback and
contributions are very welcome.
