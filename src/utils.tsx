import 'astro/jsx-runtime'
import { useRef, useEffect } from 'preact/hooks'

/** Remove \ and / from beginning of string */
export function removeLeadingSlash(path: string) {
  return path.replace(/^[/\\]+/, '')
}

/** Remove \ and / from end of string */
export function removeTrailingSlash(path: string) {
  return path.replace(/[/\\]+$/, '')
}

// capitalize first letter of string
export function capitalizeFirstLetter(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export function useOutsideClick(callback) {
  const ref = useRef(null)

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback()
      }
    }

    document.addEventListener('click', handleClick, true)

    return () => {
      document.removeEventListener('click', handleClick, true)
    }
  }, [ref])

  return ref
}
