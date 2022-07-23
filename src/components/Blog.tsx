import 'preact/jsx-runtime'
import classNames from 'classnames'
import { ChevronLeftIcon, ChevronRightIcon, WarningIcon } from './Icons'

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
  category: string
  slug: string
  href: string
  heroImage: {
    src: string
    alt: string
  }
}

function BlogCard({
  blog: {
    heroImage: { src, alt },
    title,
    publishDate,
    category,
    href,
    draft,
    person: { name, lastName, jobTitle, image }
  }
}: {
  blog: BlogProps
}) {
  return (
    <div className='flex justify-between flex-col w-80 mx-auto h-[26rem] overflow-hidden relative shadow-lg hover:shadow-2xl transition-shadow'>
      <img
        class='absolute w-full h-full object-cover cursor-pointer'
        src={src}
        alt={alt}
        onClick={() => window.location.assign(href)}
      />
      <div
        onClick={() => window.location.assign(href)}
        className='cursor-pointer px-4 py-4 w-full overflow-hidden relative backdrop-blur-sm bg-white/70 dark:bg-zinc-900/80 flex flex-col justify-between'
      >
        <div className='flex flex-col pb-6 gap-2'>
          <div className='flex justify-between text-xs'>
            <div className='text-zinc-600 dark:text-zinc-300 font-medium uppercase'>
              {category}
            </div>
            <div className='text-zinc-600 dark:text-zinc-300'>
              {publishDate}
            </div>
          </div>
          <a href={href}>
            <h2 className='dark:text-zinc-50 capitalize font-medium w-60 underline-offset-4 underline md:no-underline hover:underline'>
              {title}
            </h2>
          </a>
        </div>
        <a href='/to/some/profile' className='group flex gap-4 w-fit'>
          <div className='flex-shrink-0 flex flex-col gap-3'>
            <div className='w-20 h-20 rounded relative overflow-hidden'>
              <img
                className='absolute w-full h-full object-cover'
                src={`/images/people/${image}`}
                alt='author picture'
              />
            </div>
          </div>
          <div className='flex flex-col gap-1'>
            <div className='text-sm group-hover:underline dark:text-zinc-100 underline-offset-2'>
              <div>{name}</div>
              <div>{lastName}</div>
            </div>
            <div className='text-xs w-28 dark:text-zinc-300'>{jobTitle}</div>
          </div>
        </a>
      </div>

      {draft && (
        <div className='flex items-center gap-1 text-xs absolute bottom-0 w-full px-4 py-4 backdrop-blur-sm bg-yellow-400/70'>
          <div class='w-5 h-5'>{<WarningIcon />}</div>
          This Blog is a draft and won't be published
        </div>
      )}
    </div>
  )
}

function PaginationArrows({ prev, next }: { prev: string; next: string }) {
  return (
    <div className='flex items-center'>
      <a
        href={prev}
        className={classNames('w-12 aspect-square', {
          'cursor-pointer': prev
        })}
      >
        {
          <ChevronLeftIcon
            className={classNames('fill-zinc-600 dark:fill-zinc-300', {
              'fill-zinc-300 dark:fill-zinc-500': !prev
            })}
          ></ChevronLeftIcon>
        }
      </a>
      <a
        href={next}
        className={classNames('w-12 aspect-square', {
          'cursor-pointer': next
        })}
      >
        {
          <ChevronRightIcon
            className={classNames('fill-zinc-600 dark:fill-zinc-300', {
              'fill-zinc-300 dark:fill-zinc-500': !next
            })}
          ></ChevronRightIcon>
        }
      </a>
    </div>
  )
}

export default function Blog({
  blogs,
  isDev,
  prev,
  next
}: {
  blogs: BlogProps[]
  isDev: boolean
  prev: string
  next: string
}) {
  const publishedBlogs = blogs.filter((blog) => isDev || !blog.draft)

  return (
    <main class='pb-40 transition-colors'>
      <section className='mx-auto max-w-6xl pt-10'>
        <div class='grid md:grid-cols-[repeat(2,_20rem)] xl:grid-cols-[repeat(3,_20rem)] justify-center gap-10'>
          {publishedBlogs.length
            ? publishedBlogs.map((blog) => {
                return <BlogCard blog={blog} />
              })
            : ''}
        </div>
        <div className='flex justify-center pt-10'>
          {(prev || next) && <PaginationArrows prev={prev} next={next} />}
        </div>
      </section>
    </main>
  )
}
