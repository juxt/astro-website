---
author: 'sta'
title: 'Datalog for trees in Clojure'
description: 'How to use Datalog in Clojure to match and extract information from trees'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2015-10-20'
heroImage: 'datalog-for-trees.jpg'
tags:
  - 'clojurescript'
---

I recently became curious about
[Datalog](https://en.wikipedia.org/wiki/Datalog) and its applications on
program analysis. There seems to be quite a lot of
[literature](http://people.csail.mit.edu/mcarbin/papers/aplas05.pdf)
around the subject, and given that [all code can be represented as a
tree](https://en.wikipedia.org/wiki/Abstract_syntax_tree), it would
imply that Datalog is especially well-suited for querying trees. I was
keen to find out more on a practical level, but I thought that learning
about program analysis **and** tree queries with Datalog at the same
time would be a bit challenging, so I thought to experiment on a kind of
tree that I know a bit better: the DOM.

This blog post will show you how to encode a DOM-like structure to
DataScript data, and how to use DataScript queries (along with a few
rules) to perform queries against the structure in order to extract
data. You can use this as a way to bootstrap your understanding of how
Datalog can be used to query any tree structure.

# Weapons of choice

The experiment was done in Clojure of course, and I've uploaded it as [a
project on github](https://github.com/stathissideris/datascript-dom), so
if you'd like to try stuff as you read, do:

    git clone git@github.com:stathissideris/datascript-dom.git

And start your REPL on the project with Leiningen.

There are two flavours of Datalog in the Clojure ecosystem,
[Datomic](http://www.datomic.com/) and
[DataScript](https://github.com/tonsky/datascript). Datomic is of course
a commercial database with a free version, and DataScript is an [open
source](https://github.com/tonsky/datascript/blob/master/LICENSE)
in-memory-only Datalog database that used to be ClojureScript-only, but
now also runs on the JVM. Because this is only a small experiment (and
because it's more forgiving/flexible with schemas etc), I chose to go
with DataScript in this case, but the same queries would apply to
Datomic with very few changes (the Datomic schema would need to be much
more extensive).

For HTML parsing, I used Daniel Janus\'
[clj-tagsoup](https://github.com/nathell/clj-tagsoup) which provides a
robust way to parse messy HTML into a
[hiccup](https://github.com/weavejester/hiccup)-like data structure (you
may end up with extra \<body\> and \<head\> tags when using it -- not
sure why, but this is just an experiment).

# Encoding the tree

The first task is to take the output of clj-tagsoup and turn it into
transactions that can then be passed to DataScript in order to establish
a number of facts about our tree. Let's have a look at the output of
clj-tagsoup:

```clojure
(require '[pl.danieljanus.tagsoup :as html])
(html/parse-string "<html><body class=\"test\"><p>A<b>B</b>C<i>D</i>E</p><p>hohoho</p></body></html>")
```

Produces:

```clojure
[:html {} [:body {:class "test"} [:p {} "A" [:b {} "B"] "C" [:i {} "D"] "E"] [:p {} "hohoho"]]]
```

You can see that it looks like the hiccup syntax, but a bit more
consistent because you always get a map in the second position, even if
there are no attributes.

There is a nice correspondence between DOM and DataScript: the DOM
elements have attributes, entities in Datalog also have attributes, and
that's how we are going to encode them. To simplify things a bit, we are
not going to prefix the HTML attribute keywords with a namespace, we'll
just use them as they are returned from clj-tagsoup.

The tag name is going to be encoded as a `:dom/tag` attribute in
DataScript to prevent any clashes with the bare keywords of the actual
attributes. DataScript does not expect you to put anything in the schema
unless there is something special about it (cardinality or a special
type), so we don't need to declare any of the attributes in advance, we
will simply store them as we encounter them. Both DataScript and Datomic
support transactions that look like [nested
maps](http://docs.datomic.com/transactions.html#sec-3-5), but we would
need to transform the original tree to something that resembles the
[enlive
syntax](https://github.com/cgrand/enlive/wiki/Getting-started#html-source):

```clojure
[{:dom/tag :html
  :child
  [{:dom/tag :body
    :class "test"
    :child
    [{:dom/tag :p
      :child
      [{:dom/tag :text-node :text "A"}
       {:dom/tag :b :child [{:dom/tag :text-node :text "B"}]}
       {:dom/tag :text-node :text "C"}
       {:dom/tag :i :child [{:dom/tag :text-node :text "D"}]}
       {:dom/tag :text-node :text "E"}]}
     {:dom/tag :p
      :child [{:dom/tag :text-node :text "hohoho"}]}]}]}]
```

Notice that free text elements are encoded as artificial `:text-node`
tags. This transaction captures the basic information about tags and the
structure of the tree. The naming of the `:child` key may seem odd in
this context because it's singular, but it reads better like that in
queries (`[?a :child ?b]` -- \"a has a child called b\").

What's missing from this transaction is the order of siblings on the
same level: if we stored it like that, there wouldn't be a way to figure
out the order of the children of the first paragraph, or even which
paragraph comes first because Datalog's relationships do not retain
order. Because of this, we need to add an index to each entity to
explicitly capture its order. So our task is to transform this:

```clojure
[:html {} [:body {:class "test"} [:p {} "A" [:b {} "B"] "C" [:i {} "D"] "E"] [:p {} "hohoho"]]]
```

Into this:

```clojure
[{:dom/tag :html
  :child
  [{:dom/tag :body
    :class "test"
    :child
    [{:dom/tag :p
      :child
      [{:dom/tag :text-node :text "A" :dom/index 0}
       {:dom/tag :b
        :child [{:dom/tag :text-node :text "B" :dom/index 0}]
        :dom/index 1}
       {:dom/tag :text-node :text "C" :dom/index 2}
       {:dom/tag :i
        :child [{:dom/tag :text-node :text "D" :dom/index 0}]
        :dom/index 3}
       {:dom/tag :text-node :text "E" :dom/index 4}]
      :dom/index 0}
     {:dom/tag :p
      :child [{:dom/tag :text-node :text "hohoho" :dom/index 0}]
      :dom/index 1}]
    :dom/index 0}]
  :dom/index 0}]
```

In contrast to Datomic, DataScript is pretty free-form when it comes to
schemas, so the schema you are going to need is pretty minimal:

```clojure
(def schema
  {:child {:db/valueType   :db.type/ref
           :db/cardinality :db.cardinality/many}})
```

Because all relationships are bi-directional in Datalog, you can always
query for the parent when you know the child, so it doesn't matter which
direction the reference is pointing to.

You may have noticed that in order to perform this conversion we need to
have some context for each node of the tree being visited, namely its
previous sibling in order to figure out what index to assign to it.
Because we are doing a context-aware tree walk, the functions of the
`clojure.walk` namespace won't be sufficient. We need to bring out the
tree superweapon: zippers.

As we walk the tree, we are going to convert each node from its
clj-tagsoup vector-based representation into the enlive-like
representation suitable for the transaction, using a simple function:

```clojure
(defn- to-entity [node]
  (if-not (string? node)
    (merge
     {:dom/tag (html/tag node)}

     ;;include attributes, but not :id
     (dissoc (html/attributes node) :id)

     ;;id will ne given a special name
     (when-let [id (:id node)] {:dom/id id})

     ;;assoc children -- if present
     (when-let [children (html/children node)]
       {:child children}))

    ;;if it's a string, encode as text-node
    {:dom/tag :text-node
    :text    node}))
```

If you look at the [documentation of
`clojure.zip/zipper`](https://clojuredocs.org/clojure.zip/zipper),
you'll see that in order to use a zipper over your tree structure, you
need 3 functions: `branch?`, `children` and `make-node`. Based on the
output of `to-entity`, creating the zipper will look like this:

```clojure
(defn dom-zipper [dom]
  (zip/zipper
   (fn [node] (not-empty (:child node))) ;;branch?
   :child ;;children
   (fn [node children] (assoc node :child children)) ;;make-node
   dom))
```

We can use this zipper to walk and transform the original tree:

```clojure
(defn dom->transaction [dom]
  (loop [zipper (dom-zipper dom)]
    (if (zip/end? zipper)
      [(zip/root zipper)]
      (recur (zip/next (replace-node zipper))))))
```

`zip/next` visits each node in the tree, depth-first. When the end is
reached, `zip/root` returns the tranformed tree. The actual node
tranformation happens in `replace-node`:

```clojure
(defn- replace-node [zipper]
  (let [dom-index (or (some-> zipper zip/left zip/node :dom/index inc) 0)]
    (zip/replace
     zipper
     (-> zipper
         zip/node
         to-entity
         (assoc :dom/index dom-index)))))
```

`dom-index` is calculated by looking to the left of the current position
of the zipper, which if it contains a node, it will have already been
transformed (because `zip/next` traverses the tree left to right). If
there are no siblings to the left of the current position, `zip/left`
will return `nil`, and `+some->+` will bail out and return `nil`.
Otherwise the chain of calls continues to `zip/node` and all the way to
`inc` which calculates the index as the index of the node to our left
+1. If at any point this expression evaluates to `nil`, we assume we are
at the first node, so the index becomes zero. The rest of the function
replaces the old tree node with the result of `to-entity` and
\`\`assoc\`\`s the `dom-index`.

At this stage, we are ready to load up our data into DataScript and
start querying!

```clojure
(def small-dom
  (html/parse-string
    "<html><body class=\"test\"><p>A<b>B</b>C<i>D</i>E</p><p>hohoho</p></body></html>"))
(def small-conn (d/create-conn schema))
(d/transact small-conn (dom->transaction small-dom))
```

# First contact with queries

First let's see if we can query on the class attribute to find the
\<body\> tag:

```clojure
(d/q '[:find [(pull ?node [*]) ...]
       :where
       [?node :class "test"]]
     @small-conn)
```

Produces:

```clojure
[{:db/id 2 :child [{:db/id 3} {:db/id 11}] :class "test" :dom/index 0 :dom/tag :body}]
```

For the query syntax see the [Datomic
documentation](http://docs.datomic.com/query.html). The weird syntax in
the find specification is using the [pull
API](http://docs.datomic.com/pull.html) to retrieve the whole of the
entity (if we just said `?node` we would simply get the entity's
`:db/id`).

To find the root:

```clojure
(d/q '[:find (pull ?node [:dom/tag]) .
       :where
       [?node _]
       [(missing? $ ?node :_child)]]
     @small-conn)
```

Produces:

```clojure
{:dom/tag :html}
```

The dot at the end of the find spec instructs DataScript to return a
single result (we do expect to have a single root after all!)

As we experiment with queries, certain patterns emerge that can be
defined as re-usable rules in DataScript. The previous query can be
written as:

```clojure
(d/q '[:find (pull ?node [:dom/tag]) .
       :in $ %
       :where (root ?node)]
     @small-conn
     '[[(root ?node)
        [?node _]
        [(missing? $ ?node :_child)]]])
```

See the [actual
code](https://github.com/stathissideris/datascript-dom/blob/master/src/datascript_dom/core.clj)
for the rules that I defined while experimenting (stored at the top, see
`+(def rules ...)+`). There are a few rules that warrant some
explanation:

```clojure
[(siblings ?a ?b)
 [?p :child ?a]
 [?p :child ?b]
 [(!= ?a ?b)]]
```

This simply says that `?a` and `?b` are siblings when they have the same
parent `?p`, but they can't be identical.

Here is a slightly more involved rule, which compares the `:dom/index`
attributes of nodes to determine whether they are siblings that are
adjacent to each other:

```clojure
[(next-sibling ?this ?sib)
 (siblings ?sib ?this)
 [?this :dom/index ?i1]
 [?sib :dom/index ?i2]
 [(- ?i2 ?i1) ?diff]
 [(= ?diff 1)]]
```

Here's a recursive rule that tests whether a node is an ancestor of
another node:

```clojure
[(anc ?par ?child)
 (?par :child ?child)]
[(anc ?anc ?child)
 (?par :child ?child)
 (anc ?anc ?par)]
```

Note that rules can have multiple definitions (like the `anc` rule), but
each definition has to have the same arity (number of variables). The
rules can be used in multiple ways. For example, you can use the `anc`
rule if you know the child but not the ancestor, or you may only know
the ancestor and you are querying for the child. Logic programming gives
you this kind of flexibility.

Here's the `anc` rule in action, used to retrieve all the ancestors of
the \<b\> tag recursively:

```clojure
(d/q '[:find [(pull ?anc [:dom/tag]) ...]
       :in $ %
       :where
       [?node :dom/tag :b]
       (anc ?anc ?node)]
     @small-conn rules)
```

Produces:

```clojure
[{:dom/tag :p} {:dom/tag :body} {:dom/tag :html}]
```

# More complex querying with real-life HTML

At this stage we're ready to try the same approach on a more complex
DOM. I've saved the IMDB page of the film \"TRON\" in the resources
folder, and we will attempt to extract some basic facts about the film
from the HTML:

```clojure
(def dom (html/parse (io/file "resources/tron.html")))
(def conn (d/create-conn schema))
(def _ (d/transact conn (dom->transaction dom)))
```

The `+(def _ ...)+` is to prevent Clojure from printing the whole result
of transact, because it's too large.

Here's how to extract the title and year:

```clojure
(let [[title year]
      (d/q '[:find [?title ?year]
             :in $ %
             :where
             [?h1 :dom/tag :h1]
             [?h1 :child ?name-node]
             [?name-node :dom/tag :span]
             [?name-node :itemprop "name"]
             (text ?name-node ?title)

             ;;year-node is the next sibling of name-node
             (next-sibling ?name-node ?year-node)
             (?year-node :child ?a-node) ;;...and it contains an <a> tag
             (?a-node :dom/tag :a)
             (text ?a-node ?year)] ;;and the <a> tag contains the year
           @conn rules)]
  {:title title
   :year  year})
```

Produces:

```clojure
{:title "TRON", :year "1982"}
```

The `text` rule in the previous example either extracts the text of the
all text nodes within a `container` node (caution, their order is not
guaranteed!), or returns the text attribute of the node itself if it
happens to be a `text-node`:

```clojure
[(text ?container ?text)
 [?container :child ?text-node]
 [?text-node :dom/tag :text-node]
 [?text-node :text ?text]]
[(text ?container ?text)
 [?container :dom/tag :text-node]
 [?container :text ?text]]
```

Here's a function that demonstrates how to use the `dom/index` attribute
to return results in the correct order:

```clojure
(defn tech-spec [conn label]
  (->>
   (d/q '[:find ?index ?value-text ;;return both to get order
          :in $ % ?label-text
          :where
          [?label :dom/tag :h4]
          [?label :class "inline"]
          (text ?label ?label-text)

          (siblings ?label ?value)
          (text ?value ?value-text)
          [(!= "|" ?value-text)] ;;exclude separators

          (?value :dom/index ?index)]
        @conn rules label)
   (sort-by first)
   (map (comp (fn [x] (.trim x)) second))))
```

Example output:

```clojure
(tech-spec conn "Runtime:") => ("96 min")
(tech-spec conn "Aspect Ratio:") => ("2.35 : 1")
(tech-spec conn "Sound Mix:") => ("70 mm 6-Track" "(70 mm prints)" "Dolby" "(35 mm prints)")
```

It's not worth copying and pasting the rest of the code here (it's
either self-explanatory or heavily commented). You can find queries that
extract the title, the ratings, the cast (which also demonstrates
passing and [using custom
functions](https://github.com/stathissideris/datascript-dom/blob/master/src/datascript_dom/core.clj#L307)),
genres, duration and tech specs.

# Conclusion

I think using DataScript for querying the DOM worked out pretty well,
and it looks promising for other types of trees. DataScript's
documentation is still a bit sparse -- I found myself either reading
its source or referring to Datomic's documentation and hoping that it
applies to DataScript (in most cases it does, with the exception of
custom functions). DataScript assumes some Datomic knowledge, and, to be
fair, the readme is very clear about differences to Datomic and about
features that are not implemented yet (like `not` clauses).

This approach is definitely way more verbose than something like XPATH,
or a number of [other libraries](https://github.com/cgrand/enlive)
implementing [CSS selectors](http://www.w3.org/TR/css3-selectors/), but
the fact that it's extensible with rules and custom functions makes it
more versatile, and certainly a good fit for cases where your tree data
is not DOM-like.

# See also

[datomizer](https://github.com/pmbauer/datomizer) - An experimental data
structure marshaling library for Datomic

Discuss below or [join the
discussion](https://news.ycombinator.com/item?id=10432359) on Hacker
News.
