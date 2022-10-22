---
author: 'dmc'
title: 'Clojure and Vim: An overview'
description: "It's very possible"
category: 'clojure'

publishedDate: '13 Dec 2016'
heroImage: 'mock3.jpg'
---

I want to encourage Vim users to continue using Vim as their primary
driver, even for Clojure. This isn't about Emacs vs Vim, it is about
encouraging people to not change editor because they've changed
language.

Vim is a very capable editor. I want to give you an overview of the
plugin set I use to work with Clojure every day.

# The core toolset

These are the central parts of my workflow that I build all else from.

## Neovim

At the start of my journey, I switched to Neovim from Vim. Neovim is a
fork of Vim that aims to refactor the legacy code base, and bring modern
features.

The first innovation from Neovim is async. These have permitted plugins
like [async-clj-omni](https://github.com/clojure-vim/async-clj-omni) to
appear for asynchronous auto-completion, and async repl plugins such as
[acid](https://github.com/hkupty/acid.nvim) for non-blocking
evaluations.

Another innovation of Neovim's is the fluent RPC api and plugin host
capabilities. These allow you to write plugins in any language for vim.
In fact, [snoe](https://github.com/snoe) wrote
[clj-refactor.nvim](https://github.com/clojure-vim/clj-refactor.nvim) in
Clojurescript, taking advantage of libraries such as
[rewrite-cljs](https://github.com/rundis/rewrite-cljs), for REPL-less
refactoring for Clojure.

> Writing plugins for a language, in that language, is the way to go
>
> - [Case Nelson](https://github.com/snoe), author of
>   [clj-refactor.nvim](https://github.com/clojure-vim/clj-refactor.nvim)

## nREPL middleware

Both CIDER & clj-refactor.el are extremely popular within the Emacs
community. Powering both are editor-agnostic APIs available through the
nREPL as middleware. This means I get access to much of the same
functionality in Vim directly from the same code base.

Due to the accessibility and usefulness of these APIs, they are used in
many Clojure plugins. Amongst the many features the middleware provides
are:

- Syntax aware completions

- Code refresh (without a dependency)

- An Enhanced doc API including information such as specs

- Locate uses of a var

- Format code

- Locate file for dependency (jump to source into jars)

## Fireplace.vim

The [fireplace](https://github.com/tpope/vim-fireplace) plugin is an
nREPL client. It's purpose is to integrate Vim with your REPL. It's a
very simple plugin, providing a light interface over the nREPL and
common interactions with it. It's the centerpiece of my REPL workflow.

It provides a number of features:

- Evaluation in the buffer `cpp`

- Command to run arbitary code `:Eval (+ 1 1)`

- Manual omni-completion you can activate with `<C-x><C-o>`

- Automatic nREPL connection

- Docs for symbol under cursor `K`

- Jump to definition `[<C-D>`

My secret weapon from fireplace is **cp**. It can evaluate a text object
(region of text) you give it. Many overlook the usefulness of this
little operation, but it's extremely handy when composed with vim-sexp.

Fireplace takes advantage of CIDER-nREPL for a number of features (e.g.
the completion, and augmenting minor functionality), displaying the
non-specificity of the middleware.

## Sexp

[vim-sexp](https://github.com/guns/vim-sexp) is the paredit of the Vim
world. It would be amiss to not mention
[vim-sexp-mappings-for-regular-people](https://github.com/tpope/vim-sexp-mappings-for-regular-people)
which adds mappings that are easier to use, but override built-ins.

It has support for a number of operations (slurpage, barfage, raise
parent, etc.). It provides text objects which make it easy to refer to
sections of code, and there are motions for navigating quickly.

The text objects for referring to parts of s-expressions are an
overlooked part of Sexp. I'll use an example where `|` is my cursor in
the snippet:

    (def price 500.0)

    (defn enterprise-price
      []
      (* pr|ice 10))

With `ie` refers to the \"element\" I'm on, this is a special meaning in
[vim-sexp](https://github.com/guns/vim-sexp) (see the readme for more
details on what an element is in sexp). In this case, it refers to
`price`, so combined with fireplace, I can do `cpie` to evaluate `price`
and see `500.0` printed at the bottom.

**ie** `cpie` will evaluate `price` and print out `10.0` at the bottom
of the screen.

**af** `cpaf` will evaluate `(* price 10)` and print out `5000.0` at the
bottom of the screen

**aF** `cpaF` will re-evaluate the `defn` and update the function
definition

Of course, all these objects are compatible with the operators you
already know like **y**ank **d**elete

# 20% improvements

These are some plugins which don't form the backbone of my workflow, but
make a 20% improvement.

## Deoplete

[Deoplete](https://github.com/Shougo/deoplete.nvim) provides as-you-type
asyncronous omnicompletion. Using
[async-clj-omni](https://github.com/clojure-vim/async-clj-omni) you can
extend Deoplete's completion to include Clojure. I found the default
fireplace completion (combined with auto-completion) would slow down
during mass typing and cause the editor to lock up whilst it caught up.

## Custom Bindings

Vim's built-in extensibility means you can very easily add mappings to
do things like a reset with `,rs`:

```vim
nnoremap <localleader>rs :Eval (dev/reset)<CR>
```

I find that I have a number of minor bindings that are useful for
automating repetitive evaluations on a project. They really augment the
REPL workflow in their nature.

## Parinfer

[parinfer](http://shaunlebron.github.io/parinfer/) is a great system for
editing Lisp code which uses your indentation level to figure out the
correct parens to insert. Changing the indentation of your code changes
where the parens are placed.

[nvim-parinfer.js](https://github.com/clojure-vim/nvim-parinfer.js) is a
vim plugin written in Clojurescript which adds
[parinfer](http://shaunlebron.github.io/parinfer/) support using the
original javascript library. It was one of the earliest plugins and is a
great way to edit Sexps.

## clj-refactor.nvim

Another plugin by [snoe](https://github.com/snoe), this plugin adds many
of the features from
[clj-refactor.el](https://github.com/clojure-emacs/clj-refactor.el) to
Neovim. Many of the refactorings don't even need a REPL to function. The
plugin is, written in Clojurescript, so it can take advantage of the
Clojure ecosystem's libraries which have been written to manipulate
code. [rewrite-cljs](https://github.com/rundis/rewrite-cljs), and
[cljfmt](https://github.com/weavejester/cljfmt) both underly this
plugin.

# Future adventures

## Acid

_Here be dragons, only for the truest of heart_.

[acid](https://github.com/hkupty/acid.nvim) is an upcoming plugin for
Neovim that absolutely deserves a mention. It's attempting to rebuild
the fireplace you know and love in Python, to add a fully async
interface to it. The plugin is in alpha, but is something to keep an eye
on.

## neovim-client

[neovim-client](https://github.com/clojure-vim/neovim-client) is a
client for Neovim, written in Clojure. The idea is to provide make it
simpler to run the JVM clojure as a plugin language for Neovim.

One of the included examples is a [socket REPL
client](https://github.com/jebberjeb/clojure-socketrepl.nvim), which is
a very impressive display of how this library could be used to build
plugins for Vim.

## Next Post(s)

Some of my current ideas for future posts:

- A detailed beginner setup guide for all these tools

- Some information on how I have built out my environment, and my
  favourite mappings

# Me

I share my dotfiles publicly, particularly of interest is probably my
[clojure
folder](https://github.com/SevereOverfl0w/.files/tree/master/nvim/layer/clojure).
Please peruse them, copy from them, learn from them.

You can come bother me in `#vim-fireplace` as `dominicm` in the
[Clojurians](http://clojurians.net) Slack, and I'll try my best to help
you with Vim.
