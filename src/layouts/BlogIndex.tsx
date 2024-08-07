import { BlogCard } from '@components/BlogCard'
import { Blog } from '@components/utils/types'
import { useState, useEffect } from 'preact/hooks';
// @ts-expect-error - Missing types for pagefind
import * as pagefind from '/pagefind/pagefind.js';

// Not so sure about this function, seems like an XSS vector
// Probably fine though as the data is sourced server side
function decodeHtmlEntities(str) {
  const textarea = document.createElement('textarea');
  textarea.innerHTML = str;
  return textarea.textContent;
}

function resultToBlog(result: any): Blog {
  return {
    title: result.data.meta.title,
    description: result.data.meta.description,
    publishedDate: result.data.meta.publishedDate,
    featured: {
      weight: 0,
    },
    author: "",
    person: {
      code: "",
      name: result.data.meta.personName,
      lastName: result.data.meta.personLastName,
      jobTitle: decodeHtmlEntities(result.data.meta.personJobTitle),
      image: result.data.meta.personImage,
    },
    category: result.data.meta.category,
    slug: "",
    href: result.data.url.replace(/\/blog\//, ''),
    heroImage: result.data.meta.heroImage,
  }
}

function paginationNumbers(pageNumber: number, totalPages: number) {
  const maxShown = 3;
  return Array.from(
    {length: Math.min(totalPages, maxShown)},
    (_, i) => i + Math.max(0, Math.min(pageNumber - 1, totalPages - maxShown)));

}

function Pagination({ pageNumber, setPageNumber, totalPages}) {
  return (
    <div class="flex flex-row bg-gradient-to-r from-slate-700 border border-gray-500 divide-x divide-gray-500 rounded-md cursor-pointer select-none">
      <a class="px-4 py-1 text-white active:bg-slate-600 rounded-l-md"
         onClick={() => setPageNumber(0)}
         disabled={pageNumber == 0}
        >‹‹</a>
      <a class="px-4 py-1 text-white active:bg-slate-600"
         onClick={() => setPageNumber(prev => Math.max(prev - 1, 0))}
         disabled={pageNumber == 0}
        >‹</a>
      {
        paginationNumbers(pageNumber, totalPages)
          .map((num) => {
            const selected = num == pageNumber;
            return (
              <a class={"px-4 py-1 text-white active:bg-slate-600" + (selected ? " bg-slate-500" : "")}
                 onClick={() => setPageNumber(num)}
                >
                {num + 1}
              </a>
            )
          })
      }
      <a class="px-4 py-1 text-white active:bg-slate-600"
         onClick={() => setPageNumber(prev => Math.min(prev + 1, totalPages - 1))}
         disabled={pageNumber == totalPages - 1}
        >›</a>
      <a class="px-4 py-1 text-white active:bg-slate-600 rounded-r-md"
         onClick={() => setPageNumber(totalPages - 1)}
         disabled={pageNumber == totalPages - 1}
        >››</a>
    </div>
  )
}


export function BlogIndex() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const pageSize = 9;
  const [pageNumber, setPageNumber] = useState<number>(0);
  const [page, setPage] = useState<any[]>([]);

  const handleSearch = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    var query = input.value;
    if (query == "") { query = null; }
    console.log("Query: " + query);
    
    setPageNumber(0);
    try {
      const search = await pagefind.search(
        query,
        {
          sort: { publishedDate: "desc" },
          filters: { blog: "true" }
        }
      );
      setSearchResults(search.results);
    } catch (error) {
      console.error('Search failed:', error);
      setSearchResults([]);
    }
  };

  // Initial search on load
  useEffect(() => {
    handleSearch({ target: { value: "" } } as unknown as Event);
  }, []);

  useEffect(() => {
    async function fetchPage() {
      const start = pageNumber * pageSize;
      const end = start + pageSize;
      const pageData = await Promise.all(
        searchResults
          .slice(start, end)
          .map(async (result: any) => {
            if (typeof result.data === 'function') {
              result.data = await result.data();
            }
            return result;
          })
      );
      if (!ignore) {
        setPage(pageData);
      }
    }

    let ignore = false;
    fetchPage();
    return () => {
      ignore = true;
    }
  }, [pageNumber, searchResults]);

  return (
    <>
      <input type="text" onInput={handleSearch} />
      <Pagination pageNumber={pageNumber} setPageNumber={setPageNumber} totalPages={Math.floor(searchResults.length/pageSize)+1} />
      <div class="grid md:grid-cols-[repeat(2,_24rem)] xl:grid-cols-[repeat(3,_24rem)] justify-center gap-10">
        {page.map((result) => {
            const blog = resultToBlog(result);
            return (
              <BlogCard {...blog} />
            )
          }
        )}
      </div>
    </>
  );
}
