---
author: 'jey'
title: 'Chapter 1 - Part 4: Data Structures'
description: 'Built-in types and how to compose them into higher-level containers'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-08-11'
heroImage: 'abstract-clojure.png'
tags:
  - 'go'
  - 'programming'
  - 'data structures'
---

In the final chapter of the Foundations micro‑series we dive into the data structures you’ll touch every single day—then show how to compose them into sets, stacks, queues, and more. No third‑party package required.

## 1 · Built‑in Data Types You Use Every Day

| Type      | Primary Use              | Key Caveats                                      |
|-----------|--------------------------|-------------------------------------------------|
| Slice     | Dynamic ordered list     | Zero value is nil; JSON encodes as null, not []. |
| Map       | Hash/dictionary          | Unordered; nil maps panic on write.             |
| Array     | Fixed‑size buffer        | Length is part of the type; rarely used directly. |
| Struct    | Aggregate data & methods | Prefer composition over inheritance.            |
| Channel   | Goroutine communication  | Zero value blocks forever; always make.         |
| Pointer   | Mutable / shared object  | Nil pointer is valid; no pointer arithmetic.    |
| Interface | Behaviour abstraction    | Implicitly satisfied; watch typed‑nil equality. |

### Quick Demo – Zero Value Pitfall

```go
var users []string          // nil slice
fmt.Println(len(users))     // 0 (safe)
jsonBody, _ := json.Marshal(users)
fmt.Println(string(jsonBody)) // "null" – surprise!
```

Initialise with `[]string{}` when you need `[]` in JSON.

## 2 · Building Higher‑Level Containers from Built‑ins

| Container      | Idiomatic Recipe              | Notes                                      |
|----------------|-------------------------------|-------------------------------------------|
| Set            | `map[T]struct{}`              | Zero‑byte value; `_, ok := set[x]`.       |
| Counter        | `map[T]int`                   | Manual `++` / `--`.                       |
| Stack          | Slice + append/pop            | Pre‑allocate to avoid realloc.            |
| Queue / Deque  | Slice as ring buffer          | Avoid expensive prepends; or use `container/ring`. |
| Ordered Map    | `map[K]V` + slice of keys     | Libraries like `github.com/elliotchance/orderedmap` help. |
| Priority Queue | `container/heap` package      | Implement `heap.Interface`.               |
| Linked List    | `container/list`              | More allocations than slices; use sparingly. |
| Concurrent Map | `sync.Map` or `map` + mutex   | Choose based on read/write ratio.         |
| Enum           | Custom type + `iota`          | Give it a `String()` method for logs.     |
| Generic Containers | Type‑parameterised structs (Go ≥ 1.18) | Keep APIs minimal; avoid over‑engineering. |

### Example – Set of IDs

```go
set := map[int]struct{}{}
set[42] = struct{}{}
if _, ok := set[99]; !ok {
    fmt.Println("not found")
}
```

Zero bytes per element; perfect for deduping in memory.

### Example – Priority Queue

```go
type Job struct { Priority int; Name string }

type jobHeap []Job
func (h jobHeap) Len() int            { return len(h) }
func (h jobHeap) Less(i, j int) bool  { return h[i].Priority < h[j].Priority }
func (h jobHeap) Swap(i, j int)       { h[i], h[j] = h[j], h[i] }
func (h *jobHeap) Push(x any)         { *h = append(*h, x.(Job)) }
func (h *jobHeap) Pop() any {
    old := *h; n := len(old) - 1
    x := old[n]; *h = old[:n]
    return x
}
```

Use `heap.Init(&h)` then `heap.Push`, `heap.Pop`—no custom sorting each time.

## 3 · Quick Reminders

- Maps are unordered → sort keys explicitly or combine with a slice when order matters.
- Zero values for slices, maps, channels are read‑safe but write‑unsafe—initialise before mutating.
- Composition + narrow interfaces beat inheritance and deep hierarchies.

Stick these on a Post‑it; you’ll save hours of debugging.

## Next Up

With the foundations locked in, we pivot to architecture. Phase 2 starts with Patterns That Actually Help—Builder, Adapter, and injected Singleton patterns that play nicely with Go’s philosophy.

Subscribe to get the Phase 2 kickoff and the copy‑paste container cookbook PDF.
