---
author: 'jey'
title: 'Chapter 1: Logging, Config, and Metrics — Consistency Beats Cleverness'
description: 'How to standardize logging, configuration, and metrics for a robust Go baseplate.'
category: 'go'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2025-07-18'
heroImage: 'abstract-clojure.jpg'
tags:
  - 'go'
  - 'programming'
  - 'baseplate'
  - 'logging'
  - 'config'
  - 'metrics'
---

## Logging, Config, and Metrics — Consistency Beats Cleverness

A robust baseplate begins with three foundational concerns: **logging**, **configuration**, and **metrics**. These components often determine whether your system is debuggable, observable, and adaptable under pressure.

### Why Consistency Matters

* **Uniformity:** When every service logs and emits metrics the same way, incident response is faster because patterns are predictable.
* **Simplicity:** Choosing one logging library or config system upfront avoids “helper drift” and reduces maintenance.
* **Scalability:** Observability scales with standardized metrics naming and log structures.

### Logging

**Goal:** Structured, context-aware logs that work locally and in production.

**Recommended Libraries:**

**Zerolog**

* **Pros:**
  * Extremely low allocation and fast.
  * JSON logs by default, great for machine parsing.
  * Simple chaining API.
* **Cons:**
  * Less flexible for dynamic log structures.
  * Can feel verbose compared to traditional logging.

**Zap**

* **Pros:**
  * High-performance, widely adopted.
  * Rich ecosystem, especially useful if your stack uses Uber's tooling.
  * Flexible structured logging.
* **Cons:**
  * Slightly more complex configuration compared to Zerolog.
  * Larger dependency footprint.

**slog (Go 1.21+)**

* **Pros:**
  * Standard library solution — no external dependency.
  * Built-in structured logging with strong future support.
  * Interoperates well with `context` and OpenTelemetry.
* **Cons:**
  * Still new; ecosystem (handlers, integrations) is maturing.
  * Not as battle-tested for high-throughput as Zap or Zerolog.

**OpenTelemetry (Otel) Logging**

* **Pros:**
  * Unified standard for logging, metrics, and tracing.
  * Seamlessly integrates logs with distributed traces.
  * Rich tooling and exporters (e.g., OTLP, Jaeger).
* **Cons:**
  * More complex setup compared to simple loggers.
  * Requires a collector or backend to be fully useful.
  * Slight performance overhead if not tuned correctly.

**Best Practices:**

* Include **contextual fields** (request IDs, user IDs, correlation IDs).
* Use a **global logger** for simplicity, but allow **injection** in testable packages.
* Define **log levels** (debug, info, warn, error) and enforce them consistently.
* Consider using **OpenTelemetry log pipelines** if you already leverage tracing.

**Example:**

```go
logger := zerolog.New(os.Stdout).With().Timestamp().Logger()
logger.Info().Str("service", "user-api").Msg("service started")
```

---

### Configuration

**Goal:** One source of truth for all runtime configuration.

**Recommended Libraries:**

* **Viper:** Flexible config loader supporting JSON, YAML, ENV, and live reloading.
* **koanf:** Lightweight alternative for layered configs.

**Best Practices:**

* **Load once** at startup and inject via `struct` or context.
* Use **environment variables** for secrets or containerized deployments.
* Consider **hot reload** for feature flags or dynamic updates.

**Example:**

```go
v := viper.New()
v.SetConfigName("config")
v.AddConfigPath("./configs")
if err := v.ReadInConfig(); err != nil {
    panic(err)
}
port := v.GetInt("http.port")
```

---

### Metrics

**Goal:** Observability through consistent, low-cardinality metrics.

**Recommended Library:**

* **Prometheus client_golang** (industry standard).

**Best Practices:**

* Define **clear metric names**: `http_requests_total`, `db_query_duration_seconds`.
* Keep **label cardinality low**—avoid unbounded values like user IDs.
* Include **histograms** for latency, **counters** for events, and **gauges** for states.

**Example:**

```go
httpRequests := prometheus.NewCounterVec(
    prometheus.CounterOpts{
        Name: "http_requests_total",
        Help: "Total number of HTTP requests.",
    },
    []string{"method", "path"},
)

prometheus.MustRegister(httpRequests)
```

---

### Operational Tips

* **Tie logs and metrics:** Use the same request ID across logs and Prometheus labels for correlation.
* **Expose `/metrics` endpoint:** Standard Prometheus scraping target.
* **Ship logs to ELK, Loki, or Otel pipeline:** JSON logs are machine-parsable and ready for search.
* **Integrate OpenTelemetry:** If your system uses tracing, emit logs with trace IDs to unify observability.