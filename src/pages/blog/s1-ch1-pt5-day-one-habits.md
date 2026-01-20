---
author: 'jey'
title: 'Chapter 1 - Part 5: Day-One Habits'
description: 'Best practices for starting strong with Go'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-08-18'
heroImage: 'abstract-clojure.jpg'
tags:
  - 'go'
  - 'programming'
  - 'best practices'
---

The final chapter in our Foundations series distils the best day‑one habits I teach every new Go hire. Each tip is intentionally bite‑sized: copy, paste, move on.

## 1 · Keep the Folder Flat

Start with just `main.go` and `go.mod`. Add sub‑packages only when duplication forces your hand.

```
my‑service/
  ├─ go.mod
  ├─ main.go
  └─ README.md
```

Why: Shallow trees cut import churn and merge conflicts. Grow `internal/` or `pkg/` later.

## 2 · Trust the Built‑In Tooling

| Task   | Command          |
|--------|------------------|
| Run app | `go run ./...`  |
| Format | `go fmt ./...`   |
| Test   | `go test ./...`  |
| Vet    | `go vet ./...`   |

Skip custom Makefiles until you truly need them.

## 3 · Check Errors Immediately

Never ignore the returned error.

```go
if err := svc.Start(); err != nil {
    log.Fatal(err)
}
```

Either handle or propagate—no silent `_ = fn()`.

## 4 · Pass `context.Context` First

Any function that can block or hit the network should start with `ctx`.

```go
func FetchUser(ctx context.Context, id int) (*User, error) { … }
```

Enables cancel, timeout, tracing, metrics.

## 5 · Concrete Types First, Interfaces Later

Implement logic against real structs. Extract an interface only when a second implementation appears.

Smells to watch: `FooService` interface on day zero, no mocks or alt impls in sight.

## 6 · Initialise Collections Explicitly

Slices, maps, channels have write‑unsafe zero values.

```go
users := make([]User, 0, 100)
cache := make(map[string]*Item)
```

## 7 · Lint Early, Format Always

Add to `go.tools` (VS Code) or run manually:

```bash
go vet ./...
# optional mega‑linter
curl -sSfL https://raw.githubusercontent.com/golangci/golangci‑lint/master/install.sh | sh -s -- -b $(go env GOPATH)/bin v1.56.0
golangci‑lint run ./...
```

Use `goimports` to auto‑add/remove imports on save.

## 8 · Pick One Structured Logger and Commit

`zap` for raw speed, `zerolog` for fewer deps—both JSON‑native.

```go
log := zerolog.New(os.Stdout).With().Timestamp().Logger()
```

Standardise the format early; grep and dashboards thank you later.

## 9 · Write Small, Focused Unit Tests

Keep tests fast (<2 s). Mock only meaningful collaborators.

```go
func TestPriceWithDiscount(t *testing.T) {
    got := PriceWithDiscount(100, 0.1)
    want := 90
    if got != want { t.Errorf("got %d want %d", got, want) }
}
```

Integration tests have value—just not in your save loop.

## Pocket Checklist

- Flat folder, two files.
- Built‑ins: run, fmt, test, vet.
- Always check error.
- `context` goes first.
- Concrete > interface.
- `make` collections.
- `go vet` + `golangci‑lint`.
- One logger → everywhere.
- Unit tests under two seconds.


