import { formatDate } from '@utils/common'
import DraftBanner from './DraftBanner'
import { TagIcon } from './Icons'
import { Blog, Person } from '@utils/types'

function BlogAuthor({ name, lastName, image, jobTitle }: Person) {
  return (
    <>
      <div className='flex-shrink-0 flex flex-col gap-3'>
        <div className='w-20 h-20 relative overflow-hidden'>
          <img
            src={image}
            className=' absolute w-full h-full object-cover'
            alt={`${name} ${lastName}`}
          />
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <div className='text-sm dark:text-zinc-100 underline-offset-2'>
          <div>{name}</div>
          <div>{lastName}</div>
        </div>
        <div className='text-xs w-28 dark:text-zinc-300'>{jobTitle}</div>
      </div>
    </>
  )
}

export function BlogCard({
  title,
  publishedDate,
  description,
  category,
  href,
  draft,
  heroImage,
  person,
  hideAuthor
}: Blog) {
  return (
    <a
      href={`/blog/${href}`}
      className='h-full group cursor-pointer flex justify-between flex-col w-96 mx-auto bg-gradient-to-b from-white to-neutral-100 dark:from-slate-700 dark:to-slate-800 relative shadow-lg hover:shadow-2xl transition-all'
    >
      <div className='text-black py-4 w-full h-full relative flex flex-col justify-between'>
        <div className='flex flex-col pb-10 gap-4'>
          <div className='flex justify-between px-4 items-center font-mono'>
            <div className='flex gap-1 items-center'>
              <TagIcon className='w-4 h-4 stroke-juxt dark:stroke-slate-300' />
              <div className='text-juxt dark:text-zinc-300 font-medium uppercase text-sm'>
                {category}
              </div>
            </div>

            <div className='text-zinc-600 dark:text-zinc-300 text-xs'>
              {formatDate(publishedDate)}
            </div>
          </div>

          <div className='flex flex-col gap-4'>
            <div className='relative w-full h-52 group-hover:brightness-110'>
              <img
                src={heroImage}
                alt={`${title}`}
                className='w-full h-full object-cover'
              />
              <div className='absolute w-full h-full top-0 left-0 backdrop-blur-lg'></div>
              <img
                src={heroImage}
                alt={`${title}`}
                className='absolute h-full top-0 left-1/2 -translate-x-1/2'
              />
            </div>
            <h2 className='px-4 dark:text-zinc-50 text-2xl font-light capitalize underline-offset-4 hover:underline'>
              {title}
            </h2>
            <h3 className='px-4 dark:text-zinc-50 font-light'>{description}</h3>
          </div>
        </div>
        {!hideAuthor && (
          <div className='px-4 group flex gap-4 w-fit'>
            <BlogAuthor {...person} />
          </div>
        )}
      </div>
      <DraftBanner draft={draft} pageName='Blog' />
    </a>
  )
}
