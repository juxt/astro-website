---
author: 'mal'
title: 'Edging forward'
description: 'An update about our Edge projectk'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '12 Dec 2018'
heroImage: 'mock3.jpg'
tags:
  - 'opensource'
---

Clojure is a great language for building systems. One of the reasons
Clojure isn't more well known is that it can be difficult and
time-consuming for programmers to set up their own development
environment where they experience just how effective the language can
be.

Back in 2016, I [wrote about](edge.html) our Edge project, which is
designed to help make it easier for people to started with their own
Clojure projects.

Over the past couple of years we've heard of a number of project teams
that have successfully used Edge as the base-camp for their ascent of
new unclimbed peaks. All the while we've been refining Edge, making
gradual improvements to keep it up-to-date. So now let me update you on
what is in Edge _master_ today.

# Fast feedback

Clojure is a Lisp, and one of the key benefits of this family of
programming languages is they are designed from the ground up to support
_live_ programming, making incremental improvements to running software.
This makes for a hugely productivity workflow.

We've kept the _reloaded workflow_ of hot-loading updated code when
triggered with an explicit reset, powered by the
`clojure.tools.namespace` library which automatically detects and
reloads your code changes. But we've also extended this into the realm
of web apps, with hot-loading of changes to HTML, CSS and ClojureScript.
This is all thanks to one of our newer projects, kick, which provides an
embeddable and extensible build process inside apps. More about kick
below.

# Modular architecture

We've retained the system-oriented component design, but made the
decision to switch out Stuart Sierra's _component_ library for James
Reeves\' [Integrant](https://github.com/weavejester/integrant)
replacement. We think Integrant is the best way of defining, and
configuring, the modular architecture we've gone for in Edge.

Talking of configuration, we've retained the approach of a single
configuration file which supports multiple different environments, using
our [Aero](https://github.com/juxt/aero) configuration library, but with
seamless integration with Integrant.

# Adoption of `tools.deps`

Edge originally used Leiningen to launch itself, but we eventually moved
to boot. Now we've changed again, this time to Clojure's
officially-supported
[`tools.deps`](https://github.com/clojure/tools.deps.alpha).

Edge is designed to be easy to modify, by using open architectural
principles and well understood idioms battle-tested by us and our
colleagues in the professional Clojure community on countless projects.
Yet our decision to adopt `tools.deps` has enabled further modularity,
allowing us to break Edge into numerous modules each with their own
dependencies. This has the added benefit of looser coupling between the
Edge infrastructure and the applications built upon it, making it easier
to upgrade one independently of the other.

# Deployment

We've got some really exciting news to report about deploying Edge.
We've added an integration with our
[pack](https://github.com/juxt/pack.alpha/) tool, for building uberjars
which are ready-to-go and runnable wherever you have a Java runtime.

But we've also built in support for running Edge in a raw unpacked mode,
much like you run Edge when you're developing. This means you still get
advanced optimized ClojureScript and CSS, but with a unique ability to
update the application while it's running, with minimal downtime. This
is how we've been running smaller projects such as our own juxt.pro
website.

How does this work? Well, we believe \"builds are just programs\" and
we've long suspected Clojure is the best programming language for
writing them. Inside Edge we have some cool tech we call _kick_, which
can be used both at _compile_ time when creating runnable uberjars and
at runtime, for the system to build and rebuild _itself_ whenever
necessary.

# Developer experience

As well as improved documentation, we've worked hard on the overall
_developer experience_, or _DX_. We've added more help at the command
line, adding integration with Bruce Hauman's
[rebel-readline](https://github.com/bhauman/rebel-readline) project and
adding colors.

We've created scripts to generate new Edge modules (which can be
developed as individual projects such as micro-services within your Edge
fork), and started to create a series of example modules to demonstrate
various features of our stack, such as REST APIs, GraphQL, re-frame,
Datomic, time-processing, cloud deployments and much more.

# Demo

Here's a quick 3½ minute demo that should give you a good impression of
where we are with Edge and how you can get started with it today.

<iframe width="560" height="315" src="https://www.youtube.com/embed/ULQuBpRsvfA" title="Edge Demo" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# More to come

I'm really excited about the direction Edge is taking. Watch this space,
there's more to come soon!
