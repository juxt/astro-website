# JUXT Website

## Quick Commands

All commands are run from the root of the project, from a terminal:

| Command           | Action                                       |
| :---------------- | :------------------------------------------- |
| `npm install`     | Installs dependencies                        |
| `npm run dev`     | Starts local dev server at `localhost:3000`  |
| `npm run build`   | Build your production site to `./dist/`      |
| `npm run preview` | Preview your build locally, before deploying |

## Components

After reading this section, you should be able to perform the most common changes to the site.

### Navbar

The Navbar can be found in `components/Navbar.astro`. The links in the Navbar are driven by the `metadata` variable that is defined at the `page` level.
For a page to appear in the Navbar, it needs a `navbar` key with optional `label` and `weight` attributes, the latter controls the position.
An example follows:

```js
// somewhere in the frontmatter of about.astro page

export const metadata = { navbar: { weight: 1 } };
```

Here, we are saying that we want the about page to be linked in the navbar (presence of navbar key) and that it has to be the first link (weight of 1).
Note that without a `label` key the label will default to the name of the `*pageName*.astro` file, so in this example it will be `about`.
