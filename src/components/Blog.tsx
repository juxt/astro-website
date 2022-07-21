import classNames from 'classnames'
import { useEffect, useState } from 'preact/hooks'
import { usePagination, UsePaginationProps } from '../utils'
import {
  chevronLeftIcon,
  chevronRightIcon,
  searchIcon,
  warningIcon
} from './Icons'

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
    <div className='w-80 mx-auto h-[26rem] overflow-hidden rounded-lg relative shadow-lg hover:shadow-2xl transition-shadow'>
      <img
        class='absolute w-full h-full object-cover cursor-pointer'
        src={src}
        alt={alt}
        onClick={() => window.location.assign(href)}
      />
      <div
        onClick={() => window.location.assign(href)}
        className='cursor-pointer px-4 py-4 w-full rounded-b-lg overflow-hidden relative backdrop-blur-sm bg-white/70 dark:bg-zinc-900/80 flex flex-col justify-between'
      >
        <div className='flex flex-col pb-6 gap-2'>
          <div className='flex justify-between text-xs'>
            <div className='text-zinc-600 dark:text-zinc-300 font-medium uppercase'>
              {category}
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
            <div className='w-20 h-20 rounded-lg relative overflow-hidden'>
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

      {draft ? (
        <div className='flex items-center gap-1 text-xs absolute bottom-0 w-full px-4 py-4 backdrop-blur-sm bg-yellow-400/70'>
          <div class='w-5 h-5'>{warningIcon()}</div>
          This Blog is a draft and won't be published
        </div>
      ) : (
        <div className='flex items-center justify-between gap-1 text-xs absolute bottom-0 w-full bg-zinc-100/90 dark:bg-zinc-800/90'>
          <div className='text-zinc-800 dark:text-zinc-300 font-medium px-4 py-4'>
            {publishDate}
          </div>
        </div>
      )}
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
        {chevronLeftIcon(
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
        {chevronRightIcon(
          classNames('fill-zinc-600 dark:fill-zinc-300', {
            'fill-zinc-300 dark:fill-zinc-500': !nextPageExists
          })
        )}
      </div>
    </div>
  )
}

function Filters({
  blogs,
  setBlogsToShow
}: {
  blogs: BlogProps[]
  setBlogsToShow: (blogs: BlogProps[]) => void
}) {
  const [searchValue, setSearchValue] = useState('')

  useEffect(() => {
    if (searchValue !== '') {
      const parsedSearchValue = searchValue.toLowerCase().trim()

      const filteredBlogs = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(parsedSearchValue) ||
          blog.author.toLowerCase().includes(parsedSearchValue)
      )
      setBlogsToShow(filteredBlogs)
    } else {
      setBlogsToShow(blogs)
    }
  }, [searchValue])

  return (
    <div class='flex items-center gap-2 justify-center'>
      <div className='w-8 aspect-square'>
        {searchIcon('fill-zinc-600 dark:fill-zinc-400')}
      </div>
      <input
        type='text'
        name='name'
        value={searchValue}
        placeholder='Search'
        onInput={(e) => setSearchValue((e.target as HTMLInputElement).value)}
        class='lg:w-1/3 w-1/2 py-2 font-light rounded-none border-b bg-transparent dark:text-zinc-200 border-zinc-400 outline-none focus:border-zinc-700 dark:focus:border-zinc-300'
      />
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
  const publishedBlogs = blogs.filter((blog) => isDev || !blog.draft)

  const [blogsToShow, setBlogsToShow] = useState(publishedBlogs)

  const paginationProps = usePagination({
    defaultRowsPerPage: 9,
    data: blogsToShow
  })

  const { filterFrom, filterTo, totalPages } = paginationProps

  return (
    <main class='dark:bg-zinc-900 bg-zinc-100 pb-80 transition-colors'>
      <section className='mx-auto max-w-6xl'>
        <div className='py-20'>
          <Filters blogs={publishedBlogs} setBlogsToShow={setBlogsToShow} />
          {!blogsToShow.length && (
            <div className='pt-20 text-xl justify-center flex dark:text-zinc-200'>
              No articles found with this search
            </div>
          )}
        </div>

        <div class='grid md:grid-cols-[repeat(2,_20rem)] xl:grid-cols-[repeat(3,_20rem)] justify-center gap-16'>
          {blogsToShow.length
            ? blogsToShow.slice(filterFrom, filterTo).map((blog) => {
                return <BlogCard blog={blog} />
              })
            : ''}
        </div>
        <div className='flex justify-center pt-10'>
          {totalPages > 1 && <PaginationArrows {...paginationProps} />}
        </div>
      </section>
    </main>
  )
}
