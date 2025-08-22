---
author: 'jey'
title: 'It’s Working… But at What Cost'
description: 'Performance troubleshooting in production: tools and common bottlenecks.'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-08-22'
heroImage: 'abstract-clojure.jpg'
tags:
  - 'go'
  - 'performance'
  - 'observability'
---

## It’s Working… But at What Cost

Performance issues often only surface in production. Fast diagnosis relies on the right tools and a structured approach.

- Troubleshoot slowdowns: use pprof, execution traces, logs, and metrics to find hotspots.
- Common issues: excessive allocations, goroutine leaks, database bottlenecks, and lock contention.
- Versioning strategy: adopt compatibility-minded versioning to avoid breaking dependencies when you change APIs or behaviors.
- Safe error exposure: never leak internal implementation details — return meaningful but safe error messages and correlate with logs.

Quick checklist:

- Collect pprof CPU/heap profiles from production-like loads.
- Capture a trace for slow requests to see blocking points and tail latency.
- Correlate trace spans with logs and metrics to narrow root cause.
- Review DB query plans and connection pool usage before assuming application-level fixes.

Performance is a system property — observe broadly, measure precisely, and change carefully.
