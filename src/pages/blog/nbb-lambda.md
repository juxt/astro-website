---
author: 'rmc'
title: 'AWS Lambda, now with first class parentheses'
description: 'Deploying Clojure on AWS Lambda with no compromises'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2022-07-14'
heroImage: 'nbb-lambda.jpg'
tags:
  - 'clojurescript'
---

## AWS Lambda and Clojure frustrations

As part of our work with Clojure at Funding Circle I've been considering
how best to approach creating AWS Lambdas. AWS Lambda has proven itself
to be very useful for expediting small, discrete tasks. Lambdas can be
used to process streaming events, to process storage events, to fulfill
API responses, and a plethora of other use-cases, all without the need
to manage any server or networking infrastructure. I don't believe
they'll take over the backend world, but they're here to stay, so we
need a first class experience for creating Lambdas in Clojure!

Thus far, our collective ability to use Clojure to implement AWS Lambdas
has been hampered, either by poor cold starts for Clojure or complex
tool chains and deployment processes for ClojureScript. This is hindered
further by the size of built artifacts. They are often larger than the
Lambda console [3MB
limit](https://docs.aws.amazon.com/lambda/latest/dg/foundation-console.html#code-editor)
which prevents editing. This reduces our ability to try out small tweaks
and experiments in the absence of our beloved REPL.

If only we had a way to implement Lamdas with Clojure that would combine
fast cold starts, with great runtime performance, easy editing in the
console, a simple packaging experience, and a large and accessible
library ecosystem. Enter [`nbb`](https://github.com/babashka/nbb).

## Serverless joy with `nbb`

`nbb` is a scripting tool that interprets ClojureScript using the nodejs
runtime. It was not made for AWS Lambda but is a great fit to the
constraints of a serverless environment. Specifically, nbb offers:

- **Blazingly fast starts**: sub-millisecond. AWS provisioning latency
  is your only overhead, so no worse than any other language and
  better than many.

- **Simplicity**: the code is interpreted directly rather than needing
  an intermediate build/compilation step.

- **Small and editable**: nbb produces distributions with plain
  Clojure inside, and small enough to be edited in the console.

- **Performance**: it has comparable performance to compiled
  ClojureScript programs (only modest overhead).

## Hello World

The [nbb
docs](https://github.com/babashka/nbb/blob/main/doc/aws_lambda.md) give
a simple _hello world_ example that shows just how easy nbb makes
writing lambdas in Clojure:

package.json: `json {"dependencies": {"nbb": "^0.6.129"}} `

index.mjs:

```javascript
import { loadFile, addClassPath } from 'nbb'

addClassPath('.') // This is necessary when you require another .cljs file

const { handler } = await loadFile('./example.cljs')

export { handler }
```

example.cljs:

```clojure
(ns example)

   (defn handler [event _ctx]
     (js/console.log event)
     (js/Promise.resolve #js{:hello "world"}))

   #js {:handler handler}
```

Just run `np install`, zip up the result, and you're ready to deploy
using the Node.js Lambda runtime v14.x or later.

## Local serverless

With `nbb`, local development is a breeze. No need for any emulators.
Just grab some sample JSON and start feeding it to your handlers that
you can run directly in the CLI or in a REPL.

## API Gateway vs Lambda console testing

Often you want to put Lambdas behind the AWS API Gateway and be able to
test them via the both the API Gateway console and the Lambda console.

The shape of the events is different depending on their source, so
here's an example of how to unify that approach. The same could be
adapted for events from S3, DynamoDB, etc.

```clojure
(defn parse-event
 [event]
 (let [clj-event (js->clj event :keywordize-keys true)]
   (if (get clj-event :requestContext) ;; invoked via API Gateway.
    (-> clj-event (get :body) (js/JSON.parse) (js->clj :keywordize-keys true))
    clj-event)))
```

Likewise, when responding, one needs to make the data specific for API
Gateway. Here is one way:

```clojure
(defn handler [event _ctx]
  (p/let [response (-> event (parse-event) (->encrypted-response))]
   (if response
     (clj->js {:statusCode 200
               :body       (js/JSON.stringify (clj->js response))})
     (clj->js {:statusCode 500}))))
```

You can also specify a different `Content-Type` header to produce HTML,
CSVs etc.

## Lambda URLS, ALB, etc

You can now access Lambdas via dedicated [HTTP
URLs](https://docs.aws.amazon.com/lambda/latest/dg/lambda-urls.html) -
great for webhooks or such. Likewise, you can invoke Lambdas behind an
Application Load Balancer [with some further
restrictions](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/lambda-functions.html).

The model for producing valid responses is the same as that for API
Gateway.

## Performance tweaking

AWS Lambdas are capable of high performance, but we should be careful
about how we measure performance on nodejs - **remember promises are
asynchronous**. Fortunately `nbb.core` now has a `time` function that is
aware of this

```clojure
(nbb.core/time (p/let [event' (-> event (parse-event))
        response (some-async-call event')]
  ...)
```

My Lambda has some crypto functions, but they should not be overly
stressful for modern CPUs. Indeed, the Lambda runs with an acceptable
latency of ~50ms on my local PC. However, even with a warm start, the same Lambda running in AWS would not complete in less than ~300ms. That's not super slow, but it's not great either.

Anything over 100ms for this kind of stuff makes me scratch my head. I
reasoned that my local PC has a powerful 24-core AMD Ryzen9, 64GB RAM
and a fast SSD. So was I cheating? Maybe the code or algorithms were not
correct.

Before going there, and after some advice from
[\@borkdude](https://twitter.com/borkdude) (of course) I tweaked the
runtime of the Lambda, bit by bit:

- CPU Architecture: from AMD → ARM.

  - 10-20% better performance and, at very high scale, slightly
    lower cost.

- RAM Provisioned: from 128Mb in doubling increments to 1Gb.

  - Big improvements on each increment up to 1Gb. Nothing meaningful
    in this case after that though YMMV.

  - \$/ms prices go from \$0.0000000017 to \$0.0000000133. If you
    expect millions of calls this is worth caring about. For many
    cases, it won't matter.

The resulting latency was \~30ms. Faster than my local PC! Maybe some
Apple Silicon compares, but this was quite a pleasant surprise.

How? AWS allocates CPU linearly in proportion to the amount of RAM
allocated, so by allocating more RAM we are allocated more CPU.

I didn't do the maths to calculate the ROI of lower charging duration vs
the increased cost per allocated MB but somebody at AWS did and [here is
the
link](https://aws.amazon.com/blogs/compute/operating-lambda-performance-optimization-part-1/).

So good news: with this level of performance, I'm not planning to make
any code changes.

## nbb and nodejs on Lambda - CPU bound?

The design of nodejs was meant specifically to enable evented IO. See
[this deep cut
interview](https://www.infoq.com/interviews/node-ryan-dahl/) and
transcript with Ryan Dahl from 2010.

One of the most important aspects of nodejs that developers need to be
careful of is hogging the CPU: that prevents the event loop from making
progress which can create huge problems on the server.

Lambdas are different: you can consume as much CPU as you wish because
it's not multi-user! This could result in new and simpler designs for
Lambda functions.

## nbb - managing promises

One might argue, given the above, that you are paying the cognitive
price of the asynchronous model without any need.

With `nbb` - like any CLJS app - you can use
[`promesa`](https://github.com/funcool/promesa), specifically `p/let`
which takes away 90% of that cost. All the promises inside the bindings
are resolved, in sequential order, before executing the body.

This is an example of the code to encrypt some data via `nbb`. It looks
like standard Clojure.

```clojure
(defn- ->encrypted-response
 [{:keys [signing-key encryption-key signature signed-property request-data]}]
 (p/let [signing-key (import-signing-key signing-key)
         encryption-key (import-crypto-key encryption-key)
         signed-data (get request-data signed-property)
         verified? (verify signing-key signature signed-data)
         encrypted-data (when verified? (obtain-pin encryption-key))]
        (when encrypted-data
          {:pin encrypted-data})))
```

**Bonus:** AWS Lambda expects to be returned a promise, and you get that
for free with `promesa`

## Conclusion

Rounding things up:

- Lambdas are here to stay and we need a first-class Clojure
  experience

- `nbb` is the best candidate I have yet seen to claim this crown

  - zero overhead start time

  - simple and small toolchain

Scripting with `nbb` is a great match for the design ethos of AWS
Lambdas: small, fast and direct. Check out the [`nbb` docs
page](https://github.com/babashka/nbb/tree/main/doc) for a bunch of
examples for all kinds of technology that nbb supports including AWS
Lambdas and GCP Functions.
