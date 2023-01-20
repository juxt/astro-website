---
author: 'dmc'
title: 'What React Hooks mean for ClojureScript'
description: 'And some examples'
category: 'clojurescript'
layout: '../../layouts/BlogPost.astro'
publishedDate: '07 Feb 2019'
heroImage: 'hook.jpg'
tags:
  - 'hooks'
---

When I first heard about ClojureScript, I looked at it through the lens
of my JavaScript experience. I assumed it would be like
[CoffeeScript](https://coffeescript.org/), you pretty much know the
JavaScript you are generating, but now you get to type less. With
ClojureScript there's a gap between the code I write and the code that's
generated, and this gap provides powerful leverage.

I've often felt the ClojureScript community should seek to understand
and exploit React better. Too many times, by trying to make React easier
and more convenient, most ClojureScript libraries obscure many of its
important features.

For example, most ClojureScript-based React wrappers try very hard to
avoid classes, replacing the many React lifecycle methods with a single
render function. Sometimes, this is sufficient but in many situations
it's unhelpful.

This subtle act of wrapping classes results in libraries inventing novel
mechanisms to provide access to the React lifecycle methods. In
reframing the object oriented paradigm of React into a functional
programming one, some complexities are introduced.

Fortunately, React now has a feature that lets us eliminate this
complexity. This new feature is called
[hooks](https://reactjs.org/blog/2019/02/06/react-v16.8.0.html).

Hooks allow you to use _plain functions as components_, even if they
need to utilize lifecycle methods (e.g. for state). ClojureScript
library authors no longer need to invent function-based wrappers on
React, they can simply use hooks.

There are already [plenty of examples](https://usehooks.com/) of where
hooks can lead to simpler code.

Using hooks directly in functions rather than wrapping with custom
mechanisms means the work of the large JavaScript community is more
accessible than before. [The community](https://usehooks.com/) is
already hard at work creating new hooks.

I've created a
[project](https://github.com/SevereOverfl0w/edge/tree/react-16.8-raw/juxt.blog.react-hooks-raw)
you can use to experiment with the snippets below yourself.

# How hooks can be used in ClojureScript

Let's see how we can use hooks in ClojureScript.

We'll start with a very basic React wrapper:

```clojure
(ns ^:figwheel-hooks juxt.blog.react-hooks-raw.frontend.main)

(defn e ;;
  [el props & children]
  (apply js/React.createElement el (clj->js props) children))

(defn mount ;;
  []
  (js/ReactDOM.render
    (e "div" nil "Hello, world")
    (js/document.getElementById "app")))

;; This is called once
(defonce init (mount))

(defn ^:after-load reload [] ;;
  (mount))
```

- `e` provides a shorthand for calling the `React.createElement`
  method, and also converts ClojureScript maps into JavaScript ones
  automatically.

- Then we create a `mount` function which can mount an `e`-created
  `<div>` into the \"#app\" on the page with the contents \"Hello
  world\".

- Finally, there's a little setup to enable live reloading.

This serves to show what's under the hood of `r/render` in your
favorite React wrapper: not much!

# State hook

Let's get to our first use of hooks. This example is taken straight from
the [Introducing Hooks](https://reactjs.org/docs/hooks-intro.html) post.

```clojure
(defn Example
  []
  (let [[count setCount] (js/React.useState 0)] ;;
    (e "div" nil
       (e "p" nil "You clicked " count " times")
       (e "button"
          {:onClick
           (fn [e]
             (setCount (inc count)))}
          "Click Me"))))

(defn mount
  []
  (js/ReactDOM.render
    (e Example nil)
    (js/document.getElementById "app")))
```

- useState returns a vector of 2 elements: the current value, and a
  function to update the current value.

We have a simple component with state, in very little code. This is
exciting because, without any libraries, we're able to _easily_ take
advantage of React's new lifecycle mechanism (without resorting to
something like
[create-react-class](https://www.npmjs.com/package/create-react-class)).
This code is easy to understand, and barely feels awkward, except for
`e`.

<div class="blog-card">
<div class="blog-card__padding">
<strong>Example</strong>
<div id="example">Loading…</div>
</div>
</div>

# Removing the `e` function

`e` is difficult to read and other than pre-processors and JSX, the
React community has no new solutions here. Fortunately, there are
_lightweight libraries_ which provide better wrappers than `e`.

1.  <https://github.com/weavejester/flupot>

2.  <https://github.com/rauhs/hicada>

3.  <https://github.com/r0man/sablono>

All of these libraries are unconcerned with React components. Their only
responsibility is to create React elements. This is ideal for our case,
as we want to use functions with hooks.

I'm going to use hicada for this example. Hicada is very easy for anyone
who has used Hiccup before. This allows us to rewrite the above example
like so:

```clojure
(defn ExampleHicada
  []
  (let [[count setCount] (js/React.useState 0)]
    (html
      [:div
       [:p "You clicked " count " times"]
       [:button {:onClick (fn [e]
                            (setCount (inc count)))}
        "Click Me"]])))
```

<div class="blog-card">
<div class="blog-card__padding">
<strong>ExampleHicada</strong>
<div id="example-hicada">Loading…</div>
</div>
</div>

# Complex state example: [useReducer](https://reactjs.org/docs/hooks-reference.html#usereducer)

We frequently use `swap!` for updating state in ClojureScript. In React,
Redux is a popular library for managing state. It's similar to re-frame
in that you dispatch events and handle them elsewhere. React includes
`useReducer`, which seems to have been inspired by Redux.

```clojure
(defn counter-reducer
  [state action]
  (case (:type action)
    :inc (update state :count inc)
    :dec (update state :count dec)))

(defn Counter
  [initial-state]
  (let [[state dispatch] (js/React.useReducer counter-reducer
                                              (js->clj initial-state :keywordize-keys true))]
    (html
      [:*
       "Count: " (:count state)
       [:button {:onClick #(dispatch {:type :inc})} "+"]
       [:button {:onClick #(dispatch {:type :dec})} "-"]])))
```

In the future, we will see a definite shift by React users towards using
hooks for state management.

I'm hopeful we will see a version of Relay or Apollo which uses hooks,
making them more accessible to us in Clojure. Currently it is difficult
to use GraphQL which matches your component structure, and I've wanted
this in a few projects.

<div class="blog-card">
<div class="blog-card__padding">
<strong>Counter</strong>
<div id="counter">Loading…</div>
</div>
</div>

# Side effects

This one is a personal favorite because I've seen this done wrong in a
number of contexts. `useEffect` really simplifies interacting outside of
the purity of the DOM.

```clojure
(defn Effect
  []
  (let [[count setCount] (js/React.useState 0)]
    (js/React.useEffect (fn []
                          (set! (.-title js/document)
                                (str "You clicked " count " times"))
                          identity))

    (html
      [:div
       [:p "You clicked " count " times"]
       [:button {:onClick (fn [e] (setCount (inc count)))}
        "Click Me"]])))
```

This is really powerful, and the provided interface is simple. Getting
this wrong was common due to the amount of manual wiring required with
classes, especially as classes are hidden by default to us.

<div class="blog-card">
<div class="blog-card__padding">
<strong>Effect</strong>
<div id="effect">Loading…</div>
</div>
</div>

# Key Bindings

This one is lifted from <https://usehooks.com>. I chose it because I
wanted to see how easily JavaScript-defined custom hooks could be
integrated into a ClojureScript project. I added an `export` before the
function, and updated it's access to React. Using it is easy in
ClojureScript:

```clojure
(defn EmojiKeys
  []
  (let [happyPress (useKeyPress "h")
        sadPress (useKeyPress "s")
        robotPress (useKeyPress "r")
        foxPress (useKeyPress "f")]
    (html
      [:div
       [:div
        "["
        (when happyPress "😊")
        (when sadPress "😢")
        (when robotPress "🤖")
        (when foxPress "🦊")
        "]"]
       [:div "h, s, r, f"]])))
```

Pressing different keys will cause different emojis to show.
Automatically, the window bindings for key presses are cleaned up by the
keypress hook when the component is unmounted.

<div class="blog-card">
<div class="blog-card__padding">
<strong>EmojiKeys</strong>
<div id="emoji-keys">Loading…</div>
</div>
</div>

# Writing our own hook from scratch

We can easily utilize advanced functionality behind a simple interface
with hooks, but how easy is it to write our own? One neat aspect of
hooks is how they compose, so we can write hooks by utilizing built-in
hooks. Building a view onto an atom can be done with `useEffect` and
`useState`:

```clojure
(defn useLens
  [a f]
  (let [[value update-value] (js/React.useState (f @a))]
    (js/React.useEffect
      (fn []
        (let [k (gensym "useLens")]
          (add-watch a k
                     (fn [_ _ _ new-state]
                       (update-value (f new-state))))
          (fn []
            (remove-watch a k)))))
    value))
```

Using `useLens` is as simple as using the built-in hooks:

```clojure
(defonce state-atom (atom {:foo 1
                           :bar 1
                           :baz 1}))

(defn Stateful
  []
  (let [x (useLens state-atom #(* (:foo %) (:bar %)))
        all (useLens state-atom identity)]
    (html
      [:div
       "foo*bar = " [:strong x]
       [:code [:pre (prn-str all)]]
       [:button
        {:onClick #(swap! state-atom update :foo inc)}
        "More foo"]
       [:button
        {:onClick #(swap! state-atom update :bar inc)}
        "More bar"]
       [:button
        {:onClick #(swap! state-atom update :baz inc)}
        "More baz"]])))
```

This gives you part of the semantics of the single-state atom pattern
that's prevalent in ClojureScript _by building on React's primitives_.
It's easy to see how a full cursor implementation could be built using
hooks.

<div class="blog-card">
<div class="blog-card__padding">
<strong>Stateful</strong>
<div id="stateful">Loading…</div>
</div>
</div>

# Hooks are not just for ClojureScript

React haven't added hooks to grab more ClojureScript mind-share. React
team member Dan Abramov has been documenting the
[why](https://medium.com/@dan_abramov/making-sense-of-react-hooks-fdbde8803889),
and [how](https://overreacted.io/why-do-hooks-rely-on-call-order/) of
hooks, so I won't discuss at length all the advantages hooks bring.

Hooks are more than just an alternative way of accessing the lifecycle,
but they **radically alter how you compose functionality together**. I
had a [Bret Victor](https://www.youtube.com/watch?v=PUv66718DII) moment
when Dan
[tweeted](https://twitter.com/dan_abramov/status/1058837112789839872)
the ability to drop in adjustment bars into any component. Historically,
something like this would have required render props & component
wrapping, which hiccup-style react libraries make more difficult.

Furthermore, the React team's experiments show that code using hooks
minifies significantly smaller than when using classes. \@jamiebuilds on
twitter [made a
comparison](https://twitter.com/jamiebuilds/status/1056015484364087297).

All round, hooks are a big win for React.

# Conclusion

The recent introduction of hooks in React has created a brand new
opportunity to provide far better integrations between ClojureScript and
React.

This is a significant milestone in the development of user interfaces in
ClojureScript.

<script crossorigin src="https://unpkg.com/react@16/umd/react.development.js"></script>
<script crossorigin src="https://unpkg.com/react-dom@16/umd/react-dom.development.js"></script>
<script src="/scripts/react-hooks-raw.js"></script>
