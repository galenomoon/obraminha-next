import React, { useState } from 'react'

//styles
import { MdArrowBackIos, MdArrowForwardIos, MdClose } from 'react-icons/md'

//assets
import not_found from '../../assets/not_found.svg'
import Image from 'next/image'

export default function Slides({ organization, show, close, image_selected, images = [] }) {
  const [index, setIndex] = useState(0)
  const key_shortcut_ref = React.useRef(null)

  function handleShortCuts(e) {
    if (e.code === 'Escape') {
      return close()
    }
    if (e.code === 'ArrowRight') {
      return index + 1 !== images?.length && setIndex(index + 1)
    }
    if (e.code === 'ArrowLeft') {
      return index + 1 !== 1 && setIndex(index - 1)
    }
  }

  React.useEffect(() => {
    if (key_shortcut_ref?.current) {
      key_shortcut_ref.current.focus()
    }
  })

  React.useEffect(() => {
    setIndex(image_selected)
  }, [image_selected])

  return (!show ? null :
    <div className='fixed animate-fade-in left-0 z-[999] flex flex-col items-center justify-center top-0 w-full h-full bg-[#00000066] backdrop-blur-md'>
      <MdClose
        className='absolute top-10 sm:right-5 md:right-10 cursor-pointer hover:scale-110 duration-150 ease-in-out hover:opacity-90 bg-[#00000066] rounded-full p-2'
        onClick={close}
        size={52}
        color="#fff"
      />
      <p className='absolute sm:top-32 max-w-[70vw] truncate line-clamp-1 md:top-8 text-dark-typography-base text-3xl'>
        {organization?.name ? `Fotos de ${organization.name}` : null}
      </p>
      <div className='flex items-center sm:gap-7 md:gap-16 md:static sm:relative justify-center'>
        {index + 1 !== 1 &&
          <button onClick={() => setIndex(index - 1)} className='z-[300] absolute md:left-16 sm:left-3 hover:scale-110 duration-150 ease-in-out '>
            <MdArrowBackIos size={42} color="#fff" />
          </button>
        }
        {!images ? <Image src={not_found} alt='not found' title="Erro de imagem" className='md:h-[75vh] md:!w-[75vw] sm:w-[80vw] object-cover rounded-xl' /> :
          <Image
            onError={e => e.target.src = not_found}
            src={images?.[index]?.image}
            alt='portifolio da organização'
            className='md:h-[75vh] md:w-[75vw] sm:w-[80vw] object-contain rounded-xl'
          />}
        {index + 1 !== images?.length &&
          <button onClick={() => setIndex(index + 1)} className='z-[300] absolute md:right-16 sm:right-3 hover:scale-110 duration-150 ease-in-out '>
            <MdArrowForwardIos size={42} color="#fff" />
          </button>
        }
      </div>
      <p className='text-dark-typography-base font-light absolute bottom-8 text-3xl'>
        {index + 1}/{images?.length}
      </p>
      <input type="text" className='bg-transparent border-0 outline-none md:block sm:hidden text-transparent' ref={key_shortcut_ref} onKeyDown={handleShortCuts} />
    </div>
  )
}
