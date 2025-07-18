---
author: 'jey'
title: 'Part 1: Adapter, Repository, Factory & Builder Patterns'
description: 'Pragmatic patterns for decoupling, testability, and safe construction in Go'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-17'
heroImage: 'abstract-clojure.png'
tags:
  - 'go'
  - 'programming'
  - 'patterns'
  - 'adapter'
  - 'repository'
  - 'factory'
  - 'builder'
---

# Adapter Pattern

Wrap external dependencies (like `*sql.DB`, HTTP clients, or third-party APIs) behind interfaces. This decouples your domain logic from implementation details, making it easy to mock, swap, or upgrade components without rewriting your core logic.

**Example:**
```go
// Define an interface for your dependency
 type UserStore interface {
     GetUser(ctx context.Context, id int) (*User, error)
 }

// Wrap the real implementation
 type SQLUserStore struct {
     db *sql.DB
 }

 func (s *SQLUserStore) GetUser(ctx context.Context, id int) (*User, error) {
     // ... SQL logic ...
 }
```

**Benefits:**
- Decouples business logic from infrastructure
- Enables mocking for tests
- Makes swapping implementations trivial
- **Why it helps you write Go fast:** You can start with a quick, concrete implementation and refactor to an interface later—no need to over-abstract up front. When requirements change, you swap out dependencies with minimal code churn. Testing is faster because you can mock dependencies easily, so you get feedback sooner.

# Repository Pattern

Encapsulate persistence logic behind narrow interfaces. This keeps SQL/ORM concerns out of your business logic and supports cleaner, more focused unit tests.

**Example:**
```go
// Domain logic depends on the interface, not the DB
func GetProfile(ctx context.Context, store UserStore, id int) (*Profile, error) {
    user, err := store.GetUser(ctx, id)
    // ...
}
```

**Benefits:**
- Keeps persistence details out of core logic
- Supports dependency injection and testability
- **Why it helps you write Go fast:** You can stub or swap your data layer instantly for tests, demos, or new backends. You avoid tangling business logic with SQL, so changes are isolated and less risky. This means faster iteration and less time spent untangling code later.

# Factory Functions (`NewThing(...)`)

Use named constructors instead of exposing raw structs. Factory functions centralize initialization, enforce safe defaults, and promote explicit dependency injection.

**Example:**
```go
type Service struct {
    client *http.Client
    logger Logger
}

func NewService(client *http.Client, logger Logger) *Service {
    return &Service{client: client, logger: logger}
}
```

**Benefits:**
- Centralizes setup logic
- Prevents partially-initialized structs
- Makes dependencies explicit
- **Why it helps you write Go fast:** You avoid bugs from missing fields and can change defaults in one place. New team members can spin up working code quickly, and you can inject test doubles or mocks without rewriting your code. 

# Fluent Builders (for complex config)

For complex configuration, use chained methods like `.WithX()`, `.SetY()`, and call `.Build()` at the end. Avoid for simple use cases—prefer literals or factory functions when possible.

**Example:**
```go
type ServerBuilder struct {
    port int
    tls  bool
}

func (b *ServerBuilder) WithPort(port int) *ServerBuilder {
    b.port = port
    return b
}
func (b *ServerBuilder) EnableTLS() *ServerBuilder {
    b.tls = true
    return b
}
func (b *ServerBuilder) Build() *Server {
    return &Server{port: b.port, tls: b.tls}
}

// Usage:
server := new(ServerBuilder).WithPort(8080).EnableTLS().Build()
```

**Benefits:**
- Makes complex setup readable and maintainable
- Avoids giant constructors with many parameters
- **Why it helps you write Go fast:** You can add new config options without breaking old code, and you avoid huge, error-prone constructors. Builders let you prototype quickly and refactor later, so you can get something working now and polish it when you have time.

**Caution:**
- Don't overuse—builders add complexity. For simple structs, stick to literals or factory functions.
