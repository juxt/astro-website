---
author: 'oly'
title: 'Combining Clojure macros: cond-> and as->'
description: 'I want it all'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '10 Jun 2015'
heroImage: 'clojure-macros.jpg'
tags:
  - 'macros'
---

# Threading for the win

I love the way the threading macros allow me to keep code lean and
clean, expressing what I want to do without having to concern myself
with wiring function calls together.

When dealing with varying function signatures or repeated references to
the threaded value, I have `+as->+`. When there are many branches in
logic and I want conditional threading I have `+cond->+`.

But sometimes `+cond->+` has the same problem as `+->+` when function
signatures differ; and by the way, wouldn't it be nice if my condition
predicates could use the current value being threaded rather than those
bound before the threading block began?

# Does exactly what it says on the tin

`+condas->+` combines the semantics of `+cond->+` and `+as->+` to give
you more flexible conditional threading. You may not need to use it
often, but in the more complicated areas of your codebase where
readability is valued at a premium you will hopefully find it helps.

```clojure
(defmacro condas->
  "A mixture of cond-> and as-> allowing more flexibility in the test and step forms"
  [expr name & clauses]
  (assert (even? (count clauses)))
  (let [pstep (fn [[test step]] `(if ~test ~step ~name))]
    `(let [~name ~expr
           ~@(interleave (repeat name) (map pstep (partition 2 clauses)))]
       ~name)))
```

Now when I have data like a [Google geocode
response](#geo-location.json) (`geo-location.json` in the code below) I
can write code like the following, keeping more context inline and
reducing the need for lexical binding. Note that the `location` value is
available for use in the conditionals allowing logic to be separated
into cleaner and simpler parts.

```clojure
(condas-> (json/decode (slurp "geo-location.json") keyword) location

  (some #{"street_address"} (:types location))
  (assoc location :address? true)

  (:address? location)
  (assoc location
         :country
         (:short_name
          (first (filter #(every? (set (:types %)) #{"country" "political"})
                         (:address_components location))))

         :postcode
         (:short_name
          (first (filter #(every? (set (:types %)) ["postal_code"])
                         (:address_components location)))))

  (= "US" (:country location))

  (-> location
      (assoc :zipcode (:postcode location))
      (dissoc :postcode))

  (when-let [country (:country location)]
    (not= "UK" country))

  (assoc location :overseas? true))
```

```json
{
  "address_components": [
    {
      "long_name": "277",
      "short_name": "277",
      "types": ["street_number"]
    },
    {
      "long_name": "Bedford Avenue",
      "short_name": "Bedford Ave",
      "types": ["route"]
    },
    {
      "long_name": "Williamsburg",
      "short_name": "Williamsburg",
      "types": ["neighborhood", "political"]
    },
    {
      "long_name": "Brooklyn",
      "short_name": "Brooklyn",
      "types": ["sublocality_level_1", "sublocality", "political"]
    },
    {
      "long_name": "Kings County",
      "short_name": "Kings County",
      "types": ["administrative_area_level_2", "political"]
    },
    {
      "long_name": "New York",
      "short_name": "NY",
      "types": ["administrative_area_level_1", "political"]
    },
    {
      "long_name": "United States",
      "short_name": "US",
      "types": ["country", "political"]
    },
    {
      "long_name": "11211",
      "short_name": "11211",
      "types": ["postal_code"]
    }
  ],
  "formatted_address": "277 Bedford Avenue, Brooklyn, NY 11211, USA",
  "geometry": {
    "location": {
      "lat": 40.714232,
      "lng": -73.9612889
    },
    "location_type": "ROOFTOP",
    "viewport": {
      "northeast": {
        "lat": 40.7155809802915,
        "lng": -73.9599399197085
      },
      "southwest": {
        "lat": 40.7128830197085,
        "lng": -73.96263788029151
      }
    }
  },
  "place_id": "ChIJd8BlQ2BZwokRAFUEcm_qrcA",
  "types": ["street_address"]
}
```
