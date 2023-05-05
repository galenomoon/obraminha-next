import Auth from '@/components/Auth'
import Header from '@/components/Header'
import React from 'react'

export default function Register() {
  return (
    <main className='overflow-hidden'>
      <Header subtitle='Cadastre-se' />
      <Auth />
    </main>
  )
}