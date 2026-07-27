---
author: 'yav'
title: 'The ground truth, made executable'
description: 'In banking operations the ground truth is written policy. Here is how one becomes a specification, then deterministic code, then a tool an agent can call but not argue with.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-07-27'
heroImage: 'the-ground-truth-made-executable.jpg'
tags:
  - 'ai'
  - 'fintech'
  - 'agents'
  - 'banking'
  - 'risk'
---

<p class="lede">The <a href="https://www.juxt.pro/blog/a-loop-needs-a-ground-truth/">first post</a> in this series argued that an agent working on its own is a loop, and a loop is only as trustworthy as the signal it verifies against. Verify against a real ground truth and it converges on what you wanted. Verify against its own output and you get an echo, fluent and confident and attached to nothing. The <a href="https://www.juxt.pro/blog/ai-agents-in-banking-operations/">second article</a> argued that banks already hold that ground truth, in decades of written policy. It drew the flow for using it. An agent reads a case, checks it against the policy, and either proposes a closure for a person to confirm or escalates it for a person to decide. That was the design. This post is the implementation. What follows is the whole path from the written policy to a running system. The policy becomes deterministic code that decides whether a break may close. Alongside that code, an agent reads the messy context of a case and turns its decision into a proposed closure or an escalation. The interesting part is the join between the two.</p>

The worked example, as in the last article, is a settlement break. A trade is booked, a detail is amended, and downstream the trade and its confirmation no longer agree on the amount due. The reconciliation platform that compares the two raises the mismatch as a break, and it lands on an operations queue. The question the loop must answer is the one an analyst answers today. May this break be closed, or must a person look at it? We will build the machinery that answers it from the policy, and nowhere else.

<figure style="margin:2.5rem 0;">
<div style="max-width:420px;margin:0 auto;">
<svg viewBox="0 0 380 336" role="img" aria-label="The flow this article builds. A break lands on the queue. An agent reads the case from the record, note and history. The versioned configuration feeds a deterministic check that runs the policy and returns a verdict. Within band the agent proposes a closure and an analyst confirms it. Otherwise the agent escalates with no recommendation and a person decides. Every step lands in an append-only trail pinned to the policy version." style="width:100%;height:auto;">
<defs><marker id="arwF" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="currentColor" opacity="0.55"/></marker></defs>
<rect x="110" y="8" width="160" height="30" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="190" y="27" text-anchor="middle" font-size="11.5" fill="currentColor">A break lands on the queue</text>
<line x1="190" y1="38" x2="190" y2="50" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwF)"/>
<rect x="105" y="50" width="170" height="46" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="190" y="69" text-anchor="middle" font-size="11.5" fill="currentColor">The agent reads the case</text>
<text x="190" y="85" text-anchor="middle" font-size="9" font-style="italic" fill="currentColor" fill-opacity="0.7">record, note, history</text>
<line x1="190" y1="96" x2="190" y2="108" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwF)"/>
<rect x="4" y="108" width="86" height="46" rx="6" fill="rgba(244,144,29,0.07)" stroke="#f4901d" stroke-width="1.5"/>
<text x="47" y="127" text-anchor="middle" font-size="9.5" font-weight="600" fill="currentColor">the config</text>
<text x="47" y="141" text-anchor="middle" font-size="8.5" font-style="italic" fill="currentColor" fill-opacity="0.75">versioned numbers</text>
<line x1="90" y1="131" x2="103" y2="131" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwF)"/>
<rect x="105" y="108" width="170" height="46" rx="6" fill="rgba(244,144,29,0.07)" stroke="#f4901d" stroke-width="1.5"/>
<text x="190" y="135" text-anchor="middle" font-size="11.5" font-weight="600" fill="currentColor">The check runs the policy</text>
<line x1="190" y1="154" x2="190" y2="166" stroke="currentColor" stroke-opacity="0.55"/>
<text x="216" y="163" text-anchor="middle" font-size="9.5" font-style="italic" fill="currentColor" fill-opacity="0.7">a verdict</text>
<line x1="190" y1="166" x2="108" y2="178" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwF)"/>
<line x1="190" y1="166" x2="272" y2="178" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwF)"/>
<rect x="20" y="180" width="165" height="48" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="102" y="195" text-anchor="middle" font-size="9.5" font-style="italic" fill="currentColor" fill-opacity="0.7">within band</text>
<text x="102" y="211" text-anchor="middle" font-size="11" fill="currentColor">the agent proposes</text>
<text x="102" y="224" text-anchor="middle" font-size="11" fill="currentColor">a closure</text>
<rect x="195" y="180" width="165" height="48" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="277" y="195" text-anchor="middle" font-size="9.5" font-style="italic" fill="currentColor" fill-opacity="0.7">otherwise</text>
<text x="277" y="211" text-anchor="middle" font-size="11" fill="currentColor">the agent escalates,</text>
<text x="277" y="224" text-anchor="middle" font-size="11" fill="currentColor">no recommendation</text>
<line x1="102" y1="228" x2="102" y2="240" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwF)"/>
<line x1="277" y1="228" x2="277" y2="240" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwF)"/>
<rect x="20" y="240" width="165" height="46" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="102" y="259" text-anchor="middle" font-size="11" fill="currentColor">an analyst confirms</text>
<text x="102" y="274" text-anchor="middle" font-size="9" font-style="italic" fill="currentColor" fill-opacity="0.7">the break is closed</text>
<rect x="195" y="240" width="165" height="46" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="277" y="259" text-anchor="middle" font-size="11" fill="currentColor">a person decides</text>
<text x="277" y="274" text-anchor="middle" font-size="8.5" font-style="italic" fill="currentColor" fill-opacity="0.7">with what the agent gathered</text>
<line x1="102" y1="286" x2="168" y2="296" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwF)"/>
<line x1="277" y1="286" x2="212" y2="296" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwF)"/>
<rect x="55" y="298" width="270" height="34" rx="6" fill="rgba(244,144,29,0.07)" stroke="#f4901d" stroke-width="1.5"/>
<text x="190" y="313" text-anchor="middle" font-size="10" font-weight="600" fill="currentColor">every step lands in the trail</text>
<text x="190" y="325" text-anchor="middle" font-size="8.5" font-style="italic" fill="currentColor" fill-opacity="0.75">pinned to the policy version</text>
</svg>
</div>
<figcaption style="text-align:center;font-size:0.875rem;opacity:0.7;margin-top:0.75rem;">The flow this article builds. The check owns the verdict, a person owns the decision, and every step lands in the trail. The deterministic parts are in orange.</figcaption>
</figure>

Three parts of that flow are deterministic. They are ordinary code with no model in them. The check runs the policy, configuration holds the numbers it checks against, and an append-only trail records what happened. This is by design. The model reads the messy case and drafts the narrative, which is what models are good at. The policy is executed against the figures, returning a verdict the model cannot talk its way around.


## The policy, as prose

For the purposes of this demo, I will use a shortened Settlement Reconciliation Policy, the kind of document that lives in a bank's operations department. It is not lifted from any real bank, but its shape is the shape of the real thing, a numbered section approved by a committee and written for analysts to read. Its first clause, 4.3.1, defines the break itself, the mismatch we met earlier. The next two carry most of the weight of what follows, so I will quote them in full and paraphrase the rest.

> **4.3.2** A break may be closed where the difference between the two amounts does not exceed the closure tolerance. The closure tolerance is USD 250.
>
> **4.3.3** A case must be escalated to an authorised analyst where an amendment to the trade is in flight upstream, or the counterparty has not confirmed the current version of the trade, or the account carries an open dispute.

The rest of the section is operational. A break over the tolerance is escalated with the investigation's findings and no recommended disposition (4.3.4). A closure within tolerance may be proposed automatically, but it takes effect only when an authorised analyst confirms it, and the analyst does not delegate that decision back (4.3.5). And every closure and every escalation records the rule applied, the tolerance in force, the policy version it was evaluated under, and the confirming analyst, in a record that cannot be altered afterwards (4.3.6).

A **tolerance** is the largest difference the bank is willing to write off without a person looking. To **escalate** is to hand the case to a person, with the findings gathered so far and no recommendation attached. A break is **within band** when its difference sits inside the tolerance, and a **breach** when it does not.

Those six clauses are already a threshold, a closed list of conditions that force a human decision, and an explicit statement of who may decide and what must be recorded. None of that is vague. It is a specification written in English, by people who argued over every clause. The work ahead is not to invent what the bank means. It is to move what it already means into a form a loop can execute.

I chose a simple policy on purpose. Turning a policy into a specification surfaces both the questions it left open and the places it contradicts itself, and a real one can raise many of each. This one raises a couple of questions and no contradictions, which keeps the post on the translation and off untangling a messy policy first. Those questions I answer as I go.

## The specification

The temptation is to go straight from the prose to the code, to point a loop at the policy and have it write the check in one move. I would not trust that, and the first post says why. A loop is only as trustworthy as what it verifies against, and prose is not something it can verify against. So a specification comes first, and the loop verifies against that. The specification is written in [Allium](https://github.com/juxt/allium), JUXT's open-source language for describing what a system must do, which I contribute to and use across my own work. Unlike the prose, the specification is something a machine can check. A tool reads it and tells you whether it holds together.

And it is not written by hand. Deriving it from the policy is the loop from the first article. I point the command at the prose, `/allium derive a specification from policy/recon-policy.md`, and it drafts the specification, checking the draft with the tools I come to below. It keeps refining until the draft holds together, and it stops to ask whenever the policy leaves a question open. This one leaves two. Clause 4.3.2 gives the cap as "USD 250", but breaks arise in every currency the bank trades. What does that cap mean for a break in euros? Is it 250 euros, or 250 US dollars converted at some rate? And if converted, at whose rate, recorded where? The loop does not guess. It asks. Clause 4.3.3 forces an escalation on certain conditions but does not say what happens when a difference sits within the tolerance and one of those conditions also holds. Which one wins, the small difference or the trigger? A question of precedence, and the loop asks that one too.

The policy is not perfect, and policies written for people rarely are. Someone working a case fills its gaps with judgement on the spot, and on the spot they can be filled wrong. Even worse, two analysts can fill the same gap two different ways. Filling them right takes real understanding of the domain, sometimes spread across several people. So anything the prose leaves unclear goes back to the people who own the policy, to be answered before a line of code is written. This is requirements engineering, and none of it is optional. Everything downstream is built on the specification, so the requirements in it have to be right first. Guessing is not an option. The model can guess better than any of us, and the whole point of the design is that it should not have to. The loop put both questions to me, and I answered as the policy owner. Both answers became policy the starting prose did not have. A cap is set per currency, in the currency it applies to, and an unmatched currency is escalated rather than converted at a floating rate. A trigger outranks the tolerance, so a case escalates even inside the band. What the loop adds is not speed. It is that the ambiguities in the prose become questions on the record.

At the centre of the specification sits CheckBreak, the rule that turns a break into a verdict. Note the guidance block at the end of the rule. The answer to the precedence question is written there, before any code exists to depend on it.

```allium
rule CheckBreak {
    when: CheckRequested(agent, break_id)
    let record = BreakRecord{break_id: break_id}
    let tolerance = ClosureTolerance{currency: record.currency}
    let threshold = tolerance.absolute_cap
    let triggers_fired = EscalationTrigger where holds_for(record)

    ensures: Verdict.produced(
        status: verdict_status(record, tolerance, threshold, triggers_fired),
        rule_id: governing_rule(tolerance, triggers_fired),
        difference: record.difference,
        threshold_applied: threshold,
        currency: record.currency,
        policy_version: current_policy_version,
        checked_at: now
    )

    @guidance
        -- verdict_status resolves in this order:
        --   1. no cap configured for the currency -> escalate_required (s4.3.2a)
        --   2. any escalation trigger holds        -> escalate_required (s4.3.3)
        --   3. difference <= threshold             -> within_band       (s4.3.2)
        --   4. otherwise                           -> breach            (s4.3.4)
}
```

Every branch carries the clause it came from, so the specification and the policy can be read side by side. And the resolution order is stated outright. A fired trigger is checked before the tolerance, because the answer to the precedence question was that escalation applies regardless of the tolerance. That single ordered list is the answer, pinned down where the code will have to match it. The `s4.3.2a` in the first branch did not exist in the policy I quoted. It is the currency answer, written back into the policy as a new clause once the loop had forced the question.

Alongside the rules sit the invariants, the properties that must hold no matter what. The two here say what must never be true of the system.

```allium
invariant NoClosureWithoutAPermittingVerdict {
    -- No case reaches closed unless a check said within_band,
    -- whatever narrative accompanied it.
    for c in BreakCases:
        c.outcome = closed implies verdict_of(c).status = within_band
}

invariant NoClosureWithoutAPerson {
    -- s4.3.5. An agent proposes; a person closes.
    for c in BreakCases:
        c.outcome = closed implies c.confirmed_by != null
}
```

The first invariant is the whole design in one sentence. A break can only close if the check permitted it, regardless of anything the agent said. The second is clause 4.3.5, that a person confirms.

This specification arrives already checked. With every draft, the loop validated the structure and looked past it to the process, whether every rule's inputs are produced somewhere, whether an entity can reach the states it declares, and whether two rules can fire on the same event and disagree. It ran those checks until they came back clean. And you do not have to take my word for that. The checks are ordinary commands, and anyone can rerun them against the specification.

```
$ allium check policy/recon.allium
0 errors, 0 warnings

$ allium analyse policy/recon.allium
0 findings   ·   8 notes (unused fields)
```

Clean means the specification agrees with itself. Whether it says what the committee meant is not something a tool can decide, and this is what the open questions were for. The loop asked instead of guessing, the people who own the policy answered, and the answers went into the specification before the checks ran again. The consistency comes from the checks. The intent comes from the questions.

## The numbers are configuration

The specification put the actual number, the USD 250 closure tolerance, in a separate place from the code. I did not ask for that. The policy says the committee sets the cap and reviews it every year, so the number will change. A number that changes belongs in configuration. That separation is what keeps the policy in the business's hands rather than a vendor's. If changing the cap means a code release, the decision takes effect when the release ships, on a delivery timetable rather than the committee's. And if the code belongs to a vendor, every threshold change becomes a change request to that vendor, the lock-in the second article argued against. So the numbers live in configuration, versioned like code, changed without a release.

```yaml
policy_version: "2026.07.v1"
source: "Settlement Reconciliation Policy, section 4.3"
approved_by: "Operations Risk Committee"

closure_tolerances:
  - id: "TOLERANCE-USD"
    currency: "USD"
    absolute_cap: "250.00"
  - id: "TOLERANCE-EUR"
    currency: "EUR"
    absolute_cap: "230.00"

escalation_triggers:
  - id: "ESC-AMEND-IN-FLIGHT"
    condition: "amendment_in_flight"
    detail: "An amendment is in flight upstream. The break may re-match on the
             next cycle and must not be closed in the meantime."
```

Two things in that file matter beyond the numbers. The tolerance carries a currency, and there is one entry per currency. This is the currency answer made concrete. A cap applies in the currency it is stated in. A break in a currency with no entry is escalated, never measured against a cap it was not given. And the escalation trigger names a `condition` from a fixed vocabulary the code knows how to evaluate, rather than describing the condition in free text. Configuration chooses which triggers apply, and code decides what each one means. That split is what keeps the policy legible to the business without letting it smuggle arbitrary behaviour into the running system.

## The check

Now the code, and this step is one more run of the loop, `/allium implement the specification in policy/recon.allium`. It starts by deriving from the specification a list of obligations, the tests the code must pass before anyone can claim the behaviour is covered. Every verdict CheckBreak can return is an obligation. So is every transition a case may take, and every invariant that must hold. For this specification the list comes to sixty.

```
$ allium plan policy/recon.allium
60 obligations
  invariant            10
  entity fields         9
  rule creates entity   7
  rule succeeds         5
  transition edge       4
  ...
```

The loop then writes the checker and the tests that satisfy those obligations, and it keeps refining until every test passes. That is the first article's loop again, with the specification as its ground truth. The bank reviews the result, owns it and keeps it. The code itself is deliberately dull. A model wrote it, verified against the specification at every step, and no model runs in it. It takes a break and a policy, and returns a verdict, and the same inputs always produce the same answer.

The checker is implemented in Kotlin, and this is its heart.

```kotlin
when {
    tolerance == null       -> ESCALATE_REQUIRED
    fired.isNotEmpty()      -> ESCALATE_REQUIRED
    difference <= threshold -> WITHIN_BAND
    else                    -> BREACH
}
```

Read it against the guidance block in the specification. The four branches follow the resolution order, step for step. The tests hold the alignment, and moving a branch turns one red. The verdict it returns is a structured record, and every field in it is something an auditor might ask for.

```json
{
  "verdictId": "v_056b833b3b02539f",
  "status": "WITHIN_BAND",
  "ruleId": "TOLERANCE-USD",
  "difference": "120.00",
  "thresholdApplied": "250.00",
  "currency": "USD",
  "policyVersion": "2026.07.v1",
  "reasons": [
    { "ruleId": "TOLERANCE-USD",
      "detail": "Difference 120.00 USD is within the 250.00 USD closure tolerance." }
  ]
}
```

The rule that fired, the threshold it applied, the policy version it ran under. This is the object the agent will later reach through a tool, and it is the object that will land on file. Before any agent touches it, though, the check is tested, and the tests satisfy the obligations derived from the specification. The cases the policy describes become assertions, written down before anything intelligent goes near them.

```kotlin
@Test fun `an amendment in flight escalates even inside the tolerance`() {
    val verdict = check(breakWithAmendmentInFlight)   // difference 180, threshold 250
    assertEquals(ESCALATE_REQUIRED, verdict.status)
    assertEquals("ESC-AMEND-IN-FLIGHT", verdict.ruleId)
}
```

That test is the precedence question made executable. The difference is inside the tolerance, and the verdict is still escalate, because the trigger wins. The specification fixed that order the moment the loop's question was answered. This test is what holds the code to it, and it goes red if the code ever drifts.

The two `/allium` commands, derive a spec from the policy and implement the spec, could have been one. Pointing the loop straight at the policy, `/allium implement this policy`, would have combined the two loops, questions and all. I split them to better show what happens underneath.

## The agent's two halves

Everything so far is the deterministic spine. A model helped build it, held to the specification throughout, and no model runs in any of it. The policy, the specification, the configuration, the check and the trail are all ordinary artefacts that a bank owns and tests. That is deliberate, because the intelligence is the last thing to add and the least trusted, and it sits on top of a spine that already works.

Now the agent. It does the part of an analyst's job that comes before any decision. It takes a break and understands it. It then either proposes that it be closed or escalates it. This agent has two halves, and keeping them separate is the whole trick.

The **first half is reading**, and this is where retrieval belongs. Retrieval-augmented generation, usually shortened to RAG, is the ordinary technique of enriching a model's context with the material that bears on the case at hand. The answer then draws on that material rather than on whatever the model happened to absorb in training. Here everything arrives through tools. The agent is started with a single line, `work break B-1001`, and a short set of instructions, effectively its rules of engagement. They tell it how to work a case, run the check before proposing, name a source for every claim, and never decide for itself whether a break may close. At that moment it holds no data about the case at all. Its first move is the obvious one, ask what the break is. It calls `show_break` with the break id, and this is everything that comes back.

```
show_break(B-1001)  ->

{
  "breakId": "B-1001",
  "product": "INTEREST_RATE_SWAP",
  "currency": "USD",
  "difference": "120.00",
  "counterpartyId": "CP-4471",
  "counterpartyName": "Northgate Capital",
  "raisedAt": "2026-07-16T06:12:00Z",
  "note": "Day-count rounding on the fixed leg. Counterparty has settled
           cleanly for 14 months."
}
```

That is a deliberate view of the break, and what it leaves out matters more than what it carries. The view is not the tool author's taste. The specification declares it, field by field, in the same document that defines the check, and the tool implements what it declares. The two raw amounts behind the difference are absent. So are the inputs to the escalation triggers of clause 4.3.3, whether an amendment is in flight, whether the counterparty has confirmed the current version of the trade, and whether the account carries an open dispute. Those are inputs to the check, the agent's other half, and it is the check that will report whether one of them fired. The agent sees enough to understand the case and to cite its sources, and no more.

A second tool, `find_similar_cases`, takes the same break id. It looks up the break's counterparty itself, so the agent never supplies a name. What comes back is the resolved-case library for that counterparty, past breaks and how each one ended. A verdict is never among them. For B-1001 it returns two resolved cases, the earlier one folded here.

```
find_similar_cases(B-1001)  ->

[
  {
    "caseId": "H-1930",
    "counterpartyId": "CP-4471",
    "counterpartyName": "Northgate Capital",
    "product": "INTEREST_RATE_SWAP",
    "currency": "USD",
    "difference": "175.00",
    "resolvedAt": "2026-06-11",
    "outcome": "CLOSED",
    "summary": "Fixed-leg rounding. Within tolerance, closed on analyst confirmation."
  },
  { "caseId": "H-1904", "difference": "60.00", "outcome": "CLOSED", ... }
]
```

A case rhyming with an earlier one carries that precedent into its narrative. The library is nowhere in the specification. The specification governs what the check does, and the check never reads history. The library is the model's context and only the model's, which is precisely why it can never turn into a verdict.

And that is the whole reading list. Neither tool returns the policy.

The **second half is the check**, and this is where the model has no say. When the agent needs to know whether the break may be closed, it does not reason its way to an answer. It calls the check. That tool takes a break identifier and nothing else.

```json
{
  "name": "check_break",
  "description": "Run the bank's settlement-break policy against a break.
                  Returns a structured verdict (WITHIN_BAND, BREACH or
                  ESCALATE_REQUIRED) with the rule that fired, the threshold
                  applied and the policy version it ran under.",
  "input_schema": {
    "type": "object",
    "properties": { "break_id": { "type": "string" } },
    "required": ["break_id"],
    "additionalProperties": false
  }
}
```

The tool cannot accept an amount, a threshold or a verdict. The input is an identifier, so there is no field through which a model-produced number could reach the check. The figures come from the break record the platform raised, read there by the code. What the agent takes back is a fact.

This is the synthesis the last post was reaching for. The model reads the case, and the policy is executed against the numbers. The model never touches them. RAG and the check are not rivals. They are the two halves of the work, and the design is entirely about which half owns which decision.

The model now holds five tools, `show_break`, `find_similar_cases`, `check_break`, `propose_closure` and `escalate`. The agent has no path to the policy and no need for one. Its recommendation, a closure or an escalation, follows the check's ruling. And what matters about the break was settled once, when the specification was derived from the policy we started with, which is why `show_break` returns the fields it does. The policy is read by a person and a loop at build time, and after that its meaning lives in compiled form, as the specification, the configuration and the check, pinned to a version. The only thing loaded when a check runs is the configuration.

There is nothing exotic underneath. The model is handed the tool contract, which names each tool and declares the input it accepts. The demo prints it with `./recon tools`. It decides when to call a tool the same way it decides anything, from the context in front of it. It can only send what the input allows, and here that is always the break id. Whichever tool it calls runs as ordinary code and returns its data. The loop, the outer program that wraps the model and executes its calls, feeds that data back into the model's context, and the model carries on with more material than it had.

A wrong id does little harm. Whichever break a proposal points at, the gate re-runs the check on that break. It re-runs it because the proposal is the model's move, and nothing guarantees the model checked first, checked the right break, or read the verdict correctly. The gate assumes none of it and recomputes. So a confused agent writes a confused narrative and still cannot close anything the policy protects. The loop refuses stray ids anyway, and the refusal returns as a tool error. In production the break id parameter would go entirely, and the outer program would inject the assigned id into every call.

<figure style="margin:2.5rem 0;">
<div style="max-width:440px;margin:0 auto;">
<svg viewBox="0 0 380 300" role="img" aria-label="The outer program drives the exchange. It starts the model with the instruction to work break B-1001 and the tool contract. The model answers with tool calls carrying the break id. The loop refuses a stray id, executes valid calls against the tools, and feeds the returned data back into the model's context, until the model ends with a proposal or an escalation. The model and the tools never touch." style="width:100%;height:auto;">
<defs><marker id="arwI" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="currentColor" opacity="0.55"/></marker></defs>
<rect x="8" y="6" width="104" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="60" y="23" text-anchor="middle" font-size="10.5" font-weight="600" fill="currentColor">the model</text>
<rect x="138" y="6" width="104" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.5"/>
<text x="190" y="23" text-anchor="middle" font-size="10.5" font-weight="600" fill="currentColor">the loop</text>
<text x="190" y="44" text-anchor="middle" font-size="8.5" font-style="italic" fill="currentColor" fill-opacity="0.7">the outer program</text>
<rect x="268" y="6" width="104" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="320" y="23" text-anchor="middle" font-size="10.5" font-weight="600" fill="currentColor">the tools, code</text>
<line x1="60" y1="34" x2="60" y2="266" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="3 3"/>
<line x1="190" y1="50" x2="190" y2="266" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="3 3"/>
<line x1="320" y1="34" x2="320" y2="266" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="3 3"/>
<text x="125" y="61" text-anchor="middle" font-size="9" fill="currentColor">work break B-1001 · the contract</text>
<line x1="190" y1="66" x2="60" y2="66" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwI)"/>
<text x="125" y="95" text-anchor="middle" font-size="9" fill="currentColor">a tool call with the break id</text>
<line x1="60" y1="100" x2="190" y2="100" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwI)"/>
<rect x="132" y="112" width="116" height="18" rx="4" fill="rgba(244,144,29,0.07)" stroke="#f4901d" stroke-width="1.2"/>
<text x="190" y="124.5" text-anchor="middle" font-size="8" font-style="italic" fill="currentColor">a stray id is refused here</text>
<text x="255" y="151" text-anchor="middle" font-size="9" fill="currentColor">executes the call</text>
<line x1="190" y1="156" x2="320" y2="156" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwI)"/>
<text x="255" y="183" text-anchor="middle" font-size="9" fill="currentColor">the data</text>
<line x1="320" y1="188" x2="190" y2="188" stroke="currentColor" stroke-opacity="0.55" stroke-dasharray="4 3" marker-end="url(#arwI)"/>
<text x="125" y="215" text-anchor="middle" font-size="9" fill="currentColor">the data, into the context</text>
<line x1="190" y1="220" x2="60" y2="220" stroke="currentColor" stroke-opacity="0.55" stroke-dasharray="4 3" marker-end="url(#arwI)"/>
<text x="125" y="247" text-anchor="middle" font-size="9" fill="currentColor">in the end, propose or escalate</text>
<line x1="60" y1="252" x2="190" y2="252" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwI)"/>
<text x="190" y="286" text-anchor="middle" font-size="9" font-style="italic" fill="currentColor" fill-opacity="0.7">the model and the tools never touch</text>
</svg>
</div>
<figcaption style="text-align:center;font-size:0.875rem;opacity:0.7;margin-top:0.75rem;">The outer program is in charge. Every call and every result passes through it, the stray id stops in it, and the model and the tools never touch.</figcaption>
</figure>

For the first of our two worked cases, the clean break B-1001 we have been reading all along, the whole exchange, call by call, looks like this.

<figure style="margin:2.5rem 0;">
<div style="max-width:440px;margin:0 auto;">
<svg viewBox="0 0 380 300" role="img" aria-label="The exchange for break B-1001 as a sequence of tool calls. The model calls show_break and receives the view with the difference and the note. It calls find_similar_cases and receives two past closures. It calls check_break and receives the verdict WITHIN_BAND under rule TOLERANCE-USD and policy 2026.07.v1. It calls propose_closure with a rationale, the gate re-runs the check, and the proposal is queued for the analyst to confirm." style="width:100%;height:auto;">
<defs>
<marker id="arwH" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="currentColor" opacity="0.55"/></marker>
<marker id="arwHo" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6.5" markerHeight="6.5" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="#f4901d"/></marker>
</defs>
<rect x="35" y="6" width="110" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="90" y="23" text-anchor="middle" font-size="10.5" font-weight="600" fill="currentColor">the model</text>
<rect x="235" y="6" width="110" height="26" rx="6" fill="none" stroke="currentColor" stroke-opacity="0.4"/>
<text x="290" y="23" text-anchor="middle" font-size="10.5" font-weight="600" fill="currentColor">the tools, code</text>
<line x1="90" y1="32" x2="90" y2="278" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="3 3"/>
<line x1="290" y1="32" x2="290" y2="278" stroke="currentColor" stroke-opacity="0.25" stroke-dasharray="3 3"/>
<text x="190" y="47" text-anchor="middle" font-size="9.5" fill="currentColor">show_break(B-1001)</text>
<line x1="90" y1="52" x2="290" y2="52" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwH)"/>
<text x="190" y="69" text-anchor="middle" font-size="9" font-style="italic" fill="currentColor" fill-opacity="0.8">the view · difference 120.00 USD · the note</text>
<line x1="290" y1="74" x2="90" y2="74" stroke="currentColor" stroke-opacity="0.55" stroke-dasharray="4 3" marker-end="url(#arwH)"/>
<text x="190" y="101" text-anchor="middle" font-size="9.5" fill="currentColor">find_similar_cases(B-1001)</text>
<line x1="90" y1="106" x2="290" y2="106" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwH)"/>
<text x="190" y="123" text-anchor="middle" font-size="9" font-style="italic" fill="currentColor" fill-opacity="0.8">two past closures with Northgate, both clean</text>
<line x1="290" y1="128" x2="90" y2="128" stroke="currentColor" stroke-opacity="0.55" stroke-dasharray="4 3" marker-end="url(#arwH)"/>
<text x="190" y="155" text-anchor="middle" font-size="9.5" fill="currentColor">check_break(B-1001)</text>
<line x1="90" y1="160" x2="290" y2="160" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwH)"/>
<text x="190" y="177" text-anchor="middle" font-size="9" font-weight="600" fill="currentColor">WITHIN_BAND · TOLERANCE-USD · 2026.07.v1</text>
<line x1="290" y1="182" x2="90" y2="182" stroke="#f4901d" stroke-width="1.5" stroke-dasharray="4 3" marker-end="url(#arwHo)"/>
<text x="190" y="209" text-anchor="middle" font-size="9.5" fill="currentColor">propose_closure(B-1001, rationale)</text>
<line x1="90" y1="214" x2="290" y2="214" stroke="currentColor" stroke-opacity="0.55" marker-end="url(#arwH)"/>
<rect x="216" y="222" width="148" height="22" rx="5" fill="rgba(244,144,29,0.07)" stroke="#f4901d" stroke-width="1.2"/>
<text x="290" y="237" text-anchor="middle" font-size="8.5" font-style="italic" fill="currentColor">the gate re-runs the check</text>
<text x="190" y="261" text-anchor="middle" font-size="9" font-style="italic" fill="currentColor" fill-opacity="0.8">proposal queued for the analyst to confirm</text>
<line x1="290" y1="266" x2="90" y2="266" stroke="currentColor" stroke-opacity="0.55" stroke-dasharray="4 3" marker-end="url(#arwH)"/>
</svg>
</div>
<figcaption style="text-align:center;font-size:0.875rem;opacity:0.7;margin-top:0.75rem;">One clean break, call by call. Every call carries the break id and nothing else, and every answer is data the model folds into its context. The verdict, in orange, is the only opinion in the exchange, and it is not the model's.</figcaption>
</figure>

## When the decision belongs to a person

The second case is the one the whole design exists for. Break B-1002 is another small difference on a dollar swap, 180 dollars against the same 250-dollar tolerance, and it comes with the same run of clean closures behind it. On the numbers and the history it rhymes with B-1001.

The transcript below is a real run of the finished system on B-1002.

```
./recon show-break B-1002
  difference 180.00 USD · Ardsley Partners
  note: sales amended a mistyped rate shortly after booking; the
  amendment is still flowing through the chain

./recon check B-1002
  ESCALATE_REQUIRED · rule ESC-AMEND-IN-FLIGHT
  policy 2026.07.v1 · verdict v_e153e052b7563c91

./recon history B-1002
  H-2258 205.00 CLOSED · H-2231 140.00 CLOSED · H-2207 88.00 CLOSED

./recon escalate B-1002 --findings "Check verdict v_e153e052b7563c91
  (policy 2026.07.v1, Settlement Reconciliation Policy s.4.3) returned
  ESCALATE_REQUIRED under rule ESC-AMEND-IN-FLIGHT: an amendment is in
  flight upstream and the break must not be closed while it may re-match
  on the next cycle. Break record: 180.00 USD difference on an interest
  rate swap with Ardsley Partners (CP-2210), raised 2026-07-16; the note
  states sales amended a mistyped rate shortly after booking and the
  amendment is still flowing through the chain. The verdict also notes
  the difference is within the 250.00 USD tolerance (TOLERANCE-USD), but
  the escalation trigger takes precedence. Counterparty history: three
  prior USD IRS breaks with CP-2210 (H-2258 205.00, H-2231 140.00,
  H-2207 88.00) all closed within tolerance on analyst confirmation;
  none of those cases involved an in-flight amendment per their
  summaries."

  Escalated B-1002 to a person (audit seq 2). No recommendation attached.
```

The check told the agent to escalate before it had even read the history. It read the history anyway, folded it into its findings, and handed the case to a person with everything it had gathered and no recommended disposition, exactly as clause 4.3.4 requires. Then it read the trail back to confirm both records had landed. Every claim in its findings names a source, whether the verdict id, the policy version, the figures and note from the break record, the resolved cases from the history, or the rule that fired.

The history moved nothing. The agent cited the three clean closures and noted itself that none of them involved an amendment in flight, an escalation with context rather than a bare verdict. The context informs, and the check decides.

This is the break the precedence question was about. Answered the other way, tolerance before triggers, B-1002 comes back `WITHIN_BAND` and the amendment is ignored. The break closes while its trade is still changing, the failure the last article proposed this very flow to prevent. And no check would have caught it, because a specification with the wrong answer in it is still a consistent specification. What stood in the way was the question itself, put to the people who own the policy before any code existed.

## Running it yourself

Everything above is in a repository you can clone and run, and there are two ways to drive it, matching the two ways most people will actually reach for an agent.

The first is a **subscription**, the path you can try with nothing more than a coding agent. On a subscription there is no direct line to the model. You reach it through the coding agent, and the coding agent brings its own outer program, so the loop that runs each `./recon` call and feeds the output back is the one it ships with. Open the repository in it, and a short instructions file hands it the tools and the rules of engagement. It reads the break, runs the check, investigates, then proposes or escalates. Whether a break may close is never its call. The transcript in the previous section is a real run of exactly this. The agent gets no privileged knowledge of which breaks may be closed, because that is the check's job.

The second is the **API**. With an API key you have the direct line, and the outer program is yours to write. The loop is a few dozen lines. It hands the model the five tools, runs each call against the very same command-line checker, and feeds the results back until the model is done. The one line that matters is what happens when the model proposes closing a break the policy protects.

```python
if name == "propose_closure":
    result = recon("propose-closure", break_id, "--rationale", rationale)
    refused = result.returncode != 0
    return result.output, refused
```

When the check refuses a proposal, the refusal comes back to the model as a tool error, in its own context, exactly as it would for a human who tried to close a breach and was stopped. The model can read the refusal, understand why, and escalate instead. What it cannot do is make the refusal not happen. The gate is in the code, not in the prompt, and no wording reaches around it.

## Change the policy, watch the loop follow

One more property shows the policy really is in charge. Operations Risk tightens the tolerance from 250 dollars to 100. A number changes in the configuration, a new version is stamped, and nothing in the agent or the check is touched. Re-run the check on B-1001 and the verdict flips from `WITHIN_BAND` to `BREACH`. A break that was closeable yesterday is not closeable today, because the agent never held the policy in the first place.

The cases already closed do not move. Each verdict pinned the version it ran under, so a break closed under the old tolerance stays closed against the old tolerance, by a named analyst, whatever the policy says now. This is clause 4.3.6 doing its work. An auditor asking why a break was closed gets the policy it was closed under.

Not every policy change is a number. A new trigger or a new rule reaches beyond the configuration, into the specification and the check. The path for that change is the one this post already walked. The policy is amended, the loop re-derives the specification, asks whatever new questions the amendment leaves open, and reimplements against it. And because the bank ran that loop itself the first time, it owns every artefact in the chain and needs no vendor to run it again.


## What the policy became

Step back from the machinery and the shape of it is simple. The policy already existed as prose, approved by a committee. The `/allium` loop turned it into a specification, checked that it held together, and stopped to ask wherever the prose left a question open. From that came a deterministic check that a bank owns and tests, and a trail that pins every decision to the version of the policy it was made under. On top of that spine sits an agent that reads the messy context and drafts the narrative, and is handed a verdict it cannot argue with. The ground truth was written down years ago. The work was giving it a form a loop could execute, and refusing, at every step, to let the model be the thing that decides.

The repository is at [github.com/juxt/recon-agent-demo](https://github.com/juxt/recon-agent-demo). Clone it, run the demo, work a break with your own coding agent, tighten a tolerance and watch a closed case stay pinned. It is a demonstration, not a product. The break store is a file standing in for a reconciliation platform, and the analyst queue is a command line. What is not simplified is the part the series has been about, the policy, the check, the gate and the trail.

Which leaves the honest open questions, and there are several, each worth its own treatment. How a policy's own changes are governed, so that a tightened tolerance carries an approval and an effective date and not merely a new number. How the resolved cases an agent escalates become a library the loop learns from, without that library quietly becoming a second, unaudited policy. Whether propose and escalate are the only actions an agent should hold. The demo sends every amendment still in flight to a person, where an operations queue might rather park the break until the next cycle re-checks it, and a defer action is policy too, with its own clause to write and its own trail to leave. And how any of this holds up when a feed goes stale and the loop must say "I could not verify" as loudly as it says "breach". The ground truth exists. Making a loop worthy of it is the work that remains.
