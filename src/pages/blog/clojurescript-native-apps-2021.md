---
author: 'alx'
title: 'Writing Mobile apps in ClojureScript in 2021'
description: "Still easy? Let's find out..."
category: 'clojurescript'
layout: '../../layouts/BlogPost.astro'
publishedDate: '13 Aug 2021'
heroImage: 'webapps-cljs.jpg'
tags:
  - 'mobile'
---

In early 2017, Frankie Sardo wrote [_Writing ClojureScript native apps
is easy_](https://www.juxt.pro/blog/native) on the JUXT blog. I recently
came across it again and was surprised at how much it still applies
today. After all, 4 years is an awfully long time in Mobile App tooling
years. The basic process of getting CLJS code into a native app is
unchanged:

- ClojureScript gets compiled into JavaScript

- Javascript is processed by ReactNative and compiled into native code

- The native code is run on your mobile device (or simulator/emulator)

**_It's worth noting that there are other ways to write an app in
Clojure(Script) these days. You could use GraalVM with
[SCI](https://github.com/phronmophobic/mobiletest),
[Gluon](https://docs.gluonhq.com/#_introduction), or mix native
ObjectiveC/Swift with ClojureScript with [this
technique](https://github.com/mfikes/goby). However, I personally think
that the React Native approach is by far the most *production ready*
approach currently available._**

So what has changed in the last 4 years?

Well, 4 years ago, the most commonly used setup involved [Leiningen and
Figwheel](https://github.com/decker405/figwheel-react-native) with a
popular framework based on that approach called
[Re-natal](https://github.com/drapanjanas/re-natal). Unfortunately,
those libraries are now showing their age. While you can get away with
using _old_ tools when developing for the web, mobile apps are far less
forgiving due to constantly breaking APIs.

These days there seem to be two mainstream options if you want to write
a native mobile app in Clojure. [Shadow-CLJS](http://shadow-cljs.org), a
multi-purpose build system with a [React Native build
target](https://shadow-cljs.github.io/docs/UsersGuide.html#target-react-native),
and [Krell](https://github.com/vouch-opensource/krell), a tool
specifically designed to get you from CLJS to React Native while staying
out of the way as much as possible. The Krell approach doesn't need
Shadow or Figwheel due to [recent advancements in the ClojureScript
compiler](https://clojurescript.org/news/2020-04-24-bundle-target).
However, this blog post will not be focusing on Krell. To explain why
that is, we must first look at yet another tool: Expo.

# Expo

Writing a native mobile app is a lot more involved than writing for the
web. Mobile apps have to be approved by the overlords at Google and
Apple --- and APIs are far more consistent across the multitude of web
platforms than those two mobile platforms.

These issues become painfully apparent with raw React Native. Just
moving a finished app from your computer onto the App Store can take
weeks and the final code is often filled with messy conditional logic
due to the differences between iOS and Android.

This is where Expo comes in. Expo is a large set of tools and SDKs which
aim to make building React Native apps easier. It lets you build and
submit apps without XCode or Android studio, provides many libraries
that make developing cross-platform less painful, and even lets you
publish new versions of your app without requiring that a new binary be
submitted to Apple/Google.

These benefits come with a lot of additional complexity though and there
are a fair few limitations to the Expo workflow ([this is a good
reference](https://docs.expo.dev/introduction/why-not-expo)). On top of
all this, I had lingering scepticism from my last experience with Expo.
I tried using Expo 4 years ago and it had been a disaster. Simply trying
to make a minor update to an app that was less than 1 year old almost
turned into a full rewrite. Expo can't build apps running old SDK
versions and most of the libraries I'd used had breaking changes when I
tried to update them. Despite all this, I was assured that Expo is more
stable now and that it is always possible to \"eject\" myself from Expo
and continue on the raw React Native path should anything become a
problem. We'll see how that turned out for me later...

# The Project

My plan was to see if it was possible to design, build, and release a
reasonably polished app to both app stores over a 2 week holiday from
work (shoutout to Covid-19 for making a hacking holiday possible... by
making travel holidays impossible). Since I was on holiday, I had set
myself a hard limit of 2 hours computer time per day, which left me with
a total of 14 hours to complete my project (though, somewhat
predictably, I spent around double that on it in the end).

Below is a demo video showing the app and its features, and [here is the
source code.](https://github.com/armincerf/kalm-mobile)

<iframe width="560" height="315" src="https://www.youtube.com/embed/m60ylWDxDHs" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# A brief recount of my holiday (I go into more detail [here](https://www.armincerf.com/2021/07/making-a-mobile-app-with-clojurescript-in-2021))

I started by cloning [this
template](https://github.com/PEZ/rn-rf-shadow), which confidently claims
to be \"The fastest way a ClojureScript coder can get started with React
Native\", and set off. The initial setup of the various Expo and React
Native tools was surprisingly smooth, and within [my first 1-hour
stint](https://www.youtube.com/watch?v=3HvhP2NImOQ), I had a REPL from
my Emacs into a working app running on my iPhone (via Expo Go). The
below video is the \~45min live stream of my first day working on the
project:

<iframe width="560" height="315" src="https://www.youtube.com/embed/3HvhP2NImOQ" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

After a few days, however, I grew frustrated with writing these render
functions in ClojureScript. Doing the business logic was great; Clojure
has never failed to impress with its ability to easily manipulate
complex data structures. However, my view code contained so much interop
that it didn't really look like Clojure anymore. Here's a snippet:

```clojure
(defn root
  []
  (let [scheme (rn/useColorScheme)
        dark-mode? (= "dark" scheme)
        !navigation-ref (atom {})]
    [:> nav/NavigationContainer
     {:ref (fn [el] (reset! !navigation-ref el))
      :theme (set! (-> ^js nav/DarkTheme .-colors .-background)
                   (if dark-mode? "black" "white"))
      ...}
     (let [stack (rn-stack/createStackNavigator)
           screen (fn screen [props] [:> (-> ^js stack .-Screen) props])]
       [:> (.-Navigator ^js stack)
        (screen {:name "View All Routines"
                 :component (r/reactify-component
                             #(views/routines % animated))})
        (screen {:name "View Single Routine"
                 :component (r/reactify-component #(views/screen-main % animated))})])]))

(defn start
  []
  (expo/render-root (r/as-element [:f> root])))
```

Now, this may not seem so bad. But it's tedious to constantly translate
code from JavaScript. I found myself continually thinking, \"I wish I
could just use copy-paste this bit.\"

So after reading an inspiring [blog
post](https://vouch.io/developing-mobile-digital-key-applications-with-clojurescript/)
by David Nolen (as I write this, he has also just released [a talk on
the same topic](https://www.youtube.com/watch?v=3HxVMGaiZbc)), I decided
I would aim for:

- All business logic and data manipulation would be done in
  ClojureScript

- All React Native/Expo code would be written in JavaScript (or
  Typescript)

Because React Native comes with its own bundler, I was able to import my
`.tsx` components using `js/require` like so:

```clojure
(ns app.components)

(def RoutineList (.-default (js/require "../src/stories/RoutineList.tsx")))
(def ViewCurrentActivity (.-default (js/require "../src/stories/ViewCurrentActivity.tsx")))
(def CreateRoutine (.-default (js/require "../src/stories/CreateRoutine.tsx")))
```

I could then use these components as I would any other React component:

```clojure
(ns app.views
  (:require
   [re-frame.core :as rf]
   [app.components :as c]))

(defn routine-list
  []
  [:> c/RoutineList
   {:routines @(rf/subscribe [:my-routines])
    :handlePlay #(rf/dispatch [:play %])}])

(defn current-activity
  []
  [:> c/ViewCurrentActivity
   {:activity @(rf/subscribe [:current-activity])
    :handlePause #(rf/dispatch [:pause %])
    ...}])

(defn create-routine
  []
  [:> c/CreateRoutine
   {:handleCreate #(rf/dispatch [:add-routine %])}])
```

This left me with the following in ClojureScript:

- The initial _root_ function from above. (Though in hindsight, I wish
  I had lifted more of that into JavaScript, as later modifications to
  it were painful.)

- Re-frame handlers and subscriptions for global state and events

- Pure functions for manipulating the app's various data structures

- A `views` namespace acting as the bridge between CLJS and JS (shown
  above)

And this in JavaScript:

- Pure functions which accepted props passed down from my CLJS and
  returned React Native components. Any buttons or UI components that
  changed the global state of the app would do so using functions
  passed down in those props.

- React hooks for local state (e.g. forms)

- Utility functions for dealing with certain Expo/React Native
  libraries

The utility functions could easily have been written in ClojureScript
too. Still, I often just wanted to copy functions from a library's
documentation and use it largely unchanged, such as in this push
notification example:

```javascript
// src/stories/utils.js

export async function schedulePushNotification(activity, seconds, callback) {
  if (activity && activity?.name && seconds) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        _contentAvailable: true,
        title: `It's time to start '${activity.name}'!`,
        body: activity?.description || activity?.message || "Have fun!",
        ios: { sound: true },
        sound: "default",
      },

      trigger: { seconds: seconds },
    });
    callback(id);
  }
}

// src/app/components.cljs
(def utils (js/require "../src/stories/utils.js"))
(def send-notification (.-schedulePushNotification utils))

// src/app/handlers.cljs
...
(c/send-notification (clj->js activity)
                     trigger-time
                     #(rf/dispatch [:notification-scheduled id %]))
...
```

Overall this approach worked great. If I had more time, I would also
have liked to set up [StoryBook](https://storybook.js.org), which would
allow for a much more robust and easily testable UI development
environment.

This solution wasn't without its frustrations, however. I am a
JavaScript novice --- having only ever used it on side-projects --- and
I found it quite painful sometimes. Reagent and friends do a reasonable
job of hiding the JS nasties from you in the web world, but I found it
to be a different story in React Native land. Overall, I definitely
recommend trying this hybrid approach.

Speaking of learning new things, styling mobile apps turned out to be
very different from the web, as there is no DOM, HTML or even really
CSS. React Native does have tools for writing _CSS_ to style your
components, but there are some differences that can catch you out. I
won't go further into React Native's differences from React here, but
don't let the name fool you; they are very different beasts.

I made a \~10-minute rapid walkthrough of the (more or less) final
codebase which goes into a little more detail:

<iframe width="560" height="315" src="https://www.youtube.com/embed/ib63-HCm-ik" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

# The Good

So as mentioned above, there were a lot of good things about my setup:

- Though I wasn't too confident with JavaScript, I found using it to
  write my views a much more pleasant experience than spending ages
  translating JavaScript examples into ClojureScript.

- Having a REPL connected to my actual phone was super cool, and very
  useful. I really missed the REPL when I was in JS land.

- Expo did save me a lot of time. Building my app and submitting it to
  the app store was much easier than I remember from four years ago,
  and although I used a Mac, I could easily have repeated the same
  process on a Linux machine.

- To my surprise, when I finally got an Android emulator working on my
  M1 Mac, things actually _just worked_ with only [a few minor
  issues](https://www.armincerf.com/2021/07/making-a-mobile-app-with-clojurescript-in-2021#4074d3ba1e4d42a6b871d51c039e8c5b).

# The Bad

It can't all be good news. There were a fair few painful moments on my
journey --- though I admit that several are likely due to my
inexperience/incompetence.

There turned out to be several third-party libraries and native features
that I couldn't use unless I was ejected from Expo. These included:

- A native context menu

- Integration with HealthKit/Google Fitness

- Timers that worked correctly when the app was backgrounded (this was
  a big one for my app in particular)

- Integration with native Audio playlist controls

Expo also adds significant bulk to your app by bundling a bunch of SDKs.
These SDKs include analytics libraries like FacebookAds, which I wasn't
too happy about. As a result, I spent an entire day in my second week
trying to _eject_ from Expo and get set up with XCode, but it quickly
became apparent that I would not have anything usable at my 2-week
deadline if I continued down that path. For all the bugs and quirks that
Expo has, XCode was worse. It simply would not build even the unchanged
React Native example. (As a side note, I did eventually solve these
problems, which I've documented in [_Getting XCode 12 to Build React
Native Projects on an M1
Mac_](https://www.armincerf.com/2021/07/getting-xcode-12-to-build-react-native-projects-on-an-m1-mac).)
Expo does have an answer to these issues called [EAS
Build](https://docs.expo.dev/build/introduction/) but as I write this it
is still in alpha and is not available to the public.

The last issue I had was hot code reloading. The React Native refresh
tool would often interfere even when it was turned off, the expo process
would regularly crash after saving a file, and sometimes I'd even get an
old version of the code loaded, causing all sorts of confusion.

To give you a clearer picture of what the hot code reloading situation
looked like (and why it wasn't such a big deal) take a look at this
short video:

<iframe width="560" height="315" src="https://www.youtube.com/embed/bSi7GpcSsYU" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>

After all these troubles with overly complex build tools, and now that I
am no longer constrained by my arbitrary deadline, I will be exploring
Krell in my next project. I think that given a longer timeframe, the
simplicity of Krell will save you more time than all of Expo's magic
whilst leaving you with at least some of your sanity. If there is enough
interest (heck... even if there isn't) I will likely move my app away
from Expo and see how things are on the Krell side. Hopefully the grass
really is greener there.

# Conclusions

In conclusion, I would say I have learned the following things in my
brief adventure into ClojureScript mobile app development:

- It is indeed possible to build a somewhat useable app and deploy it
  to the app store in 30 hours (though I did have a slightly uglier
  version downloadable via TestFlight/Google Play at my 2
  weeks/14-hour deadline)

- I had to compromise on many features because they were not supported
  by Expo, though I cannot yet say whether starting with Expo was a
  mistake

- Not using Expo involves a lot more initial setup, but it is
  something I will be trying in the future, as the complexity that
  Expo brings with it has left a sour taste in my mouth

- Despite some frustrations, I actually did enjoy the experience
  overall, though I'm not considering a career change any time soon 😅

- ClojureScript is undeniably better than JavaScript (at least on this
  blog 😄), but a hybrid ClojureScript + JavaScript approach works
  really well, even in the absence of JavaScript experience

If you are interested in the app I created during my experiment, you can
find it on the app stores here:

- [Android](https://play.google.com/store/apps/details?id=com.armincerf.kalm_routines)

- [iOS](https://itunes.apple.com/app/kalm-routines/id1578270343)

And you can find the source code at
<https://github.com/armincerf/kalm-mobile>.

If you want to see more detail of my experience building the app, you
can check my [personal blog
here](https://www.armincerf.com/2021/07/making-a-mobile-app-with-clojurescript-in-2021#4074d3ba1e4d42a6b871d51c039e8c5b),
containing clips from my live streams of the development process.

And finally, if you're not convinced that ClojureScript can be used for
real production applications, check out [this _Status_
project](https://github.com/status-im/status-react). It's a massive
(6.5k+ commits) fully-featured mobile app built entirely in
ClojureScript!
