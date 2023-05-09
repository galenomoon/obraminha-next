import React from 'react'
import Link from 'next/link'

export default function OrganizationTabNavigation({ organization, tab }) {
  return (
    <div className='flex items-center md:justify-center sm:justify-around font-light w-full'>
      <Link href={`/${organization?.slug}/sobre`} name="sobre" type='button' className={`${tab === 'sobre' ? 'border-background-secondary' : 'text-typography-light dark:text-dark-typography-light border-transparent'} border-b-[4px] flex items-center justify-center py-3 sm:w-fit sm:px-2 md:w-[150px] uppercase`}>
        Sobre
      </Link>
      <Link href={`/${organization?.slug}/perguntas`} name="perguntas" type='button' className={`${tab === 'perguntas' ? 'border-background-secondary' : 'text-typography-light dark:text-dark-typography-light border-transparent'} border-b-[4px] flex items-center justify-center py-3 sm:w-fit sm:px-2 md:w-[150px] uppercase`}>
        Perguntas
      </Link>
      <Link href={`/${organization?.slug}/avaliações`} name="avaliacões" type='button' className={`${tab === 'avaliações' ? 'border-background-secondary' : 'text-typography-light dark:text-dark-typography-light border-transparent'} border-b-[4px] flex items-center justify-center py-3 sm:w-fit sm:px-2 md:w-[150px] uppercase`}>
        Avaliações
      </Link>
      {
        organization?.work_images?.length > 0 &&
        <Link href={`/${organization?.slug}/fotos`} name="fotos" type='button' className={`${tab === 'fotos' ? 'border-background-secondary' : 'text-typography-light dark:text-dark-typography-light border-transparent'} border-b-[4px] flex items-center justify-center py-3 sm:w-fit sm:px-2 md:w-[150px] uppercase`}>
          Fotos
        </Link>
      }
    </div>
  )
}