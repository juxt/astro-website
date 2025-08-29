---
author: 'jey'
title: 'Chapter 1 - Part 1: Finding the Familiar'
description: 'Static typing, binaries, data-types, stdlib, tooling'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-21'
heroImage: 'abstract-clojure.jpg'
tags:
  - 'go'
  - 'programming'
  - 'foundations'
---


## Similarities (Go and Your Favourite Language)

### Static Typing
Feels like: Java, C#, Rust

Go’s compiler checks types at build‑time—no surprise cast panics at runtime. Editors get real‑time autocompletion, and refactors stay safe.

### Compiled Binaries
Feels like: cargo build, C++ make, Java jlink

go build spits out a single, static binary. Drop it on a container or EC2 box—no JVM, no Python venv, no shared‑lib hunt.

### Familiar Data Types
Arrays · Slices · Maps · Structs · Pointers · Interfaces

Slices behave like Vec/lists, maps like dicts/HashMaps, structs like plain old C structs. Pointers exist but without pointer arithmetic; interfaces give you duck typing à la TypeScript or Java’s interfaces.

### Package / Module System
Feels like: Java packages, Python modules, Rust crates

Import paths mirror repo URLs (example.com/user/pkg), and go mod resolves versions—no GOPATH gymnastics since 1.18.

### Errors as Values
Feels like: Rust’s Result<T, E>

Functions return (value, error); you inspect and handle explicitly:

```go
user, err := db.ByID(ctx, id)
if err != nil {
    return nil, fmt.Errorf("lookup user %d: %w", id, err)
}
```

No exceptions for control flow; panics are truly exceptional.

### Built‑in JSON Handling
Feels like: Python’s json module, JavaScript JSON.parse / stringify

json.Marshal and json.Unmarshal live in the stdlib. Struct tags control field names and omitempty rules—zero third‑party libs needed.

### Simple Tooling
Feels like: Cargo’s one‑stop CLI

go fmt, go vet, go test, go run, go mod—everything in one binary. Install, and you’re productive in minutes.

### Rich Standard Library
Feels like: Python’s “batteries included”, .NET BCL

HTTP server, crypto, TLS, template engine, SQL driver scaffolding, even an HTML sanitizer—import paths away.

### First‑Class Concurrency
Feels like: C# async/await, Kotlin coroutines

Goroutines (go fn()) are <4 KB green threads. Channels offer typed message passing; blocking I/O yields the goroutine, not the OS thread.

## Conclusion

"Finding the Familiar" is about recognizing the strengths of Go while leveraging the knowledge you already have from other programming languages. This foundation will set the stage for exploring Go's unique features and best practices in the upcoming posts.
