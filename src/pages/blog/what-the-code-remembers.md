---
author: 'hga'
title: 'Load-bearing bugs'
description: 'The last person who understood the reconciliation engine left three years ago.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-03-06'
heroImage: 'three-paradoxes.jpg'
tags:
  - 'ai'
  - 'legacy'
  - 'allium'
  - 'specification'
---

<p class="lede">The file is called <code>reconciliation_engine.py</code>. It is 10,000 lines long. The last person who understood it left three years ago, and the infrastructure team's wiki labels the server it runs on with a terse "do not touch", linking to a <a href="https://en.wikipedia.org/wiki/Postmortem_documentation" target="_blank">post-mortem</a> from 2019 when someone rebooted the machine and the overnight batch failed. The operations desk spent their weekend fixing it by hand. The wiki page got its label. Nobody rebooted the machine again.</p>

Everyone knows this file is a problem. Nobody knows what to do about it. The code is in source control, but reading it raises more questions than it answers. Variable names suggest one intent, comments suggest another, and the control flow quietly contradicts both. Somewhere in those 10,000 lines are business rules that keep the firm's books balanced. Somewhere else are workarounds for vendor bugs that were fixed years ago. Nobody can tell which is which.

This particular file doesn't exist. We assembled it from a dozen conversations with teams who have their own version: different language, different function name, same wiki label. You've already pictured yours.

## The fence across the road

<span class="pullquote" text-content="Every line of code is someone's fence."></span>Legacy code modernisation is excavation work, but every dig faces a prior question, and it has nothing to do with technique. [G.K. Chesterton](https://en.wikipedia.org/wiki/G._K._Chesterton) once [described](https://www.chesterton.org/taking-a-fence-down/) a fence standing across a road. A reformer sees it, sees no obvious purpose, and proposes to tear it down. Chesterton's response: if you cannot explain why the fence was built, you are not the person to remove it. Every line of code is someone's fence.

Legacy code contains three kinds of behaviour, and they look identical from the outside. Intentional behaviour: the system does what it was designed to do. Accidental behaviour: bugs, race conditions, edge cases nobody anticipated. And the treacherous third kind: accidentally intentional behaviour, where a bug has been running in production long enough that other systems, processes and people now [depend on it](https://www.hyrumslaw.com/). All three live in the reconciliation engine's 10,000 lines. Good luck telling them apart.

[Raymond Chen](https://en.wikipedia.org/wiki/Raymond_Chen_(Microsoft)) has [documented](https://devblogs.microsoft.com/oldnewthing/20031224-00/?p=41363) this at scale. When Microsoft built [Windows 95](https://en.wikipedia.org/wiki/Windows_95), they discovered that popular applications [relied on undocumented behaviour](https://www.joelonsoftware.com/2004/06/13/how-microsoft-lost-the-api-war/) in earlier versions, including outright bugs. Rather than break those applications, the Windows team shipped [compatibility shims](https://en.wikipedia.org/wiki/Shim_(computing)): code that detected specific programs and reproduced the old, broken behaviour. The bugs had become load-bearing. Remove them, and the ecosystem collapses.

Every legacy system in a financial institution has its own version of these shims, even if nobody wrote them deliberately. The overnight reconciliation that depends on records arriving in a specific order because a sorting bug happens to produce the right sequence. The margin calculation that gives the correct answer only because two rounding errors cancel each other out.

<span class="pullquote left" text-content="Characterisation tests tell you what the code does for specific inputs. They don't tell you why."></span>The established answer is [Michael Feathers'](https://michaelfeathers.silvrback.com/) method from [Working Effectively with Legacy Code](https://www.oreilly.com/library/view/working-effectively-with/0131177052/): write [characterisation tests](https://en.wikipedia.org/wiki/Characterization_test) that pin the system's current behaviour, then refactor with confidence that any change in output will be caught. This is sound practice, and any serious modernisation effort will use it. But characterisation tests tell you what the code does for specific inputs. They don't tell you why. You can pin a thousand behaviours and still not know which are intentional, which are accidental, and which are the load-bearing kind that will bring the operations desk to a halt if you touch them.

## The site survey

Before any excavation, archaeologists survey the site. They map what's visible, hypothesise about what's beneath, and build a model of the terrain before moving a single stone. The [equivalent in software](https://en.wikipedia.org/wiki/Software_archaeology) has been prohibitively expensive: understanding a legacy codebase well enough to change it safely demands sustained attention from engineers who are also needed elsewhere. The cost of comprehension has exceeded the cost of endurance, so the system stays, accumulating another year of patches. Assumptions from the original design [persist long after the people who made them have gone](/blog/what-outlasts-the-code).

AI offers a way to change this equation. A large language model can read those 10,000 lines of Python and recover patterns with a patience humans cannot match. It can cross-reference code paths and flag contradictions between what comments claim and what the code does, tracing state transitions that span hundreds of lines. We [built a distributed system](/blog/from-specification-to-stress-test) this way last year, working from specifications rather than ad-hoc prompts, and the difference in coherence was striking. The question we're now asking is whether the same discipline works in reverse: starting from code and recovering the specification.

<span class="pullquote" text-content="Comprehension without structure is just summarisation."></span>Comprehension without structure is just summarisation. Ask an LLM "what does this code do?" and you get a natural-language description, useful for orientation, impossible to build against. You cannot diff two prose summaries to find where behaviour changed; you cannot ask "if I remove this branch, what breaks?" against a paragraph of English. The model needs somewhere to put what it finds, in a form precise enough to reason about and stable enough to trust.

## A form for the findings

The software industry has tried to solve this before. [Gherkin](https://cucumber.io/docs/gherkin/) and the [BDD](https://en.wikipedia.org/wiki/Behavior-driven_development) family capture what systems do as executable scenarios, but executability couples the specification to the implementation: over time, the testing concern wins and scenarios [drift toward the how](https://dannorth.net/blog/introducing-bdd/). [Decision tables](https://en.wikipedia.org/wiki/Decision_Model_and_Notation) capture conditional logic cleanly but miss the temporal dimension, the state transitions and event sequences that shape financial systems. [Event Storming](https://www.eventstorming.com/) starts from the right place, working backward from observable events, but operates at the level of discovery rather than detail. These are useful techniques. But they share a limitation: they either assume you already know the rules, or they bind the specification to the code in ways that prevent it from serving as an independent reference.

To see why this matters, consider a simple business rule: a trade should create a settlement obligation only if the counterparty's credit limit hasn't been exceeded. In Gherkin, this might look like:

```gherkin
Scenario: Trade creates settlement when credit limit not exceeded
  Given a counterparty "ACME" with a credit limit of 1,000,000
  And "ACME" has existing exposure of 500,000
  And I am on the trade submission page
  When I enter trade details for counterparty "ACME" with notional 200,000
  And I click "Submit Trade"
  Then a settlement obligation should be created with status "pending"
```

Notice how "I am on the trade submission page" and "I click Submit Trade" have crept in. The scenario started as a behavioural rule but the step definitions need something concrete to drive, so the specification has absorbed details about the UI. Change the interface from a web form to an API, and the specification breaks even though the business rule hasn't changed.

The same rule in [Allium](https://juxt.github.io/allium):

```
rule CreateSettlementObligation {
    when: TradeSubmitted(trade)

    requires: trade.counterparty.credit_usage
              + trade.notional <= trade.counterparty.credit_limit

    ensures:
        SettlementObligation.created(
            trade: trade,
            amount: trade.notional,
            status: pending
        )
}
```

No page, no button, no UI. The rule captures the what and nothing else. Allium handles the question of who can trigger the rule and through what interface separately, through a construct called [surfaces](https://github.com/juxt/allium/blob/main/references/language-reference.md), keeping the business logic clean of interaction detail. It has no execution runtime, and its specifications are verified through reasoning rather than running, which means an LLM can stress-test them for contradictions, gaps and edge cases without touching the legacy system. You give up automated regression in exchange for independence from the implementation. **A specification and a test serve different masters. Allium chose its side.**

The workflow we're preparing to test starts with distillation: pointing the model at the codebase and distilling rules into Allium's structured format. These rules are hypotheses that need domain expert review, not audit artefacts. When someone says "that's not right, the credit check only applies to external counterparties", the rule is updated and the model traces the implications across the rest of the specification. When someone identifies a load-bearing bug, the specification records it explicitly: this behaviour is intentional, preserve it, and here is why. The three kinds of behaviour from the dig site, intentional, accidental and accidentally intentional, can finally be distinguished, labelled and tracked.

We haven't completed this work yet. We've seen specification-first development work for greenfield systems, and we expect the same discipline to apply when working in reverse. Whether it survives contact with 10,000 lines of undocumented Python is what we're about to find out.

## Before you break ground

The reconciliation engine will still be 10,000 lines long. The person who understood it won't come back. But before anyone rewrites a line of it, the team needs to know what it's preserving and what it's fixing.

The hardest part of legacy modernisation was never the coding. It was the knowing.
