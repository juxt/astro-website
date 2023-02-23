import classNames from 'classnames'
import { useState } from 'preact/hooks'
import { Blog } from './types'

export function ClojureInBlogs({
  sortedBlogs,
  industries
}: {
  sortedBlogs: Blog[]
  industries: { label: string; value: string }[]
}) {
  const [selectedIndustry, setSelectedIndustry] = useState<string>('all')
  const blogs =
    !selectedIndustry || selectedIndustry === 'all'
      ? sortedBlogs
      : sortedBlogs.filter(
          (blog) => blog.clojureIn.industry === selectedIndustry
        )

  return (
    <>
      <div className='text-lg pb-6'>Filter by industry</div>
      <div className='flex flex-row flex-wrap items-start gap-4 pb-4'>
        {industries?.map(({ label, value }) => {
          return (
            <div
              onClick={() => setSelectedIndustry(value)}
              className={classNames(
                'border-2 p-2 border-green-500 cursor-pointer',
                { 'bg-green-500': selectedIndustry === value }
              )}
            >
              {label}
            </div>
          )
        })}
      </div>

      <div className='flex flex-col gap-28'>
        <div className='flex flex-col'>
          <div className='grid lg:grid-cols-[repeat(2,_1fr)] xl:grid-cols-[repeat(3,_1fr)] gap-x-14 gap-y-14 py-12'>
            {blogs.map((blog) => {
              const [location, title] = blog.title.split(':')
              return (
                <a
                  href={`/blog/${blog.href}`}
                  className='group cursor-pointer justify-end flex flex-col w-80 mx-auto gap-4'
                >
                  <div className='text-white flex flex-col justify-between'>
                    <h3 className='text-lg font-semibold'>
                      {location}: <br />
                      {title}
                    </h3>
                    <h5 className='font-extralight'>{blog.description}</h5>
                  </div>
                  <img className='' alt='blog' src={blog.heroImage} />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
