import { SearchClient } from 'algoliasearch'
import algoliasearch from 'algoliasearch/lite'
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

export function BlogIndex({ blogs }) {
  return (
    <div className='mt-10 flex flex-col items-center relative'>
      <div className=''>
        <InstantSearch
          indexName='blog'
          searchClient={searchClient as SearchClient}
        >
          <Configure hitsPerPage={4} distinct={true} />
          <SearchBox></SearchBox>
          <PoweredBy />

          <RefinementList
            attribute='tags'
            searchable={true}
            operator='and'
            limit={5}
            sortBy={['name:asc']}
            showMore={true}
          />
          <RefinementList
            attribute='author'
            searchable={true}
            operator='and'
            limit={5}
            sortBy={['name:asc']}
            showMore={true}
          />
          <RefinementList
            attribute='category'
            searchable={true}
            operator='and'
            limit={5}
            sortBy={['name:asc']}
            showMore={true}
          />

          <CustomHits blogs={blogs} />
          <Pagination />
        </InstantSearch>
      </div>
    </div>
  )
}
