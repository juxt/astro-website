---
author: 'jon'
title: 'Why have a stack?'
description: 'Becoming opinionated'
category: 'analysis'
layout: '../../layouts/BlogPost.astro'
publishedDate: '15 Jan 2018'
heroImage: 'mock3.jpg'
---

How do you decide what tech stack to choose? As software developers we
face this question often when bootstrapping new projects, and it becomes
particularly pertinent when we need to consider long term maintenance. A
[recent security
article](https://hackernoon.com/im-harvesting-credit-card-numbers-and-passwords-from-your-site-here-s-how-9a8cb347c5b5)
offers a sobering reflection on how easily we can make a wrong decision,
especially when we are striving for the latest and greatest tech, the
most nascent and shiniest of tooling.

In this post the author demonstrates creating a superficially useful NPM
library that is actually malware, capable of scanning credit-card
numbers and dispatching them to a remote URL. He is deploying this
library to an ecosystem where there is the acceptance and expectation of
project dependency graphs to grow large and unwieldy, where
unscrutinised dependencies can easily become lost in the weeds.

Software developers in general are trusting of other software
developers. If we stumble across a library on GitHub or an NPM that
looks like it could help, we don't always pause to consider if this code
has been written to specifically harm us or our users. We might browse
the code on GitHub, but as the author writes: _\"it's perfectly possible
to ship one version of your code to GitHub and a different version to
npm\"_.

There will always be a risk of exploits being uncovered in the libraries
we use, but if for each project we choose the technologies completely
anew, then the Russian roulette gun gets loaded each time. Today might
be a JavaScript library exploit, but tomorrow could be the vulnerability
in the popular Java library Struts in conjunction with the serialisation
library XStream, that resulted in the [Equifax
breach](https://cynation.com/the-equifax-data-breach/).

As developers we want to try out new libraries and techniques. We know
that the field of software development is still maturing and that there
is much room for improvement, but there is also a growing need for
conservatism in the tools we select. Not least because we are entering
an age of compliance, where our technology stacks and documented
processes will need to be evidenced and certified on an on-going basis.

This narrows the remit for choosing a substantially different technology
stack for each project, which runs contrary to the practice incumbent in
many of the flat hierarchical polyglot software houses of choosing the
_best tools for the job_, based on the skills and experience at hand on
any particular given day.

The alternative approach for a software company is to have your very own
prescribed technical stack, to become opinionated. Similar to how we
manage software products, a stack should be iterated on and evolved over
time. If we can re-use our technology stack across projects, then as
each incarnation of the stack is subjected to external penetration tests
and production runtime experience, then all of our projects will
benefit.

We can then also reap the productivity benefits of having deeply focused
on a chosen subset of technologies. The next project will become faster
to build as we can reuse patterns and approaches across the entire
stack, the developers becoming more fluent as they are allowed to remain
inside the same coding paradigms, becoming specialists rather than
generalists.

Overall there is a balance to be struck. We want to encourage innovation
and to constantly evolve the tools we use, but we also need to endeavour
to be conservative adopters, waiting until libraries have become
established and proven before incorporating them into our own software
stack. Once we then have a stack, it needs to evolve, rather than be
rebooted and reimagined on a continual basis.
