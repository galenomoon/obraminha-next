import React from 'react'
import empty_state from '../../assets/empty_states.svg';
import Image from 'next/image';

export default function EmptyState({title, description, image, className, imageClassName}) {
  return (
    <div className={className + ' flex w-full flex-col items-center gap-8 my-10'}>
      <Image src={image || empty_state} alt='empty state' className={`w-auto ${imageClassName || 'h-52'}`} />
      <div className='w-full flex flex-col items-center gap-1'>
        <h4 className='w-full text-3xl font-bold text-center'>{title}</h4>
        <p className="w-full text-center px-4 text-base font-semibold text-typography-base/60 dark:text-dark-typography-base/60">
          {description}
        </p>
      </div>
    </div>
  )
}
