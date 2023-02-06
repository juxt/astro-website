---
author: 'mal'
title: 'iota'
description: 'Cheer up your testing with this small library'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2015-09-23'
heroImage: 'iota.jpg'
tags:
  - 'open source'
---

[iota](https://github.com/juxt/iota) is a little library from JUXT that
makes it quicker to author assertions in your tests.

It does this by presenting a more expressive syntax for specifying the
predicates you want to be satisfied by your test.

We designed iota after observing common patterns that emerged when we
were writing test suites.

One observation was that unlike Java methods that tend to return
primitives, or other objects, Clojure functions tend to return data
structures (maps, sets, lists), often with some deeper structure.

To test the result of functions like this, we often use a `let` binding
where we capture the result and then write multiple test assertions.

```clojure
(require '[schema.core :as s])

(let [result (some-fn-under-test)]
  (is (= :foo (:a result)))

  (is (= :bar (:b result)))

  (is (= :zip (get-in result [:x :y "z"])))

  (is (nil? (s/check result-schema result))))
```

iota provides a macro, `given`, to express these forms more succinctly,
so that your assertions read more like logic truth statements.

The first argument to `given` is the value _under test_, followed by a
set of _triples_, one per test assertion.

```clojure
(given (some-fn-under-test)
  :a := :foo

  :b := :bar

  [:x :y "z"] := :zip

  identity :- result-schema)
```

Arguably, the iota code is easier to read, because it reduces the
parenthesis, reads left-to-right and the middle _operator_ keyword in
each triple evokes logic notation.

The first keyword is `:=`, which could be read _implies_, _yields_ or
_is_. We _apply_ the function (or functions) on the left hand side, and
expect the result on the right.

# Schema conformance

Now we have this structure for writing predicates as triples, we can
have fun by changing the operator keyword.

Our first variation is to test values against [Prismatic
Schema](https://github.com/Prismatic/schema). We steal the `:-` keyword
used by schema's own custom `defn` to evoke the triple's meaning: the
result of applying the left-hand-side must satisfy the schema on the
right.

# More fun

We are now limited only by our imagination (and the number of short
keywords available to us in the set of all valid keywords in Clojure).

My personal favorite is the ⊃ (superset) operator which, as you might
expect, asserts that the derived value is a superset of the right hand
side. This is extremely useful when you want to test for headers in a
Ring response, but don't want the test to break if there are extra
headers in there. Of course, it has the added benefit of making your
code look happier.

```clojure
(given response
  :headers :⊃ {"Content-Type" "text/html;charset=utf-8"
               "Content-Length" "1298"})
```

# Function application

Suppose we want to check that our response has a status 204, and
consequently should not include `Content-Length`.

We can apply a number of functions, in turn, to the given value to
derive a new value to compare against.

For example, if we wanted to derive the set of header fields from the
response, we can specify a vector.

```clojure
[:headers keys set]
```

We can also use keywords, and strings, to extract values.

```clojure
[:headers "Vary"]
```

Putting it all together...

```clojure
(given response
  :status := 204

  [:headers keys set] :⊅ {"Content-Length"}
  [:headers "Vary"] := "Accept-Charset")
```

# ClojureScript support

[Nicolás Berger](https://github.com/nberger) recently sent in a very
welcome pull-request which we gladly accepted, allowing iota to be used
in ClojureScript tests as well as Clojure ones. So now your
ClojureScript tests can now smile too, thanks Nicolás!

# Summary

iota is a small yet surprisingly useful library, less than 100 lines of
code. We released it a few months ago and we've been surpised by the
small cult following it has attracted. Do give it a try, and let us know
what you think. Suggestions for improvements (or pull requests)
gratefully received!
