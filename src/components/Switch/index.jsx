import React from 'react'

export default function Switch({onChange, checked}) {
  return (
    <button type="button" onClick={onChange} className='border-[3px] w-[76px] h-fit rounded-full relative bg-background-secondary/10 border-background-secondary'>
     <div className={`m-1 ${checked ? "translate-x-[37px]" : ""} duration-150 w-[25px] h-[25px] bg-background-secondary rounded-full`}/>
    </button>
  )
}
