import React from 'react'

// icons
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

// deeps
import api_client from '@/config/api_client';

export default function PaginationBox({ total_pages = 0, request = { method: 'get', payload: {} }, className, paginated_value, set_paginated_value, current_page = 1 }) {
  const [page, setPage] = React.useState(current_page)
  const [is_loading, setIsLoading] = React.useState(false)
  const [requestURL, setRequestURL] = React.useState(null)

  const BackPage = () => {
    setRequestURL(paginated_value?.previous_page)
    return page !== 0 ? setPage(page - 1) : {}
  }
  const NextPage = () => {
    setRequestURL(paginated_value?.next_page)
    setPage(page + 1)
  }

  React.useEffect(() => {
    if (requestURL) {
      setIsLoading(true)
      api_client[request.method](requestURL, request.payload)
        .then(({ data }) => set_paginated_value(data))
        .catch(console.error)
        .finally(() => setIsLoading(false))
    }
  }, [requestURL])

  React.useEffect(() => {
    setPage(current_page)
  }, [current_page])

  return (total_pages > 1 ?
    <section className={`flex gap-6 items-center ${className} md:w-auto sm:w-full justify-between`}>
      <div className='text-xl flex items-center justify-center gap-3 w-[144px] py-2 rounded-full bg-background-light dark:bg-dark-background-light'>
        <span className='text-typography-primary'>{page < 10 ? `0${page}` : page}</span>
        <span className='opacity-20'>/</span>
        <span className=''>{total_pages < 10 ? `0${total_pages}` : total_pages}</span>
      </div>
      <div className='flex gap-4 items-center'>
        <button className='disabled:opacity-40' disabled={is_loading || (page === 1)} onClick={BackPage}>
          <MdArrowBackIos size={28} />
        </button>
        <button className='disabled:opacity-40' disabled={is_loading || (page === total_pages)} onClick={NextPage}>
          <MdArrowForwardIos size={28} />
        </button>
      </div>
    </section> : null
  )
}
