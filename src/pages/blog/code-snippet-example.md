---
author: 'jdt'
category: 'technology'
title: 'Code Snippets'
layout: '../../layouts/BlogPost.astro'
description: 'Examples with different langauges'
publishedDate: '9 Jul 2022'
tags:
  - 'code'
  - 'snippets'
draft: true
featured:
  weight: 2
heroImage:
  src: 'mock1.jpg'
  alt: 'Space shuttle leaving curved trail in the sky'
---

# how to use code snippets

Check out `code-snippet-example.md` in `/pages/blog`

```js
// this is a comment
const a = 'a string'
function $initHighlight(block, cls) {
  try {
    if (cls.search(/\bno\-highlight\b/) != -1)
      return process(block, true, 0x0F) +
             ` class="${cls}"`;
  } catch (e) {
    /* handle exception */
  }
  for (var i = 0 / 2; i < classes.length; i++) {
    if (checkCondition(classes[i]) === undefined)
    return "foo"
  }

  return (
    <div>
      <web-component>{block}</web-component>
    </div>
  )
}

export  $initHighlight;
```

```json
[
  {
    "title": "apples",
    "count": [12000, 20000],
    "description": { "text": "...", "sensitive": false }
  },
  {
    "title": "oranges",
    "count": [17500, null],
    "description": { "text": "...", "sensitive": false }
  }
]
```

```kotlin
import kotlinx.serialization.Serializable
import kotlin.random.Random

interface Building

@Serializable
class House(
    private val rooms: Int? = 3,
    val name: String = "Palace"
) : Building {
    var residents: Int = 4
        get() {
            println("Current residents: $field")
            return field
        }

    fun burn(evacuation: (people: Int) -> Boolean) {
        rooms ?: return
        if (evacuation((0..residents).random()))
            residents = 0
    }
}

fun main() {
    val house = House(name = "Skyscraper 1")
    house.burn {
        Random.nextBoolean()
    }
}
```

```graphql
# Graphql detection template

mutation Hero($episode: Episode, $withFriends: Boolean!) {
  hero(episode: $episode) {
    name
    friends @include(if: $withFriends) {
      name
      ... on Droid {
        primaryFunction
      }
      ... on Human {
        height
      }
    }
  }
}

query HeroNameAndFriends {
  hero {
    name
    friends {
      name
    }
  }
}

fragment comparisonFields on Character {
  name
  appearsIn
  friends {
    name
  }
}

input StoryLikeSubscribeInput {
  storyId: string
  clientSubscriptionId: string
}
```

```clojure
{:options
 :data [{:value 1}]
 :width 300
 :height 100
 :series [{:type "column"
           :xKey "type"
           :yKeys ["value"]}]
 :axes [{:type "category"}
        {:type "number"}]}

```

```clj
(reduce
  (fn [col value]
    (doto col (.push #js {:value value})))
  #js []
  (range 20))
```
