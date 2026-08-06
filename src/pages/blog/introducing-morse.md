---
author: 'hga'
title: 'Morse: code, decoded'
description: 'Security tools hand you bugs one alert at a time. Morse turns detective, assembling the evidence into a picture of what your code was meant to do.'
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

The gap closed because models learned to find flaws at scale. In April 2026, Anthropic gave around fifty operators of critical infrastructure access to a gated model under [Project Glasswing](https://www.anthropic.com/news/expanding-project-glasswing). Within two months, roughly two hundred organisations had reported [more than ten thousand](https://blog.cloudflare.com/cyber-frontier-models/) high- and critical-severity flaws, some of which had sat unnoticed in major operating systems and browsers for decades. Anthropic keeps the model gated because safeguards against its offensive use [do not yet exist](https://www.anthropic.com/news/claude-fable-5-mythos-5): the same search that finds flaws for defenders finds them for attackers.

## The patch reflex

Security tooling has relied on databases of known problems. Dependency tools like [Snyk](https://snyk.io) match your inventory against feeds of known-vulnerable packages; code analysers like [SonarQube](https://www.sonarsource.com/products/sonarqube/) match your source against catalogued weakness patterns, and the catalogues keep growing: more than [48,000 CVEs](https://www.infosecurity-magazine.com/news/first-forecasts-record-50000-cve/) were published last year.

The only way to keep pace with discovery at that speed is to automate the patching too. Even then, two problems remain.

The first problem is timing: by the time a CVE is published, attackers have it too, and with exploitation following disclosure within a day, a database of known flaws gives you no head start.

<span class="pullquote" text-content="The exploit lives in their composition, in the gap between what the code does and what its authors intended."></span>

The second is coverage: CVE databases describe known issues in dependencies, but they have far less to say about the weaknesses in your own code, and an attacker doesn't care where the weakness lies. A parser slightly too permissive, a cache that trusts its inputs, an error path that leaves a session half open: none of these is a problem on its own, but by chaining them together an attacker gains a foothold. The exploit lives in their composition, in the gap between what the code does and what its authors intended.

Weaknesses like these can't be patched in the traditional sense, because finding them means knowing what the code is meant to do and noticing where it does more than it should. Secure code does everything it needs to do and nothing else: no side effects its authors didn't intend, no edge cases where its behaviour is anyone's guess.

## Renting the search

The obvious response, and the one much of the industry has settled on, is AI red teaming: point the same frontier models at your own code before an adversary does. It works: last year a researcher used one to [find a remote zero-day](https://sean.heelan.io/2025/05/22/how-i-used-o3-to-find-cve-2025-37899-a-remote-zeroday-vulnerability-in-the-linux-kernels-smb-implementation/) in the Linux kernel's SMB implementation.

<span class="pullquote left" text-content="Red teaming ends when the budget ends, not when the code is safe."></span>

But red teaming is an open-ended search, and it ends when the budget ends, not when the code is safe. Across millions of lines a thorough sweep runs into millions of dollars, and a clean run proves only that one model on one budget found nothing this time.

The money buys a report. Your team still has to fix everything it lists, and while they do, the code moves on: every commit takes the codebase a little further from the one that was checked. By the next release the report describes a system you no longer run, and the search has to be paid for all over again.

## Introducing Morse

Wherever intent is weakly expressed, an implementation admits alternatives: inputs and sequences of events under which the code does something its authors never considered. Every alternative behaviour reachable from the outside is a potential exploit, and alternatives are exactly what an attacking model hunts for.

**Morse** is our answer, and it inverts the search. Rather than paying a model to find exploits one at a time, it works out what the code is trying to achieve, marks every place the implementation admits behaviour the author never intended, and hardens the code until only intended behaviour remains. A scanner can tell you that a function ignores a return code; Morse reasons about your code in the terms of your domain. Code hardened this way withstands exploits nobody has invented yet, because the ambiguity they would be built from is gone.

We've called it Morse for two reasons.

* Morse code turns a message into dots and dashes that anyone who knows the code can read straight back. A codebase is layers of recorded human intent waiting to be read the same way.
* Morse is the Oxford detective who worked patiently from evidence and preferred corroboration to confidence.

Inspector Morse never worked alone; he had his faithful assistant Lewis. Our Morse has the same: the command line tool that does the legwork, scanning, ingesting and raising tickets from your terminal or your CI, is called `lewis`.


## How Morse works

Everything downstream, from the findings to the fixes, depends on an artefact that Morse builds first.

### Distilling the specification

Morse begins by reading the codebase and distilling a behavioural specification: a statement of what the code is evidently meant to do, in the language of your domain. Recovering specifications from programs is a research problem with a long history, but where earlier techniques could only surface machine-level invariants, current models produce [formally verifiable specifications](https://dl.acm.org/doi/10.1109/ICSE55347.2025.00129) for most benchmark programs. The distillation is itself diagnostic: where a tangle of rules governs a small area of code, there is usually something worth a closer look.

### The signal in the noise

Morse runs alongside the tools you already have. CI keeps building, Snyk and SonarQube keep scanning, and `lewis` ingests their reports next to Morse's own analysis. Every observation, from a CVE match to a behavioural divergence, is recorded in a journal committed to your repository in a documented open format. There is no external database and no account to provision; state is shared the way code is shared, by push and pull.

Observations are grouped into a short list of findings. Duplicate reports of one flaw collapse into one finding; a dependency upgrade that clears twelve CVEs appears as one action. Ranking combines [CISA's known-exploited catalogue](https://www.cisa.gov/known-exploited-vulnerabilities-catalog) and [EPSS](https://www.first.org/epss/) probabilities with Morse's own severity assessment, so the list is ordered by risk. What reaches your team is the shape of the problem, in a handful of findings instead of thousands of raw alerts.

### Spec-anchored tests

Morse won't touch code it can't test. Before any fix, it asks whether the existing tests can be trusted, and coverage alone doesn't make them trustworthy. Because the specification says how the code should behave, Morse can judge whether the tests check the right things, and where they are missing or weak it proposes new ones, drawn from the specification. Each proposed test fails on first run, which is the point: a failing test is the bug made concrete, in a form your engineers can run and inspect.

Sometimes the analysis finds the reverse: a test that has asserted the buggy behaviour for years, protecting the defect as behaviour every future change must preserve. Morse flags these findings as entrenched and rewrites the test to fail in the right way, with the same rigour as a change to the code itself.

### Fixing without breaking things

With the intended behaviour pinned down in failing tests, Morse writes an implementation that satisfies them in the most secure way available, then checks the change against the specification to confirm nothing your systems depend on has moved. An accepted finding merges with its regression guard already written, while a rejected one corrects the specification, so review improves the analysis rather than merely filtering it.

A fix is reported as likely fixed on the first clean scan, and as confirmed once the other tools have independently re-scanned and agree. The distinction is visible at a glance, so nobody chases scanners or keeps a spreadsheet in step, and nothing merges without your team's sign-off.

### From one repository to a fleet

The analysis is the same for one repository or a thousand; what changes is the shell around it. Locally, `lewis` is all a developer needs: point it at a repository and it scans, ingests and reports there and then. At estate scale, Morse runs as a managed service that schedules scans across the fleet and aggregates what it finds, so one vulnerable dependency in forty services becomes one finding with one remediation. It works through the systems your teams already use, raising tickets in Jira, publishing summaries to Confluence and opening pull requests in GitHub or Bitbucket, so visibility lands where people already look rather than on another dashboard nobody remembers to check. Both modes share the journal format, so a team that starts with one repository keeps everything when it grows.

## Why this is the right approach

Red teaming has no economy of scale: the next sweep costs what the last one did and delivers another report. Morse, adopted as part of the development process, puts the same budget into artefacts that last. The behavioural specification and its test suite are built once, at a cost bounded by the size of the codebase, and every commit after that is checked against them for a marginal cost. Quality and security become sustainable habits of the development process itself, secure by construction rather than by periodic inspection.

![Line chart of cumulative cost over five releases. AI red teaming climbs linearly to 600 thousand dollars. Morse rises steeply to 160 thousand while the spec and tests are built, then flattens near 215 thousand. The lines cross before release 2, and the widening gap after the break-even point is labelled compounding savings.](../../assets/blog/morse-economics.svg)

**The artefacts belong to you**, and they live in your repository: the specification, the tests and the journal of every observation, decision and fix, all in an open format. There is no vendor database to depend on, and the whole history is inspectable in git by your team or your auditors.

They also change how the team works. With the system's intended behaviour written down at last, instead of living only in the heads of a few long-tenured engineers, developers understand the code they are changing. **Test quality rises**, the backlog of latent bugs shrinks, and fixes start from a failing test rather than from archaeology.

And they guard the future, because every change, whether from your developers or their AI assistants, is checked against the specification and its tests. **The rate at which new vulnerabilities enter the codebase falls** along with the count of old ones, and fewer flaws ever get a shelf life.

That is the difference between patching and hardening. Patching is reactive work that, done well, keeps pace with the rate at which new flaws are catalogued. Hardening with Morse is proactive work that sets up a virtuous cycle: the specification and its tests make change safer, safer change raises quality, and higher quality leaves attackers less to work with. An engagement ends with your team owning a codebase in better shape than we found it, and equipped to keep it that way.

---

Morse is built by JUXT, where we have spent years hardening critical systems for banks and fintechs. If you would like to watch it read one of your own codebases back to you, we would be glad to arrange it.
