---
author: 'mal'
title: 'Parsing text with clojure.spec'
description: "The library that keeps on givin'"
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '17 Jan 2018'
heroImage: 'mock3.jpg'
---

This week I've been working on JUXT's
[tick](https://github.com/juxt/tick) library.

Tick is a time library, and has a few playful functions for working out
dates like Easter Sunday. But as part of a major overhaul of the
library, towards a serious production-ready library, we've decided it
needs to read holiday dates from official information sources (not all
holidays can be computed!) and for that, it needs to be able to read the
[iCalendar](https://en.wikipedia.org/wiki/ICalendar) format.

iCalendar is specified in [RFC
5545](https://tools.ietf.org/html/rfc5545), and like many RFCs, grammar
rules are defined in a syntax known as Augmented Backus-Naur Form
([ABNF](https://en.wikipedia.org/wiki/Augmented_Backus%E2%80%93Naur_form)),
which is a lot more intuitive than it sounds.

iCalendar files are made up of a set of _content_ lines defined by the
following rule:

```
contentline = name *(";" param ) ":" value CRLF
```

This tells us that each line has to begin with a name, optionally
followed by some parameters, then a colon followed by a value, ending
with a line-ending.

Of course, we now need to know precisely what names, parameters and
values are. These are also defined for us (but for the purposes of this
article I've simplified somewhat):

```
name = iana-token
iana-token = 1*(ALPHA / DIGIT / "-")
param = param-name "=" param-value
param-name = iana-token
param-value = iana-token
value = iana-token
```

# Parsing

Having split up our iCalendar file into content lines (and there are
some folding rules in doing that which we'll ignore), we now need to
parse them.

I'd like our solution to have the following properties:

1.  Be easy to understand and update (my simplifications aren't going to
    go the distance)

2.  Be reasonably performant

3.  Be done by the time I get to the JUXT office (I'm writing this on my
    morning bus journey)

We _could_ start by trying Regular Expressions, which are well provided
for in Clojure and Java. But regexes [don't cope well with any degree of
complexity](https://blog.codinghorror.com/regular-expressions-now-you-have-two-problems/).
Our _zero-or-more parameters_ rule is going to trip us up.

At this point, I'd usually roll up my sleeves and be reaching for tools
like [instaparse](https://github.com/engelberg/instaparse) in Clojure
(or [Antlr](http://www.antlr.org/) in Java) and paging-in all that
Computer Science 101 stuff about LALR(1) context-free grammars, blah
blah blah. But I'm on the bus and have rather intermittent Internet
connectivity. Is there a quicker/better way?

Turns out, tick already has a dependency on
[clojure.spec](https://clojure.org/about/spec), so can I use that?

Let's start creating a spec for `iana-token`.

```clojure
(require '[clojure.spec :as s])

(s/def ::iana-token
  (s/+ (set "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ01234567890-"))

;; Let's try it
(s/conform ::iana-token (seq "DTSTART")) => [\D \T \S \T \A \R \T]
(s/conform ::iana-token (seq "&64*")) => :clojure.spec.alpha/invalid
```

Gosh, that wasn't so hard.

Now let's see if we can hand-write our rule for `contentline`:

```clojure
(s/def ::contentline
  (s/cat
    :name ::iana-token
    :params (s/*
              (s/cat
                :semi #{\;}
                :param-name ::iana-token
                :equals #{\=}
                :param-value ::iana-token))
    :colon #{\:}
    :value ::iana-token))
```

Notice how readable and intuitive that code is.

Let's try that rule with some a real iCalendar contentline:

```clojure
(s/conform
  ::contentline
  (seq "DTSTART;TZID=US-EAST:20180116T140000"))
=>
{:name [\D \T \S \T \A \R \T],
 :params
 [{:semi \;,
   :param-name [\T \Z \I \D],
   :equals \=,
   :param-value [\U \S \- \E \A \S \T]}],
 :colon \:,
 :value [\2 \0 \1 \8 \0 \1 \1 \6 \T \1 \4 \0 \0 \0 \0]}
```

clojure.spec has broken the string up into just the pieces we need. For
our parameters, it's given us a collection, because there could be a few
of them.

As a quick example, let's extract the value of first parameter.

```clojure
(apply str (get-in … [:params 0 :param-value]))
=> "US-EAST"
```

Voila!

# Conclusion

The fact that clojure.spec -- which was designed for a different
purpose -- seems so adept in the area of parsing is a surprise, but it's
a sign that there's a lot of power in this little library. More evidence
that where many languages veer off into the minutia, Clojure _gets the
job done_.

The performance on my laptop isn't bad (\~500µs), and will parse a
5000-line iCalendar file in couple of seconds, which is within my
requirements.

Looks like I'm done, and my bus has arrived!

(With thanks to \@thegeez for this
[gist](https://gist.github.com/thegeez/77aee6f0ebcf6a42aa7d893388502e40)
which inspired me to try clojure.spec to solve this problem.)
