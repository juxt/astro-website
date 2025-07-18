---
author: 'jey'
title: 'Chapter 1: Database Layer — Wrap pgx/sqlc/GORM Behind Thin Interfaces'
description: 'How to design a database layer that keeps business logic clean, testable, and fast.'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-18'
heroImage: 'abstract-clojure.png'
tags:
  - 'go'
  - 'programming'
  - 'baseplate'
  - 'database'
  - 'pgx'
  - 'sqlc'
  - 'gorm'
---

## Database Layer — Wrap pgx/sqlc/GORM Behind Thin Interfaces

### Goal: Prevent Database Details from Leaking into Business Logic

A well-designed database layer hides query details and makes your domain logic testable without a live database. The key principle is to keep the data access surface **thin and explicit** — no unnecessary abstractions that slow down development.

---

### Base Repository Design with Query Input

A **baseRepo** can define common functionality such as `Get`, `Insert`, `InsertReturnID`, `Delete`, and error wrapping. Each operation takes in a **query string** so that logic is fully flexible and reusable. Consider including **context timeouts** and other safeguards.

```go
package data

import (
    "context"
    "errors"
    "time"
    "github.com/jackc/pgx/v5/pgxpool"
)

type BaseRepo[T any] struct {
    db     *pgxpool.Pool
    mapper func(row RowScanner) (*T, error) // Maps a row to type T
}

type RowScanner interface {
    Scan(dest ...any) error
}

// WrapError standardizes database errors by converting driver errors
// like pgx.ErrNoRows into domain-specific errors such as ErrNotFound.
func (r *BaseRepo[T]) WrapError(err error) error {
    if errors.Is(err, pgx.ErrNoRows) {
        return ErrNotFound
    }
    return err
}

// Get retrieves a single record using the provided query.
// If no rows are found, it returns ErrNotFound (instead of nil) to make
// error handling consistent and explicit.
func (r *BaseRepo[T]) Get(ctx context.Context, query string, args ...any) (*T, error) {
    ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
    defer cancel()

    row := r.db.QueryRow(ctx, query, args...)
    result, err := r.mapper(row)
    if err != nil {
        return nil, r.WrapError(err)
    }
    return result, nil
}

// Insert executes an INSERT statement using the provided query and arguments.
func (r *BaseRepo[T]) Insert(ctx context.Context, query string, args ...any) error {
    ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
    defer cancel()

    _, err := r.db.Exec(ctx, query, args...)
    return r.WrapError(err)
}

// InsertReturnID executes an INSERT statement and returns the generated ID.
func (r *BaseRepo[T]) InsertReturnID(ctx context.Context, query string, args ...any) (int64, error) {
    ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
    defer cancel()

    var id int64
    err := r.db.QueryRow(ctx, query, args...).Scan(&id)
    return id, r.WrapError(err)
}

// Delete executes a DELETE statement using the provided query and arguments.
func (r *BaseRepo[T]) Delete(ctx context.Context, query string, args ...any) error {
    ctx, cancel := context.WithTimeout(ctx, 2*time.Second)
    defer cancel()

    result, err := r.db.Exec(ctx, query, args...)
    if err != nil {
        return r.WrapError(err)
    }
    if result.RowsAffected() == 0 {
        return ErrNotFound
    }
    return nil
}
```

**Things to Think About for Your BaseRepo:**

* **Context Timeouts:** Set reasonable default timeouts (1–3s) for all queries.
* **Insert vs InsertReturnID:** Support both depending on whether you need the generated key.
* **Transaction Management:** Provide a `WithTx` helper to execute multiple statements atomically.
* **Error Normalization:** Convert driver errors (`pgx.ErrNoRows`) into standard domain errors (`ErrNotFound`).
* **Performance:** Keep your mapper functions efficient and avoid unnecessary allocations.
* **Observability:** Add optional logging and metrics to each query (e.g., log slow queries).

---

### Thin Repository Interfaces (Pros/Cons)

**Pros:**
- **Decoupling:** The domain layer depends only on interfaces, not specific database drivers.
- **Testability:** Mock implementations can be injected easily during testing.
- **Clarity:** Forces clear contracts between domain logic and persistence.
- **Flexibility:** Switching between SQL implementations (pgx/sqlc) or moving to another database is simpler.

**Cons:**
- **Boilerplate:** Requires defining and maintaining interfaces and mocks.
- **Over-abstraction risk:** Too many generic interfaces can make the code harder to read.
- **Performance trade-offs:** Interface indirection may have minor runtime costs.

**Rule of Thumb:** Start with a single concrete repo and extract an interface when testing or multiple implementations demand it.

---

### Choosing Between pgx, sqlc, or GORM

#### pgx (Raw SQL)
**Pros:**
- Maximum control over queries.
- Minimal runtime overhead.
- Excellent for performance-critical paths.

**Cons:**
- More verbose — you must hand-write SQL and scan results manually.
- Harder to maintain for large schemas.

#### sqlc (Compile-Time SQL)
**Pros:**
- Type-safe query generation.
- Queries are validated at compile time.
- Eliminates most boilerplate scanning code.

**Cons:**
- Requires SQL files and regeneration when queries change.
- Limited dynamic query building.

#### GORM (ORM Convenience)
**Pros:**
- Quick prototyping — minimal SQL required.
- Active ecosystem with migrations and hooks.
- Good for admin tools or CRUD-heavy applications.

**Cons:**
- Runtime reflection can add overhead.
- Can hide query performance problems.
- Less compile-time safety compared to sqlc.

**Recommendation:** Use sqlc for most production scenarios, pgx for performance-heavy or complex queries, and GORM when you need quick iteration or an admin panel.

---

### Example Usage with a Custom UserRepo

```go
// UserRepo composes BaseRepo for UserRecord and maps to UserDomain.
type UserRepo struct {
    base *data.BaseRepo[UserRecord]
}

func NewUserRepo(db *pgxpool.Pool) *UserRepo {
    return &UserRepo{
        base: &data.BaseRepo[UserRecord]{
            db:     db,
            mapper: userMapper,
        },
    }
}

func (u *UserRepo) GetByID(ctx context.Context, id int64) (*UserDomain, error) {
    rec, err := u.base.Get(ctx, "SELECT id, name, email FROM users WHERE id=$1", id)
    if err != nil {
        return nil, err
    }
    return &UserDomain{ID: rec.ID, Name: rec.Name, Email: rec.Email}, nil
}
```

### Avoiding Over-Engineering

* Keep `BaseRepo` focused on shared functionality (error wrapping, CRUD primitives).
* Avoid bloating it with domain-specific queries.
* Maintain consistent error types (`ErrNotFound`, `ErrConflict`) across repositories.
* Use `ctx` timeouts to avoid runaway queries.
