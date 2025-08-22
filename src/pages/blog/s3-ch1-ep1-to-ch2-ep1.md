---
author: 'jey'
title: 'Fast Tests & Practices'
description: 'Combined episode covering mockgen, test helpers, flaky tests, test boundaries, feedback loops, revert-friendly commits, and validating vs sanitizing.'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-08-22'
heroImage: 'abstract-clojure.jpg'
tags:
  - 'go'
  - 'testing'
  - 'mocking'
  - 'git'
  - 'validation'
  - 'ci'
---

## Fast Tests & Practices

This combined post gathers practical patterns to keep tests fast, reliable, and maintainable — from generating mocks to sanitizing input and keeping commits small.

### Fast Unit Test — mockgen

Generate mocks only for small, well-defined interfaces that represent true seams in your code. Over-mocking implementation details leads to fragile tests and slow maintenance.

- Use `mockgen` to produce reliable, compile-time-checked mocks.
- Mock behavior, not structure — test intent rather than implementation.
- Prefer small interfaces that are easy to reason about and stub.

### Test Helpers

Centralize common test setup and teardown to make tests concise and uniform.

- Create helper packages for fixtures, in-memory stores, and builders.
- Reuse helpers across packages to avoid copy/paste.
- Keep helpers small and well-documented to avoid hidden complexity.

Good helpers speed authoring and make intent clear.

### No Flaky Tests

Flaky tests erode trust and slow teams down. Control sources of nondeterminism in unit tests:

- Control random input by seeding or injecting deterministic generators.
- Avoid real network, disk, or time dependencies — use fakes or deterministic stubs.
- Use table-driven tests to cover edge cases deterministically.

Aim for reliable, repeatable tests.

### Small Test Boundaries

Tight, focused unit tests give faster feedback and clearer failure signals than huge integration tests.

- Define clear boundaries for what a unit test is responsible for.
- Push slow, end-to-end verification into a smaller number of integration tests.
- Keep unit tests self-contained and fast.

### Fast Feedback Loops

Fast feedback is the lifeblood of iterative development.

- Aim to test critical logic in under 2 seconds.
- Run quick checks locally and gate slower suites in CI.
- Optimize the common fast paths developers run during coding.

Short feedback cycles reduce context switching and speed up fixes.

### Revert-Friendly Commits

Small, focused commits make it easy to bisect, revert, and review changes.

- Keep PRs scoped to a single concern.
- Write clear commit messages and break work into atomic steps.
- Avoid mixing refactors with behavior changes in the same commit.

This practice helps teams move faster and recover from regressions quickly.

### Validating vs Sanitizing

Don’t just check that input is correct — also make it safe.

- Validate: ensure input meets expected shape and constraints (types, ranges, required fields).
- Sanitize: transform or clean input to a safe canonical form — trim whitespace, enforce casing, strip dangerous characters.
- Both: use validation to reject incorrect input and sanitization to reduce downstream risks.

Practical tips:

- Trim and normalize strings at the boundary.
- Enforce casing for case-insensitive identifiers.
- Escape or reject unexpected characters where appropriate.

These steps protect your domain logic and storage from accidental or hostile input.
