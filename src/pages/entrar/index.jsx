import Auth from '@/components/Auth'
import Header from '@/components/Header'
import React from 'react'

export default function Login() {
  return (
    <main className='overflow-hidden'>
      <Header subtitle='Entrar' />
      <Auth is_login />
    </main>
  )
}
