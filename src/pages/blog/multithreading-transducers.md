---
author: 'bnh'
title: 'Multithreading within a transducer'
description: 'Parallelising transducers'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '12 Mar 2019'
heroImage: 'mock3.jpg'
---

[pmap](https://clojure.github.io/clojure/clojure.core-api.html#clojure.core/pmap)
(parallelising map) is a clojure function that parallelises computation
of the function against the inputs.

It is very easy to use; just change `map` to `pmap` and you are done.

But `pmap` does not work in a transducer; Why is this, and can we write
an equivalent?

# What does pmap do anyway?

If you call `source pmap` you will see that it:

1.  uses `map` to lazily construct `future` s of the passed function
    call

2.  returns a lazy sequence that `deref` s these futures

3.  launches the first `(availableProcessors +2)` futures immediately
    (but see next item)

4.  Note that it is subject to **chunking**. The first 32 futures will
    automatically be realised, which could result in wasted computation.

# What if I just put futures into my transducer?

You absolutely can do this! There are just two downsides:

1.  You will end up with a bunch of futures in your reducing function,
    which is not quite the easy-to-use thing offered by `pmap`

2.  You only indirectly control the parallelisation (by the speed that
    your reducing function runs)

# How about if I deref the futures inline?

This will get you the data you need, but will immediately remove any
parallelisation

# How about if I put a lag between the future and the deref?

Now you're talking!

If we make the transducer run on 6 item lag, we can have exactly 6
futures in flight at any time.

All we have to do is to write a bit of code to create a lag. We can
recruit `clojure.lang.PersistentQueue` to do this for us:

```clojure
(defn build-lagging-transducer
  "creates a transducer that will always run n items behind.
   this is convenient if the pipeline contains futures, which you
   want to start deref-ing only when a certain number are in flight"
  [n]
  (fn [rf]
    (let [qv (volatile! PersistentQueue/EMPTY)]
      (fn
        ([] (rf))
        ([acc] (reduce rf acc @qv))
        ([acc v]
         (vswap! qv conj v)
         (if (< (count @qv) n)
           acc
           (let [h (peek @qv)]
             (vswap! qv pop)
             (rf acc h))))))))
```

And we can use this to write the transducer generating function:

```clojure
(defn parallelising-map
  [f]
  (let [n (+ 2 (.. Runtime getRuntime availableProcessors))]
    (comp (map #(fn [] (f %)))
          (map future-call)
          (build-lagging-transducer n)
          (map deref))))
```

# Show me

Lets define a function that we wish to multithread. Something that goes
to sleep randomly:

```clojure
(defn sleepy-fn
  [counter v]
  (let [ts (+ 500 (rand-int 500))]
    (println (str "starting " v))
    (Thread/sleep ts)
    (println (str "completed " v))
    [(swap! counter inc) v ts]))
```

And now lets try `parallelising-map`:

```clojure
(let [counter (atom 0)]
  (into []
   (parallelising-map #(sleepy-fn counter %))
   (range 64)))
```

Note that this only works efficiently when tasks take similiar lengths
of time!

If quick tasks are stuck behind a long task, they will be held up. This
is a fundamental consequence of the linear nature of transducers

# What if I used an Executors/FixedThreadPool?

Well you could write something like:

```clojure
(let [counter (atom 0)
      n (+ 2 (.. Runtime getRuntime availableProcessors))
      ^ExecutorService exec (Executors/newFixedThreadPool n)]
  (transduce
   (comp (map #(fn [] (sleepy-fn counter %)))
         (map #(.submit exec %)))
   (completing conj #(map deref %))
   (range 64)))
```

But it doesn't avoid the fundamental problem that if we want the results
of `sleepy-fn` in order, then we are going to have to wait for them.

# In Summary

The `parallelising-map` function described here works as a transducer
friendly equivalent to
[pmap](https://clojure.github.io/clojure/clojure.core-api.html#clojure.core/pmap)
whilst avoiding issues potentially caused by chunking.

[clojure.lang.PersistentQueue](https://github.com/clojure/clojure/blob/master/src/jvm/clojure/lang/PersistentQueue.java)
is not particularly well documented, but is the easiest way to introduce
a queuing data structure into your programs.
