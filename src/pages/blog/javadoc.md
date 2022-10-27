---
author: 'mal'
title: 'javadoc from the repl'
description: 'How to launch javadoc in your REPL'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '06 Oct 2015'
heroImage: 'javadoc-repl.jpg'
---

One of the [pearls presented by Renzo Borgatti at this year's
ClojuTRE](https://www.youtube.com/watch?v=QI9Fc5TT87A) was the
little-known `javadoc` function.

I keep a local copy of the Java 8 SDK apidocs on my machine, which come
in useful when you're coding close to the host platform. (For example,
right now I'm coding with `java.nio.ByteBuffer` and find I need quick
access to the docs. Until now I've been opening up the apidocs manually
and searching for what I need by scrolling through the index of the
gazillion or so Java type names that form part of the JDK.)

For what it's worth, I installed the Java 8 apidocs with pacman.

    sudo pacman -Sy openjdk8-doc

Now I can add the following to my `~/.lein/profiles.clj` :-

```clojure
{:user
  {:repl-options
    {:init
      (do
        (require '[clojure.java.javadoc :refer [javadoc]])
        (clojure.java.javadoc/add-local-javadoc
          "/usr/share/doc/java8-openjdk/api/"))}
  }
}
```

Now, any time I launch a REPL, I can do the following

```clojure
(javadoc java.lang.String)
```

and up pops a browser with the javadoc. Thanks Renzo!

The advantage of using `~/.lein/profiles.clj` rather than `project.clj`
is that it doesn't affect other users of the project, who may be using
other operating systems or distros.

# Working with other namespaces

For most of my projects, the first thing I do when launching the JVM is
switch to a `dev` namespace. This means that if there are any
compilation issues with `dev`, I can fix them with a working REPL.

However, what becomes of our `javadoc` function? It is no longer
present. Therefore I've added the following to the `dev` namespaces of
my projects.

```clojure
(ns dev
  (:require
    [clojure.java.javadoc :refer [javadoc]]
  …
))
```

Fortunately, the local javadoc location persists I don't have to set it
again. This means that I can set it once, with
`clojure.java.javadoc/add-local-javadoc`, in my local Leiningen
`profiles.clj`, and it will set things up for me without affecting those
working in other operating systems and distros.
