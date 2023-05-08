import React from 'react'

//styles
import { MdClose } from 'react-icons/md'

export default function Modal({ show, close, title, children, className }) {

  return show ?
    <section className='fixed top-0 left-0 overflow-hidden z-[100] w-screen h-screen flex items-center justify-center backdrop-blur-md'>
      <section className={`${className} sm:overflow-auto md:overflow-visible animate-slide-in-t sm:px-2 sm:py-6 md:p-6 text-center sm:w-full sm:h-full flex items-center md:justify-center sm:justify-start gap-6 flex-col shadow-xl md:w-fit md:h-fit rounded-3xl bg-background-neutral dark:bg-dark-background-base relative`}>
        {close &&
          <button onClick={close} className='absolute top-3 right-3 p-2 rounded-2xl dark:text-dark-typography-base text-typography-base bg-background-base dark:bg-white/10 hover:opacity-80 flex items-center justify-center'>
            <MdClose size={32} />
          </button>
        }
        <h1 className='text-3xl font-semibold'>
          {title}
        </h1>
        {children}
      </section>
    </section>
    : null
}
