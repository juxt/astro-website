---
author: 'juxt'
title: 'On-Demand Webinar: Bitemporality and the Art of Maintaining Accurate Databases'
metaTitle: 'On-Demand Webinar: Bitemporality and the Art of Maintaining Accurate Databases'
description: 'Discover why bitemporality is a topic industry luminaries are talking about, and how it will likely to impact your work in 2024'
category: 'database'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2023-08-16'
heroImage: 'webinar-og.jpg'
tags:
  - 'architecture'
  - 'bitemporality'
  - 'xtdb'
---

Last week, we hosted a thought leadership webinar, on the topic of bitemporality — a topic many luminaries, including Kent Beck, Martin Fowler, Ben Stopford, and Kris Jenkins have been discussing in depth recently, but what is it exactly, and how is it relevant to your Data Architecture?

Well, how often have you had to add a `modified_at` or `effective_from` column to a database table? Have you ever had to keep old versions of data around and make it visible to end users?

Time is a fundamental aspect of data modeling — and yet application developers are frequently reduced to rolling their own half-baked ‘bitemporal’ SQL schemas on top of popular database systems.

This ad hoc approach to handling time has been the status quo for decades, but it's a complicated, risky business — and new systems can do better.
Bitemporal modeling equips developers with a rigorous abstraction for working with immutable data and versioned records.

Listen to the on-demand recording of this webinar to discover the most common use cases for bitemporal modeling, and learn how it impacts the design and maintenance of applications.

## Key takeaways:

- Familiarize yourself with the SQL:2011 standard temporal features;
- Understand the landscape of existing approaches and tools for implementing bitemporality to ensure successful projects;
- Discover how you can visualize your own bitemporal data using an open source interactive tool.

## Watch the recording:

<iframe class='md:w-[560px] w-full h-[315px]' src="https://www.youtube.com/embed/D3KUMBEapyw" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

**You can access Jeremy's slides <a href='/slides/juxt-bitemporality-webinar-230810.pdf' target='_blank'> here</a>** - the slides include the links to the various resources Jeremy showed during the session.

## Webinar speakers:

**Jeremy Taylor - Head of Product for XTDB** (<a href='https://www.xtdb.com/' target='_blank'>XTDB</a> is an open source database for solving complex problems with dynamic and temporal data)

Before joining JUXT in 2019, Jeremy held a sales engineering position within IBM working on eCommerce systems. For over a decade, Jeremy has been fascinated by relational and non-relational databases, and is motivated by the promise of data abstractions that can improve developer productivity across domains with frequently evolving schemas.

**James Henderson - XTDB Engineering Lead at JUXT**

James has been working on XTDB since 2019. James is an experienced software engineer, and has held leadership positions in companies ranging from an international investment bank to small startups. He writes Clojure, Java and Kotlin, and has been responsible for wider software architecture, data engineering and system administration.
