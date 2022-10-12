---
author: 'dmc'
title: 'JUXT Journal 2019.05.1'
description: ''
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '03 May 2019'
heroImage: 'mock3.jpg'
tags:
  - 'journal'
---

Here's a round-up from JUXT's open source over the past couple of weeks.

# Crux

We have released [Crux](https://juxt.pro/crux/) as a public alpha! Crux
is an \"unbundled\" open source document database with bitemporal
Datalog queries.

- Crux was open-sourced live on stage during the keynote for
  [Clojure/north](https://clojurenorth.com/jon-pither.html) and a
  video recording will be available very soon (stay tuned!)

- We were featured in [The REPL](https://www.therepl.net/87/)

- [Jon](https://juxt.pro/people/jon.html) and
  [Jeremy](https://juxt.pro/people/jdt.html) went on the Defn podcast
  to talk about Crux

We are keen to receive all feedback for Crux via the [juxt-oss
zulip](https://juxt-oss.zulipchat.com/#narrow/stream/194466-crux) or
[github](https://github.com/juxt/crux)

# Edge

We have [documented](https://juxt.pro/edge/docs/built-in-libraries.html)
some of the internal libraries in Edge. We will tweak the exact
formatting, but it's a good start to have them listed somewhere.

Production documentation was moved into a sub-section to help clarify
what's relevant to that (stressful) part of a project.

We also added lifecycle documentation, to incorporate information about
how you work with Edge. This currently is about updating Edge and what
happens when you modify your Edge project.

The nrepl version was bumped in the dev.nrepl setup. While I was working
on that I noticed that I rather hastily chose the namespace \"nrepl\"
for this functionality, which isn't appropriate. \"nrepl\" will probably
be renamed to \"juxt.edge.nrepl-server\" in the future, it's an internal
namespace so that's a non-breaking change.

# [yada]{.yada}

[Malcolm](https://juxt.pro/people/mal.html) has been working hard on
designing [[yada]{.yada}\'s new
authentication](https://github.com/juxt/yada/wiki/Authentication-design)
with some input from me.

[yada]{.yada} 1.3-alpha introduced a new design for
authentication/authorization. We've started iterating on that again
based on feedback from projects where we've tried it.

While the new 1.3-alpha auth is far more spec compliant, it doesn't
encompass all the authentication strategies you find in the wild. In
particular, cookie and static authentication are points of difficulty.

We think we've now nailed down the general approach of processing
authentications, and we're now working out how this impacts the
challenge phase of authentication. A challenge is issued when you
attempt to access a resource and you don't have sufficient
authentication. For example, if you have basic authentication on your
resource, a `WWW-Authenticate` header is sent containing the option of
\"Basic\", which your browser interprets to show you a prompt.

There's lots more to consider for the [yada]{.yada} 1.3 auth, and we'll
cover some of it in the next post.

We also released a new 1.3-alpha with media-type suffix support. This
makes it easier to implement standards like JSON:api and JSON schema.

# Shop

We've started a mob programming project in the Milton Keynes office
called [shop](https://github.com/juxt/shop) and the goal is to:

- Show an example of a real application built on Crux and Edge

- Demonstrate the benefits of bitemporal queries

We're taking the opportunity to learn more about React, JSON schema, and
hypermedia in the process of working on it.

# Hiring

We have roles open including some in a tier-1 investment bank in Canary
Wharf, London. The project is developing a new trading portal using
Clojure, Reagent and re-frame, in a banking department that values
technology and doing things right. The role is open to devs, seniors and
project leads, get in touch with <careers@juxt.pro> if you're
interested.

# Wrapping up

That's it for this release. There will be another once we have a big
enough list to justify a post, that should be in a couple of weeks.
