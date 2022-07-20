# JUXT Website

## Quick Commands

Get [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable).

All commands are run from the root of the project, from a terminal:

| Command            | Action                                       |
| :----------------- | :------------------------------------------- |
| `yarn install`     | Installs dependencies                        |
| `yarn run dev`     | Starts local dev server at `localhost:3000`  |
| `yarn run build`   | Build your production site to `./dist/`      |
| `yarn run preview` | Preview your build locally, before deploying |

## Components

After reading this section, you should be able to perform the most common changes to the site.

### Navbar

The Navbar can be found in `components/Navbar.astro`. The links in the Navbar are driven by the `metadata` variable that is defined at the `page` level.
For a page to appear in the Navbar, it needs a `navbar` key with optional `label` and `weight` attributes, the latter controls the position.
An example follows:

```js
// somewhere in the frontmatter of about.astro page

export const metadata = { navbar: { weight: 1 } }
```

Here, we are saying that we want the about page to be linked in the navbar (presence of navbar key) and that it has to be the first link (weight of 1).
Note that without a `label` key the label will default to the name of the `*name*.astro` file, so in this example it will be `about`.

### New Page

All site pages are `*name*.astro` and `*name*.md` files defined in the `src/pages` folder. To reach an individual page in your browser you can simply walk the file system and construct the `url` accordingly.

Let's assume the following folder structure:

```
├── src/
│   └── pages/
│   │   ├── blog/
│   │   │   ├── post1.md
│   │   │   ├── post2.md
│   │   │   └── post3.md
│   │   │   └── index.astro
│   │   └── index.astro
```

The `url` to visit `post1.md` would be: `/blog/post1`. Notice that the `index.astro` files play a special role, as they are the default page under each single page folder. For example, if you visit: `/blog`, the `/blog/index.astro` file is the one served. Clearly, the site homepage is `/pages/index.astro`.

All you need to create a new page is a `*name*.astro` file with the following content:

```astro
---
import Layout from '../layouts/Layout.astro'
---

<Layout navbar={true}>
  <main>new page here</main>
</Layout>
```

From here, the sky's the limit.

### Articles

To create a new article add a `*blogName*.md` file in `pages/blog`. You must include all the necessary metadata in the frontmatter of your article for the post to be displayed properly. An example follows:

```md
---
draft: true
author: 'lda'
layout: '../../layouts/BlogPost.astro'
title: 'Hello world!'
description: "Bring your markdown, we'll handle the rest"
publishDate: '17 Jul 2022'
heroImage:
  src: '/images/blog/introducing-astro.jpg'
  alt: 'Space shuttle leaving curved trail in the sky'
---
```

When a post is ready to go live, you can set the `draft` value to be false and it will be included in the build.

### Optimized Images (NOT SUPPORTED CURRENTLY)

Through the `setup` attribute in the frontmatter you can import the `Image` component that can be easily consumed from your article.

```md
---
setup: |
  import { Image } from '@astrojs/image'
  import hero from '../../assets/images/mock.webp'
---

# hello world

<Image src={hero} width={640} aspectRatio="16:9" />
```

Remember to import also the pictures, which are stored in `src/assets/images`.
