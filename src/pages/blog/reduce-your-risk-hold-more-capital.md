---
author: 'yav'
title: 'Reduce your risk, hold more capital'
description: "A hedge cuts a desk's real risk by 10% and raises its FRTB capital requirement by 14%. The industry reported it in 2015. A checkable property finds it in seconds."
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-08-07'
heroImage: 'reduce-your-risk-hold-more-capital.jpg'
tags:
  - 'ai'
  - 'risk'
  - 'testing'
  - 'engineering'
---

<p class="lede">A trading desk holds a position that loses money when interest rates rise. It hedges, adding a second position in the other direction that makes money if that happens. Measured with the regulator's own correlation numbers, the desk's overall risk drops by about 10%.</p>

<p class="lede">But its capital requirement rises 14%.</p>

The risk here is how many dollars the book's value can swing, calculated with the regulator's own assumptions about rate moves. The capital requirement is the dollars the bank must set aside against it.

That is not an implementation bug, and it is not a creative reading of an ambiguous rule. It falls straight out of FRTB, the Fundamental Review of the Trading Book. FRTB is the Basel Committee on Banking Supervision's new market-risk capital framework, now becoming law across the EU, the UK and, by proposal, the US. The 14% is what the framework's own formula produces, computed step by step with the numbers the rulebook itself supplies.

<figure style="margin:2.5rem 0;">
<img src="/images/reduce-your-risk-hold-more-capital-chart.png" alt="Paired bar chart. Actual risk falls from 100 before the hedge to 90 after it, minus 10 percent. The capital requirement rises from 100 to 114, plus 14 percent." style="display:block;margin:0 auto;width:100%;max-width:540px;height:auto;" />
<figcaption style="text-align:center;font-size:0.875rem;opacity:0.7;margin-top:0.75rem;">The same desk, before and after its hedge. Both in money terms, scaled so the unhedged book equals 100.</figcaption>
</figure>

For a single unhedged position the formula and the risk measure agree, so both numbers start at \$100. After the hedge the risk falls to \$90 but the capital requirement rises to \$114.

## Capital should track risk

The FRTB standardised approach is a hundred-odd pages of prose and formulas. I ran one slice of it, general interest rate risk, through allium, which extracted it as a formal specification. Most of it translated directly, tables of numbers and the formulas that combine them into a capital charge. The text, however, does not state the property all those numbers are meant to deliver. FRTB's stated objective is risk sensitivity. In plain terms, the capital a bank must hold should rise when its risk rises and fall when its risk falls. Here is that property, written down in checkable form:

```
invariant RiskSensitivity {
    for p in Portfolios:
        for q in Portfolios:
            sbm_risk_dominates(p, q) implies q.delta_charge <= p.delta_charge
}
```

If a portfolio carries no more risk than another, its capital requirement must be no larger. Hedging must never increase it.

From the specification, allium derived 28 obligations. Each obligation becomes a test that runs against the standard's own published parameters. The risk sensitivity test fails in seconds. Its output, abridged and annotated:

```
[FALSIFIED]  invariant.RiskSensitivity

    p = long 2y                        (the desk before the hedge)
    q = long 2y + short 20y at 1.36x   (the desk after the hedge)

    portfolio_risk(q) =  89.7  <  portfolio_risk(p) = 100.0    10% less risk
    delta_charge(q)   = 113.7  >  delta_charge(p)   = 100.0    14% more capital
```

This is the desk from the opening, before and after its hedge. The safer portfolio is the more expensive one to hold. The risk side uses the regulator's correlations with one mathematical correction, documented in the repo, because the printed values cannot be used exactly as they stand.

## Known for a decade

A hole this size, I assumed, must already be known, so I went digging.

It is. ISDA, the International Swaps and Derivatives Association, [reported it in February 2015](https://www.isda.org/a/eTiDE/1b.pdf), ten weeks after the draft was published. Their letter called it a "methodological flaw" producing "unrealistically large capital charges for well-hedged basis positions", and warned of "a perverse incentive created to leave risk unhedged". The Basel Committee itself [acknowledged the problem in writing in 2018](https://www.bis.org/bcbs/publ/d436.pdf), saying parts of the aggregation are "not commensurate with the actual risk". In 2019 it softened the offending formula and finalised the framework.

The counterexample in this post runs on the softened formula. Under the 2016 text the surcharge on a hedge like this could exceed 30%. The 2019 change more than halved it. It did not remove it, and the industry still says so. In [October 2025](https://www.isda.org/a/XlBgE/The-Impact-of-the-FRTB-on-Correlation-Trading.pdf), six years after the fix, ISDA wrote that parts of the standardised approach act "as a disincentive for risk-reducing hedging activities".

## Why it is still there

This was a hard defect to catch at the drafting table with the tools of the time. The industry still caught its symptoms within ten weeks, and the committee responded twice, on the record. Every response tuned numbers. Risk sensitivity was always the stated goal, but a goal stated in prose is not a requirement a revision can be tested against. The revisions were validated with impact studies, which measure how much capital banks would hold overall. Nothing in the published record tested whether reducing risk could still increase a charge.

The cost of the fix has grown far beyond the extra capital banks might have needed to set aside when this behaviour hit their books. The formula is baked into an international standard, into law across the EU and the UK, into a live US proposal, and into the risk systems of every large bank. A fix means re-opening, re-approving and re-implementing all of it, in coordination.

There is a quieter question too, and I keep coming back to it: how many desks have adapted so well that they now skip the hedge, if that hedge would cost capital?

## The cheap check

Formalising a hundred pages of regulation used to be a research project. With today's tooling it is trivial, and the checks themselves run in seconds. It does not need to change how standards are drafted or how systems are built. It is an extra check, and a worthy one. Extract a specification from what the documents promise, derive the obligations, and run them. The tools to catch the next defect of this kind exist now.

The specification, the derived obligations, the failing tests and every number and quote in this post are in the [frtb-hedging-penalty](https://github.com/yavorpanayotov/frtb-hedging-penalty) repo. The scope is deliberately small, one risk class of one approach. The ground truth was there all along, in the standard's own pages. It just needed to be made checkable.
