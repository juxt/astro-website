---
author: 'jey'
title: 'Chapter 2: DTO → Domain → Record — Keep Data Shapes Honest'
description: 'How to decouple API, business logic, and persistence for maintainable Go services.'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-18'
heroImage: 'abstract-clojure.jpg'
tags:
  - 'go'
  - 'programming'
  - 'baseplate'
  - 'dto'
  - 'domain'
  - 'record'
---

## DTO → Domain → Record — Keep Data Shapes Honest

### Goal: Decouple API Shapes, Core Logic, and Persistence

Your system should define **clear boundaries** between how data enters (DTO), how it is processed and understood (Domain), and how it is persisted (Record). This separation prevents coupling between API changes, internal business rules, and database schema adjustments.

---

### What Each Struct Is For

#### DTO (Data Transfer Object)

* **Purpose:** Represents the shape of data coming into or leaving your service. It’s an external contract — for example, JSON payloads for REST APIs, messages for gRPC, or any serialized data format.
* **Validation:** DTOs must be validated immediately at the boundary layer. Type constraints and business rules (e.g., email must be valid, name must not be empty) are enforced here.
* **Key Principle:** Treat DTOs as *untrusted* input. They should never be passed directly into domain logic without validation and mapping.
* **Examples:**
  * For HTTP APIs, DTOs match JSON payloads.
  * For gRPC, DTOs are generated from protobuf definitions.
  * Each endpoint or external interface may have its own DTO shape.

**Example:**

```go
type CreateUserRequest struct {
    Name  string `json:"name" validate:"required,min=3"`
    Email string `json:"email" validate:"required,email"`
}
```

---

#### Domain

* **Purpose:** Encapsulates **business rules and core logic**. Domain models should be stable and independent of both transport and database details.
* **Structure:** The domain object describes how the entity behaves (methods, state transitions) rather than its database fields.
* **Validation:** Domain validation is often **state-dependent**. For example:
  * A `UserDomain` object without an ID might be valid when constructed from a `CreateUserRequest`.
  * The same object might be invalid when coming from a database query if the ID is missing.
* **Service Layer:** A service layer is often responsible for enforcing state-based validation before persisting or returning domain objects.

**Example:**

```go
type UserDomain struct {
    ID    int64  // May be zero when creating a new user.
    Name  string
    Email string
}

func (u UserDomain) IsValidForInsert() bool {
    return u.Name != "" && u.Email != ""
}

func (u UserDomain) IsValidForUpdate() bool {
    return u.ID > 0 && u.Name != "" && u.Email != ""
}

func (u UserDomain) IsValidForRead() bool {
    return u.ID > 0
}
```

---

#### Record

* **Purpose:** Represents how data is **persisted in the database**. The Record struct mirrors database table columns.
* **Persistence Behavior:** A Record struct should be able to be inserted or updated into the database without assumptions about business logic.
* **Design Choices:**
  1. **Single Large Struct:** All fields are included for every DB operation. Simple but less flexible for partial inserts.
  2. **Multiple Small Structs:** Define separate structs for specific queries, e.g., `UserInsertRecord`, `UserSelectRecord`, `UserUpdateRecord`.
* **Tags:** Use **only `db` tags** to map fields to columns. **Never use `json` tags** on Record structs since they are not meant for API serialization.

**Example:**

```go
type UserRecord struct {
    ID    int64  `db:"id"`
    Name  string `db:"name"`
    Email string `db:"email"`
}
```

**Note:** **Do not add JSON tags to Record structs** — API concerns should never leak into the persistence layer.

---

### Why You Never Pass Raw Request Structs into Domain Logic

* **Validation & Sanitization:** DTOs are untrusted and need strict validation.
* **API Evolution:** Adding or removing fields in the DTO should not break domain logic.
* **Security:** Prevent leaking database or internal business logic fields back to the client.
* **Testing:** Domain logic tests should remain unaffected by changes in the API or database.

**Bad Example:**

```go
func CreateUser(dto CreateUserRequest) error {
    return userRepo.Insert(dto) // tightly coupled
}
```

**Good Example:**

```go
func (svc *UserService) CreateUser(input UserDomain) error {
    if !input.IsValidForInsert() {
        return errors.New("invalid user domain state")
    }
    record := userMapper.DomainToRecord(input)
    return userRepo.Insert(record)
}
```

---

### Detailed UserService Example

Below is an example service that handles **Create**, **Update**, and **Read** operations with proper DTO validation, domain state checks, and mapping to records.

```go
package service

import (
    "context"
    "errors"
    "strings"
    "your_project/internal/dto"
    "your_project/internal/domain"
    "your_project/internal/repo"
)

type UserService struct {
    repo repo.UserRepository
}

// Create a new user.
func (s *UserService) CreateUser(ctx context.Context, request dto.CreateUserRequest) (int64, error) {
    // 1. Validate DTO
    if err := request.Validate(); err != nil {
        return 0, err
    }

    // 2. Map to domain
    userDomain := domain.UserDomain{
        Name:  strings.TrimSpace(request.Name),
        Email: request.Email,
    }

    // 3. Domain validation
    if !userDomain.IsValidForInsert() {
        return 0, errors.New("user domain object is invalid for insert")
    }

    // 4. Map to record and insert
    record := repo.UserRecord{
        Name:  userDomain.Name,
        Email: userDomain.Email,
    }
    return s.repo.Insert(ctx, record)
}

// Update an existing user.
func (s *UserService) UpdateUser(ctx context.Context, user domain.UserDomain) error {
    // 1. Domain validation
    if !user.IsValidForUpdate() {
        return errors.New("user domain object is invalid for update")
    }

    // 2. Map to record and update
    record := repo.UserRecord{
        ID:    user.ID,
        Name:  user.Name,
        Email: user.Email,
    }
    return s.repo.Update(ctx, record)
}

// Read an existing user by ID.
func (s *UserService) GetUser(ctx context.Context, id int64) (domain.UserDomain, error) {
    record, err := s.repo.GetByID(ctx, id)
    if err != nil {
        return domain.UserDomain{}, err
    }

    domainObj := domain.UserDomain{
        ID:    record.ID,
        Name:  record.Name,
        Email: record.Email,
    }
    if !domainObj.IsValidForRead() {
        return domain.UserDomain{}, errors.New("invalid state of user record")
    }
    return domainObj, nil
}
```

---

### Mapping Strategies (Manual vs Code Generation)

* **Manual Mapping:**
  * More verbose but gives complete control over transformations.
  * Easier to add domain-specific logic (e.g., trimming whitespace or normalizing email).
* **Code Generation:**
  * Reduces boilerplate for large systems.
  * Tools like `go:generate`, `sqlc`, or custom codegen can auto-map DTOs to domain structs.
  * Less flexible for non-trivial field conversions.

**Recommendation:** Start with manual mappers until the patterns stabilize, then consider automating.

---

### Example of DTO → Domain → Record Mapping

```go
func DtoToDomain(dto CreateUserRequest) UserDomain {
    return UserDomain{Name: strings.TrimSpace(dto.Name), Email: dto.Email}
}

func DomainToRecord(domain UserDomain) UserRecord {
    return UserRecord{Name: domain.Name, Email: domain.Email}
}
```

---

### Versioning of DTOs vs Domain Models

* **DTOs evolve faster:** APIs change frequently, so add versioned DTOs (`v1`, `v2`) when breaking changes occur.
* **Domain Models remain stable:** Business rules change less frequently and should avoid versioned chaos.
* **Records mirror persistence:** DB migrations may change record structure, but the domain and DTOs should be adapted through mapping layers.

**Example:**

```
/api/v1/user -> UserV1DTO -> UserDomain -> UserRecord
/api/v2/user -> UserV2DTO -> UserDomain -> UserRecord
```

---

### Things to Think About

* Validate data at **multiple layers:** DTO validation at the boundary, and domain state validation inside the service layer.
* Decide early on **record design strategy:** single struct vs multiple query-specific structs.
* Maintain **unit tests for mappers** to ensure transformations remain correct.
* Keep **validation logic** localized: DTO validation for external inputs, domain validation for internal consistency.
* Never mix **API concerns** (e.g., JSON tags) with persistence models.

---
