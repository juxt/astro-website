---
author: 'jon'
title: 'Data at the Gates'
description: 'Coerce to avoid data inconsistencies polluting your codebase'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2016-02-01'
heroImage: 'data-gates.jpg'
---

A saving architectural pattern is to marshal your data into some
canonical format at the gates of your application.

# The problem

A classic anti-example is pulling data out of your relational DB, i.e.
with Postgresql or Sqlite and leaving the data untreated.

Databases aren't usually happy when you want to have column names with
hyphens (kebabs) in them, and so we have to use `last_updated` instead
of `last-updated`. Since our JDBC libraries will typically give us a
Clojure map back for each row in the table when we do queries, then it's
easy to have `last_updated` kicking around further up the application
stack, if we don't step takes to convert. This could disenfranchise
other developers who expect to see the idiomatic `last-updated` instead.
Soon the code-base could become littered with transformations munging
the data back and forth between representations.

Tensions can escalate when someone starts pulling down data from a 3rd
party JSON endpoint containing the lethal `lastUpdated`, allowing it to
proceed unfettered. It's a matter of time before a triple store gets
added and we see `product/last-updated`. Would someone please think of
the children?

Aside from our data keys, the values can be mish-mashed too. A frequent
example is being confused as to whether a UUID is either a String or an
actual UUID. We also have the what-should-a-date-be conundrum; `Joda`,
`java.util`, `String`, or epoch based.

# The Approach

I've learnt my lesson: always get the data sorted out at the boundaries
of the application. In the Postgresql/Sqlite example, whenever rows are
returned as Clojure maps, I typically run them through the excellent
little [camel-snake-kebab](https://github.com/qerub/camel-snake-kebab)
library.

For example, I could provide my own wrapper replacement for the
`clojure.java.jdbc/query` function:

    (defn- query [db q]
      (clojure.jdbc/query db q :row-fn kebab/->kebab-case-keyword))

The magic happens in `->kebab-case-keyword` that will coerce all
\`\`last_updated\`\`s to `last-updated` when they come out of the db (it
can also convert from camel-case, helping with the third party JSON
example).

Taking this approach further, when we receive data via our exposed REST
endpoints we could and should coerce the data right then and there.
Libaries such as `compojure-api`, `tripod`, `pedestal-swagger` and
`Yada`, aim to help with this, allowing you to specify the data schema
alongside your routes. Common coercions are then applied such as sorting
out the pesky UUID and date conversions.

[Prismatic Schema](https://github.com/plumatic/schema) is often the hero
here. I once worked on a data processing pipeline where we erected
_schema barriers_ at the start of the pipeline (where data was picked up
from a file drop), and at the end (where we published data into an
ElasticSearch instance). Along the way we also persisted the data at
various stages, and so we had intermediate schemas.

Not only did this give us contractual guarantees about the data at
certain points in the processing pipeline, it also helped our overall
reasoning about the code. Once you then have a Prismatic schema
definition, it can then become a basis for writing applicable coercions,
using the Schema API.
