---
author: 'hga'
title: 'Patching is not hardening'
description: 'Point a model at your code and ask it to fix the bugs. That is necessary, and nowhere near enough.'
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-08-03'
heroImage: 'a-bug-on-the-dark-side-of-the-moon.jpg'
tags:
  - 'ai'
  - 'security'
  - 'engineering'
---

<p class="lede">A vulnerability used to have a shelf life. In 2021, the median gap between a security flaw being disclosed and first being exploited was close to a year, long enough to schedule a fix into an ordinary release. Today that gap is <a href="https://zerodayclock.com" target="_blank">just over a day</a>.</p>

AI collapsed that gap, and the same capability serves defenders. In April 2026, Anthropic gave around fifty operators of critical infrastructure access to a gated model under [Project Glasswing](https://www.anthropic.com/news/expanding-project-glasswing). Within two months, roughly two hundred organisations had reported [more than ten thousand](https://blog.cloudflare.com/cyber-frontier-models/) high- and critical-severity flaws, some of which had sat unnoticed in major operating systems and browsers for decades.

Anthropic has kept the model gated because the safeguards to stop its offensive use [do not yet exist](https://www.anthropic.com/news/claude-fable-5-mythos-5).

## The patch reflex

Security tooling has relied on databases of known problems. Dependency tools like [Snyk](https://snyk.io) match your inventory against feeds of known-vulnerable packages; code analysers like [SonarQube](https://www.sonarsource.com/products/sonarqube/) match your source against catalogued weakness patterns. More than [48,000 CVEs](https://www.infosecurity-magazine.com/news/first-forecasts-record-50000-cve/) were published last year.

The only way to keep pace with AI-speed discovery is to patch with AI. Even then, two problems remain.

The first is timing. By the time a CVE is published, attackers have it too, and with exploitation following disclosure within a day, a database of known flaws gives you no head start.

<span class="pullquote" text-content="The exploit lives in their composition, in the gap between what the code does and what its authors intended."></span>

The second is coverage. CVE databases describe known issues in dependencies, but attackers also work in your own code, chaining flaws that look innocuous alone: a parser slightly too permissive, a cache that trusts its inputs, an error path that leaves a session half open. None matches a known-bad pattern. The exploit lives in their composition, in the gap between what the code does and what its authors intended.

Finding it means reasoning about intent, and intent is not in any database.

## Renting the search

The obvious next move is to point the same frontier models at your own code before an adversary does. It works: last year a researcher used one to [find a remote zero-day](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/) in the Linux kernel's SMB implementation. The trouble is what you are left holding afterwards.

<span class="pullquote left" text-content="Red teaming ends when the budget ends, not when the code is safe."></span>

Red teaming is an open-ended search: it ends when the budget ends, not when the code is safe. Across millions of lines a thorough sweep runs into millions of dollars, and a clean run proves only that one model on one budget found nothing this time. The result also decays: every commit moves the code away from what was checked, so the spend repeats at every release.

## Reading the code back

At the root of almost any exploit sits one of two things: brittle logic that works only for the inputs its author imagined, or a missing guard whose assumption was never written down. **Morse** is our answer, and it inverts the search. Rather than paying a model to find exploits one at a time, it works out what the code is trying to achieve, marks every place the implementation admits behaviour the author never intended, and hardens the code until only intended behaviour remains.

Code hardened this way withstands exploits nobody has invented yet, because the ambiguity they would be built from is gone.

We've called it Morse for two reasons.

* Morse code turns a message into dots and dashes that anyone who knows the code can read straight back. A codebase is layers of recorded human intent waiting to be read the same way.
* Morse is the Oxford detective who worked patiently from evidence and preferred corroboration to confidence.

Inspector Morse never worked alone; he had his faithful assistant Lewis. Our Morse has the same: the command line tool that does the legwork, scanning, ingesting and raising tickets from your terminal or your CI, is called `lewis`.


## The method: findings, not alerts

Morse begins by reading the codebase and distilling a behavioural specification: a statement of what the code is evidently meant to do, in the language of your domain. Recovering specifications from programs is an [old research problem](https://dl.acm.org/doi/10.1145/503272.503275), but where earlier techniques could only surface machine-level invariants, current models produce [formally verifiable specifications](https://dl.acm.org/doi/10.1109/ICSE55347.2025.00129) for most benchmark programs and catch bugs that [older inference methods miss](https://arxiv.org/abs/2310.01831). The distillation is itself diagnostic: where a tangle of rules governs a small area of code, there is usually something worth a closer look.

Morse runs alongside the tools you already have. CI keeps building, Snyk and SonarQube keep scanning, and `lewis` ingests their reports next to Morse's own analysis. Every observation, from a CVE match to a behavioural divergence, is recorded in a journal committed to your repository in a documented open format. There is no external database and no account to provision; state is shared the way code is shared, by push and pull.

Observations are grouped into a short list of findings. Duplicate reports of one flaw collapse into one finding; a dependency upgrade that clears twelve CVEs appears as one action. Ranking combines [CISA's known-exploited catalogue](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) and [EPSS](https://www.first.org/epss/) probabilities with Morse's own severity assessment, so the list is ordered by risk. Your team sees the shape of the problem, not thousands of alerts.

## Tests before fixes

Morse applies no fix to code that lacks trustworthy tests, and coverage alone is not trust. The specification says how the code should behave, so Morse can judge whether the existing tests check the right things. Where they are missing or weak, it proposes new ones drawn from the specification. Each proposed test fails on first run: a bug made concrete, in a form your engineers can run and inspect.

Sometimes the analysis finds the reverse: a test that has asserted the buggy behaviour for years, protecting the defect as behaviour every future change must preserve. Morse flags these findings as entrenched and rewrites the test to fail in the right way, with the same rigour as a change to the code itself.

## Fixing under guard

With the intended behaviour pinned down in failing tests, Morse writes an implementation that satisfies them in the most secure way available, then checks the change against the specification to confirm nothing your systems depend on has moved. An accepted finding merges with its regression guard already written. A rejected one corrects the specification, so review sharpens the analysis instead of filtering it.

A fix is reported as likely fixed on the first clean scan, and as confirmed once the other tools have independently re-scanned and agree. The distinction is visible at a glance; nobody chases scanners or keeps a spreadsheet in step. Nothing merges without your team's sign-off.

## What you keep

A red-team sweep buys a search whose output decays. Morse spends a comparable budget on two durable artefacts: the behavioural specification and the test suite that encodes it. The cost is front-loaded and bounded by the size of the codebase; after that, keeping pace with change is marginal, because each new commit is assessed against a specification that already exists.

![Line chart of cumulative cost over five releases. AI red teaming climbs linearly to 600 thousand dollars. Morse rises steeply to 160 thousand while the spec and tests are built, then flattens near 215 thousand. The lines cross before release 2, and the widening gap after the break-even point is labelled compounding savings.](../../assets/blog/morse-economics.svg)

The artefacts do double duty. They record what your systems are meant to do, written down at last rather than held in the heads of a few long-tenured engineers, and they are guard rails for new code, for your developers and their AI assistants alike. Test quality rises, the backlog of latent bugs shrinks, and fixes start from a failing test rather than from archaeology. Fewer vulnerabilities ever get a shelf life.

That is the difference between patching and hardening. Patching keeps you level with the flaws you already know about; hardening changes the ground they grow in. An engagement with Morse ends with your team owning a codebase in better shape than we found it, and equipped to keep it that way.

---

Morse is built by JUXT, where we have spent years hardening critical systems for banks and fintechs. If you would like to watch it read one of your own codebases back to you, we would be glad to arrange it.
