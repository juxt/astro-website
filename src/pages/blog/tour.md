---
draft: false
author: 'mtf'
layout: '../../layouts/BlogPost.astro'
title: 'Tour: Building data stores with Trip'
description: ""
publishedDate: '2023-05-12'
tags:
  - event-driven-architecture
  - tour
  - evenstore
  - datalog
  - trip
  - kafka
heroImage: 'nrepl.jpg'
---

## Serendipity

I'm currently writing some blog posts about Event Driven Architecture.  As part of this series, I recreate some of the key concepts/features in Clojure without using external services.

Serendipitously, in the latest Juxt Safari 🐘 session (our internal tech talks),  Hak and Jeremy presented Trip: the just-released library providing datalog in a name-space.

For my demo code, I needed:

 - an easy local way to store events for a data sourcing example i.e an event-store,
 - a way to store records for a topic on a message bus i.e. a log-store (using Kafka's terminology for the storage abstraction).
 
 A perfect opportunity to have a play with Trip as the underlying, but local, back-end 🙂.

## Events as Documents 

My blog post examples include an event-sourced robot that uses hashes to represent the events.

```clojure
{:aggregate-id #uuid "73ff776c-572c-4fd7-9c4e-0ef829b57307",
 :created-at 10000,
 :type :bot-created}
 
{:aggregate-id #uuid "73ff776c-572c-4fd7-9c4e-0ef829b57307",
 :created-at 10010,
 :type :nickname-assigned,
 :nickname "Tripy"}
 
{:aggregate-id #uuid "09a9d187-af19-43af-a00f-683ffcbab766",
 :created-at 20010,
 :type :nickname-assigned,
 :nickname "XTDBY"}
```

Each hash can simply be a document in Trip.  An event-store client requires, for each unique `:aggregate-id`, we can return, in order, all events stored.  These events are then replayed in the aggregate system to reconstruct the state of a robot - a process called hydration.  Here we encounter our first stumbling block - Trip, out-the-box, doesn't support insertion order.

## A Tour is a Trip with some Order

Tour is a tiny library on top of Trip that adds ordering to Trip in a simple [naive 😃] way.  There are two main functions,  `append` and `gen-datalog`: one to create transaction data to insert documents and the other to help with data retrieval.

Trip works by augmenting the addition of documents with order state.  Anytime we use Trip's `transact` to add an event to the DB we also:

- insert into the event a `:db/id` with an uuid value and an `:offset` with an integer value.  The `:db/id`is required and ensures every event gets added, even if it's a duplicate. The `:offset` is calculated via its position in the sequence of events with the same `:aggregate-id` currently being added plus the latest available offset for that `:aggregate-id`.
- we use the Trip DB itself to store a state document that keeps track of the latest available offset for each `:aggregate-id`

For events example above, the state document would look like this.

```clojure
 {:db/id :offset-metadata
  :73ff776c-572c-4fd7-9c4e-0ef829b57307  2
  :09a9d187-af19-43af-a00f-683ffcbab766  1}
```

And we would add to the DB like this

```clojure
(def conn (trip/create-conn)) ; connection to a new empty db
(trip/transact! conn
                [{:db/id #uuid "2e9e029b-384a-4ad2-b19b-b59d0b638941"
                  :offset 0
                  :aggregate-id #uuid "73ff776c-572c-4fd7-9c4e-0ef829b57307",
                  :created-at 10000,
                  :type :bot-created}
			     ...
                 {:db/id #uuid "0d96a404-81fb-451d-b71e-570c6c77814d"
                  :offset 0
                  :aggregate-id #uuid "09a9d187-af19-43af-a00f-683ffcbab766",
                  :created-at 20010,
                  :type :nickname-assigned,
                  :nickname "XTDBY"}
				  
                 {:db/id :offset-metadata
                  :73ff776c-572c-4fd7-9c4e-0ef829b57307  2
                  :09a9d187-af19-43af-a00f-683ffcbab766  1}])
```

## Records as Documents

For our log-store, we want to store records as documents. Records look like this:


```clojure
{:topic "foo"
 :partition 1
 :key :sister
 :value "angela"}

{:topic "foo"
 :partition 1
 :key :dad
 :value "trevor"}
```

This time we want our total ordering to be based on the composite key of `:topic` and `:partition`.

The transaction data would look like this

```clojure
(def conn (trip/create-conn)) ; connection to a new empty db
(trip/transact! conn
                [{:db/id #uuid "c247ae63-1a43-4297-87e5-f67072129c0e"
                  :offset 0
                  :topic "foo"
                  :partition 1
                  :key :sister
                  :value "angela"}
                 {:db/id #uuid "92b568c5-ba8c-44b2-b9f9-ae27d5137fce"
                  :offset 1
                  :topic "foo"
                  :partition 1
                  :key :dad
                  :value "trevor"}
                 {:db/id :offset-metadata
                  :foo-1 2}])
```

The grouping key `:foo-1` is built from the topic name and partition number.

## Tour's Append Function

Tour's append function is a general implementation of the above.  First, a helper function to generate grouping keys.

```clojure
(defn- grouping-key
  [ks document]
  (->> document
       ((apply juxt ks))
       (interpose "-")
       (apply str)
       keyword))
```

And then the append function itself is responsible for creating the transaction data for trip.

```clojure
(defn append [db documents & ks]
  (let
 [offset-metadata (or (trip/entity db :offset-metadata)
                            {:db/id :offset-metadata})
        document-groups (group-by (partial grouping-key ks) documents)
        document-offsets (for [[ks documents] document-groups]
                           (let [offset (get offset-metadata ks 0)
                                 new-offset (+ offset (count documents))
                                 offsets (range offset new-offset)]
                             [(mapv (fn [document offset]
                                      (assoc document
                                             :db/id (random-uuid)
                                             :offset offset))
                                    documents offsets)
                              {ks new-offset}]))
        new-documents (into [] (mapcat first document-offsets))
        new-offset-metadata (reduce merge offset-metadata (map second document-offsets))]
    (conj new-documents new-offset-metadata)))
```

## Trivial Write Functions

Back to the blog's code requirements. It's now trivial to implement the `save-events!` function required by my event sourcing example and the `commit-records!` function for use by a topic.

```clojure
(defn save-events! 
  [conn events]
  "Save the events to store based on an events :aggregate-id"
  (trip/transact! conn [[:db.fn/call tour/append events :aggregate-id]]))

```

and

```clojure
(defn commit-records!
  "Save the records (messages) to store based on the records :topic and :partition"
  [conn records]
  (trip/transact! conn [[:db.fn/call tour/append records :topic :partition]]))
```

Pretty neat all thanks to Trip 😎

Note that we use a transaction function to call append - the reason being thread safety.  By default Trip implements its connection as an atom.   The append function itself uses the database to discover the latest offsets - if we dereference the connection to get the value and the overall transact retries, then the value may have changed in a competing thread.

It's pretty great we can do this as we explore easily some of the issues seen with the partitioning of topics in Kafka.  The below test shows different client threads saving to the event-store.  Thanks to Clojure atom's isolation properties we will always have a consistent state file.  However, we won't actually know which thread wins out and the overall final ordering of the saved documents.  Precisely the problems encountered when working with Kafka partitions.

```clojure
(deftest eventstore-isolation-negative-test
  "This test results in an incorrect state file"
  (future (eventstore/save-events! conn [event-a1 event-b1]))
  (future (eventstore/save-events! conn [event-b2 event-a2 event-a1]))
  (Thread/sleep 500)
  (is (= (frequencies [event-a1 event-a2 event-a1])
         (frequencies (eventstore/get-events-for-aggregate (trip/db conn) aggregate-id-a))))
  (is (= (frequencies [event-b1 event-b2])
         (frequencies (eventstore/get-events-for-aggregate (trip/db conn) aggregate-id-b))))
  (is (= {:db/id :offset-metadata
             (-> aggregate-id-a str keyword) 3
             (-> aggregate-id-b str keyword) 2}
            (trip/entity (trip/db conn) :offset-metadata))))
```

## Retrieval 

Getting the data back out requires some Datalog to pull the documents and some post-sorting in Clojure.

```clojure
(->> (trip/q '{:find [(pull ?e [*])]
                :where
                [[?e :aggregate-id ?aggregate-id] 
                 [?e :offset ?o'] 
                 [(>= ?o' ?o)]]
               :in [$ ?aggregate-id ?o]}
             db aggregate-id)
      (into [])
      flatten
      (sort-by :offset)
      (mapv #(dissoc % :db/id :offset)))
```

Tour's `gen-datalog` macro and a helper function aid in the construction of the queries based on the components of the composite key.  The macro generates the Datalog query and the helper function does a post-query transform to tidy things up.

```clojure
(defmacro gen-datalog
  [offset-type & key-syms]
  `(quote
    ~(hash-map :find '[(pull ?e [*])]
               :in (into ['$] (concat
                               (mapv #(symbol (str "?" (name %))) key-syms)
                               (when (#{:nthrest :take :nth} offset-type) ['?o])
                               (when (= :slice offset-type) ['?f-o '?t-o])))
               :where (into []
                            (concat
                             (mapv #(vector '?e (keyword %) (symbol (str "?" (name %))))
                                   key-syms)
                             (when (#{:nthrest :take :nth :slice} offset-type)
                               ['[?e :offset ?o']])
                             (case offset-type
                               :nthrest ['[(>= ?o' ?o)]]
                               :take ['[(< ?o' ?o)]]
                               :nth ['[(= ?o' ?o)]]
                               :slice ['[(>= ?o' ?f-o)] '[(< ?o' ?t-o)] ]
                               :all nil
                               nil))))))
```

The macro is passed an `offset-type` which is a keyword representing its namesake Clojure operation e.g.`:nthrest` provides all documents after an offset, `:take` before.

And the post-query transform is simply

```clojure
(defn post-query-transform
  "Helper function typically used after a query using `gen-datalog`"
  [query-results]
  (->> query-results
       (into [])
       flatten
       (sort-by :offset)
       (mapv #(dissoc % :db/id))))
```

## Trivial Read Functions

For the example blog code, we can now write our respective read functions as easily as the write functions.

For the event-store we need to return in order all events for a particular aggregate and remove the offset.

```clojure
(defn get-events-for-aggregate 
  [db aggregate-id]
  (->> (trip/q (tour/gen-datalog :all aggregate-id) db aggregate-id)
       tour/post-query-transform
       (mapv #(dissoc % :offset))))
```

And for our message bus requirements, we can mimic a poll that fetches a message at an offset and all after it.

```clojure
(defn poll 
  [db topic partition offset]
  (->> (trip/q (tour/gen-datalog :nthrest topic partition) db topic partition offset)
       tour/post-query-transform))
```
	
## Trip's Protocol's To the Rescue

In DDD we might want our event-store to both save the events it receives and publish those events to a message bus in the same "transaction".  This way we are assured that subscribers to the published events will be eventually consistent.

Thankfully Trip supports changing out the underlying operations for a connection.  The intention here is to allow people to extend Trip in new and interesting ways.  Tour uses it to pivot to `refs` instead of `atoms` to manage connections.  This way, via Clojure's native support for transactions, we have transactional behaviour for free.

```clojure
(defn create-conn [] (ref (trip/empty-db)))

(extend-type clojure.lang.Ref
  trip/DbConnection
  (-db [this] @this)
  (-transact [this tx-data]
    (let [result (atom nil)]
      (alter this (fn [db]
                    (let [tx-report (trip/with db tx-data)]
                      (reset! result tx-report)
                      (:db-after tx-report))))
      @result)))
```

We can simply implement this now

```clojure
(def conn (tour/create-conn))

(defn event-to-record
  "Transform an event into a Kafka like record"
  [topic partition k v]
  {:topic topic
   :partition partition
   :key (get v k)
   :value v})

(defn save-events-and-publish!
  [conn events topic partition]
  (dosync
   (eventstore/save-events! conn events)
   (logstore/commit-records! conn (->> events
                                       (mapv (partial event-to-record topic partition :aggregate-id))))))
```

Tour's `create-conn` function uses the ref based connection protocol.  A simple function `event-to-record`, demonstrates a conversion of events into message bus records.

The following test exercises our implementation - saving event-a's to partition 1 and event-b's to partition 2 of the "event-topic".

```clojure
;; Sample events
(def aggregate-id-a (random-uuid))
(def aggregate-id-b (random-uuid))

(def event-a1 {:aggregate-id aggregate-id-a
               :created-at 10000
               :type :bot-created})
(def event-a2 {:aggregate-id aggregate-id-a
               :created-at 10010
               :type :nickname-assigned
               :nickname "Tripy"})
(def event-b1 {:aggregate-id aggregate-id-b
               :created-at 20000
               :type :bot-created})
(def event-b2 {:aggregate-id aggregate-id-b
               :created-at 20010
               :type :nickname-assigned
               :nickname "XTDBY"})

;; In action
(deftest repository-test
  (save-events-and-publish! conn [event-a1 event-a2 event-a2] "event-topic" 1)
  (save-events-and-publish! conn [event-a1] "event-topic" 1)
  (save-events-and-publish! conn [event-b1 event-b2] "event-topic" 2)
  (is (= {:db/id :offset-metadata
          (-> aggregate-id-a str keyword) 4
          (-> aggregate-id-b str keyword) 2
          :event-topic-1 4
          :event-topic-2 2}
         (trip/entity (trip/db conn) :offset-metadata)))
  (is (= [event-a1 event-a2 event-a2 event-a1]
         (eventstore/get-events-for-aggregate (trip/db conn) aggregate-id-a)))
  (is (= [event-b1 event-b2]
         (eventstore/get-events-for-aggregate (trip/db conn) aggregate-id-b)))
  (is (= (->> [event-a2 event-a1]
              ;; as logstore record retrieval includes the offsets
              ;; we have to inject the expected values
              (mapv (fn [offset record]
                      (-> (event-to-record "event-topic" 1 :aggregate-id record)
                          (assoc :offset offset)))
                    (drop 2 (range))))
         (logstore/poll (trip/db conn) "event-topic" 1 2)))
  (is (= (->> [event-b1 event-b2]
              (mapv (fn [offset record]
                      (-> (event-to-record "event-topic" 2 :aggregate-id record)
                          (assoc :offset offset)))
                    (range)))
         (logstore/poll (trip/db conn) "event-topic" 2 0))))
```

One thing to note here is that we use a single Trip database to serve both our stores - in line with the [shared state](https://www.juxt.pro/blog/atomic-architecture/) idea from Atomic Architecture.
