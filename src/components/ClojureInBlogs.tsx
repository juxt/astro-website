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
                'border-2 p-2 border-green-900 cursor-pointer',
                { 'bg-purple-700': selectedIndustry === value }
              )}
            >
              {label}
            </div>
          )
        })}
      </div>

      <div className='flex flex-col gap-28'>
        <div className='flex flex-col items-center'>
          <div className='grid lg:grid-cols-[repeat(2,_1fr)] xl:grid-cols-[repeat(3,_1fr)] justify-center gap-x-6 gap-y-20 py-12'>
            {blogs?.map((blog) => {
              return (
                <a
                  href={`/blog/${blog.href}`}
                  className='group cursor-pointer justify-between flex flex-col w-96 mx-auto gap-6'
                >
                  <div className='text-white flex flex-col justify-between h-24'>
                    <h3 className='text-2xl font-semibold'>{blog.title}</h3>
                    <h5 className='text-lg font-extralight'>
                      {blog.description}
                    </h5>
                  </div>
                  <img className='' alt='blog' src={blog.heroImage} />
                  <div>
                    <p className='text-lg font-light text-white'>
                      {blog.publishedDate}
                    </p>
                  </div>
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </>
  )
}
