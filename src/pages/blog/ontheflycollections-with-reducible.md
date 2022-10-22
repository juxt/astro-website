---
author: 'bnh'
title: 'On-the-fly collections with Reducibles'
description: 'Digest large datasets with ease'
category: 'clojure'

publishedDate: '22 Oct 2019'
heroImage: 'on-the-fly.jpg'
---

# Lazy Sequences

Lazy Sequences are great for exploring a problem space. _However you hit
a few snags as data volumes ramp up:_

## It is all too easy to create head retention

leading to an Out Of Memory Error

## Each lazy sequence maintains its own header tank of chunked data

which can add up to **alot** of memory in a long pipeline

## Difficult to release resources predictably

For system resources like Files, there is no reliable way to release
resources that are lazily crawled

## Exception are deferred to _The Future_

Any latent exceptions will be exposed in a lazy manner; meaning you
could have to handle an exception when you are least expecting it, or
have the Virtual Machine quietly end that thread.

## Awkward to interrupt processing

if you want to abort processing 2% of the way through a 1'000'000'000
element sequence you may find that it takes a surprisingly long time to
finish and return control.

# Enter reducible

A **reducible** is a neat way to avoid these problems.

A **reducible** is a direct `reify` of `clojure.lang.IReduceInit` or
`clojure.lang.IReduce` that conceals a `loop/recur` behind a `reduce`
friendly facade.

It runs eagerly and can plug into `reduce/transduce/into` thereby
avoiding problems described above.

## Consider `IReduceInit`

because this is the more general purpose of the two.

It is defined in
<https://github.com/clojure/clojure/tree/master/src/jvm/clojure/lang/IReduceInit.java#L13-L15>
as

\`\`\` public interface IReduceInit{ Object reduce(IFn f, Object start)
; } \`\`\`

this `reduce` method will get called by `clojure.core/reduce` function.
A general implementation might look like

\`\`\` (defn iterator-reducible \"expresses an iterator through the
medium of IReduceInit if first-val is nil it will be ignored\"
\[first-val \^java.util.Iterator it\] (reify IReduceInit (reduce \[this
f init\] (loop \[acc (if first-val (f init first-val) init)\] (if (or
(reduced? acc) (not (.hasNext it))) (unreduced acc) (recur (f acc (.next
it)))))))) \`\`\` . It's a plain old `loop/recur` . We invoke the
reducing function `f` to handle a value . We always check the
accumulator for the `reduced` short circuit. This supports
early-termination constructs like `(take 2` The iterator may go on for
ever, so we need a way to break out of the loop. . the first parameter
to the reduce function is the Java `this` reference, it typically does
not carry any value her and is usually ignored.

You use **reducibles** directly with

- `into`

- `reduce`

- `transduce`

```clojure
(into [] (take 10) (iterator-reducible :starting-value (.iterator (range))))
=> [:starting-value 0 1 2 3 4 5 6 7 8]
```

You **CANNOT** plug them into `sequence`

```clojure
(sequence (take 10) (iterator-reducible :starting-value (.iterator (range))))

IllegalArgumentException Don't know how to create ISeq from: dev$iterator_reducible$reify__54612  clojure.lang.RT.seqFrom (RT.java:550)
```

although you can of course `(into '()`

## It gets useful when

using system resources; for example if we need to crawl zip files but
have to make sure that the file resources get released immediately after
use, then we can write

```clojure
(defn zipfile-reducible
  "expects to be passed a .zip or .jar file
   crawls through the file, presenting entries to the reducing function
   ensures the file is closed afterwards"
  [zf]
  (reify IReduceInit
    (reduce [this f init]
      (with-open [is (clojure.java.io/input-stream zf)
                  zis (ZipInputStream. is)]
        (loop [acc init]
          (let [next-entry (.getNextEntry zis)]
            (if (and (some? next-entry)
                  (not (reduced? acc)))
              (recur (f acc (assoc (bean next-entry)
                              :input-stream zis)))
              (unreduced acc)))
          )))))
```

and we can experiment with

```clojure
(into []
  (comp (drop 10) (take 1))
  (zipfile-reducible
    (jio/file (System/getProperty "java.home") "lib/charsets.jar")))
```

to take this further, we can then crawl _every_ zip entry in _every_
.jar file in `/usr/lib/jvm` like this

```clojure
(defn preserving-reduced
  "copy-and-pasted from clojure.core, which declares it as private"
  [rf]
  #(let [ret (rf %1 %2)]
     (if (reduced? ret)
       (reduced ret)
       ret)))

(defn chaining-reducible
  "like concat but for reducibles
  takes a coll of colls.
  Returns reducible that chains call to reduce over each coll"
  [coll-of-colls]
  (reify IReduceInit
    (reduce [_ f init]
      (let [prf (preserving-reduced f)]
        (reduce (partial reduce prf)
          init
          coll-of-colls)))))

(defn iszipped-suffix?
  [^File f]
  (let [n (.getName f)]
    (some #(string/ends-with? n %)
      #{".jar" ".zip"})))


(time (reduce
        (fn [acc _] (inc acc))
        0
        (chaining-reducible
          (map zipfile-reducible
            (filter iszipped-suffix?
              (file-seq (.getParentFile (.getParentFile (jio/file (System/getProperty "java.home"))))))))))
"Elapsed time: 16922.336304 msecs"
=> 367051
```

Note that we are using lazy sequences of zipfile reducibles; If this
created a problem, there is scope for turning this into a reducible too

## Careful of those arities

- The 2 argument `reduce` will only ever use `clojure.lang.IReduce`

- **Everything else** uses `clojure.lang.IReduceInit` including

  - BOTH arities of `transduce`

  - `into`

  - `eduction`

so

```clj
(reduce + (iterator-reducible nil (.iterator (range 10))))

ClassCastException dev$iterator_reducible$reify__54612 cannot be cast to clojure.lang.IReduce  clojure.core.protocols/fn--7831 (protocols.clj:75)
```

will throw you a ClassCastException

but

```clj
(transduce identity + (iterator-reducible nil (.iterator (range 10))))
=> 45
```

won't!

We could of course extend the `iterator-reducible` definition to support
this but in practice I find the 2 argument form of `reduce` to be little
used.

## Conclusion

If you have large volumes of data to process, it is worth considering
whether reducibles can get you better performance with lower system
resource usage.
