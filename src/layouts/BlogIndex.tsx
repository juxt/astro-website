import algoliasearch from 'algoliasearch/lite'
import * as classNames from 'classnames'
import { useState } from 'preact/hooks'
import 'preact/jsx-runtime'
import {
  Configure,
  InstantSearch,
  Pagination,
  RefinementList,
  SearchBox,
  useHits
} from 'react-instantsearch-hooks-web'
import { BlogCard } from '../components/BlogCard'
import { Blog } from '../components/types'

const algoliaClient = algoliasearch(
  'UIDFJO4C3W',
  '6c38c8327a86c8af12f25c04b19d2b72'
)

const searchClient = {
  ...algoliaClient
}

function CustomHits({ blogs }) {
  const { hits } = useHits()
  const filteredHits = hits.filter((hit) => {
    return blogs.get(hit.permalink)
  })
  return (
    <div>
      <div className='grid md:grid-cols-[repeat(2,_24rem)] xl:grid-cols-[repeat(3,_24rem)] justify-center gap-10'>
        {filteredHits.map((hit) => (
          <div key={hit.permalink}>
            <BlogCard {...blogs.get(hit.permalink)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BlogIndex({ blogs }: { blogs: Map<string, Blog> }) {
  const [filtersVisible, setFiltersVisible] = useState(false)
  return (
    <div className='mt-10 flex flex-col items-center relative'>
      <InstantSearch
        indexName='blog'
        searchClient={searchClient}
        routing={true}
      >
        <Configure hitsPerPage={9} distinct={true} />
        <div className='flex flex-col gap-2 pb-20 w-10/12 md:w-[600px]'>
          <SearchBox />
          <div className='flex justify-between'>
            <button
              className='text-xs bg-slate-200 dark:bg-slate-600 dark:text-white dark:hover:text-slate-600 dark:hover:bg-slate-200 text-slate-800 hover:bg-slate-400 transition-all hover:text-white rounded-md px-2 py-1'
              onClick={() => setFiltersVisible(!filtersVisible)}
            >
              Show Filters
            </button>
          </div>

          <div
            className={classNames(
              'transition-all text-black dark:text-white flex flex-wrap justify-between pt-4 overflow-hidden',
              filtersVisible ? 'h-full opacity-100' : 'h-0 opacity-0'
            )}
          >
            <div className='flex flex-col gap-2'>
              <div className='text-sm font-bold'>Tags</div>
              <RefinementList
                attribute='tags'
                searchable={true}
                operator='and'
                limit={5}
                sortBy={['name:asc']}
                showMore={true}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <div className='text-sm font-bold'>Category</div>
              <RefinementList
                attribute='category'
                searchable={true}
                operator='and'
                limit={5}
                sortBy={['name:asc']}
                showMore={true}
              />
            </div>
            <div className='flex flex-col gap-2'>
              <div className='text-sm font-bold'>Author</div>
              <RefinementList
                attribute='author'
                searchable={true}
                operator='and'
                limit={5}
                sortBy={['name:asc']}
                showMore={true}
              />
            </div>
          </div>
        </div>

        <CustomHits blogs={blogs} />
        <div className='my-20'>
          <Pagination padding={1} />
        </div>
      </InstantSearch>
    </div>
  )
}
