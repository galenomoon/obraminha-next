import React from 'react'

//components
import Rating from '@/components/Rating'
import EmptyState from '@/components/EmptyState'

export default function ReviewsList({ reviews = [], className }) {

  return (
    reviews?.length ?
      <div className={`${className} flex flex-col w-full h-full gap-4`} >
        <div className='flex items-center w-full gap-6 py-3 justify-between md:flex-row sm:flex-col'>
          <p className='text-xl sm:my-[9px] md:mt-[18px] md:mb-[6px] font-semibold'>
            Últimas avaliações feitas
          </p>
        </div>
        <div className='flex flex-col w-full text-start'>
          {reviews?.map((review, index) => (
            <div className='flex flex-col w-full gap-2 py-[12px] border-b-[2px] border-typography-light/20 dark:border-dark-background-light/40' key={index}>
              <Rating value={review?.stars} size={18} />
              <p className='text-md font-light'>
                {review?.comment}
              </p>
            </div>
          ))}
        </div>
      </div>
      :
      <EmptyState title='Nenhuma avaliação feita' description='Seja o primeiro a fazer uma avaliação' />
  )
}