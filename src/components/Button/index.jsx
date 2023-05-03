import React from 'react'
import Link from 'next/link'

export default function Button({ className, onClick = () => { }, children, to, name, disabled, type }) {
  return (to ?
    <Link
      onClick={(e) => disabled ? {} : onClick(e)}
      href={disabled ? '#' : to}
      name={name}
      className={`duration-100 ${className} ${disabled ? 'bg-gray-400 dark:bg-dark-background-light' : 'bg-background-secondary'} text-typography-secondary flex hover:opacity-90 items-center justify-center rounded-full px-5 py-4 w-[180px] uppercase`}
    >
      {children}
    </Link>
    :
    <button
      type={type || 'submit'}
      disabled={disabled}
      name={name}
      onClick={(e) => disabled ? {} : onClick(e)}
      className={`duration-100 ${className} ${disabled ? 'bg-gray-400 dark:bg-dark-background-light' : 'bg-background-secondary'} text-typography-secondary flex items-center justify-center rounded-full hover:opacity-90 py-3 w-[180px] uppercase`}
    >
      {children}
    </button>
  )
}