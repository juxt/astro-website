---
author: 'osm'
title: A Bitemporal Christmas
description: 'Unlike other children, Jimmy needs to query for his presents.'
category: 'database'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2023-12-20'
heroImage: 'bitemporal-christmas.jpg'
tags:
  - 'bitemporality'
  - 'xtdb'
---

It was the morning of a very special Christmas in the Winters family, even though they didn't know it yet.
Jimmy was in bed, trying his hardest to sleep but he was too excited.
Not being able to hold on any longer he threw off his covers and ran downstairs, just to get *one* look at his presents under the tree.

But something was wrong, the tree was bare!
There were no presents to be seen and instead there was a glowing blue portal.

**Jimmy:** What's going on? Where are my presents?

**Robot 👋🤖:** Hello

Jimmy fell back in shock.
There was a small, friendly looking, robot standing in front of him.
Right in the middle of his living room!

**Jimmy:** Who are you?!

**Robot 😢:** Oh dear, I'm sorry for scaring you.

**node 😅:** My name is `node`, and I need your help. I've lost my way home, maybe if we can find your presents we can find my home too!

**Jimmy:** But where _are_ my presents?

**node 🔍:** Let's have a look.

A small screen labelled [`XTQL v2`](https://docs.xtdb.com) folded out of `node`'s chest on which a query appeared:

```clojure
(from :gifts [{:for "Jimmy"} name])
; =>
[]
```

**node ❓:** Hmm, they're not here where could they be?

**Jimmy:** Well I got presents last year, why wouldn't I this year?

**node ⏳:** Let's look at last years presents then.

A new query appeared on `node`'s screen:

```clojure
(from :gifts {:bind [{:for "Jimmy"} name]
              :for-valid-time (at #inst "2022-12-25")})
; =>
[{:name "Transformer"}
 {:name "LEGO"}
 {:name "NES"}]
```

**node 🎁:** Indeed, It looks like you got some nice presents last year.

**Jimmy:** Whoa! How did you do that?

**node 🔍🗓:** It's simple really, I just queried for all the gifts you got last year.

Just then Jimmy's Mum and Dad came downstairs.

**Mum:** What's going on down here? Didn't we tell you that you couldn't open your presents until later this morning? And who is-

**node 🔮:** That's it! Let's look at the presents you'll be getting in the *future*!

```clojure
(from :gifts {:bind [{:for "Jimmy"} name occasion xt/valid-from]
              :for-valid-time (from #inst "2023-12-25")})
; =>
[{:name "SNES", :occasion "Christmas", :xt/valid-from #time/zoned-date-time "2023-12-25T10:00Z[UTC]"}
 {:name "Pogs", :occasion "Christmas", :xt/valid-from #time/zoned-date-time "2023-12-25T10:00Z[UTC]"}
 {:name "Super Soaker", :occasion "Birthday", :xt/valid-from #time/zoned-date-time "2024-06-11T00:00Z[UTC]"}]
```

**Jimmy:** Whoa, I'll be getting a Super Soaker for my birthday next year!

**node 😣:** Oops

**Mum:** Now Jimmy, what did I tell you about peeking at your presents?

**Jimmy:** Sorry Mum...

**Dad:** Well, seeing as it's Christmas, if this young robot here can show us how to only query for **only** presents we'd planned to give you **today** you can have your birthday present early.

**node 🫡:** On it!

```clojure
(from :gifts {:bind [{:for "Jimmy"} name occasion]
              :for-valid-time (in #inst "2023-12-25" #inst "2023-12-26")})
; =>
[{:name "SNES", :occasion "Christmas"}
 {:name "Pogs", :occasion "Christmas"}]
```

**Dad:** Well done! You've earned that early Birthday present. Let me just go and get it for you.

**node 🤖:** Don't worry, I can do that too!

```clojure
(xt/insert-into :gifts
  '(-> (from :gifts {:bind [{:for "Jimmy" :occasion "Birthday"} xt/id for name]
                     :for-valid-time (at #inst "2024-06-11")})
       (with {:xt/valid-from #inst "2023-12-25"
              :occasion "Christmas"})))]
```

**Jimmy:** Thanks Mum! Thanks Dad!

**node:**
```clojure
(from :gifts [{:for "Jimmy"} name])
; =>
[{:name "SNES"}
 {:name "Pogs"}
 {:name "Super Soaker"}]
```

**Mum:** See, now you've waited a little, your Christmas presents are here too!

**node 😢:** I still don't see a way home though

**Jimmy:** Hmm, I don't see Grandma's present here either.

**Grandma:** Sorry dear, let me just put them under the tree now. Oh dear, they've been sucked into this portal thingy too!

**node ⏪:** Not to worry, let's look at the presents that were just added.

```clojure
(-> (from :gifts [{:for "Jimmy"} name xt/system-from])
    (where (> xt/system-from (- (current-timestamp) #time/duration "PT1H")))
    (without :xt/system-from))
; =>
[{:name "Pokémon cards"}
 {:name "XTDB"}
 {:name "Tamagotchi"}]
```

**node 🏠:** There it is! XTDB! My home!

And with that, `node` jumped into the portal and was gone.
But out popped all the missing presents, and one extra present:

- [First Look at XTDB v2 - Session Recording & Slide-deck](https://www.xtdb.com/blog/v2-show-and-tell)
- [XTDB 2.x docs](https://docs.xtdb.com/)
  - [Getting Started](https://docs.xtdb.com/intro/getting-started.html#_connecting_from_clojure)
  - [What is XTQL?](https://docs.xtdb.com/intro/what-is-xtql.html)
  - [XTQL Query Reference](https://docs.xtdb.com/reference/main/xtql/queries.html)
