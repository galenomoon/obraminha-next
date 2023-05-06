import React from 'react'

export default function SeparatorLabel({ label = 'label' }) {
  return (
    <section className='flex items-center gap-3 px-2 w-full'>
      <div className='bg-typography-light/40 dark:bg-dark-typography-light/40 h-[1px] w-full' />
      <p className='font-semibold text-md text-typography-light dark:text-dark-typography-light whitespace-nowrap'>
        {label}
      </p>
      <div className='bg-typography-light/40 dark:bg-dark-typography-light/40 h-[1px] w-full' />
    </section>
  )
}