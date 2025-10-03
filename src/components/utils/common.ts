import { GetImageTransform } from '@astrojs/image/dist/lib/get-image'
import { Blog, Person } from '@utils/types'
import { ImageMetadata, MarkdownInstance } from 'astro'

// to return the last part of the path without the extension
// i.e. '/blog/clojure-in-akvo.mdx'
// becomes 'clojure-in-akvo'
export function slugifyPath(path: string): string {
  return path.split('/').slice(-1)[0].split('.')[0]
}

type AllBlogs = {
  rawBlogs: MarkdownInstance<Blog>[]
  isDev: boolean

  rawPeople: MarkdownInstance<Person>[]
  getImage: (
    transform: GetImageTransform
  ) => Promise<astroHTML.JSX.ImgHTMLAttributes>
  heroImageImport: (imageName: string) => Promise<{ default: ImageMetadata }>
  authorImageImport: (imageName: string) => Promise<{ default: ImageMetadata }>
}

export async function parseBlogs({
  rawBlogs,
  isDev,
  rawPeople,
  getImage,
  heroImageImport,
  authorImageImport
}: AllBlogs): Promise<Blog[]> {
  const peopleByCode = new Map(
    rawPeople.map((person) => [person.frontmatter.code, person.frontmatter])
  )

  const blogs = await Promise.all<Blog>(
    rawBlogs.map((page) => {
      const author = page.frontmatter.author
      const person = peopleByCode.get(author)
      const expert = (isDev || !person?.expertDraft) && person?.expert
      if (!person)
        throw new Error(
          `No person found for author: '${author}' in '${page.url}'`
        )

      const permalink = page.url
      const parsedImage = person.image ? slugifyPath(person.image) : ''
      const parsedPostImage = page.frontmatter.heroImage
        ? slugifyPath(page.frontmatter.heroImage)
        : ''

      // Handle missing images by providing defaults
      const authorImagePromise = parsedImage
        ? getImage({
            src: authorImageImport(parsedImage),
            width: 200,
            quality: 80,
            alt: 'person'
          })
        : Promise.resolve({ src: '' })

      const postImagePromise = parsedPostImage
        ? getImage({
            src: heroImageImport(parsedPostImage),
            width: 450,
            quality: 100,
            alt: 'post'
          })
        : Promise.resolve({ src: '' })

      return Promise.all([authorImagePromise, postImagePromise]).then(
        ([authorImage, postImage]) => {
          return {
            ...page.frontmatter,
            slug: permalink,
            href: permalink,
            heroImage: postImage.src,
            person: { ...person, expert, image: authorImage.src }
          }
        }
      )
    })
  )

  return blogs.filter((blog) => !blog.draft && !blog.childArticle)
}

/** Remove \ and / from beginning of string */
export function removeLeadingSlash(path: string) {
  return path.replace(/^[/\\]+/, '')
}

/** Remove \ and / from end of string */
export function removeTrailingSlash(path: string) {
  return path.replace(/[/\\]+$/, '')
}

// capitalize first letter of string
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function currentPage(pathname: string) {
  return removeTrailingSlash(removeLeadingSlash(pathname))
}

export function formatDate(ISO8601String: string) {
  try {
    const date = new Date(ISO8601String)
    return new Intl.DateTimeFormat([], {
      year: 'numeric',
      month: 'short',
      day: '2-digit'
    }).format(date)
  } catch (e) {
    console.error(e)
    return 'Invalid date'
  }
}

export function bgColorClass(color: string) {
  if (color == 'orange') {
    return 'bg-[#b76330]'
  } else if (color == 'yellow') {
    return 'bg-[#ca8a04]'
  }
  return null
}
