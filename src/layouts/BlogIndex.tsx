import { BlogCard } from '@components/BlogCard'
import { Blog } from '@components/utils/types'
import { useState, useEffect, useRef } from 'preact/hooks';
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

export function BlogIndex() {
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleSearch = async (event: Event) => {
    const input = event.target as HTMLInputElement;
    const query = input.value;
    
    if (query) {
      try {
        const search = await pagefind.search(
          query,
          { filters: { blog: "true" } }
        );
        const results = await Promise.all(
          search.results.slice(0, 9).map(async (result: any) => {
            result.data = await result.data();
            return result;
          })
        );
        setSearchResults(results);
      } catch (error) {
        console.error('Search failed:', error);
        setSearchResults([]);
      }
    } else {
      setSearchResults([]);
    }
  };

  useEffect(() => {
    const inputElement = searchInputRef.current;
    if (inputElement) {
      inputElement.addEventListener('input', handleSearch);
    }

    return () => {
      if (inputElement) {
        inputElement.removeEventListener('input', handleSearch);
      }
    };
  }, []);

  return (
    <div className='mt-10 flex flex-col items-center relative'>
      <input type="text" id="search" ref={searchInputRef} />
      <div id="results" class="grid md:grid-cols-[repeat(2,_24rem)] xl:grid-cols-[repeat(3,_24rem)] justify-center gap-10">
        {searchResults.map((result) => {
            const blog = resultToBlog(result);
            return (
              <BlogCard {...blog} />
            )
          }
        )}
      </div>
    </div>
  );
}
