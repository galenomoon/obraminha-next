import React from 'react'
import { useRouter } from 'next/router'

//assets
import Logo from '../Logo'

export default function Footer() {
  const { pathname } = useRouter()

  return pathname === "entrar" || pathname === "cadastrar" ? null :
    <div className='w-full h-[100px] shadow-2xl flex sm:px-7 md:px-10 justify-between items-center bg-background-base dark:bg-dark-background-neutral'>
      <Logo className='md:w-[180px] sm:w-[120px]' />
      <div className='flex flex-col text-typography-base md:text-auto sm:text-sm dark:text-dark-typography-base text-end'>
        <p>(13) 99720-8984</p>
        <p>obraminha@gmail.com</p>
      </div>
    </div>
}
