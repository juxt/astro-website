---
author: "dmc"
title: "JUXT Journal 2019.05.1"
description: ""
category: "clojure"
layout: "../../layouts/BlogPost.astro"
publishedDate: "03 May 2019"
heroImage: "mock3.jpg"
tags:
  - "journal"
---

# Edge

- Design work on fixing the problems Emacs users run into on
  ClojureScript projects

      I thought the blame was with integrant-repl, as it doesn't have much safety around modifying it's system.
      When I looked closer, it turned out to be less general, and only happening with figwheel-main.

      I eventually tracked it down to a sequence of race conditions and opened an issue on figwheel-main to discuss further link:https://github.com/bhauman/figwheel-main/issues/183[].
      In the meantime, it can be worked around, so I have made those changes.

- New default app template design by \@lda
