---
author: 'jey'
title: 'Chapter 2 - Part 4: Performance-Aware Coding Tips'
description: 'Practical Go tips for writing fast, memory-efficient code that scales.'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-17'
heroImage: 'abstract-clojure.jpg'
tags:
  - 'go'
  - 'programming'
  - 'performance'
  - 'memory'
  - 'speed'
---

# Performance-Aware Coding Tips

You don’t need to micro-optimize everything, but knowing a few key patterns will help you write Go code that’s fast, memory-efficient, and ready for scale — without sacrificing clarity.

## Memory

- **Group struct fields by size:**
  Order matters — placing smaller fields together minimizes padding, improving memory layout and CPU cache performance.
  ```go
  type Compact struct {
      A int32
      B int16
      C int16
      D byte
      E byte
  }
  ```
- **Reuse memory with `sync.Pool`:**
  For high-throughput systems, `sync.Pool` can reduce allocations and GC pressure (e.g. for buffers, JSON decoders).
  ```go
  var bufPool = sync.Pool{
      New: func() interface{} { return make([]byte, 4096) },
  }
  buf := bufPool.Get().([]byte)
  // ... use buf ...
  bufPool.Put(buf)
  ```
- **Understand slice allocation behavior:**
  `append()` can reallocate — avoid surprises by controlling capacity and reusing memory where possible.

## Speed

- **Use buffered channels:**
  Unbuffered channels block; buffering allows better throughput. Tune the size based on workload.
  ```go
  ch := make(chan int, 100)
  ```
- **Avoid `defer` in hot paths:**
  `defer` adds runtime cost — use manually structured cleanup in tight loops or performance-sensitive areas.
  ```go
  // Instead of:
  for i := 0; i < n; i++ {
      f := open()
      defer f.Close() // slow in a loop
      // ...
  }
  // Do:
  for i := 0; i < n; i++ {
      f := open()
      // ...
      f.Close()
  }
  ```
- **Limit reflection and `interface{}`:**
  Reflection is slow and unsafe. Use generics (Go 1.18+) where possible instead of `interface{}` or `reflect`.
- **Watch JSON encoding performance:**
  `encoding/json` is convenient but slow — only switch to faster libs (e.g. `segmentio/encoding`, `jsoniter`) after profiling.
- **Avoid string formatting for timestamps:**
  Use `.Unix()`, `.UnixNano()` instead of `.String()` or `.Format()` in critical code — avoids unnecessary allocation and formatting work.
  ```go
  ts := time.Now().UnixNano()
  ```

---

**Why these patterns help you write Go fast:**
- You avoid hidden performance cliffs and can scale with confidence.
- Your code is easier to profile and optimize when needed.
- You get the best of both worlds: readable code that’s also efficient.
