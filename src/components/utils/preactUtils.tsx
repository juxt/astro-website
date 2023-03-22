import 'preact/jsx-runtime'
import { useRef, useEffect, useState } from 'preact/hooks'

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

export type UsePaginationProps = {
  offsetState: [number, (offset: number) => void]
  rowsState: [number, (rows: number) => void]
  filterFrom: number
  filterTo: number
  totalPages: number
  prevPageExists: boolean
  nextPageExists: boolean
  currentPage: number
}

export const usePagination = ({
  defaultRowsPerPage = 9,
  data
}: {
  defaultRowsPerPage: number
  data: unknown[]
}): UsePaginationProps => {
  const [offset, setOffset] = useState<number>(0)
  const [rowsPerPage, setRowsPerPage] = useState<number>(defaultRowsPerPage)

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [offset])

  const filterFrom = offset * rowsPerPage
  const filterTo = (offset + 1) * rowsPerPage

  const totalPages = Math.ceil((data?.length || 0) / rowsPerPage)
  const currentPage = offset + 1

  const prevPageExists: boolean = offset > 0
  const nextPageExists: boolean = filterFrom + rowsPerPage < (data?.length || 0)

  return {
    offsetState: [offset, setOffset],
    rowsState: [rowsPerPage, setRowsPerPage],
    filterFrom,
    filterTo,
    totalPages,
    prevPageExists,
    nextPageExists,
    currentPage
  }
}
