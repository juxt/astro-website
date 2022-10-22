---
author: 'jon'
title: 'Selling Clojure to the Business'
description: 'Our experiences of selling Clojure'
category: 'analysis'

publishedDate: '27 Mar 2018'
heroImage: 'mock3.jpg'
tags:
  - 'clojure'
---

When JUXT talks to potential clients we're often trying to answer _Why
Clojure?_ Here I will attempt to cover some of the answers we have
evolved through various sales meetings. Feel free to use what's here or
to provide feedback. For those wanting Clojure to play a leading role in
shaking the IT industry out of its wasteful malaise, then we're all in
this together.

# Clojure is Lean

Developers love Clojure for it's simplicity and well thought out
approach to immutability with its persistent data collections. This is
fantastic and absolutely valid, but if we're in a meeting with business
stakeholders then it's better to lead with how Clojure helps development
teams get more done with less.

Clojure is leaner than other mainstream languages, and this should be
the first killer answer to the _Why Clojure?_ question.

To back this up we talk about past Clojure projects. At a Clojure
rewrite of an online newspaper the existing Java solution was around
500k lines of code, the Clojure replacement being \~20K LOC solution.
There was an analogous previous attempt to rewrite the platform in Java
using XLST but this was terminated after a couple of years. The Clojure
effort took about six months with a small team of high motivated
developers and was utterly successful.

At a major property portal we built and released 4 fully-fledged systems
in under 10 months from scratch. We have seen from other Clojure
projects outside of JUXT that this is a repeating pattern; Clojure is an
extremely powerful weapon for productivity. You can achieve more with
less; Clojure codebases tend to be an order of magnitude less in size
than their mainstream counterparts.

Yes, Clojure is a beautiful, elegant language to work with. More

software against tight timescales.

# Why is Clojure Lean?

The person opposite will be wondering _why_ is Clojure so lean and
effective? You may think it's unsporting and a bit negative to shoot
fish in a barrel, but here I like to attack OO a bit. You can't avoid
this anyway as OO is the elephant in the room being the mainstream
status quo. I've have found however that this can be a light and fun
conversation, as people generally enjoy trading war stories and rallying
against established orthodoxy.

We usually open by discussing how in OO we tend to preemptively build up
a comprehensive object model to describe the problem domain
exhaustively. Objects for everything, let no minutiae detail of the
business domain go unmodelled, unformalised, unclassified. The object
model adds reams of code to the solution and generates a class of second
order problems such as constant maintenance and dependency management.
Sure, it may not be idiomatic in OO to create masses of type classes at
low abstraction levels, but we're talking mainstream here. It happens
all the time and leads to colossal waste on software projects.

In Clojure we work with the data as it comes using inbuilt basic
collection types; maps, sets, vectors etc. We operate on the data using
simple functions to achieve transformational logic, functions being
simple data-in, data-out contracts with no side effects. We offer that
this is a much simpler way of going about programming and gets us closer
to working functionality faster.

# Functional and an Evolving Domain Model

Sometimes I can see an element of _better the devil you know_ creeping
into the conversation with the person opposite. The potential client may
well be thinking \"OK, whilst I'm not a massive fan of big object
models, I'm not sure I like this idealised future of mathematical
functions manipulating raw data all the time... it does sound like a
rather sterile and soulless future. What about the value of having a
domain model in the code? Hasn't everyone has bought into Domain Driven
Design, where the code makes some attempt to promote a common
understanding between developers and business stakeholders?\"

I like to address this counter-argument on the front foot. The domain
model evolves from composing functions together and creating high order
functions that clearly express the business rules they are serving. With
a functional codebase, the domain model is more apparent as business
rules sit closer together in well defined namespaces as simple
functions, rather than being scattered about in large type definitions.

It can be difficult not to get carried away when arguing this point. I
want to express how in Clojure a codebase tends to evolve the domain
model organically, adhering to bottom-up development principles. On the
surface a mature Clojure codebase acts like a DSL on steroids, the
result being a beautiful business language sitting on top of the
baseline fundamental language of Clojure.

# OK, but why Clojure? Isn't Clojure a bit esoteric?

People have often have a cynical view of salesmen peddling obscure tools
and technologies. They may have heard that Clojure is a LISP, and so
they could have pre-judged it as an esoteric developer fad.

We say that Clojure is a safe choice for the enterprise after all. It's
built on Java; you can deploy it to your existing Java ecosystem and use
your existing Java libraries. We see Clojure as pragmatic; yes it's
strongly opinionated but it won't stop you adding occasional side
effects into your functions and it doesn't get in your way. There are
some _pure_ functional languages out there that do have a more rigorous
academic grounding, but Clojure is a language that is meant to be widely
used, and is becoming so.

# What's the size of the development pool, is it easy to hire Clojurians?

Our past clients haven't had any difficulty hiring, and what they
usually report is that they see a higher calibre of individuals coming
through the door. I'm a little wary of over-selling this point as
there's never a free lunch when it comes to hiring, and the point can
sound a little arrogant. But it is true nonetheless; the available
resource pool of Clojure developers is self-selecting. You get enthused
technologists extremely passionate about what they do, or else they
would have stuck with the mainstream.

This point gets a lot of traction with potential clients. I can only
conclude that every IT business struggles with recruitment. If having a
language like Clojure will actually help the process, then they want to
consider it.

We talk specifically about the great community spirit in Clojure, and of
the frequent regional meet-ups happening in multiple countries.

This conversation is usually interlocked with a concern about training.
We say we've never had any problem training up Clojure developers, and
developers making the leap tend to love it and never want to go back.
This helps hugely with staff retention.

# Energising a company

This is a point we sometimes make, depending on the context. We do want
to cover that Clojure is a fun programming language, and that it can be
used as a mechanism to re-energise an IT department.

We're seeing lots of cases of IT departments feeling stuck and
inefficient. Not all stakeholders are adverse to disruption, many
require and seek it.

# Summary

There are many more tangents and deviations than what we've covered
here, and it does require discipline to stay focused. We hope this post
gives some ammunition to others trying to sell Clojure, either
externally or internally.
