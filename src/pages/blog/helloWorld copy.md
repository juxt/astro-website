---
author: 'lda'
category: 'technology'
layout: '../../layouts/BlogPost.astro'
title: 'Speed up your ClojureScript Webapp'
description: "Bring your markdown, we'll handle the rest. Space shuttle leaving curved trail in the sky."
publishDate: '17 Jul 2022'
heroImage:
  src: '/images/blog/mock.webp'
  alt: 'Space shuttle leaving curved trail in the sky'
---

From October 2020 until July 2021, I had the chance to work on an exciting greenfield project in the investment sector. The goal was to develop a data-intensive webapp able to handle hundreds of UI changes per second along with the resolution of thousands of formulas, taking as inputs live market data and user entered values.

As this has been the most performance-critical software I have built so far, I thought it might be useful to share the approaches and tools that were adopted to tackle slow performance, involving both scripting and rendering.

The project stack includes:

- Reagent
- Re-frame
- Re-graph
- Ag-grid/Ag-charts

## Identifying the bottlenecks

### Runtime Performance Analyzer

Browser developer tools are great at spotting slowdowns and their cause. In particular, the runtime performance analyzer provides in-depth insights about your app performance while it is running. The final report shows a dissected view of the code, which is presented as a stack of functions in a timeline, therefore making clear which parts take longer to execute. To know more about this tool you can check out [this tutorial](https://developer.chrome.com/docs/devtools/evaluate-performance/), so you can learn how to make the most out of it.

To illustrate the usefulness of this tool let's start by looking at the performance of a single task:

What you see above is a WebSocket message being received and processed. From the top, `channel.port1.onmessage` is the function that is invoked when the payload pings the client. Going down the stack, there are a bunch of internal re-frame functions that finally lead to the app business logic with the call to `app$events$graph_feed_values_BANG_`.

By hovering over the rectangle, you get the number of milliseconds the function in question took to execute. However, by clicking on it you can view a lot of extra information that helps better explore the code.

Focusing on the `Bottom-Up` pane, a list of activities can be sorted by Self and Total time to immediately identify the slow running functions. Additionally, by clicking on any of the file name links located at the end of the rows, you can see the individual lines of source code that are likely to downgrade performance.

With only a 20 second investigation, we were able to spot that line `185` in the `calculations2.cljs` file might be taking too long to complete, so we have a good starting point for making some improvements.

By right clicking over the area with the milliseconds it is also possible to add breakpoints, to pause the app execution for data inspection whenever the relevant line of code is invoked.

### Performance Monitor

This tool runs while the user interacts with the app, and it tracks core metrics such as CPU usage, JS heap size, and so on. Although the performance monitor doesn't tell us as much as the runtime performance analyzer, it still provides a great top level view of your app, indicating its overall health.

The performance monitor can be found by hitting `ESC` from the devtools. If it's not among the available tabs, it needs to be added from the left three-dots menu. Here's a picture of what it looks like:

## Squeezing out performance

### JS vs CLJS data structures

When possible, you should avoid going back and forth between JS and CLJS data structures via the functions `clj->js` and `js->clj`. If you know some data structure will be consumed by a JS component, consider providing it in JS.

For example, AG Charts, a charting library, expects an array of objects as one of the parameters i.e. `[{value: 1}, {value: 2}]`. Instead of providing a CLJS vector and letting it be converted to JS, which implies an extra recursive pass over the full collection, some interop can be used to directly create a mutable JS array. The following example shows how to generate a JS array from your CLJS code.

```clojure

(reduce
(fn [col value]
(doto col (.push #js {:value value})))
#js []
(range 20))
```

Even though this code with interop is definitely less readable than normal Clojure, it can provide a nice performance boost in two specific cases:

- The data structure is deeply nested
- The generated output is fed to a component that updates very frequently

When processing props for components, Reagent doesn't touch any JS data structure it encounters, in fact, it simply returns it, as can be seen from here.

To show the level of improvement that JS data structures can achieve let's use the AG Charts example. A sample of the charting library props follows:

```clojure

{:options
{:data [{:value 1} ... ]
:width 300
:height 100
:series
[{:type "column"
:xKey "type"
:yKeys ["value"]}]
:axes [{:type "category"}
{:type "number"}]}}

```
