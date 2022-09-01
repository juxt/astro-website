import { SearchClient } from 'algoliasearch'
import algoliasearch from 'algoliasearch/lite'
import {
  InstantSearch,
  Hits,
  Highlight,
  Snippet,
  SearchBox,
  Configure,
  RefinementList,
  Pagination
} from 'react-instantsearch-hooks-web'

const algoliaClient = algoliasearch(
  'UIDFJO4C3W',
  '8eb8ba2a38de04f454d17a1ed47a9c2d'
)

const searchClient = {
  ...algoliaClient,
  search(requests) {
    if (requests.every(({ params }) => !params.query)) {
      return Promise.resolve({
        results: requests.map(() => ({
          hits: [],
          nbHits: 0,
          nbPages: 0,
          page: 0,
          processingTimeMS: 0
        }))
      })
    }

    return algoliaClient.search(requests)
  }
}

function Hit({ hit }) {
  return (
    <article>
      <h1>
        <Highlight attribute='name' hit={hit} />
      </h1>
      <Snippet hit={hit} attribute='name' />
    </article>
  )
}

export function BlogSearch() {
  return (
    <div className='mt-10 h-64 flex flex-col items-center relative'>
      <div className='absolute top-0 left-1/2 transform -translate-x-1/2'>
        <InstantSearch
          indexName='blog'
          searchClient={searchClient as SearchClient}
        >
          <Configure hitsPerPage={4} />
          <SearchBox></SearchBox>
          <RefinementList attribute='name' />
          <Hits hitComponent={Hit} />
          <Pagination />
        </InstantSearch>
      </div>
    </div>
  )
}
