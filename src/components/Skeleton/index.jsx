import React from 'react'

export default function Skeleton({ conditional, children, className, length = 1 }) {
  return (
    conditional ? children : Array(length).fill(0).map((_, i) =>
      <div key={i} className={`dark:bg-[#444]/50 bg-[#e3e3e3] w-fit h-fit ${className} rounded-2xl animate-[pulse_1230ms_ease-in-out_infinite] m-1`}>
        <div className='invisible'>{children}</div>
      </div>)
  )
}

export function SkeletonText({ conditional, children, rows = 9 }) {
  return conditional ? children :
    <div className='flex flex-col gap-2 w-full h-fit'>
      {Array(rows).fill(0).map((_, i) => <Skeleton key={i} className='!w-full !h-[28px]' />)}
    </div>
}