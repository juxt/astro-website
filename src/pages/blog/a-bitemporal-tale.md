---
author: 'iva'
title: 'A Bitemporal tale'
description: 'History. Of histories.'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
tags:
  - 'play'
publishedDate: '19 Apr 2019'
heroImage: 'bitemp-tale.jpg'
---

For those readers whose learning ability is better when affections are
in place, we're offering a short story writing experience through
database transactions and queries.

For an interactive no-install browser-based experience, see the
[Nextjournal edition of the Tale](https://nextjournal.com/crux/a-bitemporal-tale). Otherwise, let's
begin...

## Setup

Assuming you have some basic knowledge of Clojure and you own a REPL.
All you need for this tale is to add [Crux](https://juxt.pro/crux) to
your deps. For more configuration details [see here](https://xtdb.com/reference/configuration.html).

```clj
;; lein
[juxt/crux-core "19.07-1.3.0-alpha"]
;; deps.edn
juxt/crux-core {:mvn/version "19.07-1.3.0-alpha"}
```

Fire up a repl and create a namespace

```clj
(ns a-tale
  (:require [crux.api :as crux]))
```

## Define a system

```clj
(def system
  (crux/start-node
    {:crux.node/topology :crux.standalone/topology
    :crux.node/kv-store "crux.kv.memdb/kv"
    :crux.standalone/event-log-dir "data/eventlog-1"
    :crux.kv/db-dir "data/db-dir-1"
    :crux.standalone/event-log-kv-store "crux.kv.memdb/kv"}))

; alternatively, you can go with RocksDB for a persistent storage
(comment
  org.rocksdb/rocksdbjni {:mvn/version "5.17.2"} ; add this to your deps
  ; define system as follows
  (def system
    (crux/start-node ; it has clustering out-of-the-box though
               {:crux.node/topology :crux.standalone/topology
                :crux.standalone/event-log-dir "data/eventlog-1"
                :crux.kv/db-dir "data/db-dir-1"})))
; see configuration section in the docs for LMDB / [embedded] Kafka setups
```

## Letting data in

The year is 1740. We want to transact in our first character -- Charles.
Charles is a shopkeeper who possesses a truly magical artefact: A Rather
Cozy Mug, which he uses in some of the most sacred morning rituals of
caffeinated beverages consumption.

```clj
(crux/submit-tx
  system
    ; tx type
  [[:crux.tx/put

    {:crux.db/id :ids.people/Charles  ; mandatory id for a document in Crux
     :person/name "Charles"
     ; age 40 at 1740
     :person/born #inst "1700-05-18"
     :person/location :ids.places/rarities-shop
     :person/str 40
     :person/int 40
     :person/dex 40
     :person/hp 40
     :person/gold 10000}

    #inst "1700-05-18"]]) ; valid time (optional)
; yields transaction data like
{:crux.tx/tx-id 1555661957640
 :crux.tx/tx-time #inst "2019-04-19T08:19:17.640-00:00"}
```

Ingest the remaining part of the set

```clj
(crux/submit-tx
  system
  [; rest of characters
   [:crux.tx/put
    {:crux.db/id :ids.people/Mary
     :person/name "Mary"
     ; age  30
     :person/born #inst "1710-05-18"
     :person/location :ids.places/carribean
     :person/str 40
     :person/int 50
     :person/dex 50
     :person/hp 50}
    #inst "1710-05-18"]
   [:crux.tx/put
    {:crux.db/id :ids.people/Joe
     :person/name "Joe"
     ; age  25
     :person/born #inst "1715-05-18"
     :person/location :ids.places/city
     :person/str 39
     :person/int 40
     :person/dex 60
     :person/hp 60
     :person/gold 70}
    #inst "1715-05-18"]])
; yields tx-data, omitted

(crux/submit-tx
  system
  [; artefacts
   ; In our tale there is a Cozy Mug...
   [:crux.tx/put
    {:crux.db/id :ids.artefacts/cozy-mug
     :artefact/title "A Rather Cozy Mug"
     :artefact.perks/int 3}
    #inst "1625-05-18"]

   ; ...some regular magic beans...
   [:crux.tx/put
    {:crux.db/id :ids.artefacts/forbidden-beans
     :artefact/title "Magic beans"
     :artefact.perks/int 30
     :artefact.perks/hp -20}

    #inst "1500-05-18"]
   ; ...a used pirate sword...
   [:crux.tx/put
    {:crux.db/id :ids.artefacts/pirate-sword
     :artefact/title "A used sword"}
    #inst "1710-05-18"]
   ; ...a flintlock pistol...
   [:crux.tx/put
    {:crux.db/id :ids.artefacts/flintlock-pistol
     :artefact/title "Flintlock pistol"}
    #inst "1710-05-18"]
   ; ...a mysterious key...
   [:crux.tx/put
    {:crux.db/id :ids.artefacts/unknown-key
     :artefact/title "Key from an unknown door"}
    #inst "1700-05-18"]
   ; ...and a personal computing device from the wrong century.
   [:crux.tx/put
    {:crux.db/id :ids.artefacts/laptop
     :artefact/title "A Tell DPS Laptop (what?)"}
    #inst "2016-05-18"]])
; yields tx-data, omitted

; places
(crux/submit-tx
  system
  [[:crux.tx/put
    {:crux.db/id :ids.places/continent
     :place/title "Ah The Continent"}
    #inst "1000-01-01"]
   [:crux.tx/put
    {:crux.db/id :ids.places/carribean
     :place/title "Ah The Good Ol Carribean Sea"
     :place/location :ids.places/carribean}
    #inst "1000-01-01"]
   [:crux.tx/put
    {:crux.db/id :ids.places/coconut-island
     :place/title "Coconut Island"
     :place/location :ids.places/carribean}
    #inst "1000-01-01"]]) ; yields tx-data, omitted
```

## Looking Around : Basic Queries

Get a database _value_ and read from it consistently. Crux uses datalog
query language. I'll try to explain the required minimum, and I
recommend [learndatalogtoday.org](http://www.learndatalogtoday.org/) as
a follow up read.

```clj
(def db (crux/db system))

; we can query entities by id
(crux/entity db :ids.people/Charles)

; yields
{:crux.db/id :ids.people/Charles,
 :person/str 40,
 :person/dex 40,
 :person/location :ids.places/rarities-shop,
 :person/hp 40,
 :person/int 40,
 :person/name "Charles",
 :person/gold 10000,
 :person/born #inst "1700-05-18T00:00:00.000-00:00"}


; Datalog syntax : query ids
(crux/q db
        '[:find ?entity-id ; datalog's find is like SELECT in SQL
          :where
          ; datalog's where is quite different though
          ; datalog's where block combines binding of fields you want with filtering expressions
          ; where-expressions are organised in triplets / quadruplets

          [?entity-id    ; first  : usually an entity-id
           :person/name  ; second : attribute-id by which we filter OR which we want to pull out in 'find'
           "Charles"]])  ; third  : here it's the attribute's value by which we filter

; yields
#{[:ids.people/Charles]}


; Query more fields
(crux/q db
        '[:find ?e ?name ?int
          :where
          ; where can have an arbitrary number of triplets
          [?e :person/name "Charles"]

          [?e :person/name ?name]
          ; see   now we're pulling out person's name into find expression

          [?e :person/int ?int]])

; yields
#{[:ids.people/Charles "Charles" 40]}


; See all artefact names
(crux/q db
        '[:find ?name
          :where
          [_ :artefact/title ?name]])
; yields
#{["Key from an unknown door"] ["Magic beans"]
  ["A used sword"] ["A Rather Cozy Mug"]
  ["A Tell DPS Laptop (what?)"]
  ["Flintlock pistol"]}
```

## Undoing the Oopsies : Delete and Evict

Ok yes, magic beans once _were_ in the realm, and we want to remember
that, but following advice from our publisher we've decided to remove
them from the story for now. Charles won't know that they ever existed!

```clj
(crux/submit-tx
  system
  [[:crux.tx/delete :ids.artefacts/forbidden-beans
    #inst "1690-05-18"]])
```

Sometimes people enter data which just doesn't belong there or that they
no longer have a legal right to store (GDPR, I'm looking at you). In our
case, it's the laptop, which ruins the story consistency. Lets
completely wipe all traces of that laptop from the timelines.

```clj
(crux/submit-tx
  system
  [[:crux.tx/evict :ids.artefacts/laptop]])
```

Let's see what we got now

```clj
(crux/q (crux/db system)
        '[:find ?name
          :where
          [_ :artefact/title ?name]])

; yields
#{["Key from an unknown door"] ["A used sword"] ["A Rather Cozy Mug"] ["Flintlock pistol"]}


; Historians will know about the beans though
(def world-in-1599 (crux/db system #inst "1599-01-01"))
(crux/q world-in-1599
        '[:find ?name
          :where
          [_ :artefact/title ?name]])

; yields
#{["Magic beans"]}
```

## Plot Development : DB References

Let's see how Crux handles references. Give our characters some
artefacts. We will do with function as we will need it later again.

```clj
(defn first-ownership-tx []
  [; Charles was 25 when he found the Cozy Mug
   (let [charles (crux/entity (crux/db system #inst "1725-05-17") :ids.people/Charles)]
     [:crux.tx/put
      (update charles
              ; Crux is schemaless, so we can use :person/has however we like
              :person/has
              (comp set conj)
              ; ...such as storing a set of references to other entity ids
              :ids.artefacts/cozy-mug
              :ids.artefacts/unknown-key)
      #inst "1725-05-18"])
    ; And Mary has owned the pirate sword and flintlock pistol for a long time
    (let [mary (crux/entity (crux/db system #inst "1715-05-17") :ids.people/Mary)]
      [:crux.tx/put
       (update mary
              :person/has
              (comp set conj)
              :ids.artefacts/pirate-sword
              :ids.artefacts/flintlock-pistol)
       #inst "1715-05-18"])])

(def first-ownership-tx-response
  (crux/submit-tx system (first-ownership-tx)))

first-ownership-tx-response
; yields tx-data
{:crux.tx/tx-id 1555661957644
 :crux.tx/tx-time #inst "2019-04-19T08:19:21.640-00:00"}
```

Note that transactions in Crux will rewrite the whole entity, there're
no partial updates and no intentions to put them in the core as of yet.
This is because the core of Crux is intentionally slim, and features
like partial updates shall be kept in the upcoming convenience projects!

### Who Has What : Basic Joins

```clj
(def who-has-what-query
  '[:find ?name ?atitle
    :where
    [?p :person/name ?name]
    [?p :person/has ?artefact-id]
    [?artefact-id :artefact/title ?atitle]])

(crux/q (crux/db system #inst "1726-05-01") who-has-what-query)
; yields
#{["Mary" "A used sword"]
  ["Mary" "Flintlock pistol"]
  ["Charles" "A Rather Cozy Mug"]
  ["Charles" "Key from an unknown door"]}

(crux/q (crux/db system #inst "1716-05-01") who-has-what-query)
; yields
#{["Mary" "A used sword"] ["Mary" "Flintlock pistol"]}
```

### Parametrized Queries

If you wondered how to write conditions analogouos to SQL
`WHERE id IN (...)` it's this way.

```clj
(def parametrized-query
  '[:find ?name
    :args {ids #{:ids.people/Charles :ids.people/Mary}}
    :where
    [?e :person/name ?name]
    [(contains? ids ?e)]
    :limit 10])

(crux/q (crux/db system #inst "1726-05-01") parametrized-query)
; yields
#{["Mary"] ["Charles"]}
```

### A few convenience functions

```clj
(defn entity-update
  [entity-id new-attrs valid-time]
  (let [entity-prev-value (crux/entity (crux/db system) entity-id)]
    (crux/submit-tx system
      [[:crux.tx/put
        (merge entity-prev-value new-attrs)
        valid-time]])))

(defn q
  [query]
  (crux/q (crux/db system) query))

(defn entity
  [entity-id]
  (crux/entity (crux/db system) entity-id))

(defn entity-at
  [entity-id valid-time]
  (crux/entity (crux/db system valid-time) entity-id))

(defn entity-with-adjacent
  [entity-id keys-to-pull]
  (let [db (crux/db system)
        ids->entities
        (fn [ids]
          (cond-> (map #(crux/entity db %) ids)
            (set? ids) set
            (vector? ids) vec))]
    (reduce
      (fn [e adj-k]
        (let [v (get e adj-k)]
          (assoc e adj-k
                 (cond
                   (keyword? v) (crux/entity db v)
                   (or (set? v)
                       (vector? v)) (ids->entities v)
                   :else v))))
      (crux/entity db entity-id)
      keys-to-pull)))


; Charles became more studious as he entered his thirties
(entity-update :ids.people/Charles
  {:person/int 50}
  #inst "1730-05-18")

; Check our update
(entity :ids.people/Charles)

;yields
{:person/str 40,
 :person/dex 40,
 :person/has #{:ids.artefacts/cozy-mug :ids.artefacts/unknown-key}
 :person/location :ids.places/rarities-shop,
 :person/hp 40,
 :person/int 50,
 :person/name "Charles",
 :crux.db/id :ids.people/Charles,
 :person/gold 10000,
 :person/born #inst "1700-05-18T00:00:00.000-00:00"}


; Pull out everything we know about Charles and the items he has
(entity-with-adjacent :ids.people/Charles [:person/has])

; yields
{:crux.db/id :ids.people/Charles,
 :person/str 40,
 :person/dex 40,
 :person/has
 #{{:crux.db/id :ids.artefacts/unknown-key,
    :artefact/title "Key from an unknown door"}
   {:crux.db/id :ids.artefacts/cozy-mug,
    :artefact/title "A Rather Cozy Mug",
    :artefact.perks/int 3}},
 :person/location :ids.places/rarities-shop,
 :person/hp 40,
 :person/int 50,
 :person/name "Charles",
 :person/gold 10000,
 :person/born #inst "1700-05-18T00:00:00.000-00:00"}
```

## What Was Supposed To Be The Final

Mary steals The Mug in June

```clj
(let [theft-date #inst "1740-06-18"]
  (crux/submit-tx
    system
    [[:crux.tx/put
      (update (entity-at :ids.people/Charles theft-date)
              :person/has
              disj
              :ids.artefacts/cozy-mug)
      theft-date]
     [:crux.tx/put
      (update (entity-at :ids.people/Mary theft-date)
              :person/has
              (comp set conj)
              :ids.artefacts/cozy-mug)
      theft-date]]))

(crux/q (crux/db system #inst "1740-06-18") who-has-what-query)
; yields
#{["Mary" "A used sword"]
  ["Mary" "Flintlock pistol"]
  ["Mary" "A Rather Cozy Mug"]
  ["Charles" "Key from an unknown door"]}
```

So, for now, we think we're done with the story. We have a picture and
we're all perfectly ready to blame Mary for stealing a person's beloved
mug. Suddenly a revelation occurs when an _upstream data source_ kicks
in. We uncover a previously unknown piece of history. It turns out the
mug was Mary's family heirloom all along!

### Correct The Past

```clj
(let [marys-birth-inst #inst "1710-05-18"
      db (crux/db system marys-birth-inst)
      baby-mary (crux/entity db :ids.people/Mary)]
  (crux/submit-tx
    system
    [[:crux.tx/cas
      baby-mary
      (update baby-mary :person/has (comp set conj) :ids.artefacts/cozy-mug)
      marys-birth-inst]]))

; ...and she lost it in 1723
(let [mug-lost-date #inst "1723-01-09"
      db (crux/db system mug-lost-date)
      mary (crux/entity db :ids.people/Mary)]
  (crux/submit-tx
    system
    [[:crux.tx/cas
      mary
      (update mary :person/has (comp set disj) :ids.artefacts/cozy-mug)
      mug-lost-date]]))

(crux/q
  (crux/db system #inst "1715-05-18")
  who-has-what-query)
; yields
#{["Mary" "A used sword"] ["Mary" "Flintlock pistol"]}
; Ah she doesn't have The Mug still.
; Because we store that data in the entity itself
; we now should rewrite its state on "1715-05-18"

(crux/submit-tx system (first-ownership-tx))

(crux/q
  (crux/db system #inst "1715-05-18")
  who-has-what-query)
; yields
#{["Mary" "A used sword"]
  ["Mary" "Flintlock pistol"]
  ["Mary" "A Rather Cozy Mug"]}
; ah, much better
```

Note that with this particular data model we should also rewrite all the
artefacts transactions since 1715. But since it matches the tale we can
omit the labour for this time. And if acts of ownership were separate
documents, the labour wouldn't be needed at all.

## Fin

```clj
(crux/q
  (crux/db system #inst "1740-06-19")
  who-has-what-query)
; yields
#{["Mary" "A used sword"]
  ["Mary" "Flintlock pistol"]
  ["Mary" "A Rather Cozy Mug"]
  ["Charles" "Key from an unknown door"]}
```

Now, knowing the _corrected_ picture we are more ambiguous in our
rooting for Charles or Mary.

Also we are still able to see how wrong we were as we can rewind not
only the tale's history but also the history of our edits to it. Just
use the tx-time of the first ownership response.

```clj
(crux/q
  (crux/db system
           #inst "1715-06-19"
           (:crux.tx/tx-time first-ownership-tx-response))
  who-has-what-query)
; yields
#{["Mary" "A used sword"]
  ["Mary" "Flintlock pistol"]}
```

### What's Next?

Crux has a few important features which we left out of scope of this
tale.

- Crux has first-class Java API, so you can use it from Kotlin, Java,
  Scala or any other JVM-hosted language.

- There's history API, so for every entity you get its full history,
  or history bounded by valid time and transaction time coordinates.

- Clustering

- Datalog Rules -- powerful query extensions

- Evict can be scoped

Learn about these and other features on [our docs portal](https://juxt.pro/crux/docs/index.html).

If you have any suggestions on how to improve this tutorial or docs
don't hesitate to contact us on
[Zulip](https://juxt-oss.zulipchat.com/#narrow/stream/194466-xtdb) or on
#crux channel on [clojurians.slack.com](https://clojurians.slack.com)
for tutorial corrections ping `@spacegangster`

### Credits

I want to give my credit on this post to all Crux authors and
contributors, thanks to Jon Pither for inviting me to Crux team and a
special thanks to Jeremy Taylor for his invaluable input to this tale.
