import classNames from 'classnames'
import { useState } from 'preact/hooks'
import { formatDate } from '@utils/common'
import { Blog } from './utils/types'

var now = new Date();
var sixMonthsAgo = new Date(now).setMonth(now.getMonth() - 6);

function isNew(blog: Blog) {
    return new Date(blog.publishedDate) > new Date(sixMonthsAgo);
}

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
      <div className='text-lg pb-6 text-white'>Filter by industry</div>
      <div className='flex flex-row flex-wrap items-start gap-4 pb-4 text-white'>
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
                  href={blog.href}
                  className='text-white group cursor-pointer justify-end flex flex-col w-96 mx-auto gap-4'
                >
                  <div className='flex flex-col justify-between'>
                    <h3 className='text-lg font-semibold'>
                      {location}: <br />
                      {title}
                    </h3>
                    <h5 className='font-extralight'>{blog.description}</h5>
                  </div>
                  <div class="relative overflow-hidden">
                      <img className='' alt='blog' src={blog.heroImage} />
                      {
                          isNew(blog) &&
                          <div class="absolute top-[10%] left-[10%] bg-[#00ff42] px-16 transform -translate-x-1/2 -translate-y-1/2 -rotate-45 p-1">
                              <span class="text-2xl text-black font-extrabold font-serif">NEW</span>
                          </div>
                      }
                  </div>
                  <div className='font-thin'>
                    {formatDate(blog.publishedDate)}
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
