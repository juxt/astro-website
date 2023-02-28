---
author: 'mrk'
title: 'Clojure in Oxford: Crossref'
description: 'Improving scholarly communications'
category: 'clojure-in'
layout: '../../layouts/BlogPostClojureIn.astro'publishedDate: '2018-11-01'
heroImage: 'crossref-logo-clojurein.jpg'
clojureIn: { season: 'one', industry: 'media & telecommunications', quote: '"When you have to come into work every day, sit down and write code, doing it in a language you love is great."' }
---

# Love metadata, love technology

Crossref makes research outputs easy to find, cite, link, and assess.
They are a not-for-profit membership organization that exists to make
scholarly communications better.

I spoke with [Joe Wass](https://www.crossref.org/people/joe-wass/),
Principal R&D Engineer in [Crossref Labs](https://www.crossref.org/labs/), to understand how
Crossref are using Clojure and what problems it solves for them.

**_Mark: Can you tell us a little bit about the history of Crossref?_**

**Joe:** Crossref was founded by a group of scholarly publishers who
essentially wanted to solve link-rot for citations. When an author
publishes a journal article, their references section can span articles
published by any number of different publishers. Up to the point that
Crossref was founded, they made individual agreements between themselves
about how to identify and link articles, and how to link into to each
others' websites. This kind of thing doesn't scale, so they created
Crossref, a non-profit organization, that provides shared infrastructure
and technology for the scholarly community.

We allow our members to register content and assign DOIs, [Digital
Object Identifiers](http://www.doi.org/), to their content items. Those
DOIs are used to uniquely identify each piece of content. They are
expressed as URLs, and when you follow one it redirects to the article's
landing page. This link redirection allows for publishers to update
their links if their websites change or, as often happens, journals get
transferred between publishers.

DOIs are the foundation for all the work we do, but there's a lot more
to it than that. We operate a central store of metadata - think titles,
authors, links to funders, tables of contents. It mostly boils down to
links, which means that we bridge quite a few communities. We share the
metadata without restriction, and it ends up in a lot of different
places. For each of the things we link to, we need to find and, if
necessary create, an identifier system to do the job. One notable
example is ORCID.org, an identifier system for authors.

Today we have 11,000 members and 100 million registered content items.

# The tech

**_Mark: That's awesome. What kind of tech stack are you using to make
all of that possible?_**

**Joe:** Our core tech stack goes back at least 15 years, and is written
in Java. In Crossref Labs we do new development, for example our REST
API and our new Event Data services, in Clojure. For Event Data, where I
currently spend most of my time, we have services written in Clojure.
They communicate using HTTP, and we lean heavily on Liberator and Apache
Kafka.

These services run in Docker containers, which makes development,
deployment and configuration management so much easier. We've chosen to
use Docker Swarm for service management, as it strikes a nice balance
between simple configuration, service discovery, scaling and load
balancing. To provision our infrastructure we use Terraform against AWS
and Hetzner Cloud.

In one way or another 'immutability' plays a role in all layers of our
stack. Obviously Clojure's an excellent choice for stateless functional
programming. Docker containers provide a well-understood stateless
abstraction. And the "immutable infrastructure" that Terraform brings
-- declarative specification of infrastructure deployment -- means
that we're able to check nearly everything into source control. That
means we can take shared ownership, where everything is versioned and
self-documenting. It also means that we could press a button and have
everything re-create itself from scratch.

**_Mark: You already touched on it but where is Clojure making life
easier for you?_**

**Joe:** There are two broad reasons we use Clojure. Firstly, a lot of
the work we do is basically taking data in one format and converting it
into another, and the data pipeline oriented approach aligns well with
the Clojure philosophy. We don't need stateful systems of objects
mutating each other, but we do need to model various domains and
transform representations. Running on the JVM is also handy, there are
some indispensable Java libraries out there that we already use, for
example the AWS client SDK and Kafka.

The second reason is simply that it's a really cool language. I'm afraid
this isn't a very scientific answer, but when you have to come into work
every day, sit down and write code, doing it in a language you love is
great. I think you write better software when you can focus at the right
level of abstraction without irrelevant things getting in your way.

My background includes C#, Objective-C, Python and friends, so I was
initially skeptical about losing mutability and object-orientation, but
it turns out most things I want to do are well modelled in the language,
and there are some nicely designed little affordances that are handy
when you need them. From threading macros to atoms to pmap.

**_Mark: You mentioned having 100 million registered content items, any
notable performance stories, issues with either Clojure or the JVM?_**

**Joe:** We use SOLR and ElasticSearch, we have had to do a bit of
tuning with those. The pipeline-oriented architecture we have means that
we can scale out easily, bit of a boring answer, but from where I'm
standing, boring is good!

**_Mark: What are you using for front end development, have you looked
at ClojureScript?_**

**Joe:** We've experimented with one or two things over the years, but
have settled on React.js and JavaScript. That's mostly a question of
finding the right cross-section of skills, both for front-end
development and future maintenance. I'm not the world's biggest fan of
JavaScript, but I have enjoyed the (limited) amount of time I've worked
with it.

We're not trying to solve all of our problems with Clojure, we have
active back-end codebases in Java, Node, Ruby, and Python. JavaScript
ticks the right boxes on the front-end, at least for now.

# Team & Recruitment

**_Mark: How many developers are coding Clojure at Crossref?_**

**Joe:** Currently two, with two more new colleagues learning at the
moment. Introducing someone to Clojure is a fascinating process because
it makes you look at the language with fresh eyes. There are so many
idioms common to other languages but with subtly and sharply different
semantics. Unpicking assumptions that are valid in almost any other
language, like bound symbols vs variables, has cemented my admiration
for Clojure!

**_Mark: Are you a remote team? If so what is the balance, how much of
your work is local vs remote?_**

**Joe:** Although we have offices in Oxford, UK and near Boston, USA, a
substantial portion of us are distributed around Europe and the USA and
work remotely full time. All the work we do is effectively remote, using
Slack, GitHub and plenty of voice calls. We also make a point to get
together on a regular basis to keep up the human contact side of things.

Because the work we do in Crossref Labs is generally open source, we
work extra hard to make sure everything is thoroughly commented,
documented and tested, so that anyone could pick it up. This hopefully
makes it easier to collaborate when we need to.

**_Mark: How have you found recruitment?_**

**Joe:** In Crossref Labs we perform a very interesting and, I think,
slightly unusual role. Yes, we write software, but we're also out in the
scholarly publishing and academic communities trying to spot new trends
and collaborating with groups and individuals to try and build new
infrastructure.

It's certainly the most domain-intensive developer job I've done, so
when we're recruiting we look for more than just experience in a certain
language. A history of multiple languages is beneficial, and it's more
important to be able to learn on the job than to arrive with Clojure
knowledge.

Because we're looking for a particular profile of developer, recent
hiring took a little longer. There was a period of time when it was very
useful to be able to work with JUXT to keep our velocity up!

# Problems

**_Mark: Have you had any notable bumps in the road using Clojure?_**

**Joe:** I think the only annoyance that springs to mind is error
handling. Anonymous and higher-order-functions sometimes cause
head-scratching, and when an exception is uncaught it's usually
something unexpected and counter-intuitive, ergo harder to debug.

Reading other people's highly abstracted code, especially when it's
highly idiomatic, can be a bit of a challenge sometimes. I love the
level of abstraction that Clojure encourages, but sometimes the concepts
that functions express can be a little difficult to get a handle on.

# Community

**_Mark: Have you had much involvement with the Clojure community? How
have you found it? Have you found libraries easy to come by?_**

**Joe:** I'd like to say that I have, but in truth I'm probably a bit
behind the times. I've identified the tools I need and find them very
effective to solve the problems I have. Some of the tools out there are
exceptionally good. Liberator, clj-time, http-kit, lein, ring to name a
few. So the community of developers writing libraries is top notch.

I went to Euroclojure in Krakow a few years ago and ended up chatting to
Rich Hickey. He was so friendly, accessible and had time for a newbie
Clojure developer. I have boundless gratitude to him, his vision,
execution and everyone working to make the Clojure ecosystem a better
place.

I do attend and speak at conferences, but they're mostly about science
communication and scholarly infrastructure!
