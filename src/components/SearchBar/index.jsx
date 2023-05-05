import React from 'react'
import { IoCloseSharp } from 'react-icons/io5'
import { MdSearch } from 'react-icons/md'

export default function SearchBar({ placeholder, onClean, onChange = () => { }, value, className, icon }) {

  const Icon = icon || MdSearch
  return (
    <div className={`flex gap-2 ${className || "sm:w-[90%] md:w-[500px]"} m-2 rounded-2xl items-center py-3 px-3 bg-background-optional dark:bg-dark-background-light`}>
      <Icon className='text-typography-light' size={22} />
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className='w-full bg-transparent focus:outline-none placeholder:text-typography-light'
        placeholder={placeholder || 'Digite a categoria que procura...'}
      />
      {(value?.length > 0 && onClean) &&
        <IoCloseSharp
          onClick={() => [onChange(''), onClean()]}
          className='text-typography-light cursor-pointer' size={25}
        />
      }
    </div>
  )
}
