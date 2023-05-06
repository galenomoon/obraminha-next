import React from 'react'

//styles
import { MdClose, MdError } from 'react-icons/md'
import { ImSpinner8 } from 'react-icons/im'

//assets
import success from '../../assets/success_message.svg'

//component
import Button from '@/components/Button'

//deeps
import { useRouter } from 'next/router'

export default function Alert({ show, close, response, is_loaded, text, navigate_to }) {
  const { query } = useRouter()
  const { category_id } = query

  const message = () => response === 'error' ?
    <div className='flex flex-col justify-center items-center'>
      <MdError size={98} className='text-red-500' />
      <div className='flex flex-col items-center justify-center gap-1 py-4'>
        <h1 className='text-3xl font-semibold'>
          Ops! Algo deu errado.
        </h1>
        <p className='text-lg text-typography-light dark:text-typography-light'>
          Por favor, tente novamente.
        </p>
      </div>
      <Button onClick={() => close()} className="!w-[90%] !mt-3">
        Tentar novamente
      </Button>
    </div>
    :
    <div className='flex flex-col justify-center items-center'>
      <img src={success} alt='success' className='w-1/2' />
      <div className='flex flex-col items-center justify-center gap-3 pb-4'>
        <h1 className='text-3xl font-semibold'>
          {text?.title || 'Seu orçamento foi enviado com sucesso!'}
        </h1>
        <p className='text-lg text-typography-light dark:text-typography-light'>
          {text?.subtitle || 'Em breve entraremos em contato.'}
        </p>
      </div>
      <Button to={navigate_to ? navigate_to : `/${category_id}`} onClick={close} className="!w-[90%]">
        Continue navegando
      </Button>
    </div>

  return show ?
    <section className='fixed top-0 left-0 overflow-hidden z-[100] w-screen h-screen flex items-center justify-center backdrop-blur-md'>
      <section className='animate-slide-in-t sm:p-2 md:p-6 text-center sm:w-full sm:h-full flex items-center justify-center shadow-xl md:w-[400px] md:h-[400px] rounded-3xl bg-background-base dark:bg-dark-background-base relative'>
        <button onClick={close} className='absolute top-3 right-3 p-2 rounded-2xl bg-black/10 dark:bg-white/10 hover:opacity-80 flex items-center justify-center'>
          <MdClose size={32} />
        </button>
        {(is_loaded && (response === 'error' || response === 'success')) ? message()
          :
          <div className='gap-8 flex flex-col justify-center items-center'>
            <h1 className='text-3xl font-semibold'>
              Estamos enviando seu orçamento
            </h1>
            <ImSpinner8 size={64} className="animate-spin" />
            <p className='text-lg text-typography-light dark:text-typography-light'>
              Por favor, aguarde alguns segundos...
            </p>
          </div>
        }
      </section>
    </section>
    : null
}
