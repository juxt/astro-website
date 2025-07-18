---
author: 'jey'
title: 'Part 2: Project Structure & Composition Patterns'
description: 'How to structure Go projects for speed, clarity, and long-term maintainability'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-17'
heroImage: 'abstract-clojure.png'
tags:
  - 'go'
  - 'programming'
  - 'project structure'
  - 'composition'
  - 'patterns'
---

# Project Structure & Composition Patterns

How you organize your Go project determines how fast you can ship, refactor, and onboard new contributors. These patterns keep your codebase lean, testable, and ready for change.

## Service Structs with Interface Contracts

Define service types that hold only their required dependencies. Attach domain logic as methods:

```go
type UserService struct {
    store UserStore
    logger Logger
}

func (s *UserService) DoSomething(ctx context.Context) error {
    // domain logic here
}
```
- Keep interfaces minimal and test them through service logic, not by mocking every collaborator.

## Narrow Interfaces, Not Wide Contracts

Design interfaces from the consumer’s perspective, not the implementer’s. Interfaces should typically have 1–3 methods max.

- Keeps code flexible and testable.
- Don’t guess future needs—don’t add SaveAll, UpdateMany, BulkDelete unless you actually use them.

## Composing Interfaces On the Fly

You can compose interfaces inline when needed:

```go
func Process(r interface{ Read([]byte) (int, error) }) error {
    // ...
}
```
- Useful for defining just what you need, without extra named interfaces.
- Easy to forget this is valid Go—avoids unnecessary over-abstraction.

## Naming Convention for Interfaces

Stick to the `-er` suffix for interfaces that describe capability: `Reader`, `Writer`, `Fetcher`, `Storer`, `Calculator`, `Publisher`, etc.

- Makes usage clear and aligns with stdlib idioms (`io.Reader`, `http.Handler`).
- Avoid generic or unclear names (`Utils`, `Handler`, `Manager`) unless truly cohesive.

## Domain-Driven Packages

Organize code around business logic: `user`, `payment`, `checkout`.

- Avoid tech-based packages (`util`, `common`, `helpers`)—they rot fast.
- Cross-cutting concerns (logging, config) can go in `internal/infra/` or similar.

## Internal Packages for Boundaries

Use `internal/` to enforce package visibility boundaries. Go’s compiler prevents external imports of internal packages:

- `internal/db/pgstore` can't be imported by sibling projects.
- Encourages better modularity and avoids accidental tight coupling.

## Use cmd/yourapp for Entrypoints

Each binary should have its own folder under `cmd/`:

- e.g. `cmd/api-server`, `cmd/job-runner`, `cmd/data-seeder`.
- Keeps your `main.go` focused on config loading, dependency wiring, and startup/shutdown orchestration.

## Keep Business Logic in Pure Packages

Write domain logic in packages that have no side effects.

- No `net/http`, `database/sql`, `os`, or `fmt.Print` in core logic.
- Side-effecting packages (adapters) call into pure logic, not the other way around.

## Avoid init() for Runtime Setup

Prefer explicit dependency wiring in `main()` or constructors.

- `init()` is hard to reason about and test—use it only for package-level constants or registration (e.g. Prometheus metrics).

## Singletons via Dependency Injection

Create long-lived dependencies (e.g. DB, logger) once in `main()` or `cmd/`.

- Pass them down explicitly into services.
- Avoid global variables and `init()` setup.

---

**Why these patterns help you write Go fast:**
- You can onboard new contributors quickly—structure is predictable and idiomatic.
- Refactoring is safer and faster—dependencies are explicit, logic is decoupled.
- Tests are easier to write and maintain—pure logic is isolated, side effects are contained.
- You avoid "big ball of mud" syndrome—each part of your app has a clear purpose and boundary.
