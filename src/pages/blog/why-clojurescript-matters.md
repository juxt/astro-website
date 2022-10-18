---
author: 'jon'
title: 'Why ClojureScript Matters'
description: 'The case for adding ClojureScript to your project'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '29 Jun 2015'
heroImage: 'mock3.jpg'
---

I find ClojureScript can be a harder sell than straight up Clojure. We
have the well established norms of JavaScript on the front-end with
something else on the back-end. Many IT stakeholders are attracted to
this paradigm because it represents an understandable application
structure with a clean separation of concerns, and it allows them to
delegate the work around. ClojureScript is also newer and more bleeding
edge, and the tooling has had a long evolutionary path.

# Avoid Splitting

Taking the _splitting_ argument head on, I don't believe that having a
planned split between _front end_ and _back end_ developers is a good
idea at all. It wasn't a great idea way when we used to have dedicated
DB specialists who would always write the SQL, or dedicated Ops
specialists who would deploy our JARs, or dedicated QAs who would write
the automated tests. We ought to see the act of handing over chunks of
the application codebase to other agencies purely as a last resort, a
devil's bargain only to made when we have no other realistic option.

When you have such a large split, there's the huge communication
overhead with both parties having to meet in the middle, that prohibits
a lack of sheer experimentation and rapid prototyping. Both sets of
developers lose a degree of ownership of the entire solution, and with
such a reticence they opt for the lowest common denominator path of
least resistance. The debates range from how much HTML the server-side
should serve, as to the contracts of AJAX requests, WebSockets and
server-side-events. What really underpins such conversations - often
unmentioned - is of which side should philosophically \"own\" the heart
of the application as the commander in chief, with the other side being
more servile. This jostling of positions leads to unwitting compromises
being made, and becomes a tenuous foundation for developer relations.

Should developers be so prideful in their work? If you want a simple and
elegant codebase, leading to a system with less bugs and less bloat,
then pride is essential. Lovingly crafted aesthetics in a codebase is
key, where beautiful code matters more than carving it up and fostering
it out amongst a larger team. We need to be able to _live_ in our
software, to inhabit it, not to treat it merely is a soulless workplace.
As Richard Gabriel talks about _Habitability_ in his \"Patterns of
Software\":

\"Software needs to be habitable because it always has to change.
Software is subject to unpredictable events: Requirements change because
the marketplace changes, competitors change, parts of the design are
shown wrong by experience, people learn to use the software in ways not
anticipated... Habitability makes a place livable, like home. And this
is what we want in software -- that developers feel at home.\"

When you have a such a leaky and coupled division in place between
front-end and back-end, then aesthetics will be compromised on both
sides, giving an immediate broken window effect. The JavaScript
developers will not care much for seeing an esotheric server-side JVM
based Lisp, and the Clojure developers will shy away from Angular
temples, praying that only the good bits of Javascript have been
employed. Both sets of developers will not narrate the system with seams
of pride, and they will seldom cross pollinate.

If you want a developer-led culture where developers are free to come up
with the best UI possible, then we need to avoid having a preemptive
split between front-end and back-end, and allow the situation to grow
more organically.

# ClojureScript lock-in?

What about UX / front-end people who are used to JavaScript? There is a
concern that by switching to ClojureScript for front-end programming, we
lock down the development environment, making it more exclusive and
impenetrable to others. It looks as though we're secluding ourselves on
our private airship.

If we are talking about designers who trade on CSS, then we do them an
immediate disservice by saying they couldn't grok some ClojureScript and
change the HTML generation logic where necessary. I've seen this happen
often, where skilled UX specialists enjoy working with Clojure. They
come from a position of dealing with complex JavaScript code anyway and
are readily desensitized to the weird and wonderful things that surround
DOM manipulation. ClojureScript is just another framework.

# But what about JavaScript compilation?

[Many
languages](https://github.com/jashkenas/coffeescript/wiki/List-of-languages-that-compile-to-JS)
compile down to JavaScript, so there's nothing radical here. Indeed,
there is a growing opinion that it simply makes sense to see JavaScript
as a compilation target and to use a richer and cleaner language on top,
especially when you can inter-operate and preserve source maps. If the
capability is well supported and mature, then why not? JavaScript itself
increasingly being seen as the byte-code of the web.

With the announcement of [_Web
Assembly_](https://medium.com/javascript-scene/what-is-webassembly-the-dawn-of-a-new-era-61256ec5a8f6),
this is the future where all languages, including JavaScript, will
compile down to the same run-time browser instruction set. ClojureScript
and JavaScript will be peers, and we will soon see other languages in
the browser.

Before we get there though, the compilation to JavaScript step isn't
much of a barrier.

# Is ClojureScript Ready?

There have been a couple of recent game-changers.

First, the tooling has greatly improved. With
[`lein-figwheel`](https://github.com/bhauman/lein-figwheel) and
[`boot`](https://github.com/boot-clj/boot) as two different options, we
have an uncomplicated ability to reload ClojureScript changes on the
fly, and this makes for a hugely fun and productive development
experience. The ClojureScript compilation times have also sped up, to
the point where there are hardly noticeable.

Second, we have [React](http://facebook.github.io/react/) capability,
with Om leading the way in allowing us to create React components. Along
with `core.async` to handle callbacks, we now have everything we need to
build extremely rich single page front-end applications. There are other
ClojureScript React frameworks offering different aesthetics to Om, but
with Om we have an established and well supported forerunner, and there
is an argument to made for staying marginally conservative in the choice
of client side framework. On the client side at least, it is refreshing
to have fewer options.

## An Exciting Future

One gets the sense that ClojureScript is taking off, and there's a buzz
starting to be generated that ClojureScript could well overtake Clojure
itself, the parent language running on the JVM. The core team led by
David Nolen are working on ClojureScript being bootstrapped from
ClojureScript, essentially meaning that you can program ClojureScript
without a JVM in sight. The reason for doing this, as Rich Hickey puts
it, is _Reach_. ClojureScript without the dependency on the JVM for
compilation will reach into places far beyond the server-side origins of
Clojure. Mike Fikes has recently capitalised on this to [ship an iOS
ClojureScript
REPL](http://blog.fikesfarm.com/posts/2015-06-27-replete-a-standalone-ios-cljs-repl.html).

Om leverages the React framework built by Facebook, and with their vast
developmental capacity they are making huge strides for React and
JavaScript to be omnipresent on mobile devices. Rather than developers
having to learn Objective C or an iOS counterpart, they can use the same
language across platforms.

React itself is also evolving and ClojureScript is keeping pace. David
Nolen recently announced _Om Next_; the future of Om. Om components will
able to specify GraphQL like paths to the sub-tree of UI data the
component needs. Om will then take care of ensuring the component gets
the data, and that future data updates are synchronized.

This is the final reason why ClojureScript is becoming a compelling
choice. It's keeping up to date with the latest advances to come out of
the most powerful developmental institutions, and is adding a layer of
polish and Clojure-like functional simplicity on top. This is happening
because Clojure is a good fit for where web programming is going; the
emphasis on functional code working with immutable data, which is what
React is all about.

# Conclusion

ClojureScript is ready for prime-time and is heading into a new
make-or-break phase of popular usage. For existing Clojurians however,
it allows us to follow the dream of building simple yet powerful
software with smaller teams, where we can write as much code as we can
in Clojure, preserving the benefits of immutability and of the bottom-up
Lisp philosophy.

Discuss below or [join the
discussion](https://news.ycombinator.com/item?id=9797615) on Hacker
News.
