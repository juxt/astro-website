---
author: 'bnh'
title: 'Simulation Testing using Datomic simulant library'
description: 'Part One'
category: 'clojure'

publishedDate: '22 Feb 2019'
heroImage: 'simulation.jpg'
---

# Why?

Dynamic, REPL driven languages like Clojure are brilliant for rapid
development.

However once the system is deployed in production and real people depend
upon its continued functioning, the interactive dynamic nature can
become a hindrance.

How can you be sure that your refactoring doesn't break the existing
system. What are the unforeseen consequences of deploying your latest
feature? How will the system scale when you become successful?

These are questions that **simulant** will help to answer.

# What?

Simulant is a smallish library belonging to the datomic.com domain.

on github at <https://github.com/Datomic/simulant>

wiki page at <https://github.com/Datomic/simulant/wiki>

It is fizzing with good ideas yet feels somewhat unfinished. This is
partly a consequence of its problem domain; 80% of any simulation
testing code is likely to be bespoke for the domain in question. However
the simulant code base could be doing more to be generally helpful

# Concepts

Simulant uses datomic to read and write almost all its data.

This provides

- **Temporal Separation** You can generate a bunch of test and they
  are stored in datomic. You can create sims out of them a long time
  afterwards

- **Scalability** You can use **datomic** as memory that is shared
  across multiple Java Virtual Machines. You can thus co-ordinate
  multiple JVMs running across multiple machines, as long as they all
  have access to the datomic database

- **Long Term Testing** You can keep tests and sim reports for long
  periods of time. This means that you can rerun the same test script
  on new versions of your code and discover what is newly broken, and
  how you have affected performance. You can analyse these reports
  over time to show how the project is progressing

It **does** mean that you will need a reasonable understanding of
datomic in order to get anything done.

Simulant splits its work as follows, all modelled as datomic entities

Model

: Describes high level usage scenarios;

    -   What are we testing?

    -   How many users?

    -   What ratio of corrupted or nonsensical data?

Test

: Takes a model and generates a runbook for testing that is
independent of any specific target system. A Test entity will
contain at least

    -   a Test Type

    -   a set of TestAgent entities

TestAgent

: A Test Agent has a list of actions which will be presented for
execution in order of their **atTime** value Actions are run
independently, within a bounded thread pool.

Action

: An action models a distinct unit of work (and the verification of
whether it completed normally) It needs to contain at least

    -   **action type**, used to drive the `(defmulti perform-action`
        multimap

    -   **atTime**, provides a rough real-time ordering. This controls
        the time that the action is submitted to the ThreadPool; A
        **busy** ThreadPool may execute in arbitrary order

Sim

: Associates a test with a specific system; It must contain

    -   **datomic URI** where the sim may retrieve its configuration
        data

    -   **process Count** how many distinct Java Virtual Machines will
        share the execution of the Sim Agents this will probably include
        additionally

        -   The URL of the system under test

        -   a set of credentials to gain test access to the system under
            test

Service

: A Service is spawned on every process that has joined the
simulation. It models a resource that that has its own start/stop
lifecycle For example

    -   **logsvc** used to report the results of a simulant action

    -   **loginsvc** used to acquire session cookies, or other
        authorisation data

    -   **uuidsvc** I am testing a system that allocated UUIDs to all
        its data items. I therefore need a way to retrieve the specific
        UUID for this sim for an action item.

    -   **processStateService** This can be used to stored data that
        belongs within one specific simulation run

            A Service stores all the data required to construct it in a datomic entity (including its factory method)
            A Service instance is then constructed in every sim process

SimClock

: describes how the atTime attribute is to be used to dispatch
actions. Default behaviour is to use atTime as a millisecond offset
from the start time, sped up by a constant amount

# How?

Simulant processes are started by running the
`simulant.sim/run-sim-process` function

1.  Each process will register its presence in datomic, the entire
    simulation will wait until as many processes have joined as were
    asked for when the sim was created. Each process polls datomic once
    a second to see when enough processes have joined.

2.  By default each process is allocated an equal share of SimAgents

3.  The Services are then started and stored in a thread local
    **services** map

4.  The process then lazily streams action entities from datomic,
    keeping the ones belonging to its Sim Agents

5.  It waits until the Sim Clock says it is time to start the next
    action

6.  The action is then dispatched to a clojure agent which associated
    with a SimAgent

7.  It repeats until all the actions have been dispatched

8.  It awaits execution on all clojure agents

9.  It instructs the **services** to complete
