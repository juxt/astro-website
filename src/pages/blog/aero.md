---
author: 'mal'
title: 'Configuration: Make it obvious!'
description: 'Avoid misleading application configuration schemes by being explicit'
category: 'opensource'
layout: '../../layouts/BlogPost.astro'
tags:
  - 'clojure'
publishedDate: '2016-05-05'
heroImage: 'config.jpg'
---

n:subtitle: Avoid misleading application configuration schemes by being
explicit

Most applications need to leave some choices in the hands of their
users. For example, you might be launching some network service on a
fixed port number, but unless you've actually reserved that port with
the Internet powers-that-be, it's possible some other application is
using that port and it has to be possible for the user to change it. You
might also need the user to provide settings that you cannot possibly
know when you are developing the application, such as the connection
string to a database.

# Environment variables

One approach is to declare your configuration in environment variables.

    PORT=8000
    DATABASE=datomic:dev://localhost:4334/my-db

That is OK when there are only a few straight-forward settings that can
be modified, but as the application's complexity increases it is likely
that you will want many such settings, and often you want to specify
lists and nested groupings.

There are schemes to name environment variables in a certain way to
achieve greater complexity but ask for constructions like this (which
for me are somewhat awkward and doesn't feel like the Unix I know and
love)

    KNOWN-USERS.0.NAME=Alice
    KNOWN-USERS.1.NAME=Bob

A better approach is to store your application's configuration in
plain-text in a file that the user can edit. EDN makes a great choice
because you can exploit Clojure's great literal syntax of nested data
structures:

```clojure
{:port 8000
 :database "datomic:dev://localhost:4334/my-db"
 :known-users [{:name "Alice"} {:name "Bob"}]}
```

# Multiple environments

> \"Some things change, some stay the same.\"
>
> -- Hymn to Her The Pretenders

Your application may need to run in different environments for different
purposes. A common case is that you have one environment for your users
and another similar environment for you to test against. Very often, the
application's configuration differs on a per-environment basis.

There are a number of ways of dealing with this situation.

## Separate configuration files

You may have heard the DRY principle (Don't Repeat Yourself) which warns
us against duplicating information. When information is duplicated it's
easy for discrepancies to creep in. If you need to change a value, you
need to find all the places where that value is repeated, and this is
highly error prone. It also reduces our ability to reason about a
system.

If we want to be able to reason about a system we first need to be able
to trust the data we have in front of us.

If we have a separate configuration file for each environment, we can
fall into the trap of rampant duplication, which destroys that trust.

We must be able to trust that accuracy of configuration data.
Duplication corrodes that trust.

## Configuration layering

Configuration layering is where you stratify configuration over a number
of layers. The bottom layer provides the defaults (perhaps in a
configuration file). The layer up provides the environment's
_overrides_.

For example, the override file for a test environment may wish to keep
the `port` setting the same as the default, but specify a new setting
for the `database` connection string.

```clojure
{:database "datomic:dev://localhost:4334/my-test-db"}
```

Why not have more layers? You could build a configuration scheme whereby
configuration is built up from a number of sources, some perhaps a
network hop away. _Zero-configuration_ schemes make good use of this
pattern.

However, there are some significant trade-offs with flexible
configuration schemes. The worst of these, in my opinion, is that
configuration becomes implicit and non-obvious, leading to lengthy and
sometimes tortuous debugging sessions:

Imagine you are brought in to diagnose a critical outage with our
application. You might find the original configuration file and assume
the database being used was \"datomic:dev://localhost:4334/my-db\". You
access that database and rummage around trying to find the problem, only
to discover (hours later perhaps) that the actual database in use was
\"datomic:dev://localhost:4334/my-prod-db2\". After much
head-scratching, you realize there was a clever hidden configuration
overridden built into the application code that pulled in an override
file. The criticality of these situations tends to be amplified by the
fact that configuration issues usually happen in production, simply
because they are often the only untested part of a production system.
Configuration systems are unforgiving when it comes to human error.

Again, we must be able to trust that accuracy of configuration data.
Layering has the potential to mislead us. That's not to say layering is
a bad choice and we very much like the design of Clojure libraries such
as [environ](https://github.com/weavejester/environ) and
[nomad](https://github.com/jarohen/nomad).

## The Aero approach

Aero is a configuration library from JUXT which encourages explicit and
obvious configuration. In Aero, we would implement the requirements
already described by following configuration file:

```clojure
{:port 8000
 :database #profile {:prod "datomic:dev://localhost:4334/my-prod-db2"
                     :test "datomic:dev://localhost:4334/my-test-db"
                     :default "datomic:dev://localhost:4334/my-db"}
 :known-users [{:name "Alice"} {:name "Bob"}]}
```

In this example, it should be quite clear what the various values for
the database are, for each environment. Aero asks the application to
provide a single value called the **profile** and this is used to switch
between environment-dependent values.

In most end-user situations, configuration files can and should be put
in version control (except for sensitive information such as passwords,
which we'll come to soon). It is understandable to want to keep the
application code separate from its operational deployment details, but
in most cases the benefits outweigh the costs. The ability to reason
about a system, in all its glorious detail, is a prize worth striving
for.

# Secrets

There are obviously some settings that contain sensitive data such as
passwords and private cryptographic keys that you must restrict access
to.

Some think this is a good reason to bring back environment variables,
since they can be configured externally and exported into the
application from outside.

In my view, environment variables are a very poor choice for sensitive
information. It's very easy for environment variables to viewed. A
simple _ps -ef_ will reveal the environment of a process. You can also
view them in the _/proc_ files-system.

Also, environment variables can be helpful in deployment situations and
it is often useful to make the current environment accessible via a
web-page or dump them to a debug log. If you environment contains
sensitive details then this idea becomes dangerous and would involve the
removal of the sensitive variables prior to output.

Rather, it is better to store your secrets in a separate file, which can
only be read by the application account user.

## Loading secrets with Aero

Aero comes with some useful EDN tag literals that you can use to read a
private configuration file.

The first is `#include`, which lets us import some extra configuration
from another file.

```clojure
{:extra #include "my-extra-config.edn"}
```

This assumes the current working directory contains the
`my-extra-config.edn` file. It would be better to avoid that assumption
by giving an absolute path.

If our file is in the HOME directory of the application user we can
access this with `#env`.

```clojure
{:home-dir #env HOME}
```

Now we can construct the absolute filename by joining the HOME directory
to the file path using Aero's #join tag literal, which is followed by a
vector of components to join.

```clojure
{:file #join [#env HOME "my-extra-config.edn"]}
```

This works because tag literals compose.

Putting it all together, we may end up with something like this:

```clojure
{:website
 {:port 8000
  :database #profile
  {:prod "datomic:dev://localhost:4334/my-prod-db2"
   :test "datomic:dev://localhost:4334/my-test-db"
   :default "datomic:dev://localhost:4334/my-db"}
  :known-users [{:name "Alice"}
                {:name "Bob"}]
  :oauth2 ^:ref [:secrets :oauth2]}

 :secrets #profile
 {:dev
  {:stripe {:key "sk_test_123"}
   :mailgun {:api-key "key-123"}
   :oauth2
   {:google
    {:client-id "cs-123"
     :client-secret "wbefes"}}}
  :prod #include #join [#env HOME "/.secrets.edn"]}}
```

Notice that this is still a valid EDN file. Aero is (mostly) defining a
set of tag literals. In most cases, we are using the `#profile` tag
literal. In the last line, where we bring in another EDN file we compose
the `#include`, `#join` and `#env` tag literals together.

Notice how EDN tag literals easily compose to give a degree of
flexibility without resorting to adding language features into the
configuration syntax (or horror-of-horrors, making the configuration
itself Turing complete).

Also notice how we use `+^:ref+` metadata to reference the otherwise
isolated part of the configuration that deals with secrets.

The result is a configuration file that is consistent, complete and
explicit. When combined with the process environment we have all the
information we need to reason about a system (except for the secrets,
which are hidden from us) .

# Integrating Aero with Stuart Sierra component

Stuart Sierra's component library asks us to create a system as a map of
components. We then must ask the component library to start the system,
where each component is given their started dependencies and started.
But between these steps we can configure our system such that each
component is configured with its corresponding section in the Aero
configuration file.

The only constraint is that we align our system map keys with our
configuration keys, but that is a reasonable design and consistent
choice.

Each component can then declare configurable settings in its record
definition header and these are available in both the start and stop
functions.

```clojure
(defrecord Website [port database known-users oauth2]
  component/Lifecycle
  (start [component] ...)
  (stop [component] ...))
```

Then we create our system out of components, specifying defaults if
necessary (despite what I have said about the pitfalls of configuration
layering, there are times where you certainly need to specify a
hard-coded default).

```clojure
(defn new-system {:website (map->Website {:known-users []})})
```

Finally we configure our system with a function that merges the system
map with the configuration map.

    (defn configure [system profile]
      (merge-with merge
         system
         (aero.core/read-config "config.edn" {:profile profile})))

# Aero extensibility

Finally, it's worth mentioning that Aero is extensible.

Garner Vickers has contributed a welcome improvement to Aero to allow
tag literals to be defined as defmethods.

For example, let's say you want to add a
[buddy](https://github.com/funcool/buddy) hasher to hash a string to a
byte array, doing this in the config directly rather than having to
write code. Now you can write something like this:

```clojure
{:session-secret #buddy.hash/sha256 "my secret passphrase"}
```

adding the following `defmethod`:

```clojure
(require '[buddy.core.hash :as hash])

(defmethod aero.core/reader 'buddy.hash/sha256
  [opts tag value]
  (hash/sha256 value))
```

# Conclusion

Configuration schemes that use implicit and allow overrides can lead to
situations where it is hard to reason about a system. It's better,
whenever possible, to use explicit schemes that make it obvious what
configuration values are set to.

JUXT's [Aero](https://github.com/juxt/aero) library provides a balanced
trade-off between then needs of flexibility, security and accuracy and
it suitable for a majority of small to mid-sized Clojure systems, and
can provide a flexible bootstrapping scheme for larger ones.
