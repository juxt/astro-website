---
author: 'anc'
title: 'Carve that Clojure codebase'
description: 'How to use carve to delete all the dead code from your projects'
category: 'clojure'
layout: '../../layouts/BlogPost.astro'
publishedDate: '2021-01-18'
heroImage: 'carve.jpg'
---

As anyone who has maintained a legacy software project will know, every
project tends inevitably to accumulate a lot of cruft.

Even in the most disciplined teams, it's hard to always keep track of
dead code, and it will just grow forever, confusing lots of devs just by
being around.

Dead code can be annoying, but also trying to track manually if
something is used or not, can be even more annoying and hard to do.

Would it not be nice to have a tool that you can just run against your
entire Clojure codebase and can detect, and even automatically delete
all the dead code?

Luckily this tool exists, it's called
[carve](https://github.com/borkdude/carve) (another project of the
amazing [Michiel Borkent AKA Borkdude](https://github.com/borkdude/)),
and it accomplishes this goal by using the code analysis output from
[clj-kondo](https://github.com/clj-kondo/clj-kondo) to detect all the
vars that are never referenced by anything else.

# Process

I will outline here a process that worked well for us and allowed us to
delete thousands of lines of code very easily. There are other ways to
use `carve` as you can see that in detail in [the carve usage section](https://github.com/borkdude/carve#usage).

## Install

Install the carve binary following instructions from [the carve install documentation](https://github.com/borkdude/carve#installation).

## Configure

Create a `.carve` directory and create a `.carve/config.edn` file with a
content like (paths will depend on your project):

```clojure
  {:paths ["src" "test" "dev"] :report {:format :text}}
```

This means: simply report in a text format (line by line) all the vars
that can be deleted according to carve.

## Run

With this report, you can check one by one the results and make sure
it's code that you should delete.

The output will be something like:

```bash
   src/core.clj:3:1 core/dead
```

Carve might give you some false positives especially if you are doing
some more advanced lazy loading and similar tricks. So it's important to
check manually (and by running your test suite) that you're not deleting
something still required.

If you are using Emacs you might like this small trick, run
`carve > to_carve.txt` and the `to_carve.txt` file with
compilation-mode, which will allow you to jump seamlessly between all
the different vars (other IDEs might have a similar feature).

## Automate

This is maybe the most important step, and it's there to ensure that
no-one can add dead code to the project again. The specific steps will
depend on your CI environment, but the idea is simply to make your build
pipeline fail if carve detects any dead code.

I will show an example with circleci since it's the tool I'm most
familiar with, but it should be trivial to port to other CI platforms.

```yaml
version: 2
jobs:
  build:
    docker:
      - image: circleci/clojure:lein-2.9.3

      working_directory: ~/<your-project>

    steps:
      - checkout
      # install carve from binary
      - run:
          wget -O carve.zip https://github.com/borkdude/carve/releases/download/v0.0.1/carve-0.0.1-linux-amd64.zip && unzip carve.zip && chmod +x carve && sudo mv carve /usr/local/bin/

      # check for dead code
      - run: carve
        - ... extra steps for your build
```

# Iterate

Now that you covered the basis there are a few more things to consider.

If for instance, you carved your project passing `["src" "test"]` as
paths, there could still potentially be dead code which isn't running in
production but it's currently tested.

Given that tests for dead code take time in your build pipeline, and
tests have always the annoying potential to be flakey, deleting them as
well is also a good idea.

To do that simply pass `["src"]` and you'll get all the dead vars in
your production code.

Once you've deleted all that extra unused code lots of tests might fail,
and it could happen for two reasons:

- some tests are now just unnecessary, which is easily fixable by
  removing them.

- some tests relied on some helper functions that are not defined in a
  test namespace, and that's also easy to fix by moving these helper
  functions in tests namespaces (which is a good idea anyway).

Also, given the dynamic nature of Clojure, there are tricks to generate
function calls at run-time, so you if you are using these tricks you
need to be careful.

# Conclusions

You can find a full example of a project with carve set up in this
[sample project](https://github.com/AndreaCrotti/carve-automate).

Deleting code is fun, happy carving!
