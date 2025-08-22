---
author: 'jey'
title: 'Fast Tests'
description: 'Why tests must be fast to enable rapid feedback.'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-08-22'
heroImage: 'abstract-clojure.jpg'
tags:
  - 'go'
  - 'testing'
  - 'fast'
---

## Fast Tests

Fast tests are the foundation of rapid iteration. If running your test suite is slow, developers run fewer tests and regressions slip through.

- Keep unit tests quick (<2s where possible).
- Prioritize testing critical logic that gives the biggest confidence per second spent.
- Profile and remove slow paths that belong in integration tests.

Next: concrete techniques to make tests fast.
