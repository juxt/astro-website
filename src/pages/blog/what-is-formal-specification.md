---
author: 'hga'
title: 'What is formal specification?'
description: 'A booking site oversells by one ticket while the test suite stays green. What would it take to know it couldn''t?'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-07-24'
heroImage: 'what-is-formal-specification.jpg'
draft: true
tags:
  - 'formal methods'
  - 'engineering'
  - 'ai'
---

<p class="lede">Here is a system you already know how to build. A venue that holds 500 people, general admission, one Postgres database. A tickets table and a purchase endpoint: count what's sold, and if there's room, insert a row inside a transaction. You could have it live by Friday.</p>

Before Friday arrives, one question deserves an answer. Capacity is 500. What stops you selling ticket 501?

In this design, the answer is a count:

```sql
BEGIN;
SELECT count(*) FROM tickets WHERE gig_id = 42;
-- application code: 499 < 500, so there's room
INSERT INTO tickets (gig_id, customer) VALUES (42, 'alice');
COMMIT;
```

Suppose Alice and Bob both want the last ticket, and two copies of this transaction run concurrently. Each counts 499 rows, each concludes there is room, each inserts, and both commits succeed. The venue has sold 501 tickets. No error was raised at any point, and the test suite stays green, because each test run executes one schedule of events, and none of them is this one.

If your instinct is that the transaction should have prevented this, the relevant fine print is the [isolation level](https://www.postgresql.org/docs/current/transaction-iso.html). Postgres defaults to READ COMMITTED, which permits the schedule above. Raising it to REPEATABLE READ does not help: each transaction reads from its own consistent snapshot, the two inserts touch different rows, and neither transaction ever sees a conflict. I ran both against Postgres 17 while writing this, and both sold the 501st ticket. The anomaly is called [write skew](https://en.wikipedia.org/wiki/Snapshot_isolation), and it was catalogued in 1995 in a [critique of the SQL standard's isolation levels](https://dl.acm.org/doi/10.1145/223784.223785). Only SERIALIZABLE catches it, by aborting one of the two transactions with an error most application code is not written to retry: "could not serialize access due to read/write dependencies among transactions".

<span class="pullquote" text-content="The guarantee you were relying on is a formal specification, written with great care by other people, that you had never read."></span>

Notice what just happened. The guarantee you were relying on is a formal specification, a precise published statement of which anomalies a database may expose at each level, written with great care by other people, that you had never read. Everyday engineering rests on statements like this at every layer. What is unusual is not depending on one; it is writing one of your own.

## What the words mean

*Formal methods* is the umbrella term for applying mathematical precision to software, and it covers two activities that are worth keeping separate. *Formal specification* is stating what a system must and must not do, in a language exact enough for a machine to analyse. "No gig ever has more tickets than its capacity" is a specification; so is "every hold is eventually released or converted into a sale". *Formal verification* is checking, mechanically, that a design or a program satisfies such a statement.

The two are separable, and the first pays for itself sooner than you might expect. Engineers at Amazon, [describing how AWS uses TLA+](https://dl.acm.org/doi/10.1145/2699417), report value from the act of specification itself: forcing a design into precise language eliminated what they called "plausible hand-waving" and exposed ambiguities that had survived review in prose design documents. Making a design precise forces questions that informal descriptions let you defer, which is what happened a few paragraphs ago to a count and an insert.

If these terms have been turning up in your reading more often lately, AI is the likely reason. When an agent writes the code, the statement of what the code must do is the part you still have to supply, and judging whether what came back is what you asked for is the part you still have to do. A formal specification is the oldest and most exacting tool for both.

You have also been consuming formal methods throughout your career, mostly without the label. A type checker is a small automated prover: on every compile, it establishes that a whole class of errors is absent from every execution your program will ever have. An isolation level, as we've seen, is a specification of the anomalies your database is permitted to show you. Writing a specification of your own changes only the subject: your system's behaviour, rather than your language's or your storage engine's.

## The design outgrows the database

For the counting bug there are direct fixes. [SELECT ... FOR UPDATE](https://www.postgresql.org/docs/current/explicit-locking.html) serialises the competing purchases, or you run at SERIALIZABLE and teach the application to retry aborted transactions. And sometimes the data model itself can absorb the problem. When the venue moves to allocated seating, every seat becomes its own row, booked or free, and the troublesome aggregate, never more than 500 sold, dissolves into a per-row property. Alice and Bob can no longer both slip past a count, because they are now competing for the same row, and a single-row conflict is the case the database handles natively; a unique constraint on the seat settles who won. The invariant hasn't changed, but remodelling has restated it in a form the database can enforce cheaply.

Solving one problem with the data model sets up the next. Customers choosing seats need time to think, so the system holds a chosen seat for ten minutes while a card number gets typed in. Nobody holds a row lock across a customer's think time, so a hold becomes a row with an expiry timestamp, and time is now part of your design rather than something that happens outside it. Then payment arrives, and with it a payment gateway that does not participate in your database transaction. The invariant you care most about, that every confirmed order was paid for exactly once, spans two systems that share no snapshot and no lock manager. No isolation level applies to it.

Somewhere between READ COMMITTED and the payment gateway, the work changed character. You are no longer configuring a database; you are designing a small distributed protocol, with holds, expiries, payment callbacks and refunds. Each fix so far answered the previous question and left the next one open, which is the argument for asking the questions up front, in writing, all of them. That is what writing a specification is. The immediate question is what such a description should look like.

## Entities and relationships

The traditions of formal methods differ first in how they view a system, and the natural place to start is a view you already draw. Through an entity-and-relationship lens, the booking site is customers, orders, seats and holds, joined by relationships: an order belongs to a customer, a hold references a seat. A specification in this tradition is a set of laws about shape: no seat belongs to two confirmed orders, no confirmed order references an expired hold. The first law is the invariant your unique constraint enforces, restated as a rule of the design rather than a property of one table.

Checking means searching for a shape that breaks a law. [Alloy](https://alloytools.org) does this directly: describe the entities, the relationships and the laws, give it a bound, say four customers, five seats and a handful of orders, and it enumerates every configuration that can exist within the bound, testing every law against each. When a law fails, you get the offending world back as a diagram small enough to read: two confirmed orders, one shared seat. A counterexample, in this tradition, is a picture.

What the shape view cannot express is change. Its worlds are snapshots, each law is checked against each snapshot in isolation, and nothing in a snapshot records how it came about. The failures we are most worried about are failures of becoming, a hold that was valid when payment began and expired before it completed, and to catch those the model needs motion.

## Events and sequences

A second tradition finds its subject in occurrences rather than things. Through this lens the site is a vocabulary of events, reserve, pay, expire and release, and the specification says which sequences are legal: no payment lands on a hold that has expired, no release without a preceding hold. This is the home ground of [process calculi](https://en.wikipedia.org/wiki/Communicating_sequential_processes) and the [B method](https://en.wikipedia.org/wiki/B-Method).

The search space has changed shape accordingly. A checker here explores sequences: starting from an empty history, it asks which events could legally occur next, extends the history by each in turn, and keeps going, hunting for a path that arrives at something forbidden. The counterexample this time is a story rather than a picture: reserve, then expire, then pay, and that payment should have been refused. This view catches the charge that lands on a dead hold, and it catches it as what it is, an ordering problem.

A single customer's story, though, is not where this article's trouble started. The write skew needed two customers, each behaving legally on their own terms, whose steps interleaved. To catch that, a model has to hold the whole system's state in view while everyone acts at once.

## Time and interleaving

The third tradition does exactly this. The system is a state machine unfolding over time, its possible histories are the set of every behaviour it could exhibit, and the specification quantifies over all of them. [TLA+](https://lamport.azurewebsites.net/tla/tla.html) works here, and this is the lens built for the 9am questions: what happens if a hold expires while its payment is in flight, the seat is resold, and both charges succeed?

To make checking concrete in this tradition, take the smallest slice of the system: the original purchase path, before seats and holds. A *model* here means the design restated as a state machine. Between database round trips, each customer's transaction does exactly two things: read the count, then insert a row. So the model is two customers, each a two-step program, and a *state* is small enough to write on an index card: how far each of Alice and Bob has progressed, plus what is committed in the table. A *step* moves one customer forward by one action. The specification is the invariant we have had from the start, never more than 500 sold, and *checking* means asking one question of every state the system can reach: does the invariant hold here?

One requirement keeps the model honest. Each step must correspond to something the code does atomically. Our two steps are two database round trips, and between any two round trips the scheduler is free to run anyone else. Model the read and the insert as a single atomic step and you have verified a system you are not running.

With Alice and Bob concurrent, their four combined steps can occur in six orders. In two of them, one customer completes before the other reads; the late reader sees 500 and the sale is refused. The other four share a decisive feature: both reads happen before either insert. Here is one, written the way a checker reports it:

```
Alice: read count    → 499
Bob:   read count    → 499
Bob:   insert row    → 500 sold
Alice: insert row    → 501 sold    ← invariant violated
```

A [model checker](https://en.wikipedia.org/wiki/Model_checking) explores this space breadth-first: take every state seen so far, generate every state one step away, test the invariant in each, and repeat until nothing new appears. When a state fails, it returns the path that led there, the exact schedule that breaks the rule. A counterexample trace is a stack trace for a design, available before the code exists.

<span class="pullquote left" text-content="Production traffic is a scheduler that eventually runs the interleavings your tests did not."></span>

Compare the test suite. Each test run executes one schedule, and usually the same one, because the four violating orders all require Bob's read to land in the few microseconds between Alice's read and her commit. On a laptop, that window is almost never hit. At 9am on a Friday with thousands of customers in the queue, it is hit constantly. The defect was in the design from the beginning; production traffic is a scheduler that eventually runs the interleavings your tests did not.

One small system, three traditions, and three kinds of counterexample: the picture, the story and the schedule. Each tradition catches a bug the other two cannot express, which is why learning one formal method does not protect you from everything. It chooses which errors you are equipped to find.

## Counting the interleavings

Six orderings is a space you can check by hand. But a real session is not two steps. Give each customer four, select, hold, pay and confirm, and two concurrent customers can weave their eight combined steps in 70 different orders. Five customers produce around 300 billion. Ten customers, four clicks each, produce roughly 10<sup>34</sup>, more orderings than there are stars in the observable universe, from a system that still fits on a whiteboard. The growth is of the same runaway kind as the [wheat and chessboard story](https://en.wikipedia.org/wiki/Wheat_and_chessboard_problem), and it arrives just as quickly.

Model checkers cope with this in two ways. The first is that they store states, not orderings: enormous numbers of schedules converge on identical states, and a state already visited is never explored twice. The second is a deliberate concession: explore everything within a bound, say five customers and three seats, and report what was found. TLC, the checker for TLA+, will work through hundreds of millions of states overnight. The result is weaker than proof and stronger than any test suite: a guarantee that no counterexample exists within the bound. Experience is kinder here than the arithmetic suggests, because design errors tend to have small counterexamples; a flaw that needs six customers to manifest will usually manifest with three.

<span class="pullquote left" text-content="A schedule 35 steps deep is beyond what any reviewer imagines or any test suite samples. Breadth-first search reaches it mechanically."></span>

Small instances do not mean short traces, though. When the Amazon engineers mentioned earlier applied TLA+ to DynamoDB's replication protocol, the design had already been through extensive fault-injection testing, stress testing on real hardware and hand-written proofs of correctness. The model checker [found three further bugs](https://lamport.azurewebsites.net/tla/formal-methods-amazon.pdf), one of which could lose customer data and whose shortest error trace ran to 35 steps: a specific sequence of failures and recovery steps, interleaved with ordinary processing. The bug had passed unnoticed through design reviews, code reviews and all of that testing, and improbability was no protection, because AWS had observed combinations of events at least as complicated in production. A schedule 35 steps deep is beyond what any reviewer imagines or any test suite samples. Breadth-first search reaches it mechanically, having already checked everything shallower. The same team introduced TLA+ to their colleagues as "exhaustively testable pseudo-code", which is as good a one-line summary of bounded model checking as exists.

Underneath this concession sits the trade that organises the whole field: the more a specification language can express, the less of its checking a machine can complete unassisted. **Verification is a spectrum, and proof occupies only one end of it.** Bounded exhaustive search, beyond reasonable doubt, is a respectable position on that spectrum, chosen deliberately.

## Safety and liveness

The properties checked so far share a useful trait: when they fail, there is a moment to point at. "No gig is ever oversold" is violated by a specific state, the one containing the 501st row. The literature calls these [safety properties](https://en.wikipedia.org/wiki/Safety_and_liveness_properties): nothing bad ever happens.

"Every hold is eventually released" is a different kind of promise: something good happens, eventually. No finite observation can violate it. Watch the system for a year without seeing the release and you have proven nothing, because "eventually" has no deadline. These are liveness properties, and verifying them requires reasoning about infinite behaviours and fairness assumptions, which is harder for tools and humans alike. Practitioners often sidestep the difficulty by bounding the promise. "Released within thirty minutes" can be violated at a specific moment, which makes it a safety property again, checkable with the machinery above. A bounded claim is both more useful to operators and easier to check, and when a system's documentation promises convergence "eventually", it is reasonable to ask when.

## Any number of customers

Bounded checking covered five customers. The claim you want is for any number, and no enumeration reaches it, because whatever bound you check, a larger one exists. The way past enumeration is [induction](https://en.wikipedia.org/wiki/Mathematical_induction), the same principle from school mathematics. Instead of exploring where the system can get to, you exhibit an *inductive invariant*: a property that is true in the initial state and preserved by every step the system can take, starting from any state that satisfies it. If no single step can carry the system from a good state to a bad one, then no sequence of steps can either, for two customers or two million. An impossible enumeration becomes one proof obligation per action.

The difficulty is that finding the invariant is a creative act. It is rarely the property you care about; it is a strengthened statement that mentions every moving part of the design, and discovering it usually means understanding your own system better than you did.

This is also why the serious proof assistants, [Lean](https://lean-lang.org), [Rocq](https://rocq-prover.org) and [Isabelle](https://isabelle.in.tum.de), are interactive, and the reason is not ergonomics. In a logic expressive enough to state facts about arbitrary systems, proof search is [undecidable](https://en.wikipedia.org/wiki/Undecidable_problem): no algorithm is guaranteed to find a proof even when one exists. Checking a completed proof, by contrast, is mechanical. The tools divide the work along exactly that line. The human supplies the creative steps, an invariant or a missing lemma, and the machine verifies every inference without fatigue. Through the [Curry-Howard correspondence](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence), the proofs are themselves programs and the checker is a type checker, the same species of tool that has been proving properties of your code on every compile.

The proofs are large. [seL4](https://sel4.systems), the operating system kernel that serves as formal verification's most complete demonstration, is under 10,000 lines of C; the proof of its functional correctness runs to roughly 200,000 lines of Isabelle and took on the order of twenty person-years. Tooling has improved since, and AI assistance is beginning to reduce the cost of proof engineering, but the ratio is worth carrying with you when someone forecasts a fully verified system by the end of the quarter.

## What the proof is about

Two caveats now need stating plainly, because they bound everything above.

The first: nearly everything in this article has operated on a model, the design restated in a specification language, not the code that takes the money. Verify the model and you have verified the model. The Amazon paper is candid about this: its most frequently asked question is how the engineers know the executable code correctly implements the verified design, and the answer given is "we don't". Implementations drift, and once they do, the verification describes a system you are no longer running. There are rigorous ways to close the gap: [refinement](https://en.wikipedia.org/wiki/Refinement_%28computing%29) derives the implementation from the model in provable steps, some teams generate test suites from the specification, and the seL4 project proved properties of the C itself. Most teams close it with discipline and review, which is to say partially. A specification that nobody reconciles against the code stops describing the system, and its guarantees quietly expire.

The second: verification answers exactly the question you asked, and only that one. Our specification says no gig oversells and no seat is double-booked. A system that never sells any ticket satisfies it completely, and could prove it. What you meant included revenue, and customers, and a band playing to a full room, and none of that was in the specification.

<span class="pullquote" text-content="Verification answers exactly the question you asked, with no opinion about whether it was the right question."></span>

These two gaps, between the model and the code and between the specification and your intent, are where formal methods earn their scepticism, and they are also where the AI connection from earlier becomes concrete. When an agent builds the system, the specification is the place your intent lives, and checking delivery against it is how you know what you received. Both gaps still apply. Verification answers exactly the question you asked, with no opinion about whether it was the right question.

## Checking the past

Meanwhile the booking site has shipped, grown a queue and a second database, and left the territory where anyone will model-check it exhaustively. Its behaviour can still be examined, by changing tense. Instead of exploring every possible future, record the past: capture the history of every hold, payment and sale the system performs, then check that record for violations.

This is the approach behind [Jepsen](https://jepsen.io/analyses), which drives databases with concurrent clients while injecting network partitions and process crashes, recording every operation. [Elle](https://github.com/jepsen-io/elle) is the checker that reads such a history and determines whether it is consistent with the isolation level the database claims to provide. The published analyses include a number of respected databases exhibiting anomalies their documentation excluded, write skew among them, which returns us to where this article began.

Be precise about what kind of instrument this is. A violation found in a history is a bug proven beyond argument, transcript included. A history containing no violations proves only that the schedules you happened to witness were correct, and those schedules are a vanishingly small sample of the possible ones. Absence of evidence is not evidence of absence. Every technique in this article has traded something away; this one trades away the future for a verdict about the past, and for a system already in production it is sometimes the only trade still available.

## Choosing what to give up

So, what is formal specification? Writing down what your system must and must not do, in a language precise enough to analyse, and then deciding, with open eyes, how much checking you can afford. Nobody can check everything, and every tradition in this tour responds by surrendering something different. Testing keeps your production code and surrenders completeness. Model checking keeps full automation and surrenders unbounded scale. Proof assistants keep unbounded scale and surrender automation. History checking surrenders the future. You have been accepting versions of these trades throughout your career, every time you leaned on a type checker or trusted an isolation level you had never read. Making the trade deliberately, for your own system's invariants, is the whole discipline.

The weekend design at the top of this article remains a reasonable way to spend a Friday. It shipped with a set of answers to questions nobody had asked out loud, and one of those answers was wrong. Formal specification is asking the questions first, while the answers are still cheap to change.

---

Making intent precise enough to check is how we approach [AI-assisted engineering at JUXT](/). If you are working out which of your system's guarantees deserve that precision, we'd welcome [a conversation](mailto:info@juxt.pro?subject=Formal%20specification).
