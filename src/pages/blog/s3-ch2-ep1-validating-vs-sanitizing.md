---
author: 'jey'
title: 'Validating vs Sanitizing'
description: 'Don\'t just check that input is correct — also make it safe.'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-08-22'
heroImage: 'abstract-clojure.jpg'
tags:
  - 'go'
  - 'validation'
  - 'security'
---

## Validating vs Sanitizing

Don’t just check that input is correct — also make it safe.

- Validate: ensure input meets expected shape and constraints (types, ranges, required fields).
- Sanitize: transform or clean input to a safe canonical form — trim whitespace, enforce casing, strip dangerous characters.
- Both: use validation to reject incorrect input and sanitization to reduce downstream risks.

Practical tips:

- Trim and normalize strings at the boundary.
- Enforce casing for case-insensitive identifiers.
- Escape or reject unexpected characters where appropriate.

These steps protect your domain logic and storage from accidental or hostile input.
