import { Transition } from '@tailwindui/react'
import algoliasearch from 'algoliasearch/lite'
import { useState } from 'preact/hooks'
import 'preact/jsx-runtime'
import {
  Configure,
  InstantSearch,
  Pagination,
  PoweredBy,
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
  return (
    <div>
      <div class='grid md:grid-cols-[repeat(2,_20rem)] xl:grid-cols-[repeat(3,_20rem)] justify-center gap-10'>
        {hits.map((hit) => (
          <div key={hit.permalink}>
            <BlogCard {...blogs.get(hit.permalink)} />
          </div>
        ))}
      </div>
    </div>
  )
}

export function BlogIndex({ blogs }: Record<string, Blog>) {
  const [filtersVisible, setFiltersVisible] = useState(false)
  return (
    <div className='mt-10 flex flex-col items-center relative'>
      <InstantSearch indexName='blog' searchClient={searchClient}>
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
            <PoweredBy />
          </div>

          <Transition
            show={filtersVisible}
            enter='transition-opacity duration-75'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='transition-opacity duration-150'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='text-black dark:text-white flex flex-wrap justify-between pt-4'>
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
            </div>{' '}
          </Transition>
        </div>

        <CustomHits blogs={blogs} />
        <div className='my-20'>
          <Pagination />
        </div>
      </InstantSearch>
    </div>
  )
}
