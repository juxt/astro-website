---
author: 'mal'
title: 'Processing documents with transducers'
description: 'Using transducers to extract information from XML, JSON and other documents'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2018-03-27'
heroImage: 'processing.jpg'
tags:
  - 'transducers'
---

In this article we will develop a set of transducers which can be
composed to extract data from an XML document (although the principles
here can be applied to any tree-structured format, including JSON).

The built-in Clojure library already has support for
[zippers](https://clojuredocs.org/clojure.zip/zipper) to navigate an XML
document. But there are limitations. Zippers are complicated animals to
work with, take quite a lot of setting up and require that the document
fits in memory. As an experiment, let's see how far we can get with
transducers instead.

# Getting started

Let's start with an example XML file, which we'll save to `example.xml`.

```xml
<book>
  <frontmatter/>
  <chapter name="Introduction">
    <para>Here is the intro</para>
    <para>Another paragraph</para>
  </chapter>
  <chapter name="Conclusion">
    <para>All done now</para>
  </chapter>
</book>
```

Clojure already contains an XML parser. We'll use it to parse our
document into a Clojure map.

```clojure
(require '[clojure.xml :as xml])

(def doc (xml/parse "example.xml"))
```

`xml/parse` parses the file into a tree structure like this

```clojure
{:tag :book :attrs {} :content [...]}
```

# Descending into the content

The first transducer we shall write will be one that descends into the
node's child elements.

Transducers work on sequences (or streams) of data. Since we want to get
the children of multiple nodes into a single combined sequence, we'll
use `mapcat` rather than `map`.

Here's our first transducer

    (def children (mapcat :content))

Give it a sequence of nodes and it will return a sequence of children.

    (sequence children [doc])

which results in

```clojure
({:tag :frontmatter, :attrs nil, :content nil}
 {:tag :chapter,
  :attrs {:name "Introduction"},
  :content
  […]}
 {:tag :chapter,
  :attrs {:name "Conclusion"},
  :content […]})
```

# Select children based on their tag

Usually we want to select children by some criteria. It's very common to
select child elements by their tag names.

So let's compose a transducer that will filter children by their tag
name, using an arbitary predicate.

    (defn tagp [pred]
      (comp children (filter (comp pred :tag))))

We've just created a function, named 'tagp\`, that given a predicate,
returns a transducer which selects some nodes' children and filters them
by their tag names.

(Transducers are infinitely composeable in this way, which gives great
flexibility.)

It's very common to want to use an equality predicate, so we can select
children by tag name. So let's create a convenience function for this.

```clojure
(defn tag= [tag]

  (tagp (partial = tag)))
```

Now we can select all the chapter nodes of our example doc like this.

```clojure
(sequence (tag= :chapter) [doc])
```

which results in

```clojure
({:tag :chapter,
  :attrs {:name "Introduction"},
  :content
  [{:tag :para, :attrs nil, :content ["Here is the intro"]}
   {:tag :para, :attrs nil, :content ["Another paragraph"]}]}
 {:tag :chapter,
  :attrs {:name "Conclusion"},
  :content [{:tag :para, :attrs nil, :content ["All done now"]}]})
```

Note that we have only replaced the `children` transducer with our new
_get elements by tag name_ one.

Let's use this transducer to count the number of chapters in our example

```clojure
(->> [doc]
     (sequence (tag= :chapter))

     count)
```

which results in 2.

# Select children based on their attributes

Similarly, we can build `attrp` and `attr=` to select children based on
their attributes. Since the attributes are contained in the `:attrs`
entry, we need to compose an accessor to access them.

```clojure
(defn attr-accessor [a]
  (comp a :attrs))
```

Now we can create our 2 attribute transducers.

```clojure
(defn attrp [a pred]
  (filter (comp pred (attr-accessor a))))

(defn attr= [a v]

  (attrp a (partial = v)))
```

Let's use our `attr=` transducer to count how many chapters have an
attribute `name` of _Conclusion_.

```clojure
(->> [doc]
       (sequence (comp (tag= :chapter)

                       (attr= :name "Conclusion")))

       count)
```

which results in 1.

# Towards a path-based query language

Let's re-write that code above to expose a path syntax. We simply apply
`comp` over the path to yield the same composite transducer as before.

```clojure
(let [path [(tag= :chapter) (attr= :name "Conclusion")]]

  (->> [doc]
         (sequence (apply comp path))
         count))
```

Note how we have now built a primitive, yet arguably more powerful,
version of XPath.

Let's implement XPath's `text()` function as a transducer

```clojure
(def text (comp (mapcat :content) (filter string?)))
```

We could implement other XPath node selectors in the same
straight-forward way.

# Putting it all together

We can now compose all these transducers to extract paragraphs in our
document. Let's extract just the paragraphs of the chapter named
_Introduction_.

```clojure
(let [path
       [(tag= :chapter) (attr= :name "Introduction") (tag= :para) text]]

    (sequence (apply comp path) [doc]))
```

which results in this list

```clojure
("Here is the intro" "Another paragraph")
```

One reason why this approach is more powerful than XPath is that we are
not limited to using XPath's built-in functions, but can inject custom
transducers or any other functions into our _path_ to do anything we
like, even something that's would be impossible in XPath, such as
creating a map between the chapter names and the text of their
paragraphs.

```clojure
(->> [doc]
     (sequence (comp
                 (tag= :chapter)

                 (map (juxt (attr-accessor :name)
                            #(sequence (comp (tag= :para) text) [%])))))

     (into {}))
```

which results in

```clojure
{"Introduction" ("Here is the intro" "Another paragraph"),
 "Conclusion" ("All done now")}
```

Nor are we limited to XML. With some easy modifications, we can build a
path query for JSON or other formats.

# Exercise

As an exercise left for the reader, can you implement XPath's
**descendants** as a transducer?

Discuss below or [join the
discussion](https://news.ycombinator.com/item?id=9645442) on Hacker
News.
