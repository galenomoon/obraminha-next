import React, { useState } from 'react'

//deeps
import { useRouter } from 'next/router'

//styles
import { BiArea } from 'react-icons/bi'
import { MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

//helpers
import { numberFormatter } from '../../helpers/numberFormatter';
import currencyFormatter from '../../helpers/currencyFormatter';

//components
import Button from '@/components/Button'
import Slides from '@/components/Slides';
import Image from 'next/image';

export default function PropertyBox({ property }) {
  const { push: navigate } = useRouter()
  const [image_index, setImageIndex] = useState(0)
  const [modal_image, setModalImage] = useState({ show: false, index: 0, images: property?.images })

  return (
    <>
      <div key={property?.id} className='flex  md:h-[234px]  md:flex-row flex-col items-center justify-center rounded-2xl shadow-lg w-full dark:bg-dark-background-neutral bg-background-neutral' >
        <div className='md:w-[35%] sm:w-full overflow-hidden md:h-full sm:h-[300px] relative flex items-center'>
          {image_index !== 0 && <MdArrowBackIos color="#fff" onClick={() => setImageIndex(image_index - 1)} className='absolute text-4xl cursor-pointer hover:scale-125 duration-100 left-3 self-center drop-shadow-lg' />}
          {image_index !== property?.images?.length - 1 && <MdArrowForwardIos color="#fff" onClick={() => setImageIndex(image_index + 1)} className='absolute text-4xl cursor-pointer hover:scale-125 duration-100 right-3 self-center drop-shadow-lg' />}
          <Image
            onClick={() => navigate(`/terrenos/${property?.id}`)}
            className='w-full h-full cursor-pointer object-cover sm:rounded-t-2xl md:rounded-l-2xl md:rounded-r-none border-r-2 border-background-optional dark:border-x-dark-background-light '
            src={property?.images[image_index]?.image}
            alt="Terreno"
          />
        </div>
        <div className='flex flex-col items-center justify-center p-4 gap-2 w-full'>
          <div className='py-1 flex items-center w-full justify-between'>
            <p className='sm:text-xl md:text-xl font-semibold'>
              {property?.title}
            </p>
            <p className='sm:text-2xl md:text-2xl font-light'>
              {currencyFormatter(property?.price)?.replace(',00', '')}
            </p>
          </div>
          <div className='bg-typography-light/20 h-[1px] w-full' />
          <div className='py-1 flex items-center w-full'>
            <a href={property?.site} target='_blank' rel="noopener noreferrer" className='text-md flex items-center gap-1'>
              <BiArea size={22} className='text-typography-primary' />
              <p>{numberFormatter(property?.square_meters)} m²</p>
            </a>
          </div>
          <div className='bg-typography-light/20 h-[1px] w-full' />
          <div className='flex sm:flex-col md:flex-row w-full md:justify-between sm:items-center '>
            <div className='flex h-[80px] sm:w-full md:w-[70%]'>
              <p className='text-dark-typography-light '>
                {property?.description?.length > 140 ? property?.description?.slice(0, 140) + '...' : property?.description}
              </p>
            </div>
            <div className='md:hidden sm:block bg-typography-light/20 h-[1px] w-full my-4' />
            <Button className='md:text-sm ' to={`/terrenos/${property?.id}`}>
              Ver Detalhes
            </Button>
          </div>
        </div>
      </div>
      <Slides
        show={modal_image.show}
        images={modal_image?.images}
        image_selected={modal_image?.index}
        close={() => setModalImage({ show: false, index: 0, images: property?.images })}
      />
    </>
  )
}
