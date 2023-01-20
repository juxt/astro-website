---
author: 'ren'
title: "The new Clojure 'iteration' function"
description: "'iteration' has been released in Clojure 1.11"
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '24 Jan 2022'
heroImage: 'clj-iteration-fn.jpg'
---

UPDATE: the original article, based on an alpha release, has been
updated to reflect Clojure 1.11 final. It also fixes a bug in the
original examples related to the meaning of `somef`.

# Introduction

The Clojure Core team is [hard at
work](https://www.youtube.com/watch?v=6vmTKoPzJUo) these days and they
recently announced a group of interesting changes in the new [Clojure
1.11](https://clojure.org/releases/devchangelog#_release_1_11_1) release
which includes the introduction of a new function called `iteration`.
This is the culmination of a few discussions and work starting on the
mailing list in
[2016](https://groups.google.com/g/clojure-dev/c/89RNvkLdYc4) by Kevin
Downey (aka \"hiredman\" on [Clojurians
Slack](https://clojurians.slack.com/) and other places). The original
thread was posing the problem of dealing with batched API calls, those
requiring the consumer a \"token\" from the previous invocation to be
able to proceed to the next. This behavior is very popular in API
interfaces such as [AWS
S3](https://docs.aws.amazon.com/cli/latest/reference/s3api/list-objects-v2.html),
where the API needs to protect against the case of a client requesting
the content of a bucket with millions of objects in it. If clients were
allowed such kind of unbounded calls, AWS servers would quickly overload
with many long lasting requests transferring megabytes of data over the
network. An elegant solution to this problem is to enforce a maximum
page-size of 1000 items (for example) and include a token that allows
the client to ask the next page of data if they desire to do so. This
prevents overloading by segmenting what could be a very long network
request into many smaller ones, giving the server an opportunity to
throttle requests if required.

# Iteration of Clojure sequences

In the past, Clojure developers dealing with paginated APIs have been
solving the same problem over and over. The problem is to create some
layer that hides away the need of knowing about the presence of
pagination and provides the
[seqable](https://clojuredocs.org/clojure.core/seqable_q) or
[reducible](https://clojuredocs.org/clojure.core/reduce) abstraction we
are all familiar with. It is then up to the user of such abstractions to
decide if they want to eagerly load many objects or consume them lazily,
without any need to know how many requests are necessary or how the
pagination mechanism works.

An \"iteration\" is effectively a stateful abstraction requested by a
client over a collection of data. The state consists of a \"cursor\" or
\"head position\" which indicates the element that will be returned
next. The cursor normally starts at some initial position when the
iteration is first created. Depending on the iteration type, the cursor
might only move forward, or also be allowed to go backward, or it can
access the collection at some random position. In the case of Clojure
sequences, the iteration has the following features:

- As the name implies it's sequential: you cannot access the nth
  element without first accessing the preceding items.

- There are no gaps.

- The iteration can only move forward.

- It's immutable.

- They are usually cached: the first access produces a cached version
  of that item.

- Are commonly (but not necessarily) lazy: the next element is
  produced only if that element is requested.

- They often apply
  [\"chunking\"](https://clojuredocs.org/clojure.core/chunk) to
  improve performance (again, not a rule). Chunking consists of
  processing more elements than actually requested.

In terms of the interface to control the iteration, there are 3 main
aspects to consider: fetch the element at the cursor location, move the
cursor to a new location and verify if there is an item at the position
pointed by the cursor. Any iteration API that provides this level of
control can be used to create a pagination layer.

Clojure already provides a function called
[iterate](https://clojuredocs.org/clojure.core/iterate) which could
provide a good starting point for our goals. However, the doc string of
the function clearly states (not surprisingly) that \"f must be free of
side-effects\". Thus `iterate`, like other sequential generators in the
standard library, does not guarantee once-only evaluation of the items
in the sequence, which could result in an arbitrary number of requests
to the backing API server.

There are definitely alternatives to `iterate` in the standard library
and one example is illustrated in the next section. While it is true
that the problem can be easily solved, the point is that the same
abstraction has been duplicated in [many
projects](https://github.com/search?q=list-objects+lazy++language%3AClojure&type=code)
and Clojure finally received an authoritative implementation.

# Example: iterating paginated objects old style

A typical requirement for many applications is to download objects from
Amazon S3. From Clojure you can use the
[Amazonica](https://github.com/mcohen01/amazonica) library, which wraps
Java with a nice idiomatic layer. Amazonica S3 contains a
[list-objects](https://github.com/mcohen01/amazonica/blob/be355a7379750856648652cd587a01636662dd42/test/amazonica/test/s3.clj#L89)
operation to retrieve the metadata information for the files in an S3
bucket (there is also a
[v2](https://docs.aws.amazon.com/AmazonS3/latest/API/API_ListObjectsV2.html)
version of the same API now, but assuming it works with few or no
changes for this example).

`list-objects` is a paginated request returning 1000 items by default,
including a continuation token `next-marker` to use for the following
request. Our goal here is to create a smooth development experience by
providing a sequential interface that hides the complexity of the
interaction. To help with running the example locally, we are going to
stub the S3 list-objects with the following fake `list-objects` (this is
inspired by some similar code in the actual [Clojure core tests for
`iteration`](https://github.com/clojure/clojure/blob/e45e47882597359aa2adce9f244ecdba730e6c76/test/clojure/test_clojure/sequences.clj#L1435-L1444)):

```clojure
;; A vector of 100 random numbers
(def results (vec (repeatedly 100 rand)))

(defn page-results
  "Get a subvector from next-marker to the length of page-size
   or till the end of the vector, if page-size is too big."
  [next-items next-marker page-size]
  (subvec
   next-items
   next-marker
   (min (+ next-marker page-size)
        (count next-items))))

(defn list-objects
  "Stub list-objects call to simulate S3 interaction."
  [& {:keys [bucket-name prefix next-marker]}]
  (let [next-items results
        page-size 12
        total-count (count next-items)
        truncated? (< (+ next-marker page-size) total-count)]
    (when (< next-marker total-count)
      {:truncated? truncated?
       :next-marker (when truncated? (+ next-marker page-size))
       :object-summaries (page-results next-items next-marker page-size)})))

(defn amazonica-s3-listobjects
  "Thin adapter layer to call the actual Amazonica list-object API.
  Bucket and prefix can be anything since they are unused in our local stub.
  This is our entry point into the Amazonica S3 library for this example."
  [bucket prefix]
  (fn [token]
    (list-objects :bucket-name bucket
                  :prefix prefix
                  :next-marker token)))

(-> ((amazonica-s3-listobjects :bucket :prefix) 20)
    :object-summaries
    clojure.pprint/pprint)

;; [0.17973186631945426
;;  0.11766342712061384
;;  0.46021361372380454
;;  0.8878281872246385
;;  0.3921644625211754
;;  0.48255337739983273
;;  0.9476269732650608
;;  0.9830267637727138
;;  0.03775653699413373
;;  0.4414217298527927
;;  0.1365124734545088
;;  0.5625448981935451]
```

`amazonica-s3-listobjects` creates a small wrapper closure around
`list-objects` to capture the statically assigned `:bucket` and
`:prefix` as initialization parameter ahead of the proper iteration.
Compared to the real Amazonica S3 API call, beside avoiding network
calls, there are only minor differences like using a smaller pagination
size of 12 to avoid long printouts in our experiments.

We can now move up one layer from the Amazonica library and capture the
paginated interaction as a Clojure sequence. The following
`fetch-summaries` function creates a lazy sequence on top of
`amazonica-s3-listobjects`. The idea is for the consumer to process as
much summaries as needed but normally not all of them (considering the
potential size of the bucket):

```clojure
(defn fetch-summaries
  "Retrieve object summaries for items in `bucket` at `prefix`."
  ([bucket prefix]
   (fetch-summaries bucket prefix 0))
  ([bucket prefix token]
   (lazy-seq
    (let [{:keys [object-summaries truncated? next-marker]}
          ((amazonica-s3-listobjects :bucket :prefix) token)]
      (if truncated?
        (cons object-summaries (fetch-summaries bucket prefix next-marker))
        (list object-summaries))))))

(->> (fetch-summaries :bucket :prefix 20)
     (sequence cat)
     (take 12)
     clojure.pprint/pprint)

;; (0.17973186631945426
;;  0.11766342712061384
;;  0.46021361372380454
;;  0.8878281872246385
;;  0.3921644625211754
;;  0.48255337739983273
;;  0.9476269732650608
;;  0.9830267637727138
;;  0.03775653699413373
;;  0.4414217298527927
;;  0.1365124734545088
;;  0.5625448981935451)
```

_\*Note\*: a clarification on terminology. `:truncated?` is `true` if
there are more results available (e.g. results were truncated and there
are more). When the last pagination of results returns, then
`truncated?` becomes `false` (e.g. there was no truncation required to
return the results)._

The function `fetch-summaries` contains the usual
[lazy-seq](https://clojuredocs.org/clojure.core/lazy-seq) pattern for
sequential generation. It also handles the details of the Amazonica S3
library contract: the token is called `:next-marker`, the results are
contained in a map and we know when there are more items by checking the
`:truncated?` flag recursively. In the next section, we are going to see
how we could write the same functionality based on the new `iteration`
function.

# Example: iterating paginated objects using the new function

The new `iteration` function distills the essence of `fetch-summaries`
by providing all the relevant ingredients. It takes the following 5
input arguments, the first of which is the only mandatory one. The
parameters defaults implement the common situation of paginated results
returned as a plain sequence. In our example, we need to tweak such
parameters to work with the map and keys returned by the S3 Amazonica
API. Here's each parameter in detail:

- `step` is a function of the next marker token. This function should
  contain the logic for making a request to the S3 API (or other
  relevant paginated API) passing the given token. The `step` function
  is expected to return the items produced by the iteration, including
  a way to tell if there are more items and the next token. `step`
  could be side-effecting. In our case,
  `(amazonica-s3-listobjects :bucket :prefix)` returns exactly the
  `step` function.

- `somef` is a function that applied to the return of `(step token)`
  returns `true` or `false` based on the fact that the request
  contains results or not, respectively. It defaults to
  [some?](https://clojuredocs.org/clojure.core/some_q), the actual
  function in the standard library. In our case we are going to use
  Amazonica S3 `:object-summaries` key to answer the question.

- `vf` is a function that applied to the return of `(step token)`
  returns the items from the current response page. It defaults to
  `identity`, so we are using `:object-summaries` again in our case
  because this is where the results are available.

- The token function `kf` is applied to the return of `(step token)`
  and should return the next marker token if one is available. This
  also defaults to `identity`. In our case we can use `:next-marker`.

- An initial value for the marker `initk`. It defaults to `nil`, but
  we need this to be 0 in our example.

Here's a replacement for `fetch-summaries` called `fetch-summaries2`
based on `iteration` and the same example we've seen so far to paginate
starting from `:next-token` equals 20 and taking the first 12 items.
Please note that you would need to use Clojure master branch (or
1.11.0-beta1, as soon as it is out officially, see Sean Corfield's fully
complete [deps.edn
file](https://github.com/seancorfield/dot-clojure/blob/develop/deps.edn#L69-L88)
for an idea on how to do this with deps.edn):

```clojure
(defn fetch-summaries2
  "New fetch summaries using iteration."
  ([bucket prefix]
   (fetch-summaries2 bucket prefix 0))
  ([bucket prefix token]
   (iteration (amazonica-s3-listobjects bucket prefix)
              :kf :next-marker
              :vf :object-summaries
              :initk token
              :somef :object-summaries)))

(->> (fetch-summaries2 :bucket :prefix 20)
     (sequence cat)
     (take 12)
     clojure.pprint/pprint)

;; (0.17973186631945426
;;  0.11766342712061384
;;  0.46021361372380454
;;  0.8878281872246385
;;  0.3921644625211754
;;  0.48255337739983273
;;  0.9476269732650608
;;  0.9830267637727138
;;  0.03775653699413373
;;  0.4414217298527927
;;  0.1365124734545088
;;  0.5625448981935451)
```

The body of `fetch-summaries2` is now reduced to a call to `iteration`
and nothing else! We can now say that `iteration` has properly captured
the level of abstraction required for this use case.

# Laziness

Laziness is a useful property to have when calling potentially expensive
network calls. The fact that the API supports pagination doesn't change
the assumption that we'd like to be able to consume as many items as we
need but not necessarily all of them, in particular when talking about a
large S3 bucket. We normally have two ways to go about stopping
paginating: one is using lazy sequential processing the other is using
[halt-when](https://clojuredocs.org/clojure.core/halt-when) to stop
reducing over the results. In this section we are going to illustrate
laziness for `iteration` and in the next how to reduce over an
`iteration`.

To help us understand laziness, we are going to add a simple `println`
to the `list-objects` function:

```clojure
(defn list-objects
  "Same as previous list-objects definition with an added println."
  [& {:keys [bucket-name prefix next-marker]}]
  (let [next-items results
        page-size 12
        total-count (count next-items)
        truncated? (< (+ next-marker page-size) total-count)]
    (println "### requested page at index" next-marker)       ;; Printing added here
    (when (< next-marker total-count)
      {:truncated? truncated?
       :next-marker (when truncated? (+ next-marker page-size))
       :object-summaries (page-results next-items next-marker page-size)})))
```

With this change, we can for observe which page is being requested, for
example:

```clojure
(let [results (take 10 (sequence cat (fetch-summaries :bucket :prefix)))]
  (last results))

;; ### requested page at index 0
;; ### requested page at index 12
;; ### requested page at index 24
;; 0.3722320250734412

;; fetch-summaries2 prints the same
(let [results (take 10 (sequence cat (fetch-summaries2 :bucket :prefix)))]
  (last results))

;; ### requested page at index 0
;; ### requested page at index 12
;; ### requested page at index 24
;; 0.3722320250734412
```

What is going on here? The results of calling `fetch-summaries` (on both
versions of `fetch-summaries`) are batched items as a collection of
collections. In general, we need to collapse the batches into a single
sequence and process them one by one, like we did in the example above.

Surprisingly, accessing the item in 10th position from the first page
produces 2 additional network calls for pages well ahead of what we
currently need. This is an effect of using the
[cat](https://clojuredocs.org/clojure.core/cat) transducer with
[sequence](https://clojuredocs.org/clojure.core/sequence) which produces
[chunking](http://clojure-doc.org/articles/language/laziness/#lazy-sequences-chunking)
that we can't easily control. Be aware that using ([(mapcat
identity)](https://clojuredocs.org/clojure.core/mapcat) would be even
worse making additional requests (`mapcat` always evaluate the first 4
arguments)!

The reader should understand that this is not a problem of `iteration`
itself, but more about the need to concatenate the results back for
processing maintaining laziness in place. We can use the following trick
to solve the problem:

```clojure
(defn lazy-concat
  "A concat version that is completely lazy and
  does not require to use apply."
  [colls]
  (lazy-seq
    (when-first [c colls]
      (lazy-cat c (lazy-concat (rest colls))))))

;; Comparing both versions of fetch-summaries at the same time
(let [results (take 10 (lazy-concat (fetch-summaries :bucket :prefix)))
      results2 (take 10 (lazy-concat (fetch-summaries2 :bucket :prefix)))]
  (last results)
  (last results2)
  nil)

;; Look, no extra calls now!
;; ### requested page at index 0
;; ### requested page at index 0
```

Instead of using `(sequence cat)`, the solution is to use `lazy-concat`,
a function that concatenates a collection of collections in the laziest
possible way. However, you need to remember to avoid using `sequence`
with transducers for processing items even after the initial
concatenation, because as soon as you do, chunking will hunt you down:

```clojure
(let [results (lazy-concat (fetch-summaries :bucket :prefix))]
  (last (take 10 (sequence (map str) results))))  ;; transforming the items into strings
;; ### requested page at index 0
;; ### requested page at index 12
;; ### requested page at index 24
;; "0.3722320250734412"
```

The take-away from this section is that it requires care to achieve
perfect laziness and make just the right number of API requests. It
would probably be nice if `iteration` could be configured in respect of
collapsing intermediate paginations into a flat sequence, removing this
responsibility from the consuming side, since it is frequently a desired
behavior.

# Reducing the `iteration`

No need to care about laziness if you are happy to consume all items!
`iteration` is \"reducible\" and will perform well with
[transduce](https://clojuredocs.org/clojure.core/transduce) or
[into](https://clojuredocs.org/clojure.core/into):

```clojure
(first (into [] (comp cat (map str)) (fetch-summaries2 :bucket :prefix)))

;; ### requested page at index 0
;; ### requested page at index 12
;; ### requested page at index 24
;; ### requested page at index 36
;; ### requested page at index 48
;; ### requested page at index 60
;; ### requested page at index 72
;; ### requested page at index 84
;; ### requested page at index 96
;; "0.09253984163327167"
```

We can see that we are consuming the entire sequence to access the first
item, paginating back and forth from the server as many times as needed.
We have an option to stop the reduction using
[halt-when](https://clojuredocs.org/clojure.core/halt-when) assuming we
know at which item to stop. Assuming we don't know about the existence
of `take`, here's how to stop after pulling 30 items from the API and
sum them up:

```clojure
(transduce
 (comp cat                            ;; concat pagination
       (map-indexed vector)           ;; create pairs index-item
       (halt-when (comp #{30} first)  ;; stop when index=30
                  (fn [acc itm] acc)) ;; return acc so far
       (map last))                    ;; just the items
 (completing conj #(reduce + %))      ;; sum up items on exit
 (fetch-summaries2 :bucket :prefix))

;; ### requested page at index 0
;; ### requested page at index 12
;; ### requested page at index 24
;; 17.981921138476928
```

By using `halt-when` or `take` we are able to only request the amount of
items we need. This produces similar effects to laziness, but it
requires a precise notion about when to stop that might not be trivial
for certain use cases.

# Summary

`iteration` is a new function that was added to the standard library in
Clojure 1.11. `iteration` adds a new style of iteration along with
others already present which takes into account the need for pagination
and side-effecting requests. It should be immediately useful for all
paginated API interactions requiring a continuation token to get the
next page of results. It contains enough knobs to adapt to any kind of
paginated API, not just the one presented in this article.

If you currently rely on a lazy version of such API interaction, you
need to pay attention at concatenating results back from `iteration`
because that's the only kind of output it provides. If you are happy to
always consume all items from the API response, then `iteration` can be
used as a drop-in replacement for your previous custom solution.

# References

- Official [Jira
  ticket](https://clojure.atlassian.net/browse/CLJ-2555)

- The [core team](https://www.youtube.com/watch?v=6vmTKoPzJUo)
  discusses several tickets, including `iteration`.

- Rich Hickey's
  [Gist](https://gist.github.com/richhickey/dc17e6c5cb7e4938e59d5b2e6cc833cb)
  with final version of the function.

- Original Ghadi Shayban's
  [Gist](https://gist.github.com/ghadishayban/050d0059e60884b95ffbb6f11901d0bb)
  showing some preliminary idea about how to interact with a
  paginating API (2016)

- Original [mailing list
  post](https://groups.google.com/g/clojure-dev/c/89RNvkLdYc4) that
  started the work (2016).

- A deeper explanation for many of the functions presented here is
  available on [Clojure: The Essential
  Reference](https://www.manning.com/books/clojure-the-essential-reference)
  by the same author of this post.

- This
  [thread](https://clojurians-log.clojureverse.org/clojure/2022-03-31/1648763674.883299)
  on Clojurians Slack raised a bug present in the article when
  requesting the last page of the results.
