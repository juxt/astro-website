---
author: 'mal'
title: 'Data Macros'
description: 'Expanding abbreviated data literals'
category: 'clojure'

publishedDate: '05 Jan 2016'
heroImage: 'mock3.jpg'
---

This article is about yet another development pattern that falls out of
[Prismatic's Schema library](https://github.com/Prismatic/schema).

[Schema
coercions](https://github.com/Prismatic/schema#transformations-and-coercion)
can be used to transform abbreviated data into canonical data. This
allows you to create _short-hands_ for your data structures. This is
analogous to Clojure's macros where the reader expands short-hand forms
into _canonical_ macro-less Clojure which can be more readily evaluated.

This needs an example.

Imagine we have a data structure that contains an action and an access
requirement needed to perform the action.

For example, to ensure that `:do-something` is only available to Bob, we
could write:

```clojure
{:action :do-something
 :allow {:user "bob"}}
```

We can define a schema for this:

```clojure
(require
 '[schema.core :as s]
  [schema.coerce :as sc])

(s/defschema AccessRequirement
 (->
  {(s/optional-key :user) String
   (s/optional-key :role) String}
  (s/constrained not-empty)))

(s/defschema Actions
 [{:action s/Keyword
   :allow AccessRequirement}])
```

If we are specifying users a lot, it might become desirable to permit
the following short-hand form:

```clojure
{:action :do-something
 :allow "bob"}
```

to expand _automatically_ to:

```clojure
{:action :do-something
 :allow {:user "bob"}}
```

So if instead of providing the access requirement as a map, we just use
a string, we mean that to be a map with the string as the value of the
`:user` entry.

We can define this short-hand as follows:

```clojure
(def AccessReqMapping
 {AccessRequirement
  (fn [x]
   (cond
    (string? x) {:user x}
    :otherwise x))})

(def access-right-coercer
  (sc/coercer Actions
              AccessReqMapping))
```

A coercion mapping is a map between _what we want_, and a function on
_what we've got_. If the function can turn what we've got into what we
want, it does so and the schema checking continues.

So what is `access-right-coercer`? It's a function that checks our input
data conforms to the schema. But as it does so it will also expand any
short-hands along the way, turning this:

```clojure
{:action :do-something
 :allow "bob"}
```

into this:

```clojure
{:action :do-something
 :allow {:user "bob"}}
```

Note, that this function will only coerce if it detects a short-hand, so
it's safe to use with an already expanded value. If the value doesn't
conform to the schema, and can't be made to, an exception is thrown.

If we expand out all the short-hand forms using declarative coercers, we
can avoid coding for them later in our data transformation logic. This
reduces work, complexity and ultimately bugs.

Just like code macros, data macros scale, recursively! In fact, it's a
technique that's used extensively in yada to make it easier to author
yada's resource-models.

For example, yada's syntax for declaring the set of formats a web
resource is capable of producing is quite complex. But the short-hand is
easy.

So this:

```clojure
{:produces
 [{:media-type "text/html"}]}
```

can be abbreviated to this:

```clojure
{:produces "text/html"}
```

Likewise, this:

```clojure
(require '[clojure.java.io])

{:methods
 {:get
  {:response
   (fn [ctx]
    (io/file "me.jpg")}}}
```

(for resources where the GET response is constant and independent of the
request) can be usefully shortened to this:

```clojure
(require '[clojure.java.io])

{:methods
 {:get (io/file "me.jpg")}}
```

Just like code macros, data macros are recursive. For example, our
upcoming HTTP library yada supports multiple authentication realms, each
with multiple schemes. In fact, the code assumes it. However, for the
vast majority of cases have a single authentication realm with a single
scheme. How can we support the complex case without making the common
cases overly verbose? Data Macros to the rescue!

```clojure
{:authentication
 {:realm "default"
  :scheme "Basic"
  :authenticator X}}
```

expands into:

```clojure
{:authentication
 {:realms
  {"default"
   {:schemes
    [{:scheme "Basic"
      :authenticator X}]}}}
```

Unlike code macros, we can _compose_ data macros by merging the coercion
mappings. Since functions are the values of these coercion mappings, the
only limiting factor is how much of a performance penalty we are willing
to spend.

If data literals in Clojure weren't powerful enough already, imagine
what you can with a powerful macro facility.
