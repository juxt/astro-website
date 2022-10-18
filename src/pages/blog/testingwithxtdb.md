---
author: 'pws'
title: 'Testing Against XTDB'
description: 'Faster, Simpler and more reliable'
category: 'xtdb'
layout: '../../layouts/BlogPost.astro'
publishedDate: '04 May 2022'
heroImage: 'testing-with-xtdb.jpg'
---

# Introduction

Testing pure functions is straightforward but most applications need to
persist state.

Traditionally, testing against a database introduces some incidental
complexities that, while acceptable for a while, can become major
problems as applications grow to a significant size:

- The database is an extra dependency to manage during setup.

- The test suite is slowed down when managing external database state.

- Database state needs to be reset between each test to maintain test
  isolation.

- Care is needed running tests in parallel to avoid tests affecting
  each other inadvertently.

Common strategies to avoid these problems include:

- Use of a Data Access Layer to abstract away calls to an external
  database.

- Using mocks to assert that the correct calls were made.

- Using a _similar_ in-memory database and relying on the SQL
  implementations to behave the same way.

- Having fewer _integration_ tests that confirm basic functionality of
  the data layer.

However, there are drawbacks to using these strategies:

- Test accuracy is compromised as critical sections of code are not
  covered by unit tests.

- The ability to use database specific features is sacrificed when
  limiting code to a subset of SQL.

- Decisions need to be made on what to test at unit or integration
  level.

- The temptation to use more _reliable_ integration tests can
  eventually lead to the situation where the test suite becomes the
  bottleneck in Continuous Integration.

However, there are databases that don't have these limitations. Our
database, [XTDB](https://xtdb.com/), allows you to avoid these
complexities and also provides some interesting _time travel_ abilities.

We'll talk about how XTDB provides consistent behaviour with swappable
backends (including in-memory storage), time-travelling tests, the
ability to reproduce bugs by trivially testing against specific database
snapshots, bisecting our data's history, and efficiently executing tests
with many assertions without writing the results to disk.

## Consistent behaviour with Different Storage Backends

The [architecture](https://docs.xtdb.com/concepts/what-is-xtdb/) of XTDB
allows for seamless swapping of storage backends with no change to the
query and transaction APIs. Using the in-memory backend for tests
provides a consistent feedback loop without the risk of tests grinding
to a halt in the future.

Call `xt/start-node` with empty an options map `{}` to start an
in-memory node:

```clojure
(ns xtdb-test
  (:require [xtdb.api :as xt]))

(time
    (with-open [node (xt/start-node {})]
      (xt/await-tx node
                   (xt/submit-tx
                     node
                     [[::xt/put {:xt/id "account1" :balance 100}]]))))
"Elapsed time: 9.958169 msecs"
; => #:xtdb.api{:tx-time #inst"2022-03-09T10:00:42.245-00:00", :tx-id 0}
```

## Testing behaviour across time

Tests may need to make assertions on a system at different dates and
times. As XTDB is a
[bitemporal](https://martinfowler.com/articles/bitemporal-history.html)
Database it provides the ability to write and query data \"as of\"
different times in its API. This greatly simplifies application code
handling time.

Data can be transacted with `valid time` arguments, signifying when the
data is visible in the system.

A consistent query across all the data can be made at any arbitrary
point in time (between the year 0 and 9999).

In the fictional example below, account holders are given a bonus of 2%
of their current balance at the start of every year. There is also a
\"bonus funds\" account that the amount is transferred from.

The `transfer-bonus` [transaction
function](https://docs.xtdb.com/language-reference/1.20.0/datalog-transactions/#transaction-functions)
retrieves the current balance of the recipient account at the
`valid time` and updates it by 2%, deducting the same amount from the
funds account.

In the test, `transfer-bonus` is called twice at the start of 2023 and
2024 and the test asserts that two accounts will balance after these
future events.

```clojure
(ns xtdb-test
  (:require [xtdb.api :as xt]
            [clojure.test :refer :all]))

(defn transact-sync [node data]
  (xt/await-tx node (xt/submit-tx node data)))

(defn insert-transaction-fn [node]
  (transact-sync
      node
     [[::xt/put
       {:xt/id :transfer-bonus
        :xt/fn '(fn [ctx recipient-id valid-time]
                  (let [db (xtdb.api/db ctx {::xt/valid-time valid-time})
                        bonus-funds-account (xtdb.api/entity db "bonus-funds")
                        recipient (xtdb.api/entity db recipient-id)
                        bonus (* (:balance recipient) 0.02)]
                    [[::xt/put (update recipient :balance #(+ % bonus)) valid-time]
                     [::xt/put (update bonus-funds-account :balance #(- % bonus)) valid-time]]))}]]))

(defn insert-accounts [node]
  (transact-sync
      node
     [[::xt/put {:xt/id "bonus-funds" :balance 1000} #inst "2020-01-01T00:00:00"]
      [::xt/put {:xt/id "account1" :balance 100} #inst "2020-01-01T00:00:00"]]))

(deftest transfer-bonus-balanced
  (with-open [node (xt/start-node {})]
    (insert-accounts node)
    (insert-transaction-fn node)
    (let [year-start-2023 #inst "2023-01-01T00:00:00"
          year-start-2024 #inst "2024-01-01T00:00:00"]
      (transact-sync
          node
          [[::xt/fn :transfer-bonus "account1" year-start-2023]
           [::xt/fn :transfer-bonus "account1" year-start-2024]]))
      (let [db (xt/db node {::xt/valid-time year-start-2024})]
        (is (= (float (+ 100 1000))
               (+ (:balance (xt/entity db "account1"))
                  (:balance (xt/entity db "bonus-funds"))))))))
```

## Git Checkout and Git Bisect for data

XTDB records all previous states of the database similarly to how Git
records all versions of a code repository.

Calling `xt/db` with a transaction id is the equivalent of
`git checkout <commit-hash>` for your data.

```clojure
(xt/db node {:xtdb.api/tx {::xt/tx-id transaction-id}})
```

If you are looking for the point at which a bug was introduced to your
Git repo, you may reach for [git
bisect](https://git-scm.com/docs/git-bisect). It allows you to run a
test across the previous versions of a codebase to find the failure
point.

XTDB allows you to programmatically switch to any previous state of the
database. Therefore, it is possible to replicate the behaviour of
`git bisect` but bisecting the state of the data rather than the code.

In this example, the boolean `:true-equals-false?` is just a placeholder
for a more realistic assertion used to check the consistency of data.
The predicate function passed into `bisect` \"checks out\" the database
at the midpoint of a range of transactions.

If the predicate fails then we know the issue started later, if it
passes, earlier. By recurring, bisect quickly finds the exact
transaction where the issue started.

```clojure
(ns xtdb-test
  (:require [xtdb.api :as xt]))

(defn bisect [pred low high]
  (if (< low high)
    (let [mid (quot (+ low high) 2)]
      (if (pred mid)
        (recur pred low mid)
        (recur pred (inc mid) high)))
    low))

(with-open [node (xt/start-node {})]
  ; submit 50 transactions
  (let [bug-introduced-at (rand-int 50)]
    (doseq [n (range 50)]
      (transact-sync
        node
        [[::xt/put {:xt/id "foo" :true-equals-false? (>= n bug-introduced-at)}]]))))
  (bisect (fn [cut-at]
            (:true-equals-false? (xt/entity (xt/db node {:xtdb.api/tx {::xt/tx-id cut-at}}) "foo")))
          0
          (::xt/tx-id (xt/latest-completed-tx node))))
```

The persistent nature of XTDB makes it possible to cheaply capture the
state of a database in bug reports. It might even be reasonable to make
a [snapshot](https://docs.xtdb.com/administration/checkpointing/) of the
database available on CI and use it to create failing test cases for
complex bugs.

## Speculative Transactions

[Speculative
Transactions](https://docs.xtdb.com/language-reference/datalog-transactions/#speculative-transactions)
allow a transaction to be run against a database to see the resulting
value without actually applying it to storage or indexing.

This enables faster [property
testing](https://clojure.org/guides/test_check_beginner) where thousands
of test cases can be run without the cost of resetting fixtures for each
test.

In this example, the `transfer-bonus` Transaction Function from above is
tested with different initial balances for the account holder. Thousands
of different values are tested in less than a second.

```clojure
(ns xtdb-test
  (:require [clojure.instant :refer [read-instant-date]]
            [clojure.test :refer :all]
            [clojure.test.check :as tc]
            [clojure.test.check.generators :as gen]
            [clojure.test.check.properties :as prop]
            [xtdb.api :as xt]))

(defn accounts-balance? [db valid-time initial-balance]
  (let [transactions [[::xt/put {:xt/id "account1" :balance initial-balance} valid-time]
                      [::xt/fn :transfer-bonus "account1" valid-time]]
        new-db-value (xt/with-tx db transactions)]
    (= (float (+ initial-balance 1000))
       (+ (:balance (xt/entity new-db-value "account1"))
          (:balance (xt/entity new-db-value "bonus-funds"))))))

(defn accounts-balance-property [node]
  (let [valid-time #inst "2023-01-01T00:00:00"
        db (xt/db node {::xt/valid-time valid-time})]
    (prop/for-all [amount (gen/choose 0 10000)]
      (accounts-balance? db valid-time amount))))

(with-open [node (xt/start-node {})]
  (is node)
  (insert-fixtures node)
  (tc/quick-check 1000 (accounts-balance-property node)))
; => {:result true, :pass? true, :num-tests 1000, :time-elapsed-ms 688, :seed 1647508942240}
```

One limitation with `xt/with-tx` is that the returned database value is
set at the valid time and tx-time of the database value passed in.
Therefore, the scope for using speculative transactions with temporal
aspects is limited.

## Conclusion

Testing is hard, especially when changing state and temporal aspects are
considered. XTDB provides stable, isolated and navigable state storage
that won't slow you down in the future.
