---
author: 'jey'
title: 'Part 3: Handy Function Patterns You Might Be Missing'
description: 'Small but powerful Go patterns for slices, maps, safe defaults, and error handling.'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-17'
heroImage: 'abstract-clojure.png'
tags:
  - 'go'
  - 'programming'
  - 'patterns'
  - 'slices'
  - 'maps'
  - 'error handling'
---

# Handy Function Patterns You Might Be Missing

These are small but powerful patterns that simplify logic, reduce errors, or boost clarity — often overlooked by devs new to Go. Mastering these will help you write Go code faster and with fewer bugs.

## Slice Utilities

- **Copy slices cleanly:**
  Use `copy(dst, src)` instead of manual loops. Great for fast duplication, slicing windows, or snapshotting.
  ```go
  dst := make([]int, len(src))
  copy(dst, src)
  ```
- **Presize slice capacity:**
  Use `make([]T, 0, cap)` to prevent repeated growth and reallocation in append-heavy logic.
  ```go
  xs := make([]string, 0, 100)
  ```
- **Truncate without reallocation:**
  Slicing a slice (`x = x[:0]`) reuses memory — great for in-place resets without reallocating.
  ```go
  buf = buf[:0]
  ```

## Data Structure Patterns

### Map Patterns
- **Deduplication with `map[T]bool`:**
  Track whether an item has already been seen.
  ```go
  seen := make(map[string]bool)
  for _, v := range vals {
      if seen[v] { continue }
      seen[v] = true
      // ...
  }
  ```
- **Indexed Lookup by ID or Key:**
  Convert a slice of structs into fast-access maps.
  ```go
  usersByID := make(map[int]User)
  for _, u := range users {
      usersByID[u.ID] = u
  }
  ```
- **Group by Field:**
  Bucket items by a shared attribute.
  ```go
  usersByRegion := make(map[string][]User)
  for _, u := range users {
      usersByRegion[u.Region] = append(usersByRegion[u.Region], u)
  }
  ```
- **Reverse Lookup Maps:**
  Flip values to keys for inverse lookups.
  ```go
  nameToID := map[string]int{"alice": 1, "bob": 2}
  idToName := make(map[int]string)
  for k, v := range nameToID {
      idToName[v] = k
  }
  ```
- **Sparse Matrices via Nested Maps:**
  Efficiently represent 2D grids where most cells are empty.
  ```go
  grid := make(map[int]map[int]Cell)
  grid[2] = make(map[int]Cell)
  grid[2][3] = Cell{...}
  ```

### Slice Patterns
- **Ring / Circular Buffers:**
  Reuse slice capacity in a fixed-size, wrapping structure. Ideal for sliding windows, recent logs, or telemetry data.

### Array Patterns
- **Lookup Tables with Arrays:**
  For small, fixed domains like ASCII or byte values, arrays offer faster and lower-overhead lookups than maps.

## Safe Defaults and Guards

- **Default zero values work — use them:**
  Slices, maps, and channels can be nil and still readable. But: nil maps will panic on writes, nil slices won't.
- **Always `make()` maps before writes:**
  Even if a function returns a map, confirm it's initialized before inserting.
- **Comma-ok idiom is essential:**
  Use `val, ok := m[k]` to detect presence — `m[k]` alone doesn't tell you if the key existed or the zero value was stored.
- **Direct map lookups don’t return ok flag:**
  A statement like `return m[k]` discards whether the key was present. Prefer splitting into `val, ok := ...` if that distinction matters.
- **Must functions can panic:**
  Helper functions like `MustParseTime()` or `MustGetConfig()` are clear and concise, but should only be used when failure is truly unrecoverable. Otherwise, they can crash your program.

## Error Logic Shortcuts

- **Return early:**
  Use `if err != nil { return err }` immediately after the call. It’s idiomatic, readable, and avoids nested error pyramids.
- **Use structured errors over freeform strings:**
  Prefer custom error types (with fields or wrappers) when context matters. Avoid string parsing for control flow.
- **Don’t ignore errors:**
  Always check and return errors, even if it’s just for logging. Use `_ = err` explicitly if discarding is intentional (e.g. in cleanup paths).
- **Avoid panic for flow control:**
  Panics are for truly unrecoverable conditions. Don’t use them to shortcut normal error logic.
- **Log at the edge, not deep in logic:**
  Let the outermost layer (e.g. HTTP handler, main loop) handle logging. Inner functions should just return errors with context.

---

**Why these patterns help you write Go fast:**
- You avoid subtle bugs and wasted time debugging basics.
- Your code is more readable and easier to maintain.
- You can prototype and refactor quickly, knowing you’re using Go’s strengths.
