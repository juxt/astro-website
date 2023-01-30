---
author: 'mal'
title: 'Component, meet Schema'
description: 'How to validate Clojure component systems'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2015-06-25'
heroImage: 'schema-meets.jpg'
tags:
  - 'macros'
---

At JUXT, most of our projects are structured using Stuart Sierra's
[component](https://github.com/stuartsierra/component) library.

Ideally, we should validate that the configuration and dependencies of
our components are fully satisfied, and that they meet a component's
expectations.

Validation isn't always necessary for smaller systems, but is useful
when systems grow beyond a certain size.

A great candidate for providing the validation logic is Prismatic's
[Schema](https://github.com/Prismatic/schema) library.

But what is the best way to integrate Schema?

# Option A: Validate in the record's constructor function

It is common to define a function that creates an instance of a
component record. This affords us the option to declare any dependency
expectations the component may have.

We could also perform validation in the function, at least for
constructor arguments. This is the approach I've been taking for the
past year or so.

```clojure
(require '[schema.core :as s])

(defn new-my-component [& {:as opts}]
  (s/validate {:some-parameter s/Int} opts)
  (using (map->Website opts) [:some-dependency]))
```

However, when components are constructed, dependencies are not present.
Dependencies are only _injected_ (or rather, the component record is
reconstructed with them) when the system is started.

Therefore, we can't check our dependencies are correct in the
constructor. They will always be nil.

# Option B: Validate in the start phase

We could validate our component in the `Lifecycle` start phase.

    (defrecord MyComponent [some-parameter some-dependency]
      Lifecycle
      (start [component]
        (s/validate {:some-parameter s/Int
                     :some-dependency (s/proto SomeProtocol)}
         component)))

Incidentally, we can also use schema's `defrecord` for this.

    (s/defrecord MyComponent
      [some-parameter :- s/Int
       some-dependency (s/proto SomeProtocol)]

      Lifecycle
      (start [component]
        (s/validate MyComponent component)
        component)
      (stop [component] component)

However, there are a few downsides with this approach.

- we need to add `Lifecycle` to all our components, even those that
  wouldn't otherwise need it

- if we throw errors in the system start phase we can leave the system
  in a half-started state which often requires a JVM reboot

# Option C: Validate independently, after the system has started

Alternatively, we can add a `check` function to our `user` namespace,
alongside the `start`, `stop` and `reset` functions.

```clojure
(defn check
  "Check for component validation errors"
  []
  (let [errors
        (->> system
             (reduce-kv
              (fn [acc k v]
                (assoc acc k (s/check (type v) v)))
              {})
             (filter (comp some? second)))]

    (when (seq errors) (into {} errors))))
```

We can call this check any time we like.

    user> (check)
    {:my-component {:some-parameter (not (instance? java.lang.Integer nil))}}

We can even add the following at the end of our usual `start` function

    (when-let [errors (check)] (println "Warning, component integrity violated!" errors))

so that we get a warning on the REPL on any _reset_ where any component
in the system has validation errors.

    user> (reset)
    :reloading ()
    Warning, component integrity violated!: {:my-component {:some-parameter (not (instance? java.lang.Integer nil))}}
    :ok

There are some key advantages to this approach. We avoid adding
validation logic to our component code, we only have to use schema
declarations when we care about validation. In other words, we only
validate components that have added these declarations, components
without them pass the validation check as usual.

I've been trying this approach for a few weeks and it's been holding up
well.
