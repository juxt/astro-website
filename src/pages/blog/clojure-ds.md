---
draft: true
token: '1234'
author: 'fin'
title: "Building persistent data structures in Clojure"
description: 'How to build your custom data structures in Clojure'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '01 Dec 2022
heroImage: 'juxt-logo-minecraft.jpg'
tags:
  - 'clojure'
---

Clojure ships by default with a really good set of data structures,
so it's worth thinking hard before building your own. There are however cases when
doing so is warranted. Let's look at two approaches that can be taken when
building custom data structures.

## Bags as a primitive example

For the purpose of this post we are going to look at [bags](https://en.wikipedia.org/wiki/Multiset)
(also known as multisets). A bag extends the concept of a set to a set with a multiplicity
for each item. So whenever we for an item in a bag, the result will be the number of times
the item was added to the bag. `nil` if it is not present. The natural way to
represent a bag in Clojure is via a map.

```clojure
(defn bag [] {:size 0 :content {}})
```

We also add a `size` field so we can answer the question of the total size of the bag in stem:[O(1)].

The implementations for `add` and `rmv` then come naturally.

```clojure
(defn add [bag ele]
  (-> bag
      (update :size inc)
      (update-in [:content ele] (fnil + 0) 1)))

(defn rmv [{content :content :as bag} ele]
  (let [cnt (get content ele)]
    (-> bag
        (update :size dec)
        (assoc :content (cond
                          (nil? cnt) (throw (ex-info "No such element" {:ele ele}))
                          (= cnt 1) (dissoc content ele)
                          :else (update content ele - 1))))))
```

In `add` we simply increase the size of the whole bag and increment the
counter of the element if existent (defaulting to a value of 0 if not).
When removing an element from the bag we first decrease the total size of
the bag and then decrement the counter of the appropriate element. Two
special cases are if the item to be removed is not present in the bag
and if the item is only present with multiplicity 1. In the former we
throw an error as the operation is not valid, in the latter we simply
remove any reference to the element from the `content` map.

Checking for an item in a bag

```clojure
(defn contains?' [bag ele]
  (some? (get-in bag [:content ele])))

(defn count' [bag ele]
  (get-in bag [:content ele]))

(defn size [bag] (:size bag))
```clojure

`contains?'` and `count'` are quoted so that we are not overriding Clojure's core functions.

Using what we have just defined.

```clojure
(-> (bag) (add "foo") (add "foo") (rmv "foo") (add "bar"))
;; => {:size 2, :content {"foo" 1, "bar" 1}}
(contains?' *1 "foo")
;; => false
(count' *2 "foo")
;; => 1
```

## Extending Clojure’s core library

The second approach is to extend Clojure's core interfaces.
In this case `clojure.lang.IPersistentSet`. The implementation details remain
the same except that we need to create a new object when modifying the bag.

```clojure
(deftype Bag [size content]
  clojure.lang.IPersistentSet

  (seq [this] (seq content))

  (count [this] size)

  (cons [this o]
    (Bag. (inc size) (update content o (fnil + 0) 1)))

  (empty [this] (Bag. 0 {}))

  (equiv [this other] (= this other))

  (disjoin [this key]
    (let [cnt (get content key)]
      (Bag. (dec size)
            (cond
              (nil? cnt) (throw (ex-info "No such key" {:key key}))
              (= cnt 1) (dissoc content key)
              :else (update content key - 1)))))

  (contains [this key] (some? (get content key)))

  (get [this key] (get content key)))

(defn bag [] (Bag. 0 {}))
```

With this implementation we can use Clojure’s core functions to manipulate our bag.

```clojure
(-> (bag) (conj "foo") (conj "foo") (disj "foo") (conj "bar"))
;; => #{["foo" 1] ["bar" 1]}
(contains? *1 "foo")
;; => true
(get *2 "foo")
;; => 1
```

The trade-off between the two approaches is one between explicit and implicit.
Extending Clojure’s core interfaces gives the flexibility of using core
functions. If the people manipulating that part of the code base are very familiar
with it, go for it. The gotcha is that people not familiar with it might make wrong
assumptions about incoming/outgoing data (i.e. we can only `disjoin` on a standard set).
In that case it might be more prudent to create an extra namespace with dedicated functions.

## Choosing the interfaces

In case one decides to extend Clojure’s core interfaces one will probably
select a subset of some common interfaces. Some examples are

- `java.lang.Object` - for implementing equality
- `clojure.lang.IHasheq` - if the type needs to support Clojure’s `hash` function
- `clojure.lang.IPersistentMap` - in case your data structure fits a map type
- `clojure.lang.IFn` - if the type should support a function-like style (similar to `(#{1 2} 1) => 1)` )
- `clojure.lang.IObj` - for metadata support
- `clojure.lang.Counted` - so that `count` works for the type
- `clojure.lang.Associative` - if the type fits an associative interface
- `clojure.lang.Seqable` - if the type implements [the Seq interface](https://clojure.org/reference/sequences)

In certain cases an interface extends a more primitive interface. For example maps implement `clojure.lang.Associative`.

We could extend our  `Bag` type with `clojure.lang.IFn` to get the same function semantics as Clojure core sets.

```clojure
clojure.lang.IFn
(invoke [this k]
  (get this k))

(applyTo [this args]
  (let [n (clojure.lang.RT/boundedLength args 2)]
    (if (= 1 n)
      (.invoke this (first args))
      (throw (clojure.lang.ArityException. n (.. this (getClass) (getSimpleName)))))))
```

```clojure
(def b (-> (bag) (conj "foo") (conj "foo") (conj "bar")))
(b "foo") ;; => 2
```

If we are creating a new type there is also the possibility to modify the printer.

```clojure
(defmethod print-method Bag [bag ^java.io.Writer w]
  (.write w "#Bag{")
  (doseq [kv (seq bag)]
    (.write w (pr-str kv)))
  (.write w "}"))
```

```clojure
(-> (bag) (conj "foo") (conj "foo") (disj "foo") (conj "bar"))
;; => #Bag{["foo" 1]["bar" 1]}
```

## History for free

When building a new type on top of Clojure’s persistent data structures
you get history for free. This is also true for
the standard core data structures, but it’s still worth reiterating.

```clojure
(defrecord WrappedDS [current history])

(defn apply-op [{:keys [current] :as wrapped-ds} fn & args]
  (let [new-ds (apply fn current args)]
    (-> wrapped-ds
        (update :history conj new-ds)
        (assoc :current new-ds))))

(defn wrap [ds]
  (->WrappedDS ds [ds]))

(-> (wrap (bag))
    (apply-op conj "foo")
    (apply-op conj "foo")
    (apply-op disj "foo")
    (apply-op conj "bar")
    :history)
;; => [#{} #{["foo" 1]} #{["foo" 2]} #{["foo" 1]} #{["foo" 1] ["bar" 1]}]
```

We hope this post has been useful to you and that you will be hacking on your own data structures soon.

=== References

* https://www.brainonfire.net/files/seqs-and-colls/main.html
* https://clojure.org/reference/sequences
