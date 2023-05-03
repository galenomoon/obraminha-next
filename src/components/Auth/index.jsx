
import React, { useEffect } from 'react'

//assets
import Image from 'next/image';
import wave from '../../assets/wave.svg'
import dark_background from '../../assets/dark-splash-green.svg'
import background from '../../assets/splash-green.svg'

//components
import AuthForm from '@/components/Auth/Form';

export default function Auth({ is_login }) {

  useEffect(() => {
    // localStorage.removeItem('token')
  }, [])

  return (
    <div className='w-full h-screen flex items-center relative justify-center bg-background-neutral dark:bg-dark-background-base'>
      <Image src={wave} alt='top wave' className='md:hidden sm:absolute top-0 w-full object-cover' />
      <Image src={wave} alt='top wave' className='md:hidden sm:absolute bottom-0 rotate-180 w-full object-cover' />
      <div className="sm:hidden md:flex flex-col items-center justify-center w-full h-full bg-cover animate-slide-in-r">
        <Image fill src={background} alt="background" className='dark:hidden block object-cover' />
        <Image fill src={dark_background} alt="dark-background" className='hidden dark:block object-cover' />
        <p className='text-4xl font-bold text-typography-secondary'>
          {is_login ? "Bem vindo de volta!" : "Olá, seja bem vindo!"}
        </p>
        <p className='text-2xl font-light text-typography-secondary'>
          Seu pedido é uma obra!
        </p>
      </div>
      <div className="flex flex-col items-center justify-center gap-8 h-full w-full animate-slide-in-l relative">
        <AuthForm is_login={is_login} />
      </div>
    </div>
  )
}