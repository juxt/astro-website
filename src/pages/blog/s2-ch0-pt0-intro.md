---
author: 'jey'
title: 'Series 2: The Baseplate Code — Never Rewrite the Foundation'
description: 'How to build, standardize, and automate a reusable Go baseplate for fast, reliable services.'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-18'
heroImage: 'abstract-clojure.png'
tags:
  - 'go'
  - 'programming'
  - 'baseplate'
  - 'architecture'
  - 'microservices'
---

# The Baseplate Code: Never Rewrite the Foundation

> "Assume everything you’ve written is wrong—or will be." — Every on‑call engineer, eventually

Shipping Go services fast doesn’t mean leaving a trail of half‑baked helper packages. It means betting on a small, boring baseplate—a reusable slice of architecture that solves cross‑cutting concerns exactly once. Build it, version it, and then get out of the way so product engineers can move.

## TL;DR
- **Standardise early.** Pick one logging, config, and metrics stack and stick with it.
- **Wrap, don’t reinvent.** Thin interfaces over pgx/sqlc/GORM buy flexibility without lock‑in.
- **Treat every error as data.** A tiny structured error type beats a thousand string compares.
- **Context everywhere.** It powers cancellation, tracing, and structured logs for free.
- **DTO → Domain → Record.** Isolate external, business, and persistence concerns.
- **Automate the boring parts.** Code‑gen, linters, and pre‑commit hooks keep velocity high.

## Why Your Foundation Matters

A shaky baseplate leaks abstractions everywhere: exotic log formats, ad‑hoc metrics, five flavours of error handling… and the day a Sev‑1 hits, no one can grep a single coherent trace.

Conversely, a stable foundation lets you:
- **Diagnose faster.** Consistent IDs and labels tie logs ↔ metrics ↔ traces.
- **Upgrade safely.** Swap out pgx for Cloud Spanner behind one interface.
- **Hire smoothly.** New joiners grok one pattern instead of five.
- **Code with confidence.** Engineers focus on business logic, not plumbing.

**Rule of thumb:** If two teams copy‑paste the same helper twice, promote it to the baseplate.

---

This post lays out a battle‑tested baseplate for Go 1.24+ microservices. It digs into why each layer exists and shows real code you can drop into your repo today.
