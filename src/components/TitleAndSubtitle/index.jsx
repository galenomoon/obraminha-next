import React from 'react'

export default function TitleAndSubtitle({ title, subtitle, className }) {
  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <p className='text-3xl font-semibold'>
        {title}
      </p>
      <p className='text-md text-typography-light dark:text-typography-light'>
        {subtitle}
      </p>
    </div>
  )
}
