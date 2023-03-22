# JUXT Website

## Quick Commands

Get [yarn](https://classic.yarnpkg.com/lang/en/docs/install/#mac-stable).

All commands are run from the root of the project, from a terminal:

| Command            | Action                                       |
| :----------------- | :------------------------------------------- |
| `yarn install`     | Installs dependencies                        |
| `yarn start`       | Starts local dev server at `localhost:3000`  |
| `yarn run build`   | Build your production site to `./dist/`      |
| `yarn run preview` | Preview your build locally, before deploying |

After reading the following section, you should be able to perform the most common updates to the site.

## Navbar & Footer links

The Navbar and Footer links are driven by the `metadata.json` file that is defined in the `src/data` folder.

## New Page

All site pages are `*name*.astro` and `*name*.md` files defined ay any level within the `src/pages` folder. To reach an individual page in your browser you can simply walk the file system and construct the `url` accordingly.

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
import Layout from '@layouts/Layout.astro'
---

<Layout navbar>
  <main>new page here</main>
</Layout>
```

From here, the sky's the limit.

## Articles

To create a new article add a `*blogName*.md` file in `src/pages/blog`. You must include all the necessary metadata in the frontmatter of your article for the post to be displayed properly. An example follows:

```md
---
draft: true
token: '1234'
author: 'lda'
layout: '../../layouts/BlogPost.astro'
title: 'Hello world!'
description: "Bring your markdown, we'll handle the rest"
publishedDate: '2022-07-23'
tags:
  - cloud
  - devops
heroImage: 'introducing-astro.jpg'
---
```

When a post is ready to go live, you can remove the `draft` attribute, so it can be indexed by algolia.

Notice that drafts go live under `/blog/drafts/*blogName*`. If you want you can provide a `token` attribute in the frontmatter to serve your article under `/blog/drafts/*blogName*/*token*`. The `token` is not a mandatory field.

The `heroImage` picture must be stored in the `src/assets/blog` folder and it must be of `.jpg` format. The `tags` are optional.

## Optimized Images

If your article body contains images, you want to use a `.mdx` file extension instead of `.md`. This is because you can import directly in your markdown an image optimizer module, which will make sure to keep your media content within a reasonable size. You can follow the example to see how it works:

```mdx
---
author: 'lda'
category: 'blog'
...

---

import { Image } from '@astrojs/image/components'
import hero from '../../assets/blog/mock.jpg'

# hello world

<Image alt='image' src={hero} />
```

To know more about the props you can pass to the `Image` component, check out this [link](https://docs.astro.build/en/guides/integrations-guide/image/#usage).

## Writing with hot-reload

The blog page is completely driven by Algolia Instant Search. This means that while writing a draft, your article won't appear in the `blog` page. To see it, you can go directly to your article url, which is `/blog/*blogName*`. There, it will hot reload as you edit and save your changes.

## Case Studies

Case studies are defined in the `src/data/case-studies` folder. Their format is `md` and they are structured as follows:

```md
---
title: 'Electric eBike provider'
subtitle: 'Building the infrastructure for an electric powered bikes scheme'
outcome:
  - 'JUXT built the backend infrastructure, dashboards, allocation logic and tracking for a bike-hire scheme in Spanish cities.'
  - 'In addition, JUXT built the public kiosk software (using ClojureScript) for individuals to register and hire bikes.'
tech:
  - 'Clojure'
  - 'ClojureScript'
  - 'Postgres'
  - 'Datomic'
  - 'AWS'
image: 'ebike-ui.jpg'
testimonial:
  quote: 'The web applications exceeded our expectations on functionality and time to market. JUXT led the development team through this period of incredible achievements.'
  role: 'Technical Director'
  by: 'Morgan Ross'
pages: { '/case-studies': { 'weight': 9 } }
---
```

For this specific case study to appear in the site, you need to specify in the `pages` object where you want it to appear. In this case, we want it to appear in the `case-studies` page, so we add a `/case-studies` key with a `weight` attribute. The `weight` attribute controls the position of the case study in the list.

For the case studies featured in the homepage, the process is the same. You can simply add an extra key value pair in the `pages` object as follows:

```json
---
 ...
  "pages": {
    "/case-studies": { "weight": 9 },
    "/": { "weight": 1 }
  }
---
```

The testimonial attribute is optional and it will only appear if you add it to the frontmatter.

Notice that the image for the case study must be a `*.jpg` file, stored in the `src/assets/case-studies/` directory.

## People

People are defined in the `src/data/people` folder. Their format is `md` and they are structured as follows:

```md
---
code: 'alx'
name: 'Alex'
lastName: 'Davis'
jobTitle: 'Senior Software Engineer'
image: 'alx.jpg'
linkedin: ''
twitter: ''
github: ''
---
```

A person's image must be a `*.jpg` file, stored in the `src/assets/people/` directory. Not all employees need to create an entry. Though, when they decide to write an article they will need to create one.

### Featured People

For the employees who need a dedicated site page with info about their skills and achievements it's possible to add a set of extra keys in the frontmatter. The following example shows how to do it:

```md
---
code: 'mal'
name: 'Malcolm'
lastName: 'Sparks'
jobTitle: 'CTO'
image: 'mal.jpg'
linkedin: ''
twitter: ''
github: ''

expert: true
expertise:
  - 'Web Servers'
  - 'Data Driven Apps'
  - 'Performance'
---

## Successes

During the 80s he wrote a number of games...
```

The `expert` key is used to determine if the person needs a dedicated page. The `expertise` key is used to display a list of skills in the dedicated page.

Moreover, the content of the dedicated page will be the markdown content that follows the frontmatter, so you can write as much as you want.

Finally, an employee can appear in the about page by adding the following key in the frontmatter:

```md
---
...

featured:
weight: 2
...

---
```

the `weight` attribute describes the order in which the employee will appear in the card list.

### Careers

`careers` is a page that lists all the open positions in the company. To create a new opening, add a `*.md` file in the `src/data/careers` folder. The format is the following:

```md
---
layout: '../../layouts/CareerPost.astro'
location: 'London / Remote'
department: 'Marketing'
contract: 'Full Time'
position: 'Head of Marketing'
draft: true
weight: 4
googleJobs:
  {
    location: 'London',
    position: 'Head of Marketing',
    publishedDate: '2021-03-11'
  }
---

## Job Description

Want to ply a Clojure trade in the investment banking world working for JUXT? We build critical applications for our banking clients, using Clojure/ClojureScript along numerous tools and libraries in the ecosystem.
...
```

The googleJobs attribute contains some metadata that will be picked up by Google to host the jobs in their platform. The `draft` attribute is used to hide the job from the list. The `weight` attribute is used to order the jobs in the list.

To see a single job you can visit the `/careers/*jobName*` url.

## Algolia Instant Search

The Algolia indexing code is written in nbb. The script runs in netlify to make sure the index is always up to date with the latest changes. The script is located in `algolia/index.cljs`.

To manually rebuild the index, run `yarn run algolia`.
