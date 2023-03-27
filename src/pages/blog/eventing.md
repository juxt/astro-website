---
draft: false
author: 'mtf'
layout: '../../layouts/BlogPost.astro'
title: 'Day-to-Day Event Driven Architecture'
description: ""
publishedDate: '2023-03-27'
tags:
  - event-driven-architecture
  - EDA
  - architecture
  - kafka
heroImage: 'observer-in-special-relativity.png'
---

There are lots of terms used in the day-to-day discussions around Event Driven Architecture (EDA): Event Sourcing (ES), Command Sourcing (CS), Command Query Separation (CQS), Command Query Responsibility Segregation (CQRS), Event, Domain Event, Command, Message, Projection, State, Eventual Consistency, Read Model, Write Model, Logs, Hydration, Aggregation, Replay, Orchestration, Choreography..and so on.  This is just a sample of the high level concepts and these come before hitting the jargon barriers of the implementing technologies. For example, if Kafka is the Message Bus then we have: Topics, Partitions, Consumers, Producers, Streams, Compaction, Retention, Exactly Once Semantics (EOS)... the list goes on.

By it's nature EDA has quite a lot to say about the interactions between systems. In any organisation that has different teams looking after different systems then it requires a lot of up-skilling of Engineers just to begin having high-level conversations about the technical merits of EDA.  Despite being a relatively old concept Event Driven Architecture is not ubiquitous compared to something such as a Micro-Service Architecture.   Senior Engineering Managers and Product owners understand REST APIs and Micro-Services - these have the honour of being inaugurated into the managerial lexicon.  EDA does not. What this means is that there is little mechanical sympathy by managers for feature changes that take an unexpected amount of time.  Similarly there is a lack of appreciation by managers for the advantages such systems bring.

Often a diktat from a highly placed architect will start a program of work to "Eventify" an organisations technical estate.  Without a coordinated program of education for both engineers and managers it becomes very hard to succeed.  All to often it results in endless bike-shedding between teams over what constitutes a command versus an event. The philosophical difference between the two providing the detail to fight over.

Greenfield EDA projects have a better chance of success simply because they don't have to deal with the baggage of existing systems.  However they have their own problems: number one being over-engineering.  Case in point - excitable engineers, going all in on a technology stack, may eschew the benefits of a traditional database in favour of in-memory state stores rebuilt from event logs at every startup.  Before you know it teams have implemented their own Database Management System.

Over this blog post series we will go into the high-level concepts with an eye to Engineers, Managers and illustrated by Clojure and Kafka.  The goal is to provide a reference such that where people and organisations differ in understanding and implementation (as they currently do and inevitably will do) JUXT Engineers have a ubiquitous language they can map differences onto. 
