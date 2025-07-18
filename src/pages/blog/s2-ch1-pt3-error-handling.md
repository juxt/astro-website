---
author: 'jey'
title: 'Chapter 1: Error Handling — Structured, Context-Aware Errors'
description: 'How to treat errors as data, not just strings, for robust Go services.'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-18'
heroImage: 'abstract-clojure.png'
tags:
  - 'go'
  - 'programming'
  - 'baseplate'
  - 'error handling'
---

## Error Handling — Structured, Context-Aware Errors

### Goal: Treat Errors as Data, Not Just Strings

**Pros:**
- Observability: Errors with codes, context, and metadata are easier to track, log, and alert on.
- Debuggability: Structured errors make it simple to trace failures across layers and correlate with logs/metrics.
- Consistency: Enforces a unified error handling approach across the codebase.
- User Experience: Enables safe, user-facing messages and retry hints.
- Testability: Error types and codes can be asserted in tests, not just string matching.

**Cons:**
- Boilerplate: Requires more code to define error types, builders, and factories.
- Complexity: Can be overkill for small projects or simple flows.
- Maintenance: Adding new error codes or fields means updating multiple places.

---

In production-grade Go systems, **errors should carry structured information** — like error codes, retry hints, and user-facing messages — instead of being plain strings. Treating errors as data improves observability, simplifies debugging, and enforces consistency across layers.

---

### Base Error with Builders

A reusable **AppError** forms the foundation for all error types. Builders and chaining methods make error creation and enrichment consistent and easy.

```go
package errs

type ErrorCode string

const (
    ErrCodeNotFound   ErrorCode = "NOT_FOUND"
    ErrCodeConflict   ErrorCode = "CONFLICT"
    ErrCodeInternal   ErrorCode = "INTERNAL_ERROR"
    ErrCodeBadRequest ErrorCode = "BAD_REQUEST"
)

type AppError struct {
    Code        ErrorCode
    Message     string // Developer-oriented message
    UserMessage string // Optional, safe-to-expose message
    Retryable   bool   // Should the caller retry?
    Err         error  // Wrapped error (root cause)
}

func (e *AppError) Error() string     { return string(e.Code) + ": " + e.Message }
func (e *AppError) Unwrap() error     { return e.Err }
func (e *AppError) IsRetryable() bool { return e.Retryable }
func (e *AppError) UserMsg() string {
    if e.UserMessage != "" {
        return e.UserMessage
    }
    return "Something went wrong."
}

func New(code ErrorCode, msg string) *AppError {
    return &AppError{Code: code, Message: msg}
}

func (e *AppError) WithUserMessage(um string) *AppError {
    e.UserMessage = um
    return e
}

func (e *AppError) WithRetryable(retry bool) *AppError {
    e.Retryable = retry
    return e
}

func (e *AppError) Wrap(err error) *AppError {
    e.Err = err
    return e
}
```

---

### Suggestions for Layer-Specific Error Structs

Each layer (DB, Domain, Service, Handler) embeds `*AppError` but adds metadata fields that are meaningful to that layer.

#### DbError

```go
package db

type DbError struct {
    *errs.AppError
    Type   string      // e.g., "INSERT", "SELECT", "UPDATE"
    Query  string      // SQL query text (optional, sanitized)
    Params interface{} // sanitized params for logs (omit sensitive data)
    DBName string      // database name or identifier
    Host   string      // DB host (useful for distributed systems)
}
```

#### DomainError

```go
package domain

type DomainError struct {
    *errs.AppError
    Aggregate string // which aggregate/entity failed, e.g., "Order", "User"
    Action    string // business action, e.g., "Validate", "CalculateTax"
    State     string // optional: state of the entity when error occurred
}
```

#### ServiceError

```go
package service

type ServiceError struct {
    *errs.AppError
    ServiceName string        // microservice or internal service name
    Operation   string        // e.g., "FetchOrders", "ProcessPayment"
    Payload     interface{}   // optional: sanitized input data
    Latency     time.Duration // optional: duration before failure
}
```

#### HandlerError

```go
package handler

type HandlerError struct {
    *errs.AppError
    Endpoint    string      // API endpoint or route
    Method      string      // HTTP method (GET, POST, etc.)
    RequestID   string      // unique request identifier
    StatusHint  int         // suggested HTTP status code (fallback mapping)
    Params      interface{} // optional: sanitized request parameters
}
```

---

### Suggested Directory Layout

For each of the four error layers:

```
errors/<layer>/
  ├── consts.go        // error codes or action types (e.g., INSERT, VALIDATE)
  ├── error.go         // struct definition with AppError embedding + fields
  └── constructors.go  // easy factories like NewInsertErr, NewDomainValidationErr
```

---

### Template for Each Layer

**errors/db/consts.go**

```go
package db

const (
    DBErrInsert = "DB_ERR_INSERT"
    DBErrSelect = "DB_ERR_SELECT"
    DBErrUpdate = "DB_ERR_UPDATE"
)
```

**errors/db/error.go**

```go
package db

type DbError struct {
    *errs.AppError
    Type   string
    Query  string
    Params interface{}
    DBName string
    Host   string
}
```

**errors/db/constructors.go**

```go
package db

import "your_project/internal/errs"

func NewInsertErr(query string, params interface{}, err error) *DbError {
    return &DbError{
        AppError: errs.New(errs.ErrCodeInternal, "insert operation failed").Wrap(err),
        Type:     "INSERT",
        Query:    query,
        Params:   params,
    }
}
```

The same pattern can be applied to **domain**, **service**, and **handler** with their specific fields and error codes.

---

### Example Factory for DomainError

```go
package domain

func NewValidationErr(entity, state string, err error) *DomainError {
    return &DomainError{
        AppError: errs.New(errs.ErrCodeBadRequest, "validation failed").Wrap(err),
        Aggregate: entity,
        Action:    "Validate",
        State:     state,
    }
}
```

---

### When to Wrap vs. Annotate Errors

* **Wrap:** Add context but preserve the root cause, e.g., `return db.NewInsertErr("insert failed", query, params, err)`.
* **Annotate:** Add log/trace context without modifying the error structure.

**Rule of Thumb:** Wrap errors when crossing package or layer boundaries.

---

### Benefits of Layered Errors

* Clear separation of concerns per layer.
* Unified structure through `AppError` but with layer-specific fields.
* Easy mapping to API responses, metrics, and logs.
