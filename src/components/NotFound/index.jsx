import React from 'react'

import Button from '@/components/Button';
import not_found from '../../assets/404_page_not_found.svg'
import TitleAndSubtitle from '@/components/TitleAndSubtitle/index';

export default function NotFound({ title, subtitle, label_button }) {
  return (
    <div className="flex w-full  justify-center min-h-screen h-fit flex-col overflow-hidden gap-6 pb-10">
      <div className='flex flex-col items-center justify-center'>
        <img src={not_found} alt="not found" className="md:w-1/2 h-[430px] object-cover animate-fade-in" />
        <TitleAndSubtitle
          title={title || "Página não encontrada"}
          subtitle={subtitle || "A página que você está procurando não existe ou foi removida."}
          className="animate-slide-in-t"
        />
        <Button to="/inicio" className="whitespace-nowrap px-6 mt-3 !w-fit">
          {label_button || "Voltar para a página inicial"}
        </Button>
      </div>
    </div>
  )
}