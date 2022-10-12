---
author: 'jms'
title: 'How-to: Clojure libraries on Maven Central'
description: "A guide for migrating Clojure libraries to Maven Central, following Crux's recent migration"
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '15 Jul 2021'
heroImage: 'mock3.jpg'
---

**_Crux is now XTDB_**

**_September 2021 Update: Crux has recently been renamed XTDB. The official home for XTDB is now https://xtdb.com._**

**_This post
still refers to XTDB as \"Crux\" but you will find newer versions of the
artifacts discussed under the new `com.xtdb` Maven GroupId
(`[com.xtdb/xtdb-core "1.19.0"]` for example) instead of the `pro.juxt`
GroupId described in the examples below
(`[pro.juxt.crux/crux-core "1.17.1"]` for example)._**

**_The official home for XTDB is now <https://xtdb.com>._**

Much as we love Clojure here at JUXT, we'll shortly be releasing a
couple of non-Clojure modules for our database [Crux](https://xtdb.com)
(watch this space!), and we'd love these to be more accessible for
people outside of the Clojure community.

Until recently, Crux artifacts were deployed to
[Clojars](https://clojars.org) - this has been great for us so far, but
it doesn't make life as easy for projects using other JVM build tools.

It's relatively straightforward to ask our non-Clojure users to add
Clojars as a repository, but this has one main drawback: additional
repositories aren't applied transitively in Maven, for security
reasons - _every_ downstream dependency of a Clojars library has to have
Clojars explicitly added as a repo. That is, from an end-user's
point-of-view, if any library anywhere in your dependency tree happens
to be deployed to Clojars, you'll have to add it.

Artifacts on Central, on the other hand, are trivially accessible to
anyone using any Maven build tool.

So, we would like to appeal to Clojure library authors: if your library
could be used by a non-Clojure application at some point, directly or
indirectly, **please do consider deploying your libraries to Central**.

(This certainly isn't to detract from how awesome Clojars and the
Clojars folks are, nor the Clojure community funding it, nor is it to
say that we're stopping using it altogether. Indeed, in doing so, we can
hopefully all save them some hosting, bandwidth, and administrative
hassle!)

This guide aims to help you through the one-time setup required to get
started.

What we know as _Maven Central_ is in fact a network of repositories,
all sync'd into one entry point at <https://repo1.maven.org/maven2>.
Larger organisations often have their own public repositories that are
mirrored here - we'll be deploying to the [_Open Source Software
Repository Hosting_](https://central.sonatype.org/publish/) (OSSRH)
service.

We'll focus on Leiningen as it's what Crux uses - no doubt the process
will be similar for your build tool of choice. Leiningen has an
excellent [sample
`project.clj`](https://github.com/technomancy/leiningen/blob/master/sample.project.clj)
which contains examples and documentation of a lot of these
configuration values - I highly recommend having this open in a tab any
time you're making non-trivial changes to your `project.clj`!

# One-time setup - verifying your group ID

Maven Central first requires that we pick and verify our group ID. Group
IDs can be based on the standard Java _reverse domain name_ pattern
(e.g. `org.clojure`, `org.apache`, `pro.juxt`). Or, if you don't want to
verify a domain name, you can use a GitHub-based group ID (e.g.
<https://github.com/jarohen> becomes `io.github.jarohen`, and
[similarly](https://central.sonatype.org/publish/requirements/coordinates/#supported-code-hosting-services-for-personal-groupid)
for GitLab, Bitbucket etc.). This is a similar, albeit slightly
longer-winded, process to the new [Clojars group ID verification
process](https://github.com/clojars/clojars-web/wiki/Verified-Group-Names).

Buckle up, it's JIRA time:

1.  Create yourself an account on [Sonatype
    JIRA](https://issues.sonatype.org/secure/Signup!default.jspa).
    You'll use this same username and password to access the [Nexus
    UI](https://oss.sonatype.org) later.

2.  Create a [New
    Project](https://issues.sonatype.org/secure/CreateIssue.jspa?issuetype=21&pid=10134)
    ticket.

3.  Verify your domain/git account:

    - For domains, this involves adding a TXT record containing a
      ticket number.

    - For git accounts, create a repo with the same name as the ticket
      number.

They say this could take 2 business days - in practice, for us, it was a
couple of hours.

Once you've verified your group ID, you can then deploy under any
sub-group too - e.g. we've only needed to verify `pro.juxt` but we
deploy Crux's modules under `pro.juxt.crux`.

There are more details on the
[requirements](https://central.sonatype.org/publish/requirements/coordinates/)
and [JIRA
process](https://central.sonatype.org/publish/publish-guide/#create-a-ticket-with-sonatype)
on the OSSRH site.

# Per-user setup

To add subsequent users (including bot users) to a group, the process is
similar to the process for creating the group (although without the need
for any re-verification):

1.  Get the user to create a JIRA account. (If it's a bot user, you'll
    probably have to do this for them.)

2.  Open a card requesting access to the group for the new user.

3.  Get someone already on the group to vouch for them in a comment on
    the card.

Users can then log in to the [Nexus UI](https://oss.sonatype.org) using
those same credentials. While you _can_ also use these same credentials
in Leiningen, there are separate deployment credentials available in
this UI. Head to your profile - then, in the dropdown, select [User
Token](https://oss.sonatype.org/#profile;User%20Token).

Add these to your Leiningen config (I've added them to
`~/.lein/credentials.clj.gpg`) as outlined
[here](https://github.com/technomancy/leiningen/blob/master/doc/DEPLOY.md#authentication).

```clojure
{#"https://oss\.sonatype\.org/.*"
 {:username "..."
  :password "..."}}
```

Finally, you'll need to publish your public GPG key on a public
keyserver. Assuming you have a GPG key set up locally, you can run
`gpg -K` to get your key ID, and then
`gpg --keyserver keyserver.ubuntu.com --send-key <key-id>` to publish
it.

Further instructions about setting up GPG for OSSRH are available
[here](https://central.sonatype.org/publish/requirements/gpg/).

# Per-project setup

Maven Central does have a few more validations than Clojars - thankfully
none too onerous! These need to be applied once per project - in Crux,
we've made use of [`lein-parent`](https://github.com/achin/lein-parent)
to share as much as possible between our various modules.

Firstly, your project needs to contain a `:license`, `:url` and
`:description` - it arguably should do anyway, but Maven Central insists
on it. These are passed down from Leiningen into the Maven
`pom.xml` file, so adding them is straightforward:

```clojure
  :description "General purpose bitemporal database for SQL, Datalog & graph queries."
  :url "https://github.com/juxt/crux"
  :license {:name "The MIT License"
            :url "http://opensource.org/licenses/MIT"}
```

Next, `<scm>` tags. Leiningen does a good job of adding these by default
for GitHub repos, but I ran into a couple of issues:

- Crux modules aren't in the root of the git repo, so I needed to add
  `:scm {:dir ".."}` to the `project.clj`.

- When I originally cloned the Crux repo, I cloned it as
  `git@github.com:juxt/crux` (i.e. without a `.git` suffix). Leiningen
  doesn't pick this up, so I had to
  `git remote set-url origin git@github.com:juxt/crux.git`.

Heh :) Hopefully that saves someone else some time!

Another easy one: we're required to add a `<developers>` tag. Leiningen
doesn't have any way of passing these through (as far as I know), so we
fall back to `:pom-addition` to manually add XML to the `pom.xml`:

```clojure
  :pom-addition ([:developers
                  [:developer
                   [:id "juxt"]
                   [:name "JUXT"]]])
```

If your project contains any Java source, you'll need to upload
_javadoc_ and _sources_ JARs too. For this, we bring in the
`lein-javadoc` plugin, and make use of `:classifiers`:

```clojure
  :plugins [[lein-javadoc "0.3.0"]]

  :javadoc-opts {:package-names ["crux.api"]
                 :output-dir "target/javadoc/out"
                 :additional-args ["-windowtitle" "Crux Javadoc"
                                   "-quiet"
                                   "-Xdoclint:none"
                                   "-link" "https://docs.oracle.com/javase/8/docs/api/"
                                   "-link" "https://www.javadoc.io/static/org.clojure/clojure/1.10.3"]}

  :classifiers {:sources {:prep-tasks ^:replace []}
                :javadoc {:prep-tasks ^:replace ["javadoc"]
                          :omit-source true
                          :filespecs ^:replace [{:type :path, :path "target/javadoc/out"}]}}
```

See the OSSRH website for [full documentation on their POM
requirements](https://central.sonatype.org/publish/requirements/).

Finally, we'll need to add `:repositories`/`:deploy-repositories` for
OSSRH:

```clojure
  :repositories
  {"snapshots" {:url "https://oss.sonatype.org/content/repositories/snapshots"}}

  :deploy-repositories
  {"releases" {:url "https://oss.sonatype.org/service/local/staging/deploy/maven2"
               :username [:gpg :env/sonatype_username]
               :password [:gpg :env/sonatype_password]}
   "snapshots" {:url "https://oss.sonatype.org/content/repositories/snapshots"
                :username [:gpg :env/sonatype_username]
                :password [:gpg :env/sonatype_password]}}
```

We use `[:gpg :env/sonatype_username]` so that Leiningen first checks
`~/.lein/credentials.clj.gpg`, then the `SONATYPE_USERNAME` environment
variable.

# Deploying

If you've named your repositories `releases` and `snapshots`,
`lein deploy` (without any further parameters) will select the right
repository depending on whether your project version ends with
`-SNAPSHOT`. For snapshots, we're all done - you should find your
artifacts in the snapshot repo (Crux's are at
<https://oss.sonatype.org/content/repositories/snapshots/pro/juxt/crux/>).

For releases, artifacts are first uploaded to a _staging_ area. Once
your `lein deploy` finishes, head back to the [Nexus
UI](https://oss.sonatype.org), and click [_Staging
Repositories_](https://oss.sonatype.org/#stagingRepositories). You
should see a staging repository, and can browse the uploaded files.

There are two more steps to release:

- _Closing_ the staging area - this performs a suite of validations on
  the files you've uploaded.

- _Releasing_ the staging area - this copies the staging area to the
  OSSRH releases repository, which is then sync'd to the main Central
  repo.

There are apparently tools out there to automate these steps too -
personally, for Crux releases, I prefer to keep these as a manual step!

We've now re-released Crux 1.17.1 onto Maven Central under the
`pro.juxt.crux` group:

```clojure
;; before
[juxt/crux-core "21.06-1.17.1-beta"]

;; after
[pro.juxt.crux/crux-core "1.17.1"]
```

More details, as always, in the [Crux release
notes](https://github.com/juxt/crux/releases/1.17.1).

# Clojars dependencies

Naturally, while we do minimise dependencies in Crux, we do depend on a
few libraries that are released on Clojars (Clojure itself, and other
`org.clojure` libraries, are already on Central). Because the addition
of extra repositories doesn't automatically propagate from a library to
its dependents, these would not be accessible to anyone depending on
Crux through Maven Central.

We've solved this, in the short-term, by releasing mirrored versions of
these libraries on Central, under our `pro.juxt.clojars-mirrors` group.
The wiring for these mirrored libraries is available at our
[`clojars-mirrors`](https://github.com/juxt/clojars-mirrors) repo -
please do feel free to either copy these, or submit PRs to add other
libraries.

# Get in touch!

We'd love to hear your thoughts - if you've any feedback or questions,
we've opened up a [thread over on
Reddit](https://www.reddit.com/r/Clojure/comments/olhjqt/howto_clojure_libraries_on_maven_central/).

Similarly, if you'd like any help or advice with migrating your
libraries, please do get in touch with us on the [Clojurians\' Slack
#juxt channel](https://clojurians.slack.com/archives/C0CFGN25D).
