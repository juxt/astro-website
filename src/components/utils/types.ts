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
  childArticle?: boolean
  parentArticle?: string
  token?: string
  title: string
  description: string
  publishedDate: string
  featured: { weight: number }
  author: string
  person: Person
  category: string
  slug: string
  href: string
  heroImage: string
  clojureIn?: { season: string; industry: string; quote: string }
  hideAuthor?: boolean
}
