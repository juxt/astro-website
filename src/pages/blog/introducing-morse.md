---
author: 'hga'
title: 'Morse: code, decoded'
description: "Patching security vulnerabilities reactively, but wondering if there's a better way? We think there is, and we've called it Morse."
category: 'ai'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2026-08-07'
heroImage: 'morse.jpg'
tags:
  - 'ai'
  - 'security'
  - 'engineering'
---

<p class="lede">A security flaw used to have a shelf life. Back in 2021, the median time between a vulnerability being disclosed and first being exploited was close to a year, long enough to schedule a fix into an ordinary release. Today the median exploit arrives <a href="https://zerodayclock.com" target="_blank">hours before its disclosure</a>. The window has been shrinking for years, and now AI is able to find exploits at scale.</p>

In April 2026, Anthropic gave around fifty operators of critical infrastructure access to a gated model under [Project Glasswing](https://www.anthropic.com/news/expanding-project-glasswing). Within two months, roughly two hundred organisations had reported [more than ten thousand](https://blog.cloudflare.com/cyber-frontier-models/) high- and critical-severity flaws, some of which had sat unnoticed in major operating systems and browsers for decades.

Outside Glasswing, the model stays restricted, because safeguards against its offensive use [do not yet exist](https://www.anthropic.com/news/claude-fable-5-mythos-5). The same capability serves both attackers and defenders alike.

## The patch reflex

Historically, defence has meant static analysis against databases of known problems. Dependency tools like [Snyk](https://snyk.io) match your inventory against feeds of known-vulnerable packages; code analysers like [SonarQube](https://www.sonarsource.com/products/sonarqube/) match your source against catalogued weakness patterns. The catalogues keep growing: more than [48,000 CVEs](https://www.infosecurity-magazine.com/news/first-forecasts-record-50000-cve/) were published last year.

The only way to keep pace with discovery at that speed is to automate the patching too. Even then, two problems remain.

The first problem is timing: with the median exploit arriving before its disclosure, a CVE database describes where attackers have already been, and patching from it can only chase them.

<span class="pullquote" text-content="The exploit lives in their composition, in the gap between what the code does and what its authors intended."></span>

The second is coverage: CVE databases describe known issues in dependencies, but they have far less to say about the weaknesses in your own code, and an attacker doesn't care where the weakness lies. [EchoLeak](https://checkmarx.com/zero-post/echoleak-cve-2025-32711-show-us-that-ai-security-is-challenging/), the zero-click flaw disclosed in Microsoft 365 Copilot in 2025, chained behaviours that were each harmless on their own. A reference-style Markdown image slipped the filter meant to redact links; its source pointed at a Microsoft domain the content-security policy already trusted, so the browser fetched it automatically and carried a user's private data out to an attacker. The exploit lives in their composition, in the gap between what the code does and what its authors intended.

Weaknesses like these can't be patched in the traditional sense, because finding them means knowing what the code is _meant to do_ and noticing where it does more than it should. Secure code does everything it needs to do and nothing else: no side effects its authors didn't intend, no edge cases where its behaviour is loosely defined.

## Attacking your own code

The obvious response, and the one much of the industry has settled on, is AI red teaming: point the same frontier models at your own code before an adversary does. It works: last year a researcher used one to [find a remote zero-day](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/) in the Linux kernel's SMB implementation.

<span class="pullquote left" text-content="Red teaming ends when the budget ends, not when the code is proven safe."></span>

But red teaming is an open-ended search. It ends when the budget ends, not when the code is proven safe. Across millions of lines a thorough sweep can runs into the millions of dollars, and a clean run proves only that *this model* used *this budget* and found nothing *this time*.

The money buys a report, but your team still has to fix everything it lists. Whilst they do, the code moves on, and every commit takes the codebase a little further from the one that was checked. By the next release the report describes a system you no longer run, and the search has to be paid for all over again.

## Introducing Morse

Wherever intent is weakly expressed, an implementation admits alternatives: inputs and sequences of events under which the code does something its authors didn't consider. Every alternative behaviour reachable from the outside is a potential exploit, and alternatives are exactly what an attacking model hunts for.

**Morse** is our answer. Rather than paying a model to find exploits one at a time, it works out what the code you write is trying to achieve, marks every place the implementation admits behaviour you never intended, and hardens the code until only intended behaviour remains.

A scanner can tell you that a function ignores a return code; Morse reasons about your code in the terms of your domain. Code hardened this way withstands exploits nobody has invented yet, because the ambiguity they would be built from is gone.

We've called it Morse for two reasons.

* Morse code turns a message into dots and dashes that anyone who knows the code can read straight back. A codebase is layers of recorded human intent waiting to be read the same way.
* Morse is the Oxford detective who worked patiently from evidence and preferred corroboration to confidence.

Inspector Morse never worked alone; he had his faithful assistant Lewis. Our Morse has the same: the command line tool that does the legwork, scanning, ingesting and raising tickets from your terminal or your CI, is called `lewis`.


## How Morse works

Morse begins by reading the codebase and distilling a behavioural specification: a statement of what the code is evidently meant to do, in the language of your domain.

Recovering specifications from programs is a research problem with a long history, but where earlier techniques could only surface machine-level invariants, current models produce [formally verifiable specifications](https://dl.acm.org/doi/10.1109/ICSE55347.2025.00129) for most benchmark programs. The distillation is itself diagnostic: where a tangle of rules governs a small area of code, there is usually something worth a closer look.

![Diagram: Morse reads your codebase and distills it into a behavioural specification.](../../assets/blog/morse-distil.svg)

### The signal in the noise

Morse runs alongside the tools you already have. CI keeps building, Snyk and SonarQube keep scanning, and `lewis` ingests their reports next to Morse's own analysis. Every observation, from a CVE match to a behavioural divergence, is recorded in a journal committed to your repository in a documented open format. There is no external database and no account to provision; state is shared the way code is shared, by push and pull.

Observations are grouped into a short list of findings, so duplicate reports of a single flaw collapse into a single finding no matter how many tools flagged it. Ranking combines [CISA's known-exploited catalogue](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) and [EPSS](https://www.first.org/epss/) probabilities with Morse's own severity assessment, so the list is ordered by risk. What reaches your team is the shape of the problem, in a handful of findings instead of thousands of raw alerts.

![Diagram: reports from Snyk, SonarQube and CI, together with Morse's own analysis, are ingested by lewis into a journal in your repository, then grouped into a short list of findings ranked by risk.](../../assets/blog/morse-signal.svg)

### Spec-anchored tests

Good tests offer the best proof that code behaves the way it should. Before any fix, Morse asks whether the existing tests can be trusted.

Coverage alone doesn't make tests trustworthy. Because the specification says how the code should behave, Morse can judge whether the tests check the right things. Where they are missing or weak it proposes new ones, drawn from the specification. Each proposed test fails on first run, because a failing test is the bug made concrete in a form your engineers can run and inspect.

![Diagram: the specification, showing how the code should behave, and the code, showing how it behaves, both feed Morse, which derives a test that fails on first run.](../../assets/blog/morse-tests.svg)

Sometimes the analysis finds the reverse: a test that has asserted the buggy behaviour for years, protecting and blessing the defect as intended behaviour. Morse flags these findings too. Updates to tests are proposed which cause 'correct failures', so your engineers can see the issues which were masked by a green test suite and yet latent in the code all along.

### Fixing without breaking things

With the intended behaviour pinned down in failing tests, Morse writes an implementation that satisfies them in the most secure way available, then checks the change against the specification to confirm nothing your systems depend on has moved.

A fix is reported as likely fixed on the first clean scan, and as confirmed once the other tools have independently re-scanned and agree. Morse is designed to make rigourous software development accessible and effective. Your team have the information they need in order to confirm and sign-off the fixes as successful.

![Diagram: an applied fix is re-scanned by Snyk, SonarQube and CI; lewis ingests their reports and the finding moves from likely fixed to confirmed fixed once every tool re-scans clean.](../../assets/blog/morse-fixes.svg)

### From one repository to a fleet

The analysis is the same for one repository or a thousand; what changes is the shell around it.

At estate scale, Morse runs as a managed service that schedules scans across the fleet and aggregates what it finds, so one vulnerable dependency in forty services becomes one finding with forty instances to resolve. It works through the systems your teams already use, raising tickets in Jira, publishing summaries to Confluence and opening pull requests in GitHub or Bitbucket.

Both modes share the journal format, so a team that starts with one repository keeps everything when it grows.

![Diagram: six repositories, each with its own journal, are aggregated by Morse running as a managed service, which raises Jira tickets, Confluence summaries and pull requests in GitHub or Bitbucket.](../../assets/blog/morse-fleet.svg)

## Why this is the right approach

Red teaming has no economies of scale: the next sweep costs what the last one did and delivers another report. Morse, adopted as part of the development process, puts the same budget into artefacts that last. The behavioural specification and its test suite are built once, at a cost bounded by the size of the codebase, and every commit after that is checked against them for a marginal cost. Quality and security become sustainable habits of the development process itself, secure by construction rather than by periodic inspection.

![Line chart of cumulative cost over five releases. AI red teaming climbs linearly to 600 thousand dollars. Morse rises steeply to 160 thousand while the spec and tests are built, then flattens near 215 thousand. The lines cross before release 2, and the widening gap after the break-even point is labelled compounding savings.](../../assets/blog/morse-economics.svg)

The artefacts belong to you, and they live in your repository: the specification, the tests and the journal of every observation, decision and fix, all in an open format. There is no vendor database to depend on, and the whole history is inspectable in git by your team or your auditors.

## From reactive to proactive

Those artefacts do more than record the past. The specification and its tests are checked against every change, whether from your developers or their AI assistants. With the system's intended behaviour written down at last, instead of living only in the heads of a few long-tenured engineers, developers understand the code they are changing, and fixes start from a failing test rather than from archaeology. The backlog of latent bugs shrinks and new vulnerabilities enter more slowly, so fewer flaws ever get a shelf life.

That is the difference between patching and hardening. Patching is reactive work that, done well, keeps pace with the rate at which the catalogues grow. Hardening with Morse is proactive work that sets up a virtuous cycle: the specification and its tests make change safer, safer change raises quality, and higher quality leaves attackers less to work with. An engagement ends with your team owning a codebase in better shape than we found it, and equipped to keep it that way.

---

Morse is built by JUXT, where we have spent years hardening critical systems for banks and fintechs. If you would like to watch it read one of your own codebases back to you, we would be glad to arrange it.
