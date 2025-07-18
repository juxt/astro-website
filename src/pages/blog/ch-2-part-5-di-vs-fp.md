---
author: 'jey'
title: 'Part 2: Dependency Injection vs Functional Programming'
description: 'How to glue Go code together quickly and safely — and when to use each style'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-17'
heroImage: 'abstract-clojure.png'
tags:
  - 'go'
  - 'programming'
  - 'patterns'
  - 'dependency injection'
  - 'functional programming'
---

# Dependency Injection vs Functional Programming

When you need to glue together real-world Go systems fast, you have two main tools: Dependency Injection (DI) and Functional Programming (FP). Each has its place — and knowing when to use which will help you ship faster and with fewer regrets.

## Dependency Injection: The Glue for Real Apps

DI is about wiring up your app: passing dependencies (like DBs, loggers, configs) into structs or functions, rather than hard-coding them. This makes your code more testable, flexible, and easier to change later.

**When to use DI:**
- Connecting infrastructure (DB, HTTP clients, config, loggers)
- Swapping implementations (real vs mock, prod vs test)
- Building modular, composable systems

**Example:**
```go
type App struct {
    Store  UserStore
    Logger Logger
}

func NewApp(store UserStore, logger Logger) *App {
    return &App{Store: store, Logger: logger}
}
```

**Why it helps you write Go fast:**
- You can swap dependencies instantly for tests or demos
- You avoid global state, so bugs are easier to track down
- You can start with concrete types and refactor to interfaces as needed

## Functional Programming: Purity for Core Logic

FP in Go means writing pure functions: no side effects, no hidden state, just input → output. This style is perfect for business logic, calculations, and anything that should be easy to test and reason about.

**When to use FP:**
- Core business logic (validation, calculations, transformations)
- Code that must be easy to test and refactor
- Avoiding hidden dependencies and side effects

**Example:**
```go
func CalculateDiscount(price, percent float64) float64 {
    return price * (1 - percent)
}
```

**Why it helps you write Go fast:**
- Pure functions are trivial to test — no setup, no mocks
- You can refactor and reuse logic with confidence
- Bugs are easier to isolate and fix

## The Pragmatic Combo

- Use DI for glue code: wire up your app, pass in dependencies, keep things swappable
- Use FP for core logic: keep it pure, testable, and easy to reason about

**This lets you:**
- Prototype quickly (start concrete, refactor to interfaces later)
- Test fast (swap real for mock, test pure logic in isolation)
- Change direction without massive rewrites

## TL;DR
- DI glues your app together — use it for infrastructure and wiring
- FP keeps your core logic clean — use it for business rules and calculations
- Mixing both lets you move fast now and adapt later
