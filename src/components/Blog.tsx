import 'preact/jsx-runtime'
import classNames from 'classnames'
import DraftBanner from './DraftBanner'
import { ChevronLeftIcon, ChevronRightIcon, PencilIcon } from './Icons'

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
    title,
    publishDate,
    description,
    category,
    href,
    draft,
    person: { name, lastName, jobTitle, image }
  }
}: {
  blog: BlogProps
}) {
  return (
    <div
      onClick={() => window.location.assign(href)}
      className='cursor-pointer flex justify-between flex-col w-80 mx-auto bg-gradient-to-b from-white to-neutral-100 dark:from-slate-700 dark:to-slate-800 min-h-[24rem] overflow-hidden relative shadow-lg hover:shadow-2xl transition-shadow'
    >
      <div className='text-black px-4 py-4 w-full h-full relative flex flex-col justify-between'>
        <div className='flex flex-col pb-10 gap-10'>
          <div className='flex justify-between items-center font-mono'>
            <div class='flex gap-2 items-center'>
              <div class='flex items-center justify-center bg-orange-100 dark:bg-gray-800 rounded-full w-8 h-8'>
                <PencilIcon className='w-4 h-4 stroke-juxt dark:stroke-slate-300' />
              </div>
              <div class='text-juxt dark:text-zinc-300 capitalize text-sm'>
                {category}
              </div>
            </div>

            <div className='text-zinc-600 dark:text-zinc-300 text-xs'>
              {publishDate}
            </div>
          </div>

          <a href={href} className='flex flex-col gap-4'>
            <h2 className='dark:text-zinc-50 text-2xl font-light capitalize underline-offset-4 underline md:no-underline hover:underline'>
              {title}
            </h2>
            <h3 className='dark:text-zinc-50 font-light'>{description}</h3>
          </a>
        </div>
        <a href='/to/some/profile' className='group flex gap-4 w-fit'>
          <div className='flex-shrink-0 flex flex-col gap-3'>
            <div className='w-20 h-20 relative overflow-hidden'>
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
      <DraftBanner draft={draft} pageName='Blog' />
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
