---
author: 'mtr'
title: 'Is Typed Clojure worth the trouble?'
description: 'Working with types in Clojure'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2015-06-22'
heroImage: 'types.jpg'
---

In this post I present some thoughts on working with [Typed
Clojure](http://typedclojure.org/), what it offers to Clojure programs,
how it fits in with the popular alternatives. It is not a core.typed
tutorial, there are several of them [available
online](https://github.com/clojure/core.typed/wiki/User-Guide), thus
some basic understanding of core.typed terminology is assumed.

First of all, Typed Clojure and core.typed, what is the difference?
Typed Clojure is an umbrella term for the project including core.typed
(the type checker), annotated libraries, editor plugins etc. Core.typed
can type check all of your (annotated) Clojure (and Clojurescript) code,
and find bugs very early in your development cycle. It features local
type inference, occurrence typing, nominal and structural typing via for
instance [heterogeneous
maps](https://github.com/clojure/core.typed/wiki/Types#heterogeneous-maps),
the latter giving you the ability to check for presence or absence of
keys in a map. It allows you to be precise about what types are
null-able, sizes of vectors etc. There is also support for higher level
constructs such as [typed core.async
channels](https://github.com/clojure/core.typed/blob/master/module-check/src/test/clojure/clojure/core/typed/test/rps_async.clj).

Typed Clojure is based on (optional) type annotations in your Clojure
source files.

```clojure
(t/ann not= (t/IFn

              [t/Any -> boolean]
              [t/Any t/Any -> boolean]
              [t/Any t/Any t/Any * -> boolean]))
(defn not=
  ([x] false)
  ([x y] (not (= x y)))

  ([x y & more]
   (not (apply = x y more))))
```

The annotations are used purely to type check your code. The Clojure
compiler is completely unaware of the type annotations, they don't
affect the generated code at all. This is of course a bit of a waste of
effort, since the compiler could put the type information into good use
and generate more efficient code. Nevertheless, having static type
analysis of your code brings more benefits than potentially faster code.
By introducing an optional type checker in a dynamic language, we get
closer to a great compromise between the flexibility of dynamic
languages and the raised level of confidence in the correctness of our
code (if-it-compiles-it-works) afforded to strongly typed languages. The
type annotations also serves as in-line documentation of the functions
which is very helpful when the codebase (and team working with it)
grows. Typed Clojure provides a interesting alternative to the
discipline of writing lots of tests and adding run-time-checked
contracts in your Clojure code in order to gain similar confidence of
code quality.

Creating a type system for a dynamic language is hard problem, and thus
core.typed come with a fair number of different type constructs that you
will have to understand in order to be able to effectively write
annotations. You have to deal with bounded polymorphic types,
covariance, contravariance, higher-kinded types and stuff like type
filters for occurrence typing. There are also details to keep in mind
when annotating protocols, records and some of Clojure's looping
constructs. Depending on your familiarity with type systems in general,
expect to spend some time to reading up on these topics.

## Core.typed, Prismatic/schema and tests

Clojure codebases typically rely on tests to verify the correctness of
the code. Dynamic languages in general tend to depend more on tests than
strongly typed languages. These tests come in many flavours, from
example-based unit tests, through [generative
testing](https://github.com/clojure/test.check) and all the way to
integration and [simulation
testing](https://github.com/Datomic/simulant). Having good test coverage
of Clojure code brings many benefits, with a particularly important one
being that a good test suites enables aggressive refactoring without
having to understand or remember all run-time impacts and subtle bugs
that might be introduced.

Another way of raising confidence in dynamically typed code is to
introduce run-time checked contracts in your code. Where you put these
contracts are typically flexible spanning from function argument level
to IO boundaries such as database access or ring handlers.
[Prismatic/schema](https://github.com/Prismatic/schema) is a library
that has gained popularity in the Clojure community and enables you to
define schemas describing the shape of data and validate input/output on
these contract boundaries. Other popular options are Clojure's built-in
pre/post conditions and the
[core.contracts](https://github.com/clojure/core.contracts) library.

The schema declarations are quite close to core.typed annotations and
depending on your vantage point offer many of the benefits of a type
checker. There are however some obvious differences: schemas are checked
at run-time whereas type checking is done completely at compile time.
core.typed also actually analyzes your Clojure code and find bugs inside
functions rather than just adding run-time assertions.

One very useful feature of Prismatic/schema which core.typed does not
have is called
[coercions](https://github.com/Prismatic/schema#transformations-and-coercion).
With this feature you can both validate your data structure and
transform it to the desired state. This is particularly useful when
validating input data from a database or ring request and doing all the
string-\>int, kebab-casing etc in one step. The net effect being much
less defensive code _on the other side_ of the coercer since you can
rely on the exact shape of the data.

By using type annotations the reliance on example-based unit testing can
be deemphasized, and more focus can be put on other forms of testing. It
cannot however totally replace the need for run-time checks, and
features like coercers are too good to trade away for just type
annotations. Luckily schemas and type annotations can co-exist in a
codebase, and since Prismatic/schema definitions and type annotations
are so similar you can even write your schemas once and [generate the
core.typed annotations](https://github.com/circleci/schema-typer) from
them.

## Working with core.typed

Where do all these annotations go and how much of them do you need? As a
rule of thumb, type annotations will make up about 10% of your code. The
var annotations should be placed just next to the definitions, to give
the additional documentation benefit. You can (and should!) remove a lot
of the repetition in the annotations by liberal use of [type
aliases](http://clojure.github.io/core.typed/#clojure.core.typed/defalias).
Done correctly these can be moved to separate namespaces and can serve a
very concise and readable model of your domain.

```clojure
(t/defalias Value Double)
(t/defalias Units (t/Map Str Int))
(t/ann-record Fjv [v :- Value, u :- Units])

(t/ann to-fjs [(t/Seq (t/U Fjv Value)) -> (t/Seq Fjv)])
(defn to-fjs
  "create unitless Fjvs from numbers"
  [nums]
  (map (t/fn [v :- (t/U Fjv Value)]
         (if (instance? Fjv v)
           v (->Fjv v {})))
       nums))
```

How much this _uglifies_ your code is a subjective assessment, and
different developers will have different levels of tolerance for these
annotations. There are situations when core.typed will find its way deep
into your functions, for instance when protocols, lambdas and common
looping constructs are used. Again developer sensitivities will vary.

One problem that all type checkers suffer from is the clarity of its
error messages. Since they operate at an abstract level, the error tends
to become cryptic and hard to map to the concrete problem at hand.
core.typed suffers from the same problem, but you will quite quickly
learn to parse the different kinds of errors it produces.

In practice you will do the bulk of the interactions with core.typed
from the REPL as you are writing code. The most common function is
`check-ns` where all vars in a namespace and its depedencies will be
checked. You should also incorporate
[lein-typed](https://github.com/typedclojure/lein-typed) in build chain
to check all namespaces regularly.

### Retrofitting type annotations to your existing code

If you are thinking about adopting Typed Clojure chances are you already
have a codebase with a bunch of tests, schemas and coercers. The first
questions to answer is which part of you code do you start annotating,
and do you aim for total or partial annotation coverage? Many factors
are in play when making this decision: code size, team size, project
maturity etc.

One way is to write annotations in the core part of your program, the
business logic. This is the functions and datastructures that really
have to be correct and that needs to be understood by the team of
developers. You also want to enable alterations of this code with
confidence that you haven't broken it. These are all very good reasons
for adding static types to your code. The argument against annotating
this part of your program (first) is that you probably already have good
test coverage of these functions, and perhaps even schemas for the
datastructures that are passed around.

Another way to proceed is to annotate parts of your codebase with little
or no test coverage. This can be code that is hard or expensive to test,
it might rely heavily on external service. A traditional approach would
be to write mocks for these services, by using type annotations you can
make do without mock-based testing. For example, CircleCI, one of the
early adopters of Typed Clojure, added annotatons to [devops code that
was using the AWS
SDK](http://blog.circleci.com/supporting-typed-clojure/).

Either approach is valid, and I'd advise spending some time upfront
thinking about where to start adding annotations. The trick is finding a
body of code that is nicely isolated from the rest (with just a slim
interface to other part), that you can fully annotate. This will allow
you to reap the full rewards of core.typed without dealing with the
drawbacks of a big surface area between typed / un-typed code. However
you choose, you will need to sprinkle your code with some `tc-ignore`
and `^:no-check` for the parts of the code that are not yet annotated.

## Typed Clojure stability

core.typed is complicated software, and still relatively new. Expect to
find and work around bugs. Most of the popular libraries you are using
lack core.typed annotations, so you are left with the choice of writing
these annotations yourself or add `tc-ignore`, `^:no-check`. None of
these options are particularly appealing, but hopefully more and more
libraries will get type annotations are core.typed will get more stable.

Furthermore, not all `clojure.core` functions [have type annotations
yet](https://github.com/clojure/core.typed/wiki/clojure.core-Annotations),
sometimes because the function's correct type can't be correctly
expressed. The existing core annotations are also improving; at the time
of writing this post it's still not uncommon to be hindered by legacy
and arguably inadequate annotations of core functions.

There are situations where, even with all of core.typed _typing tools_
at your disposal, you still can't give a Clojure fn / form a meaningful
core.typed annotation. This is certainly disappointing when it happens
but one needs to remember that core.typed (and [Typed
Racket](http://docs.racket-lang.org/ts-guide/index.html) on which is
based upon) is an active research area. So even if it feels wrong to
refactor Clojure code in order to make core.typed happy, there will be
situations when you are forced to do so if you adopt a typed workflow.

Having said all that, it's still a very capable piece of software, and
it performs well even with reasonably size codebases. The main
maintainer [Ambrose Bonnaire-Sergeant](https://twitter.com/ambrosebs) is
very quick to respond to questions and is actively working on Typed
Clojure. The [core.typed mailing
list](https://groups.google.com/forum/#!forum/clojure-core-typed) is
also a great place to look for help.

## What's next?

Typed Clojure is still under active development, and currently [gradual
typing](http://frenchy64.github.io/2015/06/19/gradual-typing.html) is
being added. This is a way for core.typed to (at run-time) enforce the
type invariants when crossing the boundaries from type to untyped code.
Interestingly with the introduction of run-time checks the overlap with
Prismatic/schema become even bigger and hopefully the ability to reuse
schemas/annotations for either tool will improve. Gradual typing will
also help solve some of the problems you face when introducing
core.typed in a non-typed codebase, as it will remove some of the need
to `tc-ignore` all the functions at the border of your typed / un-typed
code.

[This demo of a typed REPL](https://www.youtube.com/watch?v=HQidWfemPgA)
is a great example of what gradual typing in Clojure could look like.

## Conclusion

The million dollar question, is Typed Clojure worth the trouble? My
conclusion is yes; if you make the effort to add it to your code, and
find your way around the bugs and few imperfect provided annotations the
benefits you will gain will be worth it. The benefits are even greater
if you are working in a team on a bigger codebase. This is a good time
to have a serious look at Typed Clojure, given that it has had time to
stabilize and the future additions of gradual typing is very exiting and
will give your hard won annotations even greater power.

Finally a call to arms, if you are a maintainer of a library, please
consider adding core.typed annotations to it. It will really help the
usefulness and adoption of Typed Clojure. If you don't have time to add
these annotations, ask for help, and please merge the pull request!

Discuss below or [join the
discussion](https://news.ycombinator.com/item?id=9757909) on Hacker
News.
