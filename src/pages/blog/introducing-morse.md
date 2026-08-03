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

<p class="lede">A vulnerability used to have a shelf life. In 2021 the median gap between a flaw being disclosed and first being exploited was close to a year, long enough to schedule a fix into an ordinary release. Today that gap is <a href="https://zerodayclock.com" target="_blank">just over a day</a>. The tools for finding new flaws have improved by a generation, and the same models that let a defender go looking let an attacker go looking first.</p>

In April 2026, Anthropic gave around fifty operators of critical infrastructure access to a gated model under the banner of [Project Glasswing](https://www.anthropic.com/news/expanding-project-glasswing). Within two months the programme had grown to roughly two hundred organisations, which between them reported [more than ten thousand](https://blog.cloudflare.com/cyber-frontier-models/) high- and critical-severity flaws, some of which had sat unnoticed in major operating systems and browsers for decades. Anthropic has kept the model gated because the safeguards to stop its offensive use [do not yet exist](https://www.anthropic.com/news/claude-fable-5-mythos-5). The capability is real, it is here, and it points both ways.

## The patch reflex

The industry's first answer has been to point a model at the codebase and ask it to fix what it finds. This is worth doing, and it is nowhere near enough. A patch is only safe if it leaves intact the behaviour your systems depend on, and a model asked narrowly to close a hole has no particular reason to know what that behaviour is.

The scanners most teams already run have the same blind spot from the other side. Dependency tools like [Snyk](https://snyk.io) match your inventory against feeds of known-vulnerable packages; code analysers like [SonarQube](https://www.sonarsource.com/products/sonarqube/) match your source against catalogued weakness patterns. Both are matching your code against problems the industry has already named. More than [48,000 CVEs](https://www.infosecurity-magazine.com/news/first-forecasts-record-50000-cve/) were published last year, but the bugs frontier models exploit are usually the ones nobody has named yet.

<span class="pullquote" text-content="The exploit lives in their composition, in the gap between what the code does and what its authors intended."></span>

Those bugs are often built by chaining behaviours that look innocuous alone: a parser that is slightly too permissive, a cache that trusts its inputs, an error path that leaves a session half open. No single link matches a known-bad pattern. The exploit lives in their composition, in the gap between what the code does and what its authors intended. Finding it means reasoning about intent, which is exactly what pattern-matching cannot do.

## Renting the search

The obvious next move is to point the same frontier models at your own code before an adversary does. It works: last year a researcher used one to [find a remote zero-day](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/) in the Linux kernel's SMB implementation. The trouble is what you are left holding afterwards.

<span class="pullquote left" text-content="Red teaming ends when the budget ends, not when the code is safe."></span>

Red teaming is an open-ended search, and it ends when the budget ends, not when the code is safe. Scaled across an estate of millions of lines and a dragnet of weakness classes, a thorough sweep runs into the millions of dollars, and a clean run proves only that one model on one budget found nothing this time. Absence of evidence is not evidence of absence. The result decays, too: every commit after the report lands moves the code away from what was checked, so the same money is spent again at the next release, and the next.

At the root of almost any exploit sits one of two things: brittle logic that works only for the inputs its author imagined, or a missing guard whose assumption was never written down. Both are the same weakness in different clothes, a codebase that nowhere states what it is supposed to do. Wherever intended behaviour is left unsaid, the implementation admits alternatives, and every alternative reachable from outside is a potential exploit. This is what an attacking model hunts for.

Morse is our answer, and it inverts the search. Rather than paying a model to find exploits one at a time, it works out what the code is trying to achieve, marks every place the implementation admits behaviour the author never intended, and closes those gaps alongside your team. Code hardened this way withstands exploits nobody has invented yet, because the ambiguity they would be built from is gone.

## Reading the code back

The name is a small joke with two halves. Morse code turns a message into dots and dashes that anyone who knows the code can read straight back, and a codebase is layers of recorded human intent waiting to be read the same way. The other Morse is the Oxford detective who worked patiently from evidence and preferred corroboration to confidence. He never worked alone, and neither does this one: the command line tool that does the legwork, scanning, ingesting and raising tickets from your terminal or your CI, is called `lewis`.

Morse starts by reading your codebase and distilling a behavioural specification from it, a precise statement of what the code is evidently meant to do, in the language of your domain. Recovering a specification from a program is an [old research problem](https://dl.acm.org/doi/10.1145/503272.503275), but earlier techniques could only surface machine-level invariants. Current models have raised it to the level of meaning, producing [formally verifiable specifications](https://dl.acm.org/doi/10.1109/ICSE55347.2025.00129) for most benchmark programs and catching bugs that [older inference methods miss](https://arxiv.org/abs/2310.01831).

Producing the specification is itself diagnostic. Where a tangle of rules governs a tiny area of code, or a few lines carry logic far more intricate than their neighbours, the process has usually found something worth a closer look.

## Findings, not alerts

Morse is built to sit alongside the tools you already run rather than displace them. Your CI keeps building and testing, Snyk and SonarQube keep scanning, and `lewis` ingests their reports next to its own behavioural analysis. Everything it learns, from a CVE match to a behavioural divergence, is recorded as an observation in a journal committed to your repository, in a documented open format. There is no external database to trust and no account to provision. Your state is shared the way code is shared, by push and pull.

Observations are grouped into a short list of prioritised findings. When two tools report the same flaw, the reports collapse into one. When a single dependency upgrade would clear twelve CVEs, it is presented as one action. Ranking draws on [CISA's known-exploited catalogue](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) and [EPSS](https://www.first.org/epss/) probabilities alongside Morse's own severity assessment, so the list is ordered by risk rather than by volume. What reaches your team is the shape of the problem, not thousands of raw alerts to wade through.

## Tests before fixes

No fix is applied to code that lacks trustworthy tests, and coverage alone does not make a test trustworthy. Because the specification says how the code should behave, Morse can judge whether the existing tests exercise it correctly, and where they are missing or weak it proposes new ones drawn from the specification.

The tests it writes fail on first run. Each failing test is a bug made concrete, in a form your engineers or QA specialists can run and inspect. Now and then the analysis finds the reverse: a test that has been asserting the buggy behaviour for years, quietly passing. A test like that does not merely miss the bug, it protects it, turning a defect into guaranteed behaviour that every future change has to preserve.

<span class="pullquote" text-content="A green suite blessing flawed code is the most dangerous state a codebase can be in."></span>

A green suite blessing flawed code is the most dangerous state a codebase can be in. Morse flags these findings as entrenched and rewrites the test to fail in the right way, treating the change with the same rigour as a change to the code itself.

## Fixing under guard

With the intended behaviour pinned down in failing tests, Morse produces an implementation that satisfies them in the most secure way available, then checks the change back against the specification to confirm that nothing your systems depend on has moved. A confirmed finding arrives with its regression guard already written. A rejected one corrects the specification, so review sharpens the analysis rather than merely filtering it.

This is the detective's habit, corroboration over confidence. A fix shows as likely fixed on the first clean scan, then as confirmed once the other tools have independently re-scanned and agree. You can tell at a glance whether a fix is merely applied or independently corroborated, and nobody has to chase scanners or keep a spreadsheet in step. Nothing merges without your team's sign-off.

## What you keep

The contrast with red teaming is easiest to see in what each leaves behind. A sweep spends its budget on a search whose output starts decaying the day it is delivered. Morse spends a comparable budget building two durable things, a behavioural specification and the test suite that encodes it. That cost is front-loaded and bounded by the size of your codebase, in practice not much more than a single sweep, and it pays for itself within a couple of releases. After that, keeping pace with change is a marginal cost, because every new commit is assessed against a specification that already exists.

Those artefacts then do double duty. They are the record of what your systems are meant to do, finally written down instead of held in the heads of a few long-tenured engineers, and they are the guard rails that keep new code sound, for your developers and their AI assistants alike. Test coverage rises, its quality rises with it, and the backlog of latent bugs shrinks. The time to fix a defect falls because every fix starts from a specification and a failing test rather than from archaeology, and the rate at which new vulnerabilities enter the codebase falls along with the count of the old ones. Fewer of them ever get a shelf life.

That is the difference between patching and hardening. Patching keeps you level with the flaws you already know about; hardening changes the ground they grow in. An engagement with Morse ends with your team owning a codebase in better shape than we found it, and equipped to keep it that way.

---

Morse is built by JUXT, where we have spent years building and hardening critical systems for banks and fintechs. If you would like to watch it read one of your own codebases back to you, we would be glad to arrange it.
