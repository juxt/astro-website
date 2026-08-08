---
author: 'yav'
title: 'The JDK contradicts its own documentation'
description: 'Fifteen places where the current JDK disagrees with its own Javadoc, found by restating the documentation as specifications and deriving the tests it demands.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-08-05'
heroImage: 'the-jdk-contradicts-its-own-documentation.jpg'
tags:
  - 'ai'
  - 'testing'
  - 'java'
  - 'engineering'
---

<p class="lede">Take a linked list of three elements. Ask for its reversed view, then clone the view. The documentation on clone promises a shallow copy, which shares its elements with the original and nothing else. Now add an element to your copy and print the list you started with. It has grown. The copy was never a copy. It is a live view, and writing to it writes through to the original. This has been true on every JDK since 21. TreeSet carries the same contract and gets it right.</p>

```java
var original = new LinkedList<>(List.of(1, 2, 3));
var clone = (LinkedList<Integer>) original.reversed().clone();

clone.push(4);

System.out.println(original);   // [1, 2, 3, 4]   expected [1, 2, 3]
```

Cloning a list is a common way to snapshot state before handing it to another component. A deep copy is the careful version, but where nothing about the case warrants one, a shallow clone is reasonable enough. Regardless, this is unexpected behaviour and it is wrong. There is no exception and no warning, and the failure surfaces later as inexplicable mutation of the source list.

This is one of fifteen places where the current JDK contradicts its own documentation. All fifteen are public, in [a repository](https://github.com/yavorpanayotov/jdk-contract-defects) holding a report and a dependency-free reproducer for each, runnable with a single command.

## A contract waiting to be executed

Any script can generate a million test inputs. The right output for each of them is another matter. Without it there is nothing to assert, and the best a test can do is check that the code does not crash. The testing literature calls the thing that knows the right answer an oracle, and the difficulty of obtaining one the oracle problem. Every article in this series has run into it, one way or another. The [third article](https://www.juxt.pro/blog/the-ground-truth-made-executable/) took a bank's settlement policy, a document with authority over what the system must do, and turned it into a specification that machines could execute. The [previous article](https://www.juxt.pro/blog/evals-are-not-tests/) argued that you cannot test what you never pinned down.

The JDK comes with its contract already pinned down. The Javadoc is the platform's normative specification, unusually precise, well maintained for thirty years, and it states laws. A shallow copy does not share structure. A matcher in a failed state reports no match. An encoder fed input after a final flush throws. Every one of those sentences is an oracle.

I kept the aim of the exercise deliberately narrow. Find observable behaviour that contradicts the JDK's own words. Not style opinions, not performance complaints, and not places where the prose could be clearer. With a contradiction, either the code is wrong or the documentation is, both are reportable, and neither is a matter of taste. This is requirements engineering again. The requirements were written by the JDK's own developers many moons ago, and they have been maintained release by release ever since.

## 10 specifications, 645 obligations, 17.6 billion checks

I pointed [Allium](https://allium-lang.org), JUXT's open-source language for writing behavioural specifications, at ten areas of the JDK. Collections and their views, streams, the class-file API, random number generation, time, arithmetic, regular expressions, character encoding, and structured concurrency. For each area the documentation was restated as a specification. Documented state machines became transitions. Documented laws became invariants. Algebraic promises, such as a value surviving a round trip through its own string form, became contracts.

From those ten specifications the tooling derived 645 test obligations mechanically. One per invariant, one per precondition and postcondition, and one per documented state transition. A documented state machine yields one further obligation, that every combination the documentation does not declare must be rejected. Checking that one honestly means trying every method in every state, the full grid. For a charset encoder that means a flush before any input has arrived, more input after the final flush, and so on, with the documentation demanding a specific exception for each.

The obligations then became about a hundred test programs, each a plain Java file with a main method, run straight from source. The count is a hundred rather than 645 because obligations cluster naturally. Most of them are promises about the same object, its size after an add, its order after a reversal, its contents after a remove, and one exercise of the object can check all of them together. A single program that walks a collection through random operation sequences, checking everything visible about it at every step, covers dozens of obligations in one run.

Allium produced the ground the checks stand on. Restating prose in a formal language forces its ambiguities into the open, because a vague sentence does not survive formalisation. The finished specifications then had to pass its checker before anything ran, and the obligations are worked out from them by its tooling, the same list every time. The model's part was everything executable, the hundred programs and the choice of how each obligation would be checked. Those hundred programs ran billions of checks against the live JDK.

A check is one rule tried against one input. The biggest contributor was a single rule about a single method. A bounded random number must land inside the range you asked for. The raw material behind that number is one 32-bit value, and there are only just over four billion of those, few enough to try them all. Every value, over four documented ranges, and that one rule alone accounted for seventeen billion checks. The float version of the same rule added another four hundred million. Everything else, across all ten areas, amounted to well under a hundred million checks, a lot by everyday standards and a rounding error next to the seventeen billion.

For the range rules, the exhaustive treatment happened to be affordable, which it rarely is. Boundary values, a handful of checks around each edge, would have been the classic route. But boundaries have to be known to be picked, and a pass here costs a few arithmetic operations. For those paths nothing needed picking. Every single case has been tried.

The JDK has been tested for three decades by people with excellent instincts. Instinct goes to the cases that look tricky and to the places where bugs are expected to hide, and after thirty years both are clean. Derived obligations have no instincts. They visit every cell of the grid at the same priority. Five of the fifteen findings sat in cells with nothing special about them, plain edge cases and unremarkable combinations of object state and method call.

<figure style="margin:2.5rem 0;">
<div style="max-width:380px;margin:0 auto;">
<svg viewBox="0 0 360 302" role="img" aria-label="The funnel of the exercise. The Javadoc across ten areas is restated as ten specifications. From those, 645 obligations are derived mechanically. The obligations become about a hundred test programs written by a model, and the programs run 17.6 billion checks against the JDK." style="width:100%;height:auto;">
<defs><marker id="arwR" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="currentColor" opacity="0.55"/></marker></defs>
<rect x="70" y="6" width="220" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="180" y="25" text-anchor="middle" font-size="11" fill="currentColor">the Javadoc, 10 areas of the JDK</text>
<line x1="180" y1="36" x2="180" y2="50" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwR)"/>
<text x="192" y="47" font-size="8.5" font-style="italic" fill="currentColor" fill-opacity="0.7">restated</text>
<rect x="70" y="52" width="220" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="180" y="71" text-anchor="middle" font-size="11" fill="currentColor">10 specifications</text>
<line x1="180" y1="82" x2="180" y2="96" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwR)"/>
<text x="192" y="93" font-size="8.5" font-style="italic" fill="currentColor" fill-opacity="0.7">derived, mechanically</text>
<rect x="70" y="98" width="220" height="30" rx="6" fill="rgba(244,144,29,0.07)" stroke="#f4901d" stroke-width="1.5"/>
<text x="180" y="117" text-anchor="middle" font-size="11" fill="currentColor">645 obligations</text>
<line x1="180" y1="128" x2="180" y2="142" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwR)"/>
<text x="192" y="139" font-size="8.5" font-style="italic" fill="currentColor" fill-opacity="0.7">implemented, by a model</text>
<rect x="70" y="144" width="220" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="180" y="163" text-anchor="middle" font-size="11" fill="currentColor">~100 test programs</text>
<line x1="180" y1="174" x2="180" y2="188" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwR)"/>
<text x="192" y="185" font-size="8.5" font-style="italic" fill="currentColor" fill-opacity="0.7">executed</text>
<rect x="70" y="190" width="220" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="180" y="209" text-anchor="middle" font-size="11" fill="currentColor">17.6 billion checks</text>
<line x1="180" y1="220" x2="180" y2="234" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwR)"/>
<rect x="70" y="236" width="220" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.5"/>
<text x="180" y="255" text-anchor="middle" font-size="11" font-weight="600" fill="currentColor">15 contradictions</text>
<text x="180" y="290" text-anchor="middle" font-size="9.5" font-style="italic" fill="currentColor" fill-opacity="0.75">the checklist is derived, not chosen</text>
</svg>
</div>
<figcaption style="text-align:center;font-size:0.875rem;opacity:0.7;margin-top:0.75rem;">The orange box is the derived part, the same 645 obligations on every run.</figcaption>
</figure>

## The techniques that found them

Most of the findings are properties of whole operation sequences, or of every implementation of one contract behaving the same way. Four techniques checked them, each from a different angle. Model-based testing, algebraic laws over a large corpus, equivalence between incremental and bulk processing, and the legality grid. This part was up to the implementing model, and it chose the techniques based on the set of obligations it was handed.

In model-based testing the harness keeps two versions of the same object. One is the real object under test. The other is a plain object that the harness updates itself, effectively doing by hand what the documentation says each operation should do. In this case the real object was the list and the plain one was an array. Add an element at the front of the list, and the harness also slots it into the front of the array, a one-line move too simple to be wrong. After every operation it compares the two, their size, element order and contents. The moment they diverge, the likelihood is that the list has strayed from its documentation.

The clone defect fell out of exactly this. Twenty classes implement the sequenced-collections contract, so the harness ran the same operations through every one of them, reversed views included. Nineteen behaved identically. LinkedList did not. Running one contract through many implementations is a fifth technique called differential testing, and a model-based harness gets it almost for free, since the same operations drive twenty classes as easily as one. Deciding whether a single implementation is correct can be genuinely hard. Spotting which of twenty implementations behaves differently from the rest is much easier.

Here is the whole chain for those twenty classes, from the documentation through the specification to the derived obligations.

```
the documentation     "If the implementation permits modifications to this
                       view, the modifications 'write through' to the
                       underlying collection."

the specification     @invariant ReversedWriteThrough
                      @invariant DoubleReversalRestoresOrder
                      @invariant ViewsAgreeOnEquality

the derivation        invariant.ReversedWriteThrough
                      invariant.DoubleReversalRestoresOrder
                      ...83 obligations from this one file
```

The reversed view must write through to its backing collection. Reversing twice must restore the original order. A view must honour the same equality contract as the collection it stands on. Eighty-three obligations were derived from this one file, and checking them is what surfaced the clone defect.

The second technique for checking those properties is algebraic laws over a large corpus. An algebraic law is a rule tying two or more operations together, and it must hold for every input. Encode a string and decode it again, and you must get your string back. A law like that is written once and does not cost much to run a million times, so you run it over a corpus, a large pile of real inputs. The class-file API carries exactly such a law, parse then write then parse again must preserve the bytes. The corpus was the JDK itself. All 27,923 class files that ship with it went through, byte for byte, one check each. That one came back clean, which is a result too.

The third technique is equivalence between incremental and bulk processing. Anything that can be fed data in small pieces must produce the same answer as when it is handed everything at once. Feeding in pieces forces the code to stop mid-work and keep track of where it got to, and that bookkeeping is machinery of its own, machinery that all-at-once tests might not wake.

Out of 173 character encodings in the JDK, exactly one returned a different answer depending on how it was fed, a charset that auto-detects Japanese encodings. Feeding it one byte at a time is explicitly allowed by the decoding protocol.

```
x-JISAutoDetect, one sentence through two feedings

  the text              こんにちは世界。日本語のテキストです。
                        // hello world, this is Japanese text

  decoded in one call   こんにちは世界。日本語のテキストです。
  decoded byte by byte  ､ｳ､�､ﾋ､ﾁ､ﾏﾀ､ｳｦ｡｣ﾆ�ﾋﾜｸ�､ﾎ･ﾆ･ｭ･ｹ･ﾈ､ﾇ､ｹ｡｣   // nonsense
```

Same bytes, same charset, different feeding. That one did not make the list of fifteen. The detector's own documentation calls it best effort, so there is no promise for the behaviour to contradict.

The last technique is the legality grid itself. Here the documentation enumerates which calls are legal in which state and the grid tests every combination. Three of the fifteen findings came out of it. An encoder method skips its documented state check on 166 of 171 charsets. A matcher that fails to find a match is documented to be left in a well-defined state, and it is not. It keeps stale results from the previous match and reports them as current. The third is the same matcher again, left with two of its own methods disagreeing after a pattern swap.

## The hundred that did not survive

A method that derives its checks mechanically has an obvious failure mode, as it tends to produce plausible non-bugs at scale. The countermeasure was adversarial. Before any candidate could claim the JDK was wrong, the model switched sides, assumed its own specification was misread, and tried hard to prove exactly that.

Roughly a hundred candidates were investigated and thrown away. More than forty died because the test was wrong. Sixty character encodings appeared to fail the round-trip law. Their documentation says several characters may map to the same bytes, so decoding can only return one of them, and it may not be the character that went in. A batch of apparent failures in parallel stream gathering went the same way as the Japanese auto-detector. A closer read of the documentation dissolved them, because it explicitly permits what the test had flagged.

My favourite discard was an access-ordered `LinkedHashMap`, a map that keeps its entries in a defined order and moves an entry to the back of that order whenever it is read. That behaviour is documented, and it is what some LRU (least recently used) caches are based on. It appeared to reorder itself wrongly, until it turned out the verifier's check was itself a read, so every check moved the very entry it was checking.

The time arithmetic held over nine million checks across six hundred time zones and came back clean. The largest clean area was the random generators, and testing them raised a puzzle of its own.

## Testing a random number generator

How do you test a random number generator when it takes no input? The established answer is statistical. Test suites with names like Dieharder and TestU01 consume gigabytes of a generator's output and search it for patterns, and a generator passes when no clear pattern is witnessed. That is the right way to judge the quality of the randomness. As we were coming from the docs, the question here was whether the documented promises hold, and those promises were largely about the range a result could fall in.

A generator has two parts, a source of raw bits and a small helper that folds those bits into the range you asked for. The documented promises live in the helper, so the helper is what goes under test. The harness replaced the source with a stub, a fake generator that returns whatever bits the test tells it to return. With the stub in place, the bits can be enumerated rather than sampled, every possible value handed to the helper exactly once. And because all of the JDK's random generator algorithms, about twenty of them, funnel their bounded methods through the same shared helpers, sweeping the helpers exhaustively covers them all at once.

The stub was not my idea. Allium had derived the obligation, that a bounded random number must land inside the range asked for, whatever the input. The model was handed a brief asking for ordinary randomised property tests. It however noticed that the input space was only about four billion values, small enough to visit completely, and upgraded sampling to enumeration on its own. I would like to think cost was part of the decision. Each pass is a few arithmetic operations. Anything more expensive and sampling would have stayed the sensible option.

Over seventeen billion checks ran through the stub, just over four billion values swept once for each of four documented ranges, and the generators kept their promise on every possible input.

<figure style="margin:2.5rem 0;">
<div style="display:flex;flex-wrap:wrap;gap:2rem;justify-content:center;">
<div style="flex:1 1 280px;max-width:400px;">
<p style="text-align:center;font-size:0.9rem;font-weight:600;margin:0 0 0.25rem;">Without the stub, sampling</p>
<svg viewBox="0 0 376 190" role="img" aria-label="A source of random bits feeds the helper, which folds the bits into the requested range and produces one sampled number. A test can only sample." style="width:100%;height:auto;">
<defs><marker id="arwP" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="currentColor" opacity="0.55"/></marker></defs>
<rect x="88" y="8" width="200" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="188" y="27" text-anchor="middle" font-size="11" fill="currentColor">a source of random bits</text>
<line x1="188" y1="38" x2="188" y2="52" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwP)"/>
<rect x="68" y="54" width="240" height="44" rx="6" fill="rgba(244,144,29,0.07)" stroke="#f4901d" stroke-width="1.5"/>
<text x="188" y="72" text-anchor="middle" font-size="10.5" font-weight="600" fill="currentColor">the helper</text>
<text x="188" y="88" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.85">folds the bits into the range you asked for</text>
<line x1="188" y1="98" x2="188" y2="112" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwP)"/>
<rect x="88" y="114" width="200" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="188" y="133" text-anchor="middle" font-size="11" fill="currentColor">one number, sampled</text>
<text x="188" y="172" text-anchor="middle" font-size="10.5" font-style="italic" fill="currentColor" fill-opacity="0.8">A test can only sample.</text>
</svg>
</div>
<div style="flex:1 1 280px;max-width:400px;">
<p style="text-align:center;font-size:0.9rem;font-weight:600;margin:0 0 0.25rem;">With the stub, enumeration</p>
<svg viewBox="0 0 376 190" role="img" aria-label="A stubbed source returns whatever bits the test asks for and feeds the same helper. The documented promise is checked on every pass, covering every possible input exactly once." style="width:100%;height:auto;">
<defs><marker id="arwQ" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="currentColor" opacity="0.55"/></marker></defs>
<rect x="68" y="4" width="240" height="38" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.55"/>
<text x="188" y="20" text-anchor="middle" font-size="11" fill="currentColor">a stubbed source</text>
<text x="188" y="34" text-anchor="middle" font-size="8.5" font-style="italic" fill="currentColor" fill-opacity="0.7">it returns whatever bits the test asks for</text>
<line x1="188" y1="42" x2="188" y2="56" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwQ)"/>
<rect x="68" y="58" width="240" height="44" rx="6" fill="rgba(244,144,29,0.07)" stroke="#f4901d" stroke-width="1.5"/>
<text x="188" y="76" text-anchor="middle" font-size="10.5" font-weight="600" fill="currentColor">the same helper</text>
<text x="188" y="92" text-anchor="middle" font-size="9" fill="currentColor" fill-opacity="0.85">the documented promises live here</text>
<line x1="188" y1="102" x2="188" y2="116" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwQ)"/>
<rect x="68" y="118" width="240" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="188" y="137" text-anchor="middle" font-size="11" fill="currentColor">the promise checked on every pass</text>
<text x="188" y="172" text-anchor="middle" font-size="10.5" font-style="italic" fill="currentColor" fill-opacity="0.8">Every possible input, exactly once.</text>
</svg>
</div>
</div>
<figcaption style="text-align:center;font-size:0.875rem;opacity:0.7;margin-top:0.75rem;">The helper, in orange, does not know who feeds it. With the stub, every possible input is visited exactly once.</figcaption>
</figure>

## Four regressions, four culprits

The reproducers are deliberately self-contained, which makes them cheap to point at other releases. Running the suite across six JDK versions, from 21 to the 27 early-access builds, turned the findings into a matrix. Eleven of the fifteen have been present for years. Four are regressions, behaviour that worked correctly in an earlier release until a later change broke it. Two of the four appeared in JDK 26 itself, the current release.

Each regression is traced in its report to the specific upstream change that introduced it, by diffing the relevant sources between releases. One of them is a performance refactoring of date formatting that turned a latent flaw into an observable crash. Another is a scale correction to a square root that fixed the general case and broke the zero case, and that one is already repaired in the early-access builds. The attribution is the eval article's lesson again. Whoever picks up the report starts with the list of suspects already down to one.

The findings are going to the JDK team through the official channel. The clone defect is filed and awaiting triage, and the rest are following. Where any of them is already known, the repository will link the prior report, because the point of the exercise was never to score against the JDK.

The reconciliation demo from earlier in this series ran a written policy through a loop that made it executable, in a system I controlled. This time the same kind of loop pointed outward, at one of the most examined codebases in the world, with its authors' own words as the ground truth. I chose a hard target on purpose. The documentation was the specification all along. All anyone had to do was execute it.
