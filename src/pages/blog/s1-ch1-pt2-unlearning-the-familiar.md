---
author: 'jey'
title: 'Chapter 1 - Part 2: Unlearning the Familiar'
description: 'Habits that trip newcomers to Go and their idiomatic fixes'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-28'
heroImage: 'abstract-clojure.png'
tags:
  - 'go'
  - 'programming'
  - 'idiomatic'
---

In Part 1 we mapped everything that felt comfortable. Today we pivot: these are the habits that trip newcomers—especially if you’re fluent in an object‑oriented language. Each section shows the pitfall, the why, and the idiomatic fix with runnable snippets.

## 1 · Overusing Inheritance (Struct Embedding ≠ Inheritance)

### The Pitfall

Java & C# reflex: reach for `extends` to share behaviour. Go only offers struct embedding, which is composition, not hierarchy.

```java
// Java — deep hierarchy
class Animal { void speak() {} }
class Dog extends Animal {
    @Override void speak() { System.out.println("Woof"); }
}

// Go — WRONG: expect polymorphic override
type Animal struct{}
func (Animal) Speak() { fmt.Println("...") }

type Dog struct{ Animal } // embeds but **does not** override
func (Dog) Speak() { fmt.Println("woof") }

var a Animal = Dog{} // dispatch is static → prints "...", not "woof"
```

### The Fix

Keep structs flat and hide swap‑able behaviour behind small interfaces:

```go
type Speaker interface { Speak() }

type Dog struct{}
func (Dog) Speak() { fmt.Println("woof") }

func Greet(s Speaker) { s.Speak() }
```

## 2 · Misusing Interfaces (Bigger ≠ Better)

### Common Mistakes

- Creating a 12‑method “kitchen‑sink” interface just in case.
- Declaring interfaces in the consumer package instead of the provider.

### Idiom

```go
// good.go
package pay

type Payer interface { Charge(cents int) error }  // tiny, purpose‑built
```

Small interfaces improve mocking and swap‑ability.

## 3 · Getters, Setters & Constructor Fanfare

### Excessive Getters/Setters

Skip boilerplate unless you need validation or locking.

```go
// ✅ idiomatic
user.Name = "Ada"
```

### Constructors

No language‑level constructors, no overloads. Use a factory when you must enforce invariants:

```go
func NewCache(cap int) *Cache {
    return &Cache{items: make(map[string]string, cap)}
}
```

## 4 · Pointer vs Value Receivers

### The Pitfall

Mixing receiver kinds silently splits the method set and breaks interface satisfaction.

```go
// BUG: value + pointer receivers mixed
func (f Foo)      Do() {}
func (f *Foo)     Close() {}
```

### The Fix

Choose:

- Pointer receivers for mutable or large structs (most cases).
- Value receivers for small, immutable types (e.g., `time.Time`‑like).

## 5 · Visibility by Capitalisation

Go has two visibilities:

- exported (public) → identifiers start with uppercase.
- unexported (package‑private) → lowercase.

No `protected`, `private`, or `friend` keywords to juggle.

## 6 · Panics Are Not Exceptions

`panic` unwinds the stack and is recoverable only with `recover`, but normal control flow should return error values.

```go
if err := cfg.Load(); err != nil {
    return fmt.Errorf("load config: %w", err)
}
```

Reserve `panic` for truly unrecoverable situations (e.g., corrupt in‑memory state).

## 7 · Goroutine Management & Context Propagation

### Unbounded Goroutines

They’re cheap, not free. Always cancel or wait.

```go
ctx, cancel := context.WithTimeout(context.Background(), time.Second)
defer cancel()

wg.Add(1)
go func() {
    defer wg.Done()
    select {
    case <-work:
    case <-ctx.Done():
    }
}()
wg.Wait()
```

### Ignoring `context.Context`

First parameter, short‑lived, cancellation signal. Pass it down; don’t store it.

## 8 · Premature Package Nesting

### The Pitfall

Common reflex: mirror domain hierarchy day one (`pkg/service/user/handler/v1/...`). Go projects start flat: `cmd/`, `internal/`, and maybe `pkg/` later.

### The Fix

Refactor when duplication, not when imagination, demands it.

## Cheat‑Sheet Recap

| Habit to Unlearn         | One‑Line Fix                          |
|--------------------------|---------------------------------------|
| Inheritance trees        | Composition + small interfaces        |
| Monster interfaces       | Slice them small (`io.Reader`‑style) |
| Getters/setters mania    | Expose fields until validation needed |
| Constructors             | Use `NewThing()` factory or plain struct literal |
| Mixed receivers          | Stick to pointer unless immutable + tiny |
| Panic as flow            | Return error values                  |
| Fire‑and‑forget goroutines | Propagate context + waitgroups       |
| Deep package trees       | Stay flat; grow later                |

Tape the table next to your monitor; it blocks 80 % of rookie mistakes.
