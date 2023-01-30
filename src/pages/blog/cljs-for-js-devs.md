---
author: 'alx'
title: 'ClojureScript for JavaScript Developers'
description: 'How do they compare in 2022?'
category: 'clojurescript'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2022-03-03'
heroImage: 'cljs-for-js-devs.jpg'
tags:
  - 'clojurescript'
  - 'mobile'
---

Last year I [spent some
time](https://www.juxt.pro/blog/clojurescript-native-apps-2021) building
a cross-platform mobile app using React Native and ClojureScript. This
led to the organizers of the React Native London conference asking me to
give a talk about ClojureScript and its use in React Native
applications, and I took that as an opportunity to do some further
research into the ecosystem and how things have changed over the last 9
months.

It seems that my app still runs fine on Expo, which was a pleasant
surprise. It was easy to update to the latest versions and a few years
ago I would have expected this to introduce a variety of breaking
changes, so this is a big improvement. Talking to people in the React
Native community, it seems that things have stabilised quite nicely.

My talk was aimed at a JavaScript audience and it led me to think about
the ClojureScript ecosystem in general, and what advantages it has over
JS these days. After all, looking back over old ClojureScript talks for
inspiration I found that some of the claims made at the time were a
little out of date. For example, Figwheel and _hot code reloading_ are
mentioned as advantages unique to ClojureScript, but these days a
standard Figwheel or ShadowCLJS project will have slower hot-reload
times when compared to ESM build tools like Vite or Snowpack. Some
credit must be given to ClojureScript's unique (to the best of my
knowledge) ability to re-evaluate vars in place, allowing developers to
avoid hot-reloading altogether.

However, while JavaScript tools have been evolving, the ClojureScript
ecosystem hasn't stood still.
[ShadowCLJS](https://github.com/thheller/shadow-cljs) has a great
console UI that allows you to inspect data flowing through your code
using `tap>` and new React wrappers like
[Helix](https://github.com/lilactown/helix) enable improved
interoperability with modern hook-based React in comparison to
[Reagent](https://reagent-project.github.io/) (though Reagent is still a
good choice in many cases).

Additionally, the _'ClojureScript for logic, JavaScript (or TypeScript)
for views'_ pattern that I used for [my react native
app](https://www.juxt.pro/blog/clojurescript-native-apps-2021) (inspired
by
[this](https://vouch.io/developing-mobile-digital-key-applications-with-clojurescript/))
can give you the best of both worlds if hot code reloading speed is
important.

Clojure's ability to mix Clojure and ClojureScript code in the same file
with .cljc, while keeping things as simple as possible, is a big
contrast to full-stack JS frameworks. An example is
[Next.js](https://nextjs.org/), which allows backend and frontend code
in the same file but achieves it with significant amounts of _magic_ and
complexity. Next is a great tool and has its uses, but when things go
wrong it can be very tricky to figure out why, which is rarely the case
with Clojure in my experience. Likewise, I find React hooks to be a
[very
complex](https://labs.factorialhr.com/posts/hooks-considered-harmful)
solution to the render lifecycle problem compared to the idiomatic
_reactive atom_ pattern popularised by Clojure's React wrappers. When
hooks work, they're great, and they make for a nice developer
experience, but I personally feel Reagent code is just as nice to write
but without nearly as many footguns.

Overall I think ClojureScript is still a great option, especially when
dealing with complex business logic (which JS is weak at in my opinion).
My talk at the React Native conference is
[here](https://youtu.be/mNq5RUc0sF4?t=1972), and is worth a watch if you
are coming from the JavaScript world but are interested in
ClojureScript.

<iframe class="aspect-video w-full" src="https://www.youtube.com/embed/mNq5RUc0sF4?start=1972" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
