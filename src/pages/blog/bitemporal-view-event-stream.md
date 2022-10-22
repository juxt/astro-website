---
author: 'jon'
title: 'Building a Bitemporal View on top of an Event-Stream'
category: 'analysis'

publishedDate: '27 Mar 2018'
heroImage: 'mock3.jpg'
---

The use of event streams has marched on from being used primarily as an
integration tool between systemsx, towards being the data-processing
backbone of our modern IT architectures.

More so, it's become increasingly common to see event-streams not just
acting as an pub/sub mechanism for ephemeral data, but also to use them
as golden store of our data.

Doing so allows us to _unbundle_ the database, to use Martin Kleppmans
term and philosophy. Using a tool such as Kafka, we achieve durability
for our data and we can make guarantees about the other parts of ACID
too. We can then use lighter tools on-top of the event-log to provide
indexes and materialised views, to follow the unix-philosophy of each
part only doing one thing and doing it particulary well.

Martin makes the case for following this approach in his excellent blog
posts and his book, and I'd thoroughly recommending reading through his
literature. There are many benefits of the unbundled approach, one being
that we can avoid the sprawl of big enterprise data-stores that each
require a sophisticated operational overhead and custom ETL wrapping. If
we can make use of tools that can be orthogonally _added_ on top of our
event-logs - the central nervous system - then our end architecture will
be more cohesive and simple - just like how you can stream together Unix
command line tools using pipes.

I was involved in a project where users had a need for bitemporal query
on top of an event stream. Simply put, it was a financial company and
traders wanted an immutable audit log of events, but they also wanted to
query for their trades against business time. This is a typical need for
bitemporal query, where you want to access data `transaction-time` (time
that data entered the database), but you also want to query against
`valid-time` aka business time, (the time that business cares about,
that may originate upstream of our database or event-log).

The client had an immutable event-log in place, and the events were
closely aligned with commands, such as _put_ this trade at valid-time
_VT_, or _delete_ this trade with a time-window for VT.

To help traders query for their valuable trades, the IT team made use of
an RDS database that was struggling to cope with the 100s of millions of
trades being thrown at it. The licensing cost of the RDS store was
becoming ever more expensive as was the operational overhead.
Essentially, the client had in place an immutable event-store and they
wanted to leverage this, in order to create a simpler and cheaper query
layer on top, that could provide bitemporal query.

Looking at the Kafka landscape we considered tools such as KTables /
KSQL, but these streaming tools operate using windowing of stream
events, where-as we wanted to build up an entire secondary-index to
cater for adhoc queries across the full timeline of events.

We looked at various databases we could leverage, but the client was
wary of adding anything too heavyweight, as there were some formidable
operational constraints to overcome. Performant query speed was also
mandated and so we would prefer a way of embedding a data-store -
especially useful as a bitemporal query engine tends to be chatty with
the lower level indexes.

We therefore spiked out using a simple K/V store - at first Redis, then
RocksDB - being fed trades from from the immutable event-log. We wrote
our own connector, but for event-logs such as Kafka, there are a range
of open-source connectors on hand.

Inside the K/V store, we built a time-based index by simply putting the
valid-time into the Key, along with the trade ID.

\`\`\` \<trade ID, valid-time\> → Trade \`\`\`

This is essentially an E-T index (entity, time). Using a lexicographical
seek, we could then pull out the most recent trade for a given ID and
timestamp that we provided.

This the basis of what we need for a bitemporal store. For legal
regulatory requirements everything in the event-log is marked with a
transaction-time at point of ingestion on to the log, then we're
building a simple secondary index sitting just off the log, that
provides data-retrieval for trades at valid-time.

We added further indexes to provide more meaningful query, such as an
AVE index `attribute-value-entity-time`. This allows users to build
graph queries that could join across attributes. For simplicity's sake,
once an entity was identified via an attribute/value pair in this index,
then we re-checked the first index to ensure that the actual
entity/trade contained the attribute/value pair at the sought for
valid-time coordinate.

This sounds complex as I describe it, but overall it wasn't - we had a
couple of simple indexes that allowed for data-access across time
providing rudimentary queries. Using RocksDB as the K/V store, we
leveraged the engineering might of Facebook so that our indexes could
handle terrabytes of data, with billions of entities being stored
within. Crucially, the ingestion rate of getting all this data into
Rocks via the event-log was _fast_, with the beauty of bitemporality
being that you can ingest data using parallel threads - as queries would
return data that was eventually consistent over valid-time.

What we built isn't a full blown generic query engine - rather it worked
well for a collection of targeted queries. We exposed the query calls
via a GraphQL endpoint, and in turn provided the client with an
explorable schema for both the query and the results they could expect.

We topped it off using GraphIQL as a front-end query tool, and Voilá!
The client had a measure of bitemporal query - much better query
capability than what they had before, and with a low operational
overhead, whilst saying in tune with the vision of having an unbundled
data architecture, to make life a better place for future generations of
developers.

- I'm not sure this is all true, as the indexes need transaction time
  for consistency, and we may have modelled this in?

- reverse the index , add T

- Mention z-curves, the need for efficient algoritms to navigate the
  indices
