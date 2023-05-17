import React from 'react'

//components
import SeparatorLabel from '@/components/SeparatorLabel/index';

//styles
import { MdClose } from 'react-icons/md';
import { HiPlus, HiPlusSm } from 'react-icons/hi';
import { AiOutlineMinusCircle } from 'react-icons/ai';
import Image from 'next/image';

export default function SecondStep({ organization, setOrganization, files, setFiles, categories = [], is_update, setImagesToDelete, images_to_delete }) {
  const input_ref = React.useRef(null)

  function handleRemoveImage(index) {
    if (is_update) {
      setImagesToDelete([...images_to_delete, files?.images[index]])
    }
    setFiles({ ...files, images: files?.images?.filter((_, i) => i !== index) })
  }

  function handleAddImage(e) {
    const file = e?.target?.files?.[0]

    setFiles({ ...files, images: files?.images?.length ? [...files?.images, file] : [file] })
  }

  return (
    <>
      <SeparatorLabel label="selecione as categorias" />
      <div className='flex flex-wrap gap-2 w-fit my-2 scrollbar-hide'>
        {categories?.results?.map((category) => {
          const has_current_category = organization?.categories?.some(c => c === category.id)

          return (
            <button
              type='button'
              key={category.id}
              onClick={() => setOrganization({ ...organization, categories: has_current_category ? organization.categories.filter(c => c !== category.id) : [...organization.categories, category.id] })}
              className={`flex rounded-3xl border-2 items-center whitespace-nowrap justify-center gap-1 px-2 py-1 duration-150 ${has_current_category ? 'border-background-secondary text-typography-danger bg-background-secondary/10' : 'border-typography-base dark:border-dark-typography-base hover:opacity-100 duration-200 opacity-60'}`}
            >
              <div>
                {has_current_category ? <AiOutlineMinusCircle className="text-lg" /> : <HiPlus className="text-lg" />}
              </div>
              <p className='pr-2'>{category.name}</p>
            </button>
          )
        })}
      </div>
      <SeparatorLabel label="adicione imagens" />
      <div className='flex flex-col gap-4 overflow-hidden w-full'>
        <div className='flex gap-3 items-center w-full justify-between'>
          <div className='flex flex-col text-start justify-center'>
            <p className='font-semibold text-2xl'>
              Anexar imagens
            </p>
            <p className='text-typography-light dark:text-dark-typography-light'>
              Adicione imagens da organização
            </p>
          </div>
          <button onClick={() => input_ref?.current.click()} type='button' className='flex bg-typography-primary dark:bg-typography-primary/40 items-center w-12 h-12 hover:opacity-80 duration-150 justify-center p-2 rounded-xl'>
            <HiPlusSm size={32} className='dark:text-typography-primary text-typography-secondary cursor-pointer' />
          </button>
        </div>
        <div className='flex flex-col'>
          <div className='overflow-x-auto flex pr-3'>
            <div className='flex gap-2 w-fit'>
              {files?.images?.map((image, index) =>
                <div key={index} className='duration-200 relative cursor-pointer md:w-[88px] group md:h-[88px] sm:w-[80px] sm:h-[80px] rounded-2xl'>
                  <Image src={image?.name ? URL.createObjectURL(image) : image?.image} alt={'property'} className='md:w-[80px] md:h-[80px] sm:w-[80px] sm:h-[80px] object-cover rounded-2xl' />
                  <div className='flex absolute top-0 flex-col items-end justify-start sm:p-1 md:p-2 w-full h-full'>
                    <MdClose title='Excluir Arquivo' onClick={() => handleRemoveImage(index)} className='text-white sm:text-2xl md:text-2xl hover:scale-110 duration-100 cursor-pointer' />
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className='flex md:flex-row sm:flex-col items-center sm:gap-2 md:gap-4'>
            <input ref={input_ref} type='file' accept="image/png , image/jpeg , image/jpg , image/webp, image/svg+xml" className='absolute inset-0 w-full h-full opacity-0 invisible' onChange={handleAddImage} />
          </div>
        </div>
      </div>
    </>
  )
}
