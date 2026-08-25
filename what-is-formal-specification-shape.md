# Shape: What even is formal specification?

Working document. Not for publication.

## Gap

Engineers keep hearing about formal methods and picture an arcane correctness script run over code, and can't see why it isn't just harder TDD. By the end they should see a family of modelling disciplines that all answer one question (we can't check everything, so what do we give up?), feel the state explosion in their gut, and leave de-mystified and de-hyped: no silver bullet, several strategies worth having, and the realisation that they've been relying on formal methods by proxy all along.

The bar: even seasoned engineers learn something. The early rungs welcome the novice; the later rungs (why provers must be interactive, proofs that dwarf their programs, the unfalsifiability of "eventually", what Elle can and cannot conclude) are news to most seniors too. The write-skew exhibit surprises almost everyone who hasn't read Berenson et al.

## Idea load

1. Formal specification ≠ formal verification ≠ formal methods. Primer arrives when the reader wants vocabulary, not before.
2. A spec pays for itself before any checker runs: precision surfaces questions you didn't know you had.
3. Verification reasons about all behaviours; testing samples them.
4. The reader already outsources formal methods daily: the type checker, isolation levels.
5. Model↔code gap: most methods verify a model, not the software. Divergence voids the exercise.
6. Intent↔spec gap: verification gives you exactly what you asked for. The empty venue never double-sells.
7. Many traditions, catching different classes of error. Demonstrated three times via the lenses, named once.
8. Verification is a spectrum: proof at one end, beyond reasonable doubt at the other.
9. The spectrum position is a trade between expressiveness and tractability.
10. State explosion: 70 orderings becomes 10³⁴ on a napkin. Rice on the chessboard as optional garnish.
11. Safety vs liveness. "Eventually" is unfalsifiable by finite observation; bounding it turns it into safety.
12. Induction as the escape from enumeration: an invariant preserved by every step.
13. Interactive provers: proof search is undecidable, proof checking is mechanical. The human supplies the invariant, the lemma, the creative leap. Not ergonomics; necessity.
14. Proofs can dwarf the code (seL4). Temper expectations, even with AI assistance.
15. Jepsen and Elle check histories, not futures. Finding a violation proves a bug; finding none proves nothing.
16. Landing: a toolbox of ways to trade away completeness, expressiveness, automation or the real code. Curry-Howard as a one-sentence footnote near the prover rung.

## Carriers

- **The booking site** (spine). First met as the reader's own confident weekend architecture. Returns on every rung, each question widening the state space. Final return as a live production system whose history gets checked.
- **The objection-and-patch dialogue** (unique constraint → capacity write skew → FOR UPDATE → TTL holds → payment gateway). Each patch answers the previous question and not the next one, which is the argument for asking all the questions up front, which is what a specification is.
- **The SQL write-skew exhibit.** Five lines, two sessions, 501 tickets, green test suite. Returns implicitly at the end when Elle checks isolation claims.
- **The napkin arithmetic.** Interleaving counts on the reader's own system: 70, then ~3×10¹¹, then ~10³⁴.
- **The type-checker dial.** "You already run a prover on every save." Returns at the interactive-prover rung via the Curry-Howard footnote.
- **The empty venue.** Late joke carrying the intent↔spec gap.

## Coverage map

| Carrier | Ideas carried | Encounter |
|---|---|---|
| Booking site | 2, 3, 5, 7, 10, 11, 12, 15 | every beat |
| Objection-and-patch dialogue | 2, 4, 7 | beats 2–5 |
| SQL exhibit | 3, 4 | beat 2, echo at beat 10 |
| Napkin arithmetic | 8, 9, 10 | beat 6 |
| Type-checker dial | 4, 13, 16 | beat 3, echo at beat 8 |
| Empty venue | 6 | beat 9 |
| (stated directly) | 1 (primer), 14 (seL4 numbers) | beats 3, 8 |

All sixteen covered. Ideas 1 and 14 land as stated points with concrete numbers rather than embodied scenes, which is acceptable: by beat 3 the reader wants the vocabulary, and seL4's figures are vivid enough to stand alone.

## Shape

**Beat 1 — the confident architecture.** The reader's own design, stated warmly and without irony: a tickets table, a transactions, done by Friday. A sentence of stakes (the 9am on-sale, the queue) but no disaster. This is comfortable territory and the piece says so.

**Beat 2 — one quiet question.** Capacity is 500. What stops you selling 501? The SQL exhibit: two sessions each count 499, each insert, both commit. The test suite is green because no test runs two sessions interleaved just so. The guarantee the reader trusted turns out to be a formal claim they've never read, made at an isolation level they aren't running.

**Beat 3 — the vocabulary, now that it's wanted.** Formal specification (saying precisely what must always hold), formal verification (checking it), formal methods (the umbrella). Writing the spec finds bugs before any checker runs; Amazon's TLA+ experience. Then the relocation move: isolation levels are formal specifications of permitted anomalies, the type checker is a prover that runs on every save. The reader has been outsourcing formal methods for their whole career. This post is about doing it on purpose.

**Beat 4 — three pairs of glasses.** The same booking site through the entity lens (seats, orders, the relation between them; catches two confirmed orders on seat 14B), the event lens (reserve, pay, expire, release; catches payment landing on a dead hold), the temporal lens (catches the hold expiring mid-payment, seat resold, both charges succeed). Each lens catches a bug the others can't see. The traditions get named here, once, lightly: this is why there are many, and why learning one doesn't inoculate you.

**Beat 5 — the patches run out.** FOR UPDATE, then TTL holds bring time into the design, then the payment gateway arrives and joins no transaction. The invariant now spans systems that share nothing. Somewhere between the unique constraint and the payment gateway, the reader stopped configuring a database and started designing a distributed protocol, and no isolation level reviews that design.

**Beat 6 — the napkin detonates.** How would you check a protocol? Enumerate what can happen. Two customers, four steps each: 70 orderings, a model checker eats it instantly. Five customers: ~300 billion. Ten: ~10³⁴, more orderings than stars. On a napkin sketch of a system. This is why "just check everything" is not a plan, why model checkers explore breadth-first with bounded scope, and why beyond reasonable doubt is a respectable place on the spectrum rather than a compromise.

**Beat 7 — does Alice ever get an answer?** Safety violations show up in a trace you can point at. Liveness violations are the absence of something, forever, and you can't watch forever. Bound it ("within 30 seconds") and it quietly becomes safety. The end of the universe makes a brief appearance.

**Beat 8 — any number of customers.** Enumeration is dead; argument replaces it. Induction: find an invariant preserved by every step, and it doesn't matter how you got here. Choosing that invariant is the creative act, and this is why serious provers are interactive: proof search is undecidable, proof checking is mechanical, so the human supplies the leap and the machine grinds the verification. Curry-Howard footnote. Then seL4: the proof is an order of magnitude larger than the kernel it verifies, decades of person-years. Temper expectations accordingly, AI assistance included.

**Beat 9 — the two gaps.** Everything so far verified a model. The code is another matter, and if they diverge, all bets are off; keeping them aligned is a discipline in itself, not a checkbox. And on the other side: the spec might not say what you meant. The venue that never sells a ticket has never double-sold one. Provably correct, and empty. Verification is a mirror: it reflects your questions back with perfect fidelity, including the ones you asked wrongly.

**Beat 10 — the live system.** Production is running now, at scales no model checker reaches. You can't check its futures; you can check its past. Jepsen bullies systems while recording histories; Elle reads a history and finds violations of claimed isolation levels, which is where the reader came in. A violation found is a bug proven. A clean history proves only that Tuesday behaved. Absence of evidence is not evidence of absence.

**Beat 11 — the landing.** No silver bullet, and no mystery either. Every tool in the piece answered the same question differently: what do you give up? Testing gives up completeness. Solvers give up expressiveness. Provers give up automation. Model checkers give up the running code. Jepsen gives up proof itself. The reader has been trading these away by proxy all along; formal specification is making the trade on purpose, with the questions written down. CTA after the rule, in the piece's own vocabulary.

## To find

- ~~**Verify the write-skew exhibit end to end.**~~ DONE (24 Jul 2026, Postgres 17 in Docker): READ COMMITTED and REPEATABLE READ both commit, final count 501; SERIALIZABLE aborts one session with "could not serialize access due to read/write dependencies among transactions" (reason code: pivot), final count 500. Script preserved in session scratchpad (`writeskew.sh`).
- **The interleaving arithmetic.** Orderings of k sessions of n steps = (kn)!/(n!)^k. Verify 2×4 = 70, 5×4 ≈ 3×10¹¹, 10×4 ≈ 10³⁴. Pick an honest comparator (stars in the observable universe ≈ 10²²⁻²⁴; atoms in a gram of matter; get one right and link it).
- ~~**Amazon TLA+ paper.**~~ DONE (24 Jul 2026, read the 2014 paper PDF at lamport.azurewebsites.net): 35-step shortest error trace confirmed, DynamoDB replication & group-membership (939 lines TLA+, 3 bugs found), NOT S3. Engineer had done fault-injection testing, stress testing and informal proofs first. "Plausible hand-waving" and "exhaustively testable pseudo-code" are direct quotes. FAQ answer on whether code matches the verified design: "we don't". Spec-alone value = eliminating hand-waving and exposing ambiguities (not "serious design bugs before any checker ran" — fixed in draft).
- **seL4 figures.** Original SOSP 2009 paper and current project page: lines of C (~8,700 at proof time?), lines of Isabelle proof (~200k?), person-years (~20?). Use the source's numbers, not rounded folklore.
- **Isolation levels as formal specs.** Berenson et al., "A Critique of ANSI SQL Isolation Levels" (1995), and Adya's thesis for the anomaly taxonomy. Link whichever reads better.
- **Elle.** Kingsbury & Alvaro's Elle paper, plus one crisp Jepsen report where a database violated its claimed isolation level (several candidates; pick one where the claim-vs-history gap is stark).
- **Postgres documentation.** Default isolation level (READ COMMITTED), SERIALIZABLE retry guidance, SSI.
- **Safety and liveness.** Lamport 1977 ("Proving the Correctness of Multiprocess Programs") or Alpern & Schneider for the safety/liveness decomposition. Link for the curious, domesticate in text.
- **Interactive provers.** A citable line on undecidability of proof search in higher-order logic vs decidable fragments (SMT). Lean and Rocq homepages.
- **Curry-Howard.** One accessible link (nLab is too much; find a gentler one).
- **Model checker mechanics.** TLC's BFS state-space exploration, for the "breadth-first search through possible worlds" claim.
- **Colour, if kept.** Ticketmaster Eras presale collapse (Nov 2022), Glastonbury queue. Wheat-and-chessboard Wikipedia page if the garnish survives.
- **Phrase check.** The proverb is "absence of evidence is not evidence of absence"; decide whether to attribute (Sagan popularised; Rees origin contested) or leave unattributed.
- **Dafny.** Verify https://dafny.org resolves; confirm "verifier proves on every compile" phrasing is fair (Boogie/Z3, verification on build).
- **B method metro claim.** "Driverless metro lines" = METEOR / Paris Métro Line 14, Siemens, ~86k lines of B, generated code. Verify before draft flag comes off; add link if a good source reads well.
- **TLC 31 billion states / five weeks.** From CACM 2015 version (not in the 2014 PDF). Confirmed via two secondary sources; sight the primary sentence if possible before publication.
- **Ivy.** Verify https://microsoft.github.io/ivy/ resolves. Claims: decidable fragment (EPR), solver always terminates with proof or counterexample-to-induction, built for distributed protocols. Source: Padon et al., "Ivy: Safety Verification by Interactive Generalization", PLDI 2016.
- **P.** Verify https://p-org.github.io/P/ resolves. Claims: Windows 8 USB driver stack core written in P and compiled into the shipping driver (Desai et al., PLDI 2013); AWS uses P across large services including S3 strong consistency migration (P project site / AWS talks). Verify both before draft flag comes off.

## Distilled sequence (rev 2, straight register)

The post reduced to its logical steps, reordered where the first draft got it wrong:

1. A count-then-insert purchase transaction; the 501 question.
2. Two concurrent runs both read 499; both commit; 501 sold; tests green (one schedule per run).
3. Isolation levels: READ COMMITTED and REPEATABLE READ permit it (write skew); SERIALIZABLE aborts one txn. Verified on Postgres 17.
4. Realisation: the guarantee relied on was a formal spec, written by others, never read.
5. Vocabulary: methods (umbrella) / specification (precise statement) / verification (mechanical check). Separable; spec alone finds design bugs (Amazon TLA+).
6. Why now: AI agents build from statements of intent, and delivery has to be judged against something. (Seeds the intent gap and the closing.)
7. Already-consumed formal methods: type checker, isolation levels.
8. **[MOVED]** The system grows: FOR UPDATE fixes the count; holds + TTL bring time inside; payment gateway joins no transaction; invariant spans systems. Each patch answers the previous question. You're designing a protocol → write it down.
9. **[MOVED]** The lenses now follow the growth (first draft had them before it, referencing holds/payments the reader hadn't met): entities/relations (Alloy), events (CSP/B), temporal (TLA+). Each catches a bug the others can't express.
10. Model checking mechanics on the smallest slice: state, step, invariant; step ↔ atomic unit of code; six orderings; four violate; the trace; BFS; tests run one schedule, production runs them all.
11. Explosion: 70 → 3×10¹¹ → 10³⁴.
12. Coping: dedupe states, bound the instance; no-counterexample-within-bound; small counterexamples in practice; expressiveness↔tractability spectrum.
13. Safety vs liveness; bounding liveness makes it safety.
14. Unbounded N: induction; invariant discovery is the creative act; provers interactive because search is undecidable, checking mechanical; Curry-Howard aside; seL4 proof size.
15. Gap one: model ↔ code (refinement, generated tests, discipline).
16. Gap two: intent ↔ spec (the venue that never sells; AI callback: the spec is where intent lives).
17. Live systems: histories; Jepsen/Elle; violation = proof of bug, clean history = Tuesday behaved.
18. Landing: every method surrenders something (completeness, unboundedness, automation, the future); doing the trade knowingly is the discipline.

Register: senior technical author, friendly, no jokes, no arch asides. Title dropped "even". Category → ai.

Rev 3 reorder: each tradition now pairs with its own checking story (entities → Alloy world-search, events → sequence exploration, temporal → the full mechanics demo), replacing the lens catalogue + single mechanics section. Counterexample forms escalate: picture → story → schedule. Allocated seating reframed as a data-model fix for write skew that introduces holds/payments (rev 2.1).

## Open decisions

- Title. "What even is formal specification?" still fits the socratic register; revisit after the first draft.
- Whether Allium gets a mention. Default: no. Decide at draft time.
- Whether the Eras/Glastonbury scene opens beat 1 or stays a passing clause.
- Length expectation: the ladder wants 2,000–2,500 words. Let the argument decide; cut rungs rather than compressing all of them if it runs long.
