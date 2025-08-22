---
author: 'jey'
title: 'Chapter 1 - Part 3: Language Traps'
description: 'Quirks that compile fine but explode at runtime or review'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-08-04'
heroImage: 'abstract-clojure.jpg'
tags:
  - 'go'
  - 'programming'
  - 'quirks'
---

In Part 1 we found comfort; Part 2 fixed bad habits. Now we shine a light on language traps—quirks that compile just fine yet explode at runtime or review. Each is paired with a runnable snippet and a fix.

## 1 · Core Language Surprises

### 1.1 Manual Error Handling

Every function that can fail returns `(T, error)`. Ignore the error, invite undefined behaviour.

```go
val, err := strconv.Atoi(input)
if err != nil { // <- ALWAYS check
    return 0, fmt.Errorf("invalid int: %w", err)
}
```

Why it bites: muscle‑memory from exceptions makes you skip the `err` variable.

### 1.2 Implicit Interfaces

No `implements` keyword—conformance is structural.

```go
type Reader interface{ Read([]byte) (int, error) }

// Any type with Read([]byte)(int,error) now *is* a Reader.
```

Gotcha: renaming or signature drift silently breaks consumers at compile time, not runtime—so tests catch it, but your IDE won’t highlight until save.

### 1.3 Goroutines ≠ Threads

Spawn a million goroutines in 30 MB RAM, but they need management.

```go
for i := 0; i < 1e6; i++ { go work(i) }
```

Always cancel or wait—or you leak memory.

### 1.4 defer Timing

`defer` executes at function return in LIFO order—not each loop iteration.

```go
for i := 0; i < 3; i++ {
    defer fmt.Println(i)
}
// prints 2 1 0, after loop ends
```

Fix by wrapping logic in a helper function when per‑iteration cleanup is needed.

## 2 · Nil Traps

| Scenario                  | Crash‑or‑Weird?                     | Safe Pattern                     |
|---------------------------|--------------------------------------|-----------------------------------|
| Typed nil interface       | `var r io.Reader = (*bytes.Buffer)(nil)` → `r != nil` | return raw nil or ensure concrete value |
| Nil slice JSON            | nil encodes to null, not []         | initialise: `s := []T{}` before marshal |
| Nil map write             | `m["k"] = v` panics                 | `m := make(map[K]V)`             |
| Function returns nil slice/map | caller may think non‑nil         | document contract or wrap with helper |
| Non‑nil slice of nil elems | `len(s) > 0` yet deref panics       | validate inner pointers          |

### Example – Typed Nil Equality

```go
var buf *bytes.Buffer
var r io.Reader = buf // interface holding *typed* nil
fmt.Println(r == nil) // false!
```

Rule: return `(nil, nil)` only when both value and its dynamic type are nil.

## 3 · Control‑Flow & Syntax Gotchas

### 3.1 Loop Variable Capture

```go
for _, file := range files {
    file := file // re‑declare!
    go func() { process(file) }()
}
```

Without the redeclare, every goroutine gets the last loop value.

### 3.2 switch / select Auto‑Break

Cases break automatically; add `fallthrough` explicitly if needed.

### 3.3 Labeled Breaks

Use labels to exit nested loops:

```go
outer:
for r.Scan() {
    for _, b := range r.Bytes() {
        if b == '\n' { break outer }
    }
}
```

### 3.4 Constants Are Inlined

`const num = 1` behaves like C `#define`; address cannot be taken.

## 4 · context.Context Rules

| Rule                     | Why                                   |
|--------------------------|---------------------------------------|
| First param, named `ctx` | Consistent discovery by linters & humans |
| Pass, don’t store        | Contexts are request‑scoped; storing leads to leaks |
| Use `Background()` at root | Top‑level main, tests                |
| `TODO()` only as placeholder | Replace before prod merge           |
| Limit `WithValue`        | Only for tracing/auth; type‑safe keys |

### Example – Propagation

```go
func fetch(ctx context.Context, url string) error {
    req, _ := http.NewRequestWithContext(ctx, http.MethodGet, url, nil)
    res, err := http.DefaultClient.Do(req)
    // ... handle err ...
    return res.Body.Close()
}
```

If `ctx` times out, the HTTP call aborts automatically.

## Cheat‑Sheet Recap

| Category         | Most Common Footgun       | One‑Line Fix                     |
|------------------|---------------------------|----------------------------------|
| Error handling   | You forgot `if err != nil` | Treat ignoring as code smell     |
| Interfaces       | Assume explicit `implements` | Trust the compiler’s struct‑ural typing |
| Goroutines       | Fire‑and‑forget           | `context` + `WaitGroup`          |
| defer            | Used in loops             | Wrap body in helper func         |
| Nil values       | Interface != nil confusion | Return true nil or explicit zero slice/map |
| Loop var         | Captured wrong            | Shadow var inside loop           |
| switch           | Missing break             | Add `fallthrough` knowingly      |
| context          | Stored global             | Pass down; never keep            |

Stick this table in your wiki; it has saved me hours of head‑scratching.

Next Up

Part 1.4 lands next week: “Start Fast—Skip the Over‑Idiomatic Rabbit Holes.” We’ll set up folders, tooling, and linting so you can ship code, not yak‑shave.

Get Part 1.4 and our goroutine‑leak checklist in your inbox.
