---
author: 'joe'
title: "Clojure's JSON ecosystem"
description: 'Choosing a JSON library for your Clojure application'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '01 Jun 2021'
heroImage: 'json-ecosystem.jpg'
tags:
  - 'json'
---

If you're new to Clojure then one of the first questions you might find
yourself asking is, _\"Which library should I choose to read and write
JSON?\"._ The family of JSON libraries for Clojure has grown over the
years, so let's take a look at the options for working with JSON in
Clojure and see how we can narrow down the field depending on the needs
of your application.

As with most choices that relate to building software systems, there are
trade-offs involved, so the choice will likely be driven by the context
in which you're working, including the demands on your application, your
existing library choices, and the processes and principles of your
organization.

# Clojure's data API

When using typed languages like Java, Kotlin, or Scala, choosing a
library to work with JSON often means choosing an API to interact with
your data too. In the case of _data binding_ libraries this might be an
API dictated by types you've created yourself. In other cases you might
find a traversal API based on lenses or some other builder types and
fluent chains of method calls.

Clojure famously encourages us to work with a small set of data types
and the core of Clojure provides a wealth of functions for interacting
with them. This typically means that no matter what library we use for
parsing a JSON object, we know that our destination is a Clojure map and
therefore our choice of JSON parsing library doesn't dictate our data
API. This is good news because when using Clojure your choice of JSON
library won't significantly affect your application code, your style of
programming, or the readability of your data interactions. That said,
let's discuss some of the pros and cons of Clojure's JSON libraries
(both popular and niche) and summarise the state of this small area of
the wider ecosystem.

# Cheshire

[Cheshire](https://github.com/dakrone/cheshire) has been the dominant
library for working with JSON in Clojure for many years, and the project
recently marked its tenth birthday. Cheshire was created by Lee Hinman
as a fork of another library, clj-json, with a goal of extending the
original with better handling of common value types (such as Dates,
UUIDs, and Clojure's set and symbol types) and adding support for
Jackson's binary format Smile, whilst maintaining great performance. To
date, Cheshire has over 15M downloads from Clojars and it's the library
you'll find most often when you browse the dependencies of a Clojure
project.

```clojure
(require '[cheshire.core :as json])

(json/parse-string "{\"foo\":\"bar\"}") ;; parse a JSON string
(json/parse-string "{\"foo\":\"bar\"}" true) ;; parse a JSON string, producing keyword keys
(json/parse-stream (clojure.java.io/reader "myfile.json")) ;; parse JSON from a file

(json/generate-string {:foo "bar"}) ;; generate a JSON string
(json/generate-string {:foo "bar"} {:pretty true}) ;; generate a JSON string with pretty printing
```

Cheshire, like many JSON libraries running on the JVM, relies on
[Jackson](https://github.com/FasterXML/jackson) to encode and parse JSON
and, since Jackson is a mature and highly-optimized JSON library, this
puts Cheshire in good stead. Cheshire is something of a swiss-army
knife, with support for custom encoders and decoders, pretty printing
options, additional binary formats like Smile and CBOR, and support for
configuring custom JSON factories to take advantage of Jackson's large
feature set.

In some environments, if dependencies are strictly controlled, then
deploying a library that depends on Jackson may not be desirable.
Jackson's core consists of around 27,000 lines of Java and it has a
large set of features not used by Cheshire. The transitive dependencies
of Cheshire also include Jackson's databind module, which contains over
68,000 lines of Java and has been subject to many published CVEs.
Although these vulnerabilities typically relate to older version streams
of Jackson databind and features not used by Cheshire, the breadth and
complexity that these libraries cover can create concern about
undiscovered vulnerabilities. In some contexts these points are
irrelevant, but if you are sensitive about introducing dependencies then
you may want to consider alternatives.

## Streaming in Cheshire

When working with very large JSON files, it may be preferable (and, in
some cases, necessary, due to hardware constraints) to stream and
process values as they are parsed, rather than parse all data into a
single in-memory structure. Since this use-case is less common, many
JSON libraries skip support for streaming entirely. Cheshire does offer
limited streaming support that can be used specifically when your JSON
file consists of either a top-level array containing a very large number
of items:

```clojure
(take 10
  (cheshire.core/parse-stream (clojure.java.io/reader "very-large-array.json")))
```

or a file containing a large number of JSON objects, one per line (also
known as JSON Lines or `.jsonl`):

```clojure
(take 10
  (cheshire.core/parsed-seq (clojure.java.io/reader "/tmp/very-large.jsonl")))
```

Cheshire's streaming support stops here, so if your very large JSON file
consists of a JSON object that _contains_ a very large array as a
property, you'll have to look elsewhere.

Summarising Cheshire:

- Fast (but not the fastest)

- Used **very** widely throughout the Clojure ecosystem, including
  clj-http, ring-json, and ring-middleware-format

- Dependency on Jackson

- Some streaming support

# data.json

[data.json](https://github.com/clojure/data.json) is part of a family of
data processing libraries created and maintained by the core Clojure
team. Like Cheshire, the project began over 10 years ago, and data.json
was originally adapted from an older JSON parsing namespace that was
part of the now defunct
[Clojure-contrib](https://github.com/richhickey/clojure-contrib).

data.json has **no** external dependencies. It's a pure-Clojure JSON
parser and encoder implementation and -- although it depends on a few
classes provided by Java's core for orchestrating reads and
writes -- it adds no other dependencies to your project. This makes
data.json great for environments where additional dependencies are
strictly controlled. The cost of this approach is that as payloads grow
beyond 10s of bytes, data.json cannot match the speed and efficiency of
libraries that build on the JVM's fastest and most highly-optimized
library, Jackson. The no-dependency approach results in a reduced
surface area for vulnerabilities, reduced deployment size, and reduced
scope for dependency conflicts (for which Jackson [has something of a
reputation](https://clojureverse.org/uploads/default/original/2X/b/ba56784c5bf75a20b595431d7a48570473e18f15.png)).

```clojure
(require '[clojure.data.json :as json])

(json/read-str "{\"foo\":\"bar\"}") ;; parse a JSON string
(json/read-str "{\"foo\":\"bar\"}" true) ;; parse a JSON string, producing keyword keys
(json/read (clojure.java.io/reader "myfile.json")) ;; parse JSON from a file

(json/write-str {:foo "bar"}) ;; generate a JSON string
(json/write-str {:foo "bar"} :indent true) ;; generate a JSON string with pretty printing
```

Summarising data.json:

- Zero external dependencies, a pure-Clojure implementation

- Not as fast as alternatives that use Jackson, unless payloads are
  very small

- No streaming support

# jsonista

At just three years old, [jsonista](https://github.com/metosin/jsonista)
is a relatively recent addition to the _JSON in Clojure_ landscape, and
is part of an ecosystem of libraries supporting web API development
created by Finnish software consultancy Metosin.

jsonista takes Cheshire as its performance low-water mark, but utilises
Jackson databind's object mapper directly to maximize performance. The
results are striking and detailed benchmarks published with the project
show jsonista outperforming the competition significantly for both
encoding and decoding at all payload sizes. As you might expect for a
library dedicated to eking out all possible performance gains,
jsonista's authors have implemented the performance critical parts of
the library in Java to eliminate boxing, dereferencing of Clojure vars,
and other sources of micro-inefficiency that Clojure typically incurs.

```clojure
(require '[jsonista.core :as json])

(json/read-value "{\"foo\":\"bar\"}") ;; parse a JSON string
(json/read-value "{\"foo\":\"bar\"}" json/keyword-keys-object-mapper) ;; parse a JSON string, producing keyword keys
(json/read-value (clojure.java.io/reader "myfile.json")) ;; parse JSON from a file

(json/write-value-as-string {:foo "bar"}) ;; generate a JSON string
(json/write-value-as-string {:foo "bar"} (json/object-mapper {:pretty true}))) ;; generate a JSON string with pretty printing
```

With its dedication to performance, jsonista keeps Clojure-based
features lean. However, since it's based on Jackson, it does offer a
very rich set of customisations through configuration of the Jackson
object mapper, including custom value encoders and decoders, and the
ability to register Jackson object mapper modules. jsonista is well
placed to unseat Cheshire as the dominant library for JSON in Clojure,
since improved performance is a feature most will grab willingly and,
for typical use-cases, jsonista can be a drop-in replacement.

Summarising jsonista:

- _Very_ fast

- Integrated by default into the Metosin web library ecosystem via
  Muuntaja

- Dependency on Jackson

- No streaming support

- Used less widely than Cheshire throughout the Clojure ecosystem,
  though this may change in time

# pjson

[pjson](https://github.com/gerritjvv/pjson) is something of a wildcard
on this list, since it's not commonly integrated into Clojure systems
and you will rarely (if ever) come across it being used by other Clojure
libraries. pjson was inspired by work done in the Java library
[boon](https://github.com/boonproject/boon), and, like others on this
list, the _raison d'etre_ of pjson is maximising performance.

Like jsonista, pjson moves much of its implementation into Java to
eliminate sources of micro-inefficiency in performance-critical areas.
pjson takes the further, somewhat dangerous step of eliminating any
guarantees around JSON _validation_ during parsing, in favor of
producing results _fast_. You can feed pjson badly-formed JSON and
receive what appears to be a successfully parsed (but very odd) result.
For most use-cases, this alone will discount pjson. To further
complicate matters, pjson's improved performance is achieved via use of
the _sun.misc.Unsafe_ class to allocate new Strings _very_ quickly, but
the legitimacy of using such classes directly might be questioned (since
they were originally undocumented and considered internal parts of the
JVM). Still, other popular Java libraries such as Gson also use this
approach.

```clojure
(require '[pjson.core :as json])

(json/read-str "{\"foo\":\"bar\"}") ;; parse a JSON string
(clojure.walk/keywordize-keys (json/read-str "{\"foo\":\"bar\"}")) ;; parse a JSON string, producing keyword keys
(json/read-str (slurp "myfile.json")) ;; parse JSON from a file

(json/write-str {:foo "bar"}) ;; generate a JSON string
```

Given jsonista's dedication to performance and apparent dominance in
that space, why consider pjson? As we know, the world of application
performance is highly driven by context, and small changes in the
profile of your own JSON payloads can change the performance
characteristics of your system. Creating universal benchmarks is
notoriously hard. pjson may come in handy if you're working on a
performance critical system for which the encoding or decoding of JSON
is the dominant factor and you are able to run some benchmarks of your
own.

Summarising pjson:

- Potentially very fast, depending on the context

- No dependencies

- No streaming support

- Dangerous in cases where incoming JSON may be invalid

# clj-lazy-json

We've touched on streaming JSON already, and so far the libraries we've
discussed either have limited streaming support or they don't attempt to
address true streaming at all. To clarify, a true streaming parser is
able to parse JSON, often token by token, to allow processing of the
data without reading the entirety of the data into memory before
processing and without having to maintain previous tokens as processing
continues. Simply taking input from a _java.io.Reader_ or
_java.io.InputStream_ is not sufficient.

[clj-lazy-json](https://github.com/michalmarczyk/clj-lazy-json) uses
Jackson's streaming parser to read JSON data and emit tokens, and
process the constructs of our JSON data as they are read. As a user of
clj-lazy-json, you register callback functions against JSON paths and
these functions are invoked each time a relevant JSON structure is
parsed.

Let's say, for instance, that you have a JSON object to parse and inside
this object there is a property with the name `"x"` -- and a very large
array as its value. We can stream and process the contents of this large
array sequentially without holding the entire structure in memory:

```clojure
(require '[clj-lazy-json.core :as json])

(json/process-json
   (json/parse (clojure.java.io/reader "/tmp/very-large-map.json"))
   {}
   [:$ "x" :*] (fn [value] ...))
```

Our path `[:$ "x" :*]` acts as a subscription and our function receives
each array item in turn. The request to `process-json` blocks until
processing is complete.

We can also interact with the parse events directly, and you'll notice
that we're able to take the first 10 parse events instantaneously, even
though our very-large-map.json contains gigabytes of data:

```clojure
(take 10
  (json/parse (clojure.java.io/reader "/tmp/very-large-map.json")))
```

Although it is unlikely to completely replace a general purpose JSON
parsing library like Cheshire or jsonista, clj-lazy-json is one of the
few Clojure libraries that offers true streaming behavior. As a result,
it's a great addition to your Clojure JSON toolbox.

Summarising clj-lazy-json:

- Dependency on Jackson

- Full streaming solution, can handle very large payloads of any type

- Limited applicability, but highly effective when needed

- No _official_ build, but [an un-official build is
  available](https://clojars.org/audiogum/clj-lazy-json)

# Wrapping up

Clojure's dynamism and focus on working effectively and directly with
data make it a fantastic language for working with JSON. Your choice of
parsing and encoding library may have little impact on your first
Clojure applications, but if the needs of your app or the environment in
which you're working become more demanding, then a grasp of the
available options can be invaluable.
