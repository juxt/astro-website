---
author: 'mal'
title: 'Storing secrets with Aero and KMS'
description: ' Aero flexes its muscles'
category: 'opensource'
layout: '../../layouts/BlogPost.astro'
tags:
  - 'devops'
  - 'cloud'
publishedDate: '2016-10-22'
heroImage: 'secrets.jpg'
---

Last May, we [wrote](/blog/aero) about our
[Aero](https://github.com/juxt/aero) configuration library. Given the
usually contentious topic of configuration I've been surprised at how
many of positive comments we've received about it. It's funny how many
of the most effective ideas in computer science are the simplest.

Aero isn't less of a library, more an idea, which is to fully exploit
the power of [EDN](https://github.com/edn-format/edn), Clojure's native
data syntax. Part of that power come's from EDN's tag literals. Aero is
simply a collection of tag literals that are useful in the configuration
of software applications.

One of the suggestions in the article was to keep secrets in a separate
file, which can be loaded into the final configuration via the
`#include` tag. While that's a valid answer to the problem of avoiding
the publication of secrets in version control, it's simply moving the
problem elsewhere -- secrets still have to live somewhere, and the
problem still remains of how to distribute secret files and make them
accessible to the application.

In this article I'll demonstrate a simple tag literal that addresses the
problem of managing secrets for applications deployed on Amazon Web
Services (AWS).

First, let's first see the co

# Infrastructure as code

Sometimes, it's hard not to feel a little smug about the tech that we
often take for granted in the Clojure community while the rest of the
industry languishes under poor technology choices.

In his article, [Using Pipelines to Manage Environments with Infrastructure as Code](https://medium.com/@kief/https-medium-com-kief-using-pipelines-to-manage-environments-with-infrastructure-as-code-b37285a1cbf5),
Kief Morris presents a contemporary manifestation of a classic
dichotomy: how to differentiate the same from the different.

This is a problem addressed in the seciont _Multiple Environments_.

Giant Onix versus Pikachu

spends more time than it took us to write Aero with an articulation of
what seems a new problem: separating application configuration between
environments
