---
author: 'fky'
title: 'Securing your clojurescript app'
description: "Use buddy's json tokens to authenticate your single page application"
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '09 Jul 2015'
heroImage: 'mock3.jpg'
---

The [Web After Tomorrow](http://tonsky.me/blog/the-web-after-tomorrow/)
will be populated by apps: standalone, in-browser, Javascript
applications. Mobile devices set a high bar for user experience that
we're now demanding from the web: we want interfaces that provide
instant feedback, are always up to date and gracefully degrade when
offline (just to name a few).

Just like a mobile app is concerned about visualisation, user
interaction, caching and syncing so will be the next generation of JS
apps. \"Web\" is just another platform to target along with iOS and
Android, with its own apis, quirks and strengths, but with no special
treatment.

Clojurescript has great potential to shine in this scenario. Not only is
the language well suited to manage the inherent complexity of a rich
client software, but the tools commonly found in a Clojure stack
(Datomic, core.async, transit, Om) are already designed for a modern
approach to applications development. Single page Clojurescript apps
[matter](https://juxt.pro/blog/posts/why-clojurescript-matters.html) .

# Say form submission once again

In such a world you can serve your application from any generic static
web hosting such as [Amazon
S3](http://docs.aws.amazon.com/AmazonS3/latest/dev/WebsiteHosting.html)
or specialised ones like [divshot](https://divshot.com/). Your app would
access and consume any number of services: twitter, slack, github,
dropbox, etc. Your server and database, if any, would not be a special
case anymore.

So if you still need to deploy a server and a database to store users
and stuff, why would you set up something so ad-hoc like Http Session to
manage authentication? Do like any other service that you integrate
would do and use [Json Tokens](http://jwt.io/) instead.

There are [plenty](https://stormpath.com/blog/token-auth-spa/)
[of](https://auth0.com/blog/2014/01/27/ten-things-you-should-know-about-tokens-and-cookies/)
[resources](http://www.slideshare.net/derekperkins/authentication-cookies-vs-jwts-and-why-youre-doing-it-wrong)
that already discuss in detail what these tokens are and why you should
use them, so I'm just going to summarise it for people too lazy to
follow links.

In a nutshell this is how token authentication works:

- Client sends username and password to the server.

- Server checks credentials (e.g. db lookup). If valid, the server
  encrypts some information into a token string that is returned to
  client as a body payload.

- Client saves the token somewhere and sends it as Authorization
  header on every request to Server.

- Server decrypts the authorization header. If decryption is
  successful it means client is authenticated and can proceed.

And it's great for these reasons (among others):

- It's not necessary to go back to the database on every request and
  validate the username and password. The token string grants you
  access until it expires, no other checks are needed.

- You can use exactly the same mechanism for your mobile clients.

- It's stateless (no need to keep sessions anywhere, the server can
  scale at will).

- The authentication machinery can be moved to a separate
  microservice. As long as the other services can decrypt the
  authorization map they don't even need to know there's a user
  database somewhere.

- Tests are easier (no need to setup cookie stores) and it works great
  with tools like [swagger](http://petstore.swagger.io/).

# Show me the code already

Most people know and use [friend](https://github.com/cemerick/friend) as
a security library for Clojure, but that's not the only one.
[Buddy](https://github.com/funcool/buddy) is an excellent alternative,
provided with extensive documentation and modular structure, which means
it's not tightly coupled to Ring. That's good, because the following
example uses [pedestal](https://github.com/pedestal/pedestal) (it
oubviously works just as well with Ring).

```clj
(ns app.users
  (:require [io.pedestal.impl.interceptor :refer [terminate]]
            [io.pedestal.interceptor.helpers :refer [defbefore defhandler]]
            [datomic.api :as d]
            [clj-time.core :refer [hours from-now]
            [buddy.auth.protocols :as proto]
            [buddy.auth.backends.token :refer [jwe-backend]]))

(defonce secret "my-secret")

(def encryption {:alg :a256kw :enc :a128gcm})

(defn- user-info [db user]
  (d/pull db [:db/id :user/role :user/company] user))

(defhandler login
  [{:keys [body-params db] :as request}]
  (let [{:keys [username password]} body-params
        [user] (d/q '{:find [[?e]]
                      :in [$ ?username ?password]
                      :where [[?e :user/email ?username]
                              [?e :user/password ?enc]
                              [(buddy.hashers/check ?password ?enc)]]}
                    db username password)
        valid? (some? user)]
    (if-not valid?
      {:status 401 :body {:message "Wrong credentials"}}
      (let [info (user-info db user)
            claims {:user info
                    :exp (-> 3 hours from-now)}
            token (jwe/encrypt claims secret encryption)]
        {:status 200 :body {:token token}}))))
```

The important bit is the line `(jwe/encrypt claims secret encryption)`.
After we've successfully authenticated the user we create a `claims`
map. The most relevant key is the expiration (set at three hours in the
example above) otherwise the user will be forever authenticated. This
claims map can be merged with any other data that you might want to get
back when you decrypt the json token sent by the client. In the example
we're extracting the user info from a Datomic reference.

When the client sends back the token we can check the authentication and
assoc the identity to the request without an extra round trip.

```clj
(defbefore check-auth
 [{:keys [request] :as context}]
  (let [req (try (some->> (proto/parse auth-backend request)
                          (proto/authenticate auth-backend request))
                 (catch Exception _))]
    (if (:identity req)
      (assoc context :request req)
      (-> context
          terminate
          (assoc :response {:status 401 :body {:message "Unauthorized"}})))))
```

(\_Thumbs up for pedestal interceptors for making it easy to early
terminate a request if the authentication fails, instead of the usual
try/catch/error-fn dance required by ring middlewares. \_)

You can place this interceptor at the root of an authenticated route and
any path under it will see the decrypted token under the `:identity`
key.

Now that you know if a user is authenticated, you probably want an
interceptor that checks if the user is allowed to access that resource.

```clj
(defn- user-allowed? [user path-params]
 (let [{company-path :company} path-params
       {:keys [:user/role :user/company]} user]
   (and (= role :admin) (= company company-path))))


(defbefore check-permissions
 [{:keys [request] :as context}]
  (let [{:keys [db identity path-params]} request
        user (:user identity)
        allowed? (user-allowed? user path-params)]
    (if allowed?
      context
      (-> context
          terminate
          (assoc :response {:status 403 :body {:message "Not allowed"}})))))
```

The function `user-allowed?` obviously depends on your business domain,
but the concept is the same: we're checking if the user represented by
`{:db/id X :user/role Y :user/company Z}` can access a specific
resource. Placing `check-permission` at the root of some paths will
short circuit the request if the user is not allowed to call that
handler.

Here's how everything plays together in with pedestal's route
definition.

```clj
(defroutes routes
  [[["/"
     ["/login" {:post login}]
     ["/user" ^:interceptors [check-auth] {:get profile}
      ["/:company/transactions" ^:interceptors [check-permissions] {:get transactions}]]]]])
```

# Summary

If you're doing user authentication in your Clojurescript app you might
want to switch to Json Tokens instead of sticking with Http Session to
make the server simpler to use, scalable and mobile ready. Json Tokens
are approved by Master Pai Mei himself.

Discuss below or [join the
discussion](https://news.ycombinator.com/item?id=9857332) on Hacker
News.
