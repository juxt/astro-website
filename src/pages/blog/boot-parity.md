---
author: 'djh'
title: 'Getting Leiningen feature-parity in Boot'
description: 'An introduction to the Boot build tool and how to get started on your Clojure project'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '19 Jan 2016'
heroImage: 'feature-parity.jpg'
---

For a basic Clojure project it can be daunting to begin with Boot (even
for the experienced Clojurist). This post will go through the basics of
setting up the `build.boot` file to keep the main tasks in Leiningen.

This post assumes a lot of prior knowledge in Leiningen and at least
some familiarity with Boot.

We start from a basic Lein project; `project.clj` with `src` & `test`
folders. I started with `lein new my-project` to get the structure.

# Feature-parity

Of course, not everything will be exactly the same, there will be some
differences between the two build systems. The main features that I will
show are:

- REPL
- test
- jar
- uberjar

# REPL

By far, the most important task is to launch a REPL to work effectively.

To get your work done, both `src` & `test` directories need to be
available.

```clojure
(set-env!
    :source-paths #{"src" "test"}
    :dependencies '[[org.clojure/clojure "1.7.0"]])
```

Many developers have a namespace loaded on REPL startup to help with
interactive development: to reload source files; to startup systems; and
to run tests. We want to have this available to use when starting a REPL
in boot.

I usually call this namespace `user` which lives in a supplementary
`dev` folder. This folder is added in to the REPL only.

## REPL task-options

If there is a boot hook available, the simplest way to change the task
is to use `task-options!` to set defaults. For more complicated
replacement we need to use `replace-task!`. Below is an example

```clojure
(task-options!
   repl {:eval (println "Howdy!")
         ;; my user ns in dev folder
         :init-ns 'user
         ;; skip the Boot automatic ns injection, also called `user`
         :skip-init true})

(replace-task!
    [r repl] (fn [& xs]
              ;; add "dev" into source-paths only for this task
              (merge-env! :source-paths #{"dev"})
              ;; just to verify the change, not required
              (println "Our paths are now" (get-env :source-paths))
              ;; and continue on with our original repl task.
              (apply r xs)))
```

So things got complicated real fast! Stick with it, it should make sense
soon.

# Test

In Leiningen when we run `lein test` it just works. There isn't much to
worry about. In Boot, it will be a bit more involved.

We must add some more boot code to our script.

```clojure
;; add in to the existing :dependencies
(set-env! :dependencies '[[adzerk/boot-test "1.1.0" :scope "test"]])

(require '[adzerk.boot-test :refer :all])
```

Now we have `boot test` available as a task. If you use Leiningen's test
selectors to filter tests then more work is needed to run these tests.

# Creating a JAR

In Leiningen, the jar command will do many things: compile classes (if
there is a `:main` or `:aot` declared); create the pom file; then
package clj from `src` and the classes into a JAR.

If we just run `boot jar` without any configuration we won't get much,
just an empty `project.jar` in the target directory!

## Understanding the pipeline

We must understand how to pipeline tasks in Boot. This is where Boot
starts to digress from Leiningen.

We wish to make our own task that will do all of the Leiningen sub-tasks
in one go.

```clojure
(deftask build
  "Build the JAR file"
  []
  (comp
   (aot)
   (pom)
   (jar)))
```

We have now created a `build` task to compose all of the tasks together.
It's quite simple really. But in order for this to work we will need to
set some options for `pom`. Also we'd like to compile some files. And
set the main class.

```clojure
;; again, both should be added into the existing declarations.

(set-env! :project 'my-project
          :version "0.1.0-SNAPSHOT")

(task-options! pom {:project (get-env :project)
                    :version (get-env :version)}
               aot {:namespace '#{my-project.core}}
               jar {:main 'my-project.core})
```

If we inspect the JAR after running `boot build`

```bash
$ boot build
Howdy # <- we still see our REPL running!
Writing pom.xml and pom.properties...
Writing my-project-0.1.0-SNAPSHOT.jar...

$ unzip -l target/my-project-0.1.0-SNAPSHOT.jar
Archive  target/my-project-0.1.0-SNAPSHOT.jar
  Length     Date   Time    Name
 --------    ----   ----    ----
        0  01-05-16 10:54   META-INF/
        0  01-05-16 10:54   META-INF/maven/
        0  01-05-16 10:54   META-INF/maven/my-project/
        0  01-05-16 10:54   META-INF/maven/my-project/my-project/
      146  01-05-16 10:54   META-INF/maven/my-project/my-project/pom.properties
     1063  01-05-16 10:54   META-INF/maven/my-project/my-project/pom.xml
       25  01-05-16 10:54   META-INF/MANIFEST.MF
 --------                   -------
     1234                   7 files
```

D'oh! We don't get anything.

## Resources & sources

You must set `:resource-paths #{"src"}` in order to include the clj
files in the JAR. Leiningen has helpfully included our `src` directory
as part of the resources to copy into the JAR. Boot has done the
opposite, we must explicitly include our sources if we want to publish
them.

# Building an uberjar

In a similar fashion to building a jar we can create our own pipeline
task.

```clojure
(deftask build-uber
    "Build the uberjar file"
    []
    (comp
     (aot)
     (pom)
     (uber)
     (jar)))
```

Unfortunately this just makes a jar named `project.jar`. We can alter
the jar name by setting task options on our new task.

```clojure
(deftask build-uber
    "Build the uberjar file"
    []
    (comp
     (aot)
     (pom)
     (uber)
     (jar :file (format "%s-%s-standalone.jar" (get-env :project) (get-env :version)))))
```

It's a bit awkward but it works.

# Conclusion

Leiningen has been around for years and it works really well for
creating projects. There are some nice features built-in to get working
quickly without needing to know a lot of things.

Boot has some really nice features, most of which are not displayed in
this demonstration. The fact that you can simply pipeline all of the
subtasks in the build process means that you can replace any part you
don't like. It is not for the feint of heart, there is a lot to set up
before you can get hacking effectively.

# The final files

A fully working setup is [available on Github](https://github.com/davidjameshumphreys/converting-to-boot-example)
to experiment with.

The `build.boot` file:

```clojure
;; An example setup showing how to move a simple library from Leiningen to Boot.

(set-env!

 :source-paths #{"src" "test"}
 ;; If resource-paths is not set then the clj files will not appear in
 ;; the JAR or uberjar
 :resource-paths #{"src"}

 ;; these values must be set to use the pom task.
 :project 'my-project
 :version "0.1.0-SNAPSHOT"

 ;; beware the initial quote on the vector!
 :dependencies '[[org.clojure/clojure "1.7.0"]
                 ;; Add your other dependencies as normal in here


                 ;; we must include this boot task in order to run
                 ;; boot test. It is scoped for the test life-cycle
                 ;; only
                 [adzerk/boot-test "1.1.0" :scope "test"]])

(require '[adzerk.boot-test :refer :all])
;; or :refer [test] if you prefer to specify.


;; We set the default values for task options. We may override them
;; from the command line or if we call tasks.
(task-options!
 pom {;; needed to write the pom.xml file.
      :project (get-env :project)
      :version (get-env :version)

      ;; How to add in your project license
      :license {"Eclipse Public License"
                "http://www.eclipse.org/legal/epl-v10.html"}

      ;; And url.
      :url "https://juxt.pro/"}

 ;; beware the initial quote here too.
 ;; you could use :all true instead
 aot {:namespace '#{my-project.core}}
 jar {:main 'my-project.core}

 ;; we have our own dev/user.clj file that we wish to load.  We
 ;; skip-init so that we don't clash with Boot's user ns.
 repl {:init-ns 'user
       :skip-init true})

;; We want to change the behaviour of the repl task to include our own
;; namespace.
(replace-task!
 [r repl] (fn [& xs]
            ;; we only want to have "dev" included for the REPL task
            (merge-env! :source-paths #{"dev"})
            (apply r xs)))

(deftask build
  "Build the JAR file"
  [] ;; we have no options for this task.

  ;; compose the tasks.
  (comp
   (aot)
   (pom)
   (jar)))

(deftask build-uber
  "Build the uberjar file"
  []
  (comp
   (aot)
   (pom)
   (uber)
   ;; In this case, we want the jar to be named in a way that mirrors
   ;; the Leiningen way.
   (jar
    :file (format "%s-%s-standalone.jar"
                  (get-env :project)
                  (get-env :version)))))
```

versus `project.clj` definition:

```clojure
(defproject my-project "0.1.0-SNAPSHOT"
  :description "An example project that demonstrates using Boot as a build tool."
  :url "https://juxt.pro/"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.7.0"]]
  :main my-project.core
  :profiles {:dev {:source-paths ["dev"]}}
  :repl-options {:init-ns user})
```
