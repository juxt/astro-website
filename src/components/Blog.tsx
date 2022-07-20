import { useState } from 'preact/hooks'

export type Person = {
  code: string
  name: string
  lastName: string
  jobTitle: string
  image: string
  linkedin: string
  twitter: string
  github: string
}

export type BlogProps = {
  draft?: boolean
  title: string
  description: string
  publishDate: string
  author: string
  person: Person
  slug: string
  href: string
  heroImage: {
    src: string
    alt: string
  }
}

const githubLogo = (
  <svg
    class='fill-slate-700 hover:fill-juxt transition-all'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
  >
    <path d='M7.999 0C3.582 0 0 3.596 0 8.032a8.031 8.031 0 0 0 5.472 7.621c.4.074.546-.174.546-.387 0-.191-.007-.696-.011-1.366-2.225.485-2.695-1.077-2.695-1.077-.363-.928-.888-1.175-.888-1.175-.727-.498.054-.488.054-.488.803.057 1.225.828 1.225.828.714 1.227 1.873.873 2.329.667.072-.519.279-.873.508-1.074-1.776-.203-3.644-.892-3.644-3.969 0-.877.312-1.594.824-2.156-.083-.203-.357-1.02.078-2.125 0 0 .672-.216 2.2.823a7.633 7.633 0 0 1 2.003-.27 7.65 7.65 0 0 1 2.003.271c1.527-1.039 2.198-.823 2.198-.823.436 1.106.162 1.922.08 2.125.513.562.822 1.279.822 2.156 0 3.085-1.87 3.764-3.652 3.963.287.248.543.738.543 1.487 0 1.074-.01 1.94-.01 2.203 0 .215.144.465.55.386A8.032 8.032 0 0 0 16 8.032C16 3.596 12.418 0 7.999 0z' />
  </svg>
)

const twitterLogo = (
  <svg
    class='fill-slate-700 hover:fill-juxt transition-all'
    xmlns='http://www.w3.org/2000/svg'
    data-name='Layer 1'
    viewBox='0 0 24 24'
  >
    <path d='M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z' />
  </svg>
)

const linkedInLogo = (
  <svg
    class='fill-slate-700 hover:fill-juxt transition-all'
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
  >
    <path d='M0 5h3.578v11H0zM13.324 5.129c-.038-.012-.074-.025-.114-.036a2.32 2.32 0 0 0-.145-.028A3.207 3.207 0 0 0 12.423 5c-2.086 0-3.409 1.517-3.845 2.103V5H5v11h3.578v-6s2.704-3.766 3.845-1v7H16V8.577a3.568 3.568 0 0 0-2.676-3.448z' />
    <circle cx='1.75' cy='1.75' r='1.75' />
  </svg>
)

// const chevronDown = (
//   <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'>
//     <path d='M12,15a1,1,0,0,1-.71-.29l-4-4A1,1,0,0,1,8.71,9.29L12,12.59l3.29-3.29a1,1,0,0,1,1.41,1.41l-4,4A1,1,0,0,1,12,15Z' />
//   </svg>
// )

function BlogCard({
  blog: {
    heroImage: { src, alt },
    title,
    publishDate,
    author,
    href,
    person: { name, lastName, jobTitle, image, linkedin, twitter, github }
  }
}: {
  blog: BlogProps
}) {
  const [_isOpen, _setIsOpen] = useState(false)

  return (
    <div className='w-80 aspect-[3/4] overflow-hidden rounded-lg relative shadow-lg hover:shadow-2xl transition-shadow'>
      <img class='absolute w-full h-full object-cover' src={src} alt={alt} />
      <div className='group px-4 py-4 w-full md:h-28 rounded-b md:rounded-none hover:rounded-b hover:h-2/3 overflow-hidden transition-all backdrop-blur-sm bg-white/70 flex flex-col justify-between'>
        <div className='flex flex-col h-28 gap-1'>
          <div className='flex justify-between text-xs'>
            <div className='text-slate-600 font-medium'>{publishDate}</div>
            <div className='text-slate-900'>{author}</div>
          </div>
          <a href={href}>
            <h2 className='capitalize font-medium w-60 underline-offset-4 underline md:no-underline hover:underline'>
              {title}
            </h2>
          </a>
        </div>
        <div className='md:opacity-0 group-hover:opacity-100 transition-opacity flex flex-col'>
          <div className='flex gap-4'>
            <div className='flex-shrink-0 flex flex-col gap-3'>
              <div className='w-28 h-28 rounded-lg relative overflow-hidden'>
                <img
                  className='absolute w-full h-full object-cover'
                  src={`/images/people/${image}`}
                  alt='author picture'
                />
              </div>
              <div className='flex justify-around text-sm items-center'>
                <a className='w-4 h-4' href={github}>
                  {githubLogo}
                </a>
                <a className='w-4 h-4' href={linkedin}>
                  {linkedInLogo}
                </a>
                <a className='w-4 h-4' href={twitter}>
                  {twitterLogo}
                </a>
              </div>
            </div>
            <div className='flex flex-col gap-2'>
              <div className=''>
                <div>{name}</div>
                <div>{lastName}</div>
              </div>
              <div className='text-sm font-light'>{jobTitle}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function Blog({
  blogs,
  isDev
}: {
  blogs: BlogProps[]
  isDev: boolean
}) {
  return (
    <main class='dark:bg-gray-900 pb-80 transition-colors'>
      <section class='pt-6 flex flex-wrap justify-center gap-4'>
        {blogs
          .filter((blog) => isDev || !blog.draft)
          .map((blog) => {
            return <BlogCard blog={blog} />
          })}
      </section>
    </main>
  )
}
