---
author: 'juxt'
title: 'JUXT and OpenSensors'
description: 'A case study of building the technology that powers a major IoT platform'
category: 'case studies'
layout: '../../layouts/BlogPost.astro'
publishedDate: '22 Oct 2015'
heroImage: 'opensensor.jpg'
---

[OpenSensors](https://opensensors.io) is an exciting open data platform
for the _Internet of Things_ (IoT) industry, providing a space for
sharing feeds from a new generation of connected devices.

Since August 2013, JUXT have been heavily involved in the development of
the platform, which is **built on Clojure technologies**.

The coming years will see an avalanche of new connected devices, from
watches and wearables, to lamp-posts, buildings and more. These new
devices are already heralding dramatic changes in industries from retail
& distribution, construction, transport, to journalism and the
environment.

The technology challenges in distributing and processing data on this
scale are enormous. But opensensors.io has a more important vision, to
ensure that public data is shared with the greatest possible audience of
innovators.

# A modern architecture to meet the IoT challenge

JUXT's Malcolm Sparks was able to draw on 20 years of software
development experience with network programming and distributed
middleware to assist with the development of the back-end data ingestion
and processing technology behind OpenSensors.

The OpenSensors platform was built on a pervasive asynchronous data
processing fabric, which employs a reactive _poll-free_ approach to data
processing. Data is pushed to consumers at all levels of the stack, from
the publication of messages over the MQTT protocol, through various
back-end components including a Reactor-based distribution engine, to
other devices and even _pushed_ to web browsers via HTML5's server-sent
events.

Already, the OpenSensors public platform has attracted and serves
thousands of data publishers and consumers.

# Clojure _across the stack_

While the backend is built on Clojure, the web applications are built
with ClojureScript, a version of Clojure which runs in web browsers (and
many other places).

As the user experience of OpenSensors shows, for the rapid development
of sophisticated _single page applications_ that users, exposed to
mobile apps on their smart phones, now expect, ClojureScript represents
a signficant advantage for time-to-market.

The **choice of Clojure** for both the back-end systems and front-end
web applications, meant that is was **possible for developers to work on
both ends** of the stack at various times, even **simultaneously**. This
reduced costs of having multiple development teams to work on different
parts of the system.

- **ClojureScript enables faster time-to-market** and enables
  **greater ambition** in the development of **rich web
  applications**.

- The choice of Clojure for both front-end and back-end development
  enables greater **flexibilty in managing limited human resources**.

- Clojure has proven **scalability** characteristics, suitable for the
  **most demanding real-time workloads**.
