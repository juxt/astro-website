import DraftBanner from './DraftBanner'
import { PencilIcon } from './Icons'
import classNames from 'classnames'
import { Blog, Person } from './types'

function BlogAuthor({ name, lastName, image, expert, jobTitle }: Person) {
  return (
    <>
      <div className='flex-shrink-0 flex flex-col gap-3'>
        <div className='w-20 h-20 relative overflow-hidden'>
          <img src={image} className=' absolute w-full h-full object-cover' />
        </div>
      </div>
      <div className='flex flex-col gap-1'>
        <div
          className={classNames(
            'text-sm dark:text-zinc-100 underline-offset-2',
            {
              'group-hover:underline': expert,
              'underline sm:no-underline': expert
            }
          )}
        >
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
  person
}: Blog) {
  return (
    <div
      onClick={() => {
        window.location.href = `/blog/${href}`
      }}
      className='h-full cursor-pointer flex justify-between flex-col w-80 mx-auto bg-gradient-to-b from-white to-neutral-100 dark:from-slate-700 dark:to-slate-800 min-h-[24rem] overflow-hidden relative shadow-lg hover:shadow-2xl transition-shadow'
    >
      <div className='text-black px-4 py-4 w-full h-full relative flex flex-col justify-between'>
        <div className='flex flex-col pb-10 gap-10'>
          <div className='flex justify-between items-center font-mono'>
            <div className='flex gap-2 items-center'>
              <div className='flex items-center justify-center bg-orange-100 dark:bg-gray-800 rounded-full w-8 h-8'>
                <PencilIcon className='w-4 h-4 stroke-juxt dark:stroke-slate-300' />
              </div>
              <div className='text-juxt dark:text-zinc-300 capitalize text-sm'>
                {category}
              </div>
            </div>

            <div className='text-zinc-600 dark:text-zinc-300 text-xs'>
              {publishedDate}
            </div>
          </div>

          <a href={`/blog/${href}`} className='flex flex-col gap-4'>
            <h2 className='dark:text-zinc-50 text-2xl font-light capitalize underline-offset-4 hover:underline'>
              {title}
            </h2>
            <h3 className='dark:text-zinc-50 font-light'>{description}</h3>
          </a>
        </div>
        {person.expert ? (
          <a href={`/people/${person.code}`} className='group flex gap-4 w-fit'>
            <BlogAuthor {...person} />
          </a>
        ) : (
          <div className='group flex gap-4 w-fit'>
            <BlogAuthor {...person} />
          </div>
        )}
      </div>
      <DraftBanner draft={draft} pageName='Blog' />
    </div>
  )
}
