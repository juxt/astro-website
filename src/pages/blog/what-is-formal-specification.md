---
author: 'hga'
title: 'What even is formal specification?'
description: 'Two psql sessions and a 501st wristband: formal methods for engineers who assumed the database had it covered.'
category: 'analysis'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-07-24'
heroImage: 'what-is-formal-specification.jpg'
draft: true
tags:
  - 'formal methods'
  - 'engineering'
  - 'databases'
---

<p class="lede">Here is a system you already know how to build. A venue that holds 500 people, general admission, one Postgres database. A tickets table and a purchase endpoint: count what's sold, and if there's room, insert a row inside a transaction. You could have it live by Friday, and it would work, mostly.</p>

The question that spoils the weekend is a quiet one. Capacity is 500. What stops you selling ticket 501?

In the design above, the honest answer is a count:

```sql
BEGIN;
SELECT count(*) FROM tickets WHERE gig_id = 42;
-- application code: 499 < 500, so there's room
INSERT INTO tickets (gig_id, customer) VALUES (42, 'alice');
COMMIT;
```

Now run it twice at the same time. Alice and Bob both want the last ticket. Each transaction counts 499 sold and inserts a row, both commits succeed, and the 501st wristband is now the fire marshal's problem. Nothing raised an error. The test suite is green and stays green, because no unit test runs two copies of the purchase path interleaved just so.

If your instinct is that transactions are supposed to prevent this, you have just arrived at [isolation levels](https://www.postgresql.org/docs/current/transaction-iso.html), the small print of the relational world. Postgres defaults to READ COMMITTED, which permits the interleaving above. REPEATABLE READ doesn't save you either: each transaction reads from its own snapshot, the two inserts touch different rows and nothing ever conflicts. I ran both against Postgres 17 while writing this, and both sold 501 tickets without a murmur. The anomaly has a name, [write skew](https://en.wikipedia.org/wiki/Snapshot_isolation), and the 1995 paper that catalogued it, [a critique of the SQL standard's isolation levels](https://dl.acm.org/doi/10.1145/223784.223785), is among other things a fine piece of formal specification, though nobody sells it that way. Only SERIALIZABLE catches the bug, by aborting one transaction with an error ("could not serialize access due to read/write dependencies among transactions") that your application was probably not written to retry.

<span class="pullquote" text-content="The guarantee you were trusting turns out to be a formal claim, written with great care by other people, that you have never read."></span>

The guarantee you were trusting turns out to be a formal claim, written with great care by other people, that you have never read. The boundary between everyday engineering and formal methods sits closer than it looks. At the moment, it runs somewhere through your postgresql.conf.

## The words, now that you want them

*Formal methods* is the umbrella term for applying mathematical precision to software, and it covers two activities that conference talks tend to blur. *Formal specification* is stating what your system must and must not do, in a language exact enough for a machine to analyse, which is all that "formal" means; no dinner jacket required. "No gig ever has more tickets than capacity" is a specification, and so is "every hold is eventually released or converted into a sale". *Formal verification* is checking, mechanically, that a design or a program satisfies such a statement.

You can do the first without the second, and it pays sooner than you'd expect. Engineers at Amazon, [describing how AWS uses TLA+](https://dl.acm.org/doi/10.1145/2699417), reported finding serious design bugs through the act of writing specifications alone, before any checker ran. Precision is a hostile environment for wishful thinking. Questions surface that nobody had thought to ask, which is roughly what happened to you a few minutes ago with a count and an insert.

You have also been consuming formal methods your whole career, mostly unlabelled. A type checker is an automated prover in miniature: on every save, it establishes the absence of a whole class of errors across every execution your program will ever have. Isolation levels are formal specifications of precisely which anomalies your database is licensed to show you. What changes when you write a specification of your own is only the target: the behaviour of your system, rather than your language's or your storage engine's.

## Three pairs of glasses

Suppose the write skew has rattled you into doing exactly that. The first decision comes before any tool gets downloaded: which way to look. The traditions of formal methods see systems differently and catch different bugs. (Meanwhile the promoter, sensing weakness, has added allocated seating.)

Through entity-and-relation glasses, the site is customers, orders, seats and the relationships between them, and the invariants are about shape: no seat belongs to two confirmed orders, no order references a seat that doesn't exist. [Alloy](https://alloytools.org) thinks this way. Describe the shapes and their laws and it searches for a small counterexample world in which a law breaks, which is a direct route to discovering that seat 14B can be sold twice. What these glasses cannot see is a payment timeout, because time doesn't exist in a relation.

Through event glasses, the same site is a vocabulary of happenings, reserve, pay, expire and release, with rules about which sequences are legal: no payment lands on a hold that has expired, no release without a hold. This is home turf for [process calculi](https://en.wikipedia.org/wiki/Communicating_sequential_processes) and the [B family](https://en.wikipedia.org/wiki/B-Method), and it catches the payment that arrives for a hold that no longer exists. It is weaker on whether the data ends up the right shape.

The third pair is temporal. Look at the site as a state machine unfolding over time and you can finally ask the sneaky question: what happens if a hold expires while its payment is in flight, the seat is resold, and both charges succeed? [TLA+](https://lamport.azurewebsites.net/tla/tla.html) lives here, modelling a system as the set of every behaviour it could ever exhibit. This is the lens built for interleavings, the one that would have caught the 501st wristband.

One small system, and each lens catches a bug the other two are blind to. Learning one formal method doesn't inoculate your code against everything; it chooses which errors you're equipped to find.

## The part Postgres can't see

Back at the database, you may be nursing the thought that a well-placed [SELECT ... FOR UPDATE](https://www.postgresql.org/docs/current/explicit-locking.html) would have prevented the overselling, and for the count problem it would. But requirements have been accreting while we talked. Allocated seating brought the hold: customers pick seats and the system keeps them for ten minutes while a card number gets typed in. Nobody holds row locks across a customer's think time, so holds become rows with expiry timestamps, and time is now inside your design rather than safely outside it. Then the payment gateway arrives, and the ground shifts: Stripe does not join your transaction. The invariant you care about most, every confirmed order was paid for exactly once, now spans two systems that share no snapshot and no lock manager. There is no setting in postgresql.conf for this.

<span class="pullquote left" text-content="Somewhere between READ COMMITTED and the payment gateway, you stopped configuring a database and started designing a distributed protocol."></span>

Somewhere between READ COMMITTED and the payment gateway, you stopped configuring a database and started designing a distributed protocol. Each patch so far answered the previous question and left the next one open, which is the case for asking the questions up front, in writing, all of them. So you write the protocol down: holds, expiries, payment callbacks and refunds. And since the write skew has made you humble, you'd like something to check it. The protocol fits on two pages. Checking everything it can do sounds feasible. Let's count.

## Ten customers, four clicks

Start smaller than the protocol, with the purchase path from the top of this piece, because as a model it fits in your head. Between database round trips, each customer's transaction does two things: read the count, then insert a row. So the model is two customers, each a two-step program, and the state of the whole system is a line you could write on an index card: where each of Alice and Bob has got to, and what's committed in the table. A step moves one customer forward by one action. The specification is the invariant we've had since the start, never more than 500 sold, and checking means asking one question of every state the system can reach: is the invariant true here?

One honesty requirement before anything runs: each step in the model must be something the code does atomically. Our two steps are two database round trips, and between any two round trips the scheduler is free to run anybody else. Model the read and the insert as a single atomic step and you have verified a system you are not running.

With Alice and Bob live at once, their four combined steps can happen in just six orders. In two of them, one customer finishes before the other reads; the late reader sees 500, the check fails and the sale is politely refused. The other four share a fatal shape: both reads happen before either insert. Here is one, written out as a checker would report it:

```
Alice: read count    → 499
Bob:   read count    → 499
Bob:   insert row    → 500 sold
Alice: insert row    → 501 sold    ← invariant violated
```

A [model checker](https://en.wikipedia.org/wiki/Model_checking) explores this space breadth-first: take every state seen so far, generate every state one step away, test the invariant in each, and repeat until nothing new appears. When a state fails, it hands back the path that led there, the exact schedule that breaks the rule. A counterexample trace is a stack trace for a design, delivered before there's any code to crash.

Compare what your test suite was doing. Each run executes one schedule, and usually the same one, because the four poisonous orderings all need Bob's read to land in the few microseconds between Alice's read and her commit. On a laptop that window is almost never hit. At 9am on a Friday, with thousands of customers in the queue, it's hit constantly. The bug was in the design all along; production traffic is just a scheduler that finally explores the orderings your tests didn't.

Six orderings, then, and a checker visits all six without breaking sweat. But the real session isn't two steps. Select, hold, pay and confirm makes four, and two concurrent customers can weave their eight combined steps in 70 different orders. Five customers make it around 300 billion. Ten customers, four clicks each: roughly 10<sup>34</sup>, comfortably more orderings than there are stars in the observable universe. This is the growth from the [old story about doubling grains across a chessboard](https://en.wikipedia.org/wiki/Wheat_and_chessboard_problem), except nobody here is trying to trick an emperor. It's just what interleaving does, to a ten-customer napkin sketch as readily as to anything planet-scale.

Checkers survive this first by storing states rather than orderings, since different schedules keep converging on states already seen, and then by being honest: explore everything within a bound, say five customers and three seats, and report what's found. TLC, the checker for TLA+, will chew through hundreds of millions of states overnight. What comes back is weaker than proof and stronger than any test suite: a guarantee that no counterexample exists within the bound. Design bugs, in practice, are rarely proud enough to need six customers when three will do. The trade underneath is expressiveness against tractability: the more your specification language can say, the less of its checking a machine can do unassisted. **Verification is a spectrum, and proof occupies only one end of it.**

## The bug you can never witness

There's a second species of question hiding in the protocol. "No gig is ever oversold" promises that nothing bad happens, and a violation is a moment you can point at: there, the 501st row. "Every hold is eventually released" promises that something good happens, eventually, and no finite observation can falsify it. Watch the system for a year without seeing the release and you've proven nothing, because eventually might mean next Tuesday or the [heat death of the universe](https://en.wikipedia.org/wiki/Heat_death_of_the_universe). The literature calls these [safety and liveness](https://en.wikipedia.org/wiki/Safety_and_liveness_properties), and tools treat them differently: liveness needs fairness assumptions and careful reasoning about cycles, so practitioners often bound it instead. "Released within thirty minutes" can be violated at a specific moment, which quietly turns it back into a safety property, checkable on the same machinery. If a vendor tells you their system provably converges eventually, it's fair to ask when.

## Arguing instead of counting

Bounded checking covers five customers; your ambitions run to N. No enumeration reaches "for any number of customers", because whatever bound you check, N+1 exists. The escape is [induction](https://en.wikipedia.org/wiki/Mathematical_induction), the same trick you met at school, and the nearest thing verification has to a superpower. Instead of exploring where the system can get to, you exhibit an invariant: a property true at the start and preserved by every step the system can take, from any state satisfying it. If no single step can carry the system from a good state to a bad one, no sequence of steps can either, for two customers or two million. An impossible enumeration becomes one proof obligation per action.

The catch is that finding the invariant is a creative act. It's rarely the property you care about but a strengthened, warts-and-all statement about every moving part of the design, and discovering it feels like understanding your own system for the first time.

This is also why the serious proof assistants, [Lean](https://lean-lang.org), [Rocq](https://rocq-prover.org) and [Isabelle](https://isabelle.in.tum.de), are interactive, and it isn't a concession to ergonomics. In a logic expressive enough to say worthwhile things about arbitrary systems, proof search is [undecidable](https://en.wikipedia.org/wiki/Undecidable_problem): no algorithm is guaranteed to find a proof, even when one exists. Checking a finished proof, on the other hand, is mechanical. The tools split the work along that line: the human supplies the leap, an invariant or a missing lemma, and the machine verifies every step without fatigue or charity. Through a lovely coincidence called the [Curry-Howard correspondence](https://en.wikipedia.org/wiki/Curry%E2%80%93Howard_correspondence), the proofs are themselves programs and the checker is a type checker, the same species of tool that has been proving things about your code on every save.

The proofs are also large. [seL4](https://sel4.systems), the operating system kernel that serves as formal verification's showpiece, is under 10,000 lines of C; the proof of its functional correctness runs to some 200,000 lines of Isabelle and consumed on the order of twenty person-years. The ratio has improved since, and AI assistance is beginning to help with proof engineering, but if someone promises you a fully verified system by the end of the quarter, the number to ask about is lines of proof.

## What, exactly, did we prove?

Time to let some air out. Nearly everything in this piece has operated on a model of the booking site, its behaviour restated in a specification language, not the code that takes the money. Verify the model and you have verified the model. Implementations drift, and when they do, the certificate on the wall describes a system you are no longer running. There are honest ways to close the gap: [refinement](https://en.wikipedia.org/wiki/Refinement_%28computing%29) derives code from the model in provable steps, some teams generate tests from the spec, and seL4 went as far as proving the C itself. Most teams close it with discipline and review, which is to say imperfectly. A specification nobody reconciles against the code decays into an elaborate way of lying to yourself.

The second gap is nearer and more embarrassing. Verification answers exactly the question you asked, and only that one. Our spec says no gig oversells and no seat double-books. There is a system that satisfies it flawlessly and can prove it: the one that never sells a ticket. Safety comes cheap to a system that refuses to act. What you meant involved revenue and a band with an audience, and none of that was in the spec.

<span class="pullquote" text-content="A proof is a mirror: it reflects your questions back with perfect fidelity, including the ones you asked wrongly."></span>

A proof is a mirror: it reflects your questions back with perfect fidelity, including the ones you asked wrongly.

## Proof that Tuesday behaved

Meanwhile the booking site shipped, grew a queue and a second database, and left the territory where anyone will model-check it exhaustively. Its behaviour can still be interrogated; you just have to change tense. Instead of exploring every possible future, record the past: capture the history of every hold and sale the system performs, then check that record for violations. This is what [Jepsen](https://jepsen.io/analyses) does to databases, tormenting them with concurrent clients and network partitions while writing everything down, and [Elle](https://github.com/jepsen-io/elle) is the checker that reads such a history and works out whether it is consistent with the isolation level the database claimed to provide. Which is where you came in: Jepsen's reports include a parade of respectable databases exhibiting anomalies their documentation ruled out, and write skew features regularly.

<span class="pullquote left" text-content="A history containing no violations proves that Tuesday behaved."></span>

Be clear about what kind of instrument this is. A violation found in a history is a bug proven beyond argument, transcript included. A history containing no violations proves that Tuesday behaved. The interleavings you witnessed are a droplet from the 10<sup>34</sup>, and absence of evidence is not evidence of absence. Every tool in this piece has struck a version of the same bargain; this one strikes it after the system exists, which is sometimes the only place left to strike it.

## What to give up

So, what even is formal specification? Writing down what your system must do, in a language precise enough to be analysed, then deciding with open eyes how much checking you can afford. Every tradition in this tour answers the same constraint, that nobody can check everything, by surrendering something different: testing keeps your code and surrenders completeness, model checking keeps automation and surrenders the unbounded, proof assistants keep the unbounded and surrender automation, and Jepsen surrenders the future for a verdict about the past. You have been making versions of these trades your whole career, every time you leaned on a type checker or trusted an isolation level you'd never read. Doing it deliberately for your own system is the entire discipline. The mathematics is there to keep you honest about which trade you made.

The weekend design at the top of this piece is still a fine way to spend a Friday. But it shipped with a stack of answers to questions nobody had asked out loud, and one of them was wrong by exactly one wristband. Ask the questions first, in whatever language you can afford to check. The fire marshal counts either way.

---

Asking the questions out loud is how we approach engineering at [JUXT](/). If you'd like help deciding which of your system's answers deserve checking, we'd welcome [a conversation](mailto:info@juxt.pro?subject=Formal%20specification).
