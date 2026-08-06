---
author: 'hga'
title: 'What are formal methods?'
description: 'AI is ushering formal verification out of academia into the working lives of software engineers. What is it?'
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

<p class="lede">AI is ushering formal methods out of academia into the working lives of software engineers. What is it all about?</p>

It's always useful to have an example in mind. Let's use this one of a ticketing system for an event with capacity 500.

```sql
BEGIN;
SELECT count(*) FROM tickets WHERE gig_id = 42;
-- application code: 499 < 500, so there's room
INSERT INTO tickets (gig_id, customer) VALUES (42, 'alice');
COMMIT;
```

How can you be sure that your system will never accidentally sell 501 tickets?

One instinct is to offload the job onto the database: the count and insert already run inside a transaction. But run two copies concurrently, Alice and Bob both after the last ticket, and each counts 499, each inserts, both commit. 501 tickets, no error, and a green test suite, because no test interleaves two sessions just so.

The fine print here is the [isolation level](https://www.postgresql.org/docs/current/transaction-iso.html). Postgres defaults to READ COMMITTED, which permits the schedule above. Raising it to REPEATABLE READ does not help: each transaction reads from its own consistent snapshot, the two inserts touch different rows, and neither transaction ever sees a conflict. I ran both against Postgres 17 while writing this, and both sold the 501st ticket. The anomaly is called [write skew](https://en.wikipedia.org/wiki/Snapshot_isolation), and it was catalogued in 1995 in a [critique of the SQL standard's isolation levels](https://dl.acm.org/doi/10.1145/223784.223785). Only SERIALIZABLE catches it, by aborting one of the two transactions with an error most application code is not written to retry: "could not serialize access due to read/write dependencies among transactions".

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

The traditions of formal methods differ first in how they view a system, and the natural place to start is a view you already draw. Through an entity-and-relationship lens, the booking site is customers, orders, seats and holds, joined by relationships: an order belongs to a customer, a hold references a seat. If you have ever sketched a schema on a whiteboard, you have modelled in this tradition.

A specification here consists of two kinds of statement: rules that describe what the system permits, and consequences you believe those rules guarantee. The rules are not invented. They are read off the system you have, or the one you intend to build. Here is the confirmation endpoint:

```python
def confirm(order_id):
    order = orders.get(order_id)
    hold = holds.get(order.hold_id)
    if hold.expires_at < now():
        raise HoldExpired()
    order.status = 'confirmed'
    orders.save(order)
```

Walk through it as a modeller rather than a programmer. The lookup on the second line records the schema: every order references a hold, and every hold, elsewhere in the schema, references a seat. Those references become rules. The guard contributes the endpoint's one promise, an order is only confirmed while its hold is alive, which as a lasting fact about the data reads: every confirmed order was confirmed before its hold expired. The same guard brings a second participant into view, because `now()` returns a different answer every time it is called; the clock is an actor here, and holds expire without a line of your code running. And `orders.save(order)` is where the database would object if it could. In the one-row-per-seat schema, a unique index would have made a second confirmation fail on exactly that line; after the seating remodel the seat sits two joins away, beyond the reach of any index, so no objection comes. "One confirmed order per seat" stopped being something Postgres enforces and became something you believe. Four authors in one short function, your code, your schema, the clock and the database, and a model owes fidelity to the semantics of each. That obligation is not new, only newly visible: the write skew at the top of this article got through because an unexamined mental model of READ COMMITTED did not match the database's own specification.

One more rule hides in what the code does not say. No path in this function, or anywhere else in the codebase, ever sets an order's status back from 'confirmed'. Confirmations outlive the holds they were granted on, and absences like that belong in the model too. Gathered up, the model is four rules: orders reference holds, and holds reference seats; every confirmed order was confirmed before its hold expired; a seat carries at most one unexpired hold at a time (from the endpoint that grants holds, which has a guard of its own); and nothing ever unconfirms an order. The belief: no seat is ever referenced by two confirmed orders. It seems to follow. Checking means finding out.

[Alloy](https://alloytools.org)'s method is blunt: examine every small situation the rules permit and see whether the belief survives in all of them. A "situation" is a tiny, fully specified database state: Alice and Bob exist, seats 14A and 14B exist, one hold, one confirmed order, every timestamp filled in. Change any detail and you have a different one. Alloy builds every situation that can exist within a bound you choose, say two customers, two seats, two holds and two orders, discards those that break a rule, and searches the remainder for one that breaks the belief. This is not fuzzing: Alloy never executes `confirm`, and it knows nothing about the function beyond the rules you transcribed from it. Even the toy bound yields thousands of situations, so the search is a machine's job. Alloy compiles the question into boolean logic and a solver settles it in milliseconds.

For these rules, the solver finds something, and the situation it returns reads as a transcript of `confirm` running twice. At 19:05, Alice calls it. Her hold on seat 14B is live until 19:10, the guard passes and her order is confirmed. Her hold then expires, and nothing unconfirms her order, because nothing ever does. At 19:11, Bob acquires a fresh hold on 14B, which is legal because the seat carries no unexpired hold, and at 19:12 he calls `confirm`. His hold is live until 19:21, so the guard has no objection, and his order is confirmed too. Every rule held throughout, and the guard did its job both times it ran. Yet seat 14B now sits on two confirmed orders. The natural objection, "my code would never allow this", has nowhere left to stand: no bug was needed, only six minutes and the rules as they are. The belief does not follow, the design double-sells without any line of code misbehaving, and the whole discovery is a diagram of five records. A counterexample, in this tradition, is a picture.

Sometimes, of course, the solver exhibits a state you are confident the running system could never reach. There are two possibilities. Either reality contains a defence the model omits, in which case you add the missing rule and run again, or the defence you were counting on does not exist, in which case you have found your bug. Distinguishing the two is precisely the work, and either answer leaves you knowing your system better.

What the shape view handles awkwardly is change. Time entered our model only as data, timestamps to compare, and simple before-and-after facts survived that translation. But a situation is still a snapshot, and the sequence of actions that produces one has no home in it. Our counterexample happened to cast a static shadow, two timestamps out of order, so this view could catch it. Not every temporal failure is so obliging: a hold that expires while its payment is mid-flight, with a gateway that will not roll back, is a story about interleaving, and to tell it the model needs motion.

## Events and sequences

A second tradition finds its subject in occurrences rather than things, and it too can be grounded in code, because `confirm` did not have to be written the way it was. An event-sourced shop would write something closer to this:

```python
def confirm(order_id):
    history = log.read(order_id)
    if not live_hold(history, now()):
        raise HoldExpired()
    log.append(order_id, 'confirmed')
```

The behaviour is the same from the outside, a guard and then an effect, but there are no rows here to point at. The system's state is the log itself, an append-only sequence of events, reserved, expired, confirmed, released, and any "current state" is something you compute by replaying it. Ask this code where the truth lives and it answers: in what happened, in order.

A specification changes shape to match. Instead of laws about a snapshot, you write a grammar for the log, saying which sequences of events are legal. "A seat may only be confirmed while reserved" becomes a rule about adjacency, no `confirmed` until a live `reserved` precedes it, a cousin of the regular expressions you already read. And the double-sell counterexample, which took five records and four timestamps to exhibit as a shape, is now a five-word string: reserved, confirmed, expired, reserved, confirmed. Two confirmations, one seat, every event legal at the moment it happened.

Checking explores sequences the way the shape tradition explored snapshots. Starting from an empty log, a checker asks which events the rules allow next, extends the log by each in turn, and keeps going, hunting for a legal path that arrives at something forbidden. This is the home ground of [process calculi](https://en.wikipedia.org/wiki/Communicating_sequential_processes) and the [B method](https://en.wikipedia.org/wiki/B-Method). The counterexample this time is a story rather than a picture, which is fitting, because the bugs this view catches are ordering bugs, caught as what they are.

Set the two traditions side by side and a pattern shows. The same behaviour, implemented two ways, invited two different specifications, and each specification makes different questions easy. In the shape view, "no confirmation on a dead hold" needed timestamps grafted onto every record; in the event view it is a one-line adjacency rule. In the event view, "every order belongs to exactly one customer" is the awkward one, answerable only by replaying the whole log; in the shape view it was a foreign key. Specifications, like implementations, can be written in many forms, and the form you choose decides which properties are simple to state and check, and which fight you all the way. The traditions coexist because no single form wins everywhere.

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

Model checkers cope with this in two ways. The first is that they store states, not orderings: enormous numbers of schedules converge on identical states, and a state already visited is never explored twice. The second is a deliberate concession: explore everything within a bound, say five customers and three seats, and report what was found. This is patient work at industrial scale: Amazon checked its DynamoDB specification on a distributed version of TLC, the checker for TLA+, spread across a cluster of ten machines, and the team's published reports include one run that explored 31 billion states over five weeks. The marathons are the clean runs, which must visit every state within the bound before they can promise anything; a run that finds a violation stops sooner, and because the search is breadth-first, the trace it hands back is the shortest that exists. A clean result is weaker than proof and stronger than any test suite: a guarantee that no counterexample exists within the bound. Experience is kinder here than the arithmetic suggests, because design errors tend to have small counterexamples; a flaw that needs six customers to manifest will usually manifest with three.

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

That arithmetic shapes the tools industry reaches for, and two of the most telling are domain-specific in a way the general-purpose proof assistants are not. [Ivy](https://microsoft.github.io/ivy/), built for distributed protocols, narrows the logic: its specification language is confined to a fragment of first-order logic in which every proof obligation is decidable, so the solver always terminates, either agreeing that an invariant is preserved by every action or returning a small concrete state that breaks it. The human keeps exactly one job, the creative one, proposing and repairing the invariant. The price is expressive power, paid deliberately; the reward is unbounded proof without a proof engineer, for as long as the protocol fits the fragment.

[P](https://p-org.github.io/P/) narrows the ambition instead. A P specification is an executable program, the participants of a protocol written as communicating state machines in a language that reads like the code engineers already write, and its checker explores interleavings and failure schedules just as our six orderings were explored, exhaustively within a bound. P gives up the unbounded claim entirely, stepping back down the spectrum to systematic exploration, and in exchange it gets adopted: Microsoft wrote the core of the Windows 8 USB driver stack in P, compiling the model into the shipping driver, and AWS uses it across its largest services, including the work that moved S3 to strong consistency. Between them, Ivy and P read the spectrum as a menu: pick the position that fits your problem, and give up nothing you didn't choose to.

## What the proof is about

Two caveats now need stating plainly, because they bound everything above.

The first: nearly everything in this article has operated on a model, the design restated in a specification language, not the code that takes the money. Verify the model and you have verified the model. The Amazon paper is candid about this: its most frequently asked question is how the engineers know the executable code correctly implements the verified design, and the answer given is "we don't". Implementations drift, and once they do, the verification describes a system you are no longer running. There are rigorous ways to close the gap. [Refinement](https://en.wikipedia.org/wiki/Refinement_%28computing%29) derives the implementation from the model in provable steps; the B method, which appeared above specifying event sequences, was designed around this, and has carried specifications all the way down to the running code of driverless metro lines. [Dafny](https://dafny.org) dissolves the gap rather than bridging it: specification and implementation share one file, preconditions, postconditions and invariants sit alongside the code they govern, and a verifier proves on every compile that the code meets them, the type checker from earlier grown to full strength. The seL4 proof reaches the C itself. Each of these buys assurance at the price of constraint, because you write in the tool's language and at the tool's pace. Most teams instead settle for discipline, review and tests generated from the specification, which is to say they close the gap partially. A specification that nobody reconciles against the code stops describing the system, and its guarantees quietly expire.

The second: verification answers exactly the question you asked, and only that one. Our specification says no gig oversells and no seat is double-booked. A system that never sells any ticket satisfies it completely, and could prove it. What you meant included revenue, and customers, and a band playing to a full room, and none of that was in the specification.

<span class="pullquote" text-content="Verification answers exactly the question you asked, with no opinion about whether it was the right question."></span>

These two gaps, between the model and the code and between the specification and your intent, are where formal methods earn their scepticism, and they are also where the AI connection from earlier becomes concrete. When an agent builds the system, the specification is the place your intent lives, and checking delivery against it is how you know what you received. Both gaps still apply. Verification answers exactly the question you asked, with no opinion about whether it was the right question.

## Checking the past

Meanwhile the booking site has shipped, grown a queue and a second database, and left the territory where anyone will model-check it exhaustively. Its behaviour can still be examined, by changing tense. Instead of exploring every possible future of a model, record the actual past of the running system: capture the history of every hold, payment and sale it performs, then check that record for violations. This buys something nothing earlier in this article could: the object under examination is the running system itself, gateway, database, network and all, rather than any description of it.

This is the approach behind [Jepsen](https://jepsen.io/analyses), which drives databases with concurrent clients while injecting network partitions and process crashes, recording every operation. [Elle](https://github.com/jepsen-io/elle) is the checker that reads such a history and determines whether it is consistent with the isolation level the database claims to provide. The published analyses include a number of respected databases exhibiting anomalies their documentation excluded, write skew among them, which returns us to where this article began.

Be precise about what kind of instrument this is, because neither tool is formal verification, and neither claims to be. Jepsen is testing: adversarial, industrial-strength testing, but testing. Elle is subtler. The isolation levels it checks against are formal specifications, the same family of definitions this article opened with, and its verdict on any given history is mathematically rigorous. The evidence, though, is empirical, whatever schedules happened to occur while Jepsen was shaking the system, so the verdict is rigorous but the coverage is not. A violation found in a history is a bug proven beyond argument, transcript included. A history containing no violations proves only that the schedules you happened to witness were correct, and those schedules are a vanishingly small sample of the possible ones. Absence of evidence is not evidence of absence. Every technique in this article has traded something away; this one trades away claims about the future for certainty about the past, and for a system already in production it is sometimes the only trade still available.

## Choosing what to give up

So, what is formal specification? Writing down what your system must and must not do, in a language precise enough to analyse, and then deciding, with open eyes, how much checking you can afford. Nobody can check everything, and every tradition in this tour responds by surrendering something different. Testing keeps your production code and surrenders completeness. Model checking keeps full automation and surrenders unbounded scale. Proof assistants keep unbounded scale and surrender automation. History checking surrenders the future. You have been accepting versions of these trades throughout your career, every time you leaned on a type checker or trusted an isolation level you had never read. Making the trade deliberately, for your own system's invariants, is the whole discipline.

The weekend design at the top of this article remains a reasonable way to spend a Friday. It shipped with a set of answers to questions nobody had asked out loud, and one of those answers was wrong. Formal specification is asking the questions first, while the answers are still cheap to change.

---

Making intent precise enough to check is how we approach [AI-assisted engineering at JUXT](/). If you are working out which of your system's guarantees deserve that precision, we'd welcome [a conversation](mailto:info@juxt.pro?subject=Formal%20specification).
