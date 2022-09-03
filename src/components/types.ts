export type Person = {
  code: string
  name: string
  lastName: string
  jobTitle: string
  image: string
  expertDraft?: boolean
  linkedin?: string
  twitter?: string
  github?: string
  featured?: { weight: number }
  expertise?: string[]
  expert?: boolean
}

export type Blog = {
  draft?: boolean
  title: string
  description: string
  publishDate: string
  featured: { weight: number }
  author: string
  person: Person
  category: string
  slug: string
  href: string
  heroImage: {
    src: string
    alt: string
  }
}
