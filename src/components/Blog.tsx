import classNames from 'classnames'
import { useState } from 'preact/hooks'
import { usePagination, UsePaginationProps } from '../utils'

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

const logoClasses =
  'fill-zinc-700 dark:fill-zinc-300 hover:fill-juxt dark:hover:fill-juxt transition-all'

const githubLogo = (
  <svg
    class={logoClasses}
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
  >
    <path d='M7.999 0C3.582 0 0 3.596 0 8.032a8.031 8.031 0 0 0 5.472 7.621c.4.074.546-.174.546-.387 0-.191-.007-.696-.011-1.366-2.225.485-2.695-1.077-2.695-1.077-.363-.928-.888-1.175-.888-1.175-.727-.498.054-.488.054-.488.803.057 1.225.828 1.225.828.714 1.227 1.873.873 2.329.667.072-.519.279-.873.508-1.074-1.776-.203-3.644-.892-3.644-3.969 0-.877.312-1.594.824-2.156-.083-.203-.357-1.02.078-2.125 0 0 .672-.216 2.2.823a7.633 7.633 0 0 1 2.003-.27 7.65 7.65 0 0 1 2.003.271c1.527-1.039 2.198-.823 2.198-.823.436 1.106.162 1.922.08 2.125.513.562.822 1.279.822 2.156 0 3.085-1.87 3.764-3.652 3.963.287.248.543.738.543 1.487 0 1.074-.01 1.94-.01 2.203 0 .215.144.465.55.386A8.032 8.032 0 0 0 16 8.032C16 3.596 12.418 0 7.999 0z' />
  </svg>
)

const twitterLogo = (
  <svg
    class={logoClasses}
    xmlns='http://www.w3.org/2000/svg'
    data-name='Layer 1'
    viewBox='0 0 24 24'
  >
    <path d='M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.66,10.1,4.05,4.05,0,0,1,2.8,9.59v.05a4.1,4.1,0,0,0,3.3,4A3.93,3.93,0,0,1,5,13.81a4.9,4.9,0,0,1-.77-.07,4.11,4.11,0,0,0,3.83,2.84A8.22,8.22,0,0,1,3,18.34a7.93,7.93,0,0,1-1-.06,11.57,11.57,0,0,0,6.29,1.85A11.59,11.59,0,0,0,20,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z' />
  </svg>
)

const linkedInLogo = (
  <svg
    class={logoClasses}
    xmlns='http://www.w3.org/2000/svg'
    viewBox='0 0 16 16'
  >
    <path d='M0 5h3.578v11H0zM13.324 5.129c-.038-.012-.074-.025-.114-.036a2.32 2.32 0 0 0-.145-.028A3.207 3.207 0 0 0 12.423 5c-2.086 0-3.409 1.517-3.845 2.103V5H5v11h3.578v-6s2.704-3.766 3.845-1v7H16V8.577a3.568 3.568 0 0 0-2.676-3.448z' />
    <circle cx='1.75' cy='1.75' r='1.75' />
  </svg>
)

const warningIcon = (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 256 256'>
    <rect fill='none' />
    <line
      x1='128'
      x2='128'
      y1='104'
      y2='144'
      fill='none'
      stroke='#000'
      stroke-linecap='round'
      stroke-linejoin='round'
      stroke-width='16'
    />
    <path
      fill='none'
      stroke='#000'
      stroke-linecap='round'
      stroke-linejoin='round'
      stroke-width='16'
      d='M114.15243,39.98472,26.17616,191.977a16.00005,16.00005,0,0,0,13.84762,24.01535H215.97625A16,16,0,0,0,229.82386,191.977L141.84757,39.98472A16,16,0,0,0,114.15243,39.98472Z'
    />
    <circle cx='128' cy='180' r='12' />
  </svg>
)

const chevronLeft = (className) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class={className}>
    <g data-name='16'>
      <rect width='24' height='24' fill='none' />
      <path d='M14.16,14.72a.75.75,0,0,1,0,1.06.76.76,0,0,1-1.07,0L9.84,12.53a.75.75,0,0,1,0-1.06l3.25-3.25a.77.77,0,0,1,1.07,0,.75.75,0,0,1,0,1.06L11.44,12Z' />
    </g>
  </svg>
)

const chevronRight = (className) => (
  <svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' class={className}>
    <g data-name='17'>
      <rect width='24' height='24' fill='none' transform='rotate(180 12 12)' />
      <path d='M9.84,14.72A.75.75,0,0,0,10.38,16a.74.74,0,0,0,.53-.22l3.25-3.25a.75.75,0,0,0,0-1.06L10.91,8.22a.77.77,0,0,0-1.07,0,.75.75,0,0,0,0,1.06L12.56,12Z' />
    </g>
  </svg>
)

function BlogCard({
  blog: {
    heroImage: { src, alt },
    title,
    publishDate,
    author,
    href,
    draft,
    person: { name, lastName, jobTitle, image, linkedin, twitter, github }
  }
}: {
  blog: BlogProps
}) {
  return (
    <div className='w-80 mx-auto aspect-[3/4] overflow-hidden rounded-lg relative shadow-lg hover:shadow-2xl transition-shadow'>
      <img class='absolute w-full h-full object-cover' src={src} alt={alt} />
      {draft && (
        <div className='flex items-center gap-1 text-xs absolute bottom-0 w-full px-4 py-4 backdrop-blur-sm bg-yellow-400/70'>
          <div class='w-5 h-5'>{warningIcon}</div>
          This Blog is a draft and won't be published
        </div>
      )}
      <div className='group px-4 py-4 w-full md:h-28 rounded-b md:rounded-none hover:rounded-b-lg hover:h-2/3 overflow-hidden transition-all backdrop-blur-sm bg-white/70 dark:bg-black/80 flex flex-col justify-between'>
        <div className='flex flex-col h-28 gap-2'>
          <div className='flex justify-between text-xs'>
            <div className='text-zinc-600 dark:text-zinc-300 font-medium'>
              {publishDate}
            </div>
            <div className='text-zinc-900 dark:text-zinc-200'>{author}</div>
          </div>
          <a href={href}>
            <h2 className='dark:text-zinc-50 capitalize font-medium w-60 underline-offset-4 underline md:no-underline hover:underline'>
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
              <div className='dark:text-zinc-100'>
                <div>{name}</div>
                <div>{lastName}</div>
              </div>
              <div className='text-sm font-light dark:text-zinc-300'>
                {jobTitle}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function PaginationArrows({
  prevPageExists,
  nextPageExists,
  offsetState
}: UsePaginationProps) {
  const [offset, setOffset] = offsetState
  return (
    <div className='flex items-center'>
      <div
        className={classNames('w-12 aspect-square', {
          'cursor-pointer': prevPageExists
        })}
        onClick={() => prevPageExists && setOffset(offset - 1)}
      >
        {chevronLeft(
          classNames('fill-zinc-600 dark:fill-zinc-300', {
            'fill-zinc-300 dark:fill-zinc-500': !prevPageExists
          })
        )}
      </div>
      <div
        className={classNames('w-12 aspect-square', {
          'cursor-pointer': nextPageExists
        })}
        onClick={() => nextPageExists && setOffset(offset + 1)}
      >
        {chevronRight(
          classNames('fill-zinc-600 dark:fill-zinc-300', {
            'fill-zinc-300 dark:fill-zinc-500': !nextPageExists
          })
        )}
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
  const paginationProps = usePagination({
    defaultRowsPerPage: 9,
    data: blogs
  })

  const { filterFrom, filterTo } = paginationProps

  const [blogsToShow, _setBlogsToShow] = useState(blogs)

  return (
    <main class='dark:bg-zinc-900 bg-zinc-100 pb-80 transition-colors'>
      <section className='mx-auto max-w-6xl pt-40'>
        <div class='grid md:grid-cols-[repeat(2,_20rem)] xl:grid-cols-[repeat(3,_20rem)] justify-center gap-16'>
          {blogsToShow
            .filter((blog) => isDev || !blog.draft)
            .slice(filterFrom, filterTo)
            .map((blog) => {
              return <BlogCard blog={blog} />
            })}
        </div>
        <div className='flex justify-center pt-10'>
          <PaginationArrows {...paginationProps} />
        </div>
      </section>
    </main>
  )
}
