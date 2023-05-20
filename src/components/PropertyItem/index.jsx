import React, { useState } from 'react'

//deeps
import Link from 'next/link'

//styles
import { BiArea } from 'react-icons/bi'
import { TbEdit } from 'react-icons/tb'
import { IoIosWarning } from 'react-icons/io'
import { MdArrowBackIos, MdArrowForwardIos, MdDeleteForever, MdOpenInNew } from 'react-icons/md';

//helpers
import { numberFormatter } from '../../helpers/numberFormatter';
import currencyFormatter from '../../helpers/currencyFormatter';

//components
import Slides from '@/components/Slides';
import Modal from '@/components/Modal/index';
import Button from '@/components/Button';
import Image from 'next/image'

export default function PropertyItem({ property, deleteProperty, openEditModal, openProposalsModal }) {
  const [image_index, setImageIndex] = useState(0)
  const [modal_delete, setModalDelete] = useState(false)
  const [modal_image, setModalImage] = useState({ show: false, index: 0, images: property?.images })

  return (
    <>
      <div key={property?.id} className='flex md:h-fit md:flex-row flex-col items-center justify-center rounded-2xl shadow-lg w-full dark:bg-dark-background-neutral bg-background-neutral' >
        <section className='flex md:flex-row sm:flex-col items-center justify-start w-full md:pl-2 sm:p-0 '>
          <div className='md:w-[180px] overflow-hidden md:h-[100px] sm:h-[126px] relative flex items-center sm:rounded-t-2xl'>
            {image_index !== 0 && <MdArrowBackIos color="#fff" onClick={() => setImageIndex(image_index - 1)} className='absolute text-2xl cursor-pointer hover:scale-125 duration-100 left-3 self-center drop-shadow-lg' />}
            {image_index !== property?.images?.length - 1 && <MdArrowForwardIos color="#fff" onClick={() => setImageIndex(image_index + 1)} className='absolute text-2xl cursor-pointer hover:scale-125 duration-100 right-3 self-center drop-shadow-lg' />}
            <Image
              layout='fill'
              onClick={() => setModalImage({ show: true, index: image_index, images: property?.images })}
              className='md:w-[180px] md:h-[100px] cursor-pointer object-cover sm:rounded-t-2xl md:rounded-xl border-background-optional dark:border-x-dark-background-light'
              src={property?.images?.[image_index]?.image}
              alt="Terreno"
            />
          </div>
          <div className='flex flex-col items-center justify-center p-3 gap-2 sm:w-full'>
            <div className='flex items-center w-full justify-between'>
              <p className='text-lg font-semibold w-[75%] truncate'>
                {property?.title}
              </p>
              <div className='flex items-center gap-2 justify-center'>
                <Link href={`/terrenos/${property?.id}`} className="sm:hidden md:flex px-7 truncate gap-2 hover:opacity-80 duration-120 items-center justify-center text-typography-primary">
                  <p>
                    ver página completa
                  </p>
                  <MdOpenInNew size={16} />
                </Link>
                <p className='sm:text-xl md:text-xl font-light'>
                  {currencyFormatter(property?.price)?.replace(',00', '')}
                </p>
              </div>
            </div>
            <div className='bg-typography-light/20 h-[1px] w-full' />
            <div className='flex sm:flex-col md:flex-row w-full md:justify-between sm:items-center '>
              <div className='flex flex-col sm:w-full md:w-[70%]'>
                <div className='text-sm flex items-center gap-1'>
                  <BiArea size={20} className='text-typography-primary' />
                  <p>{numberFormatter(property?.square_meters)} m²</p>
                </div>
                <p className='text-dark-typography-light text-sm whitespace-nowrap truncate'>
                  {property?.description?.length > 140 ? property?.description?.slice(0, 140) + '...' : property?.description}
                </p>
              </div>
              <div className='flex gap-3 mt-3 items-center justify-center'>
                <button onClick={() => setModalDelete(true)} className='flex bg-[#c22945] dark:bg-[#c22945]/40 items-center justify-center hover:opacity-80 duration-150 p-2 rounded-xl'>
                  <MdDeleteForever size={28} className='dark:text-[#c22945] text-typography-secondary cursor-pointer' />
                </button>
                <button onClick={() => openEditModal()} className='flex bg-[#efc11c] dark:bg-[#efc11c]/40 items-center hover:opacity-80 duration-150 justify-center p-2 rounded-xl'>
                  <TbEdit size={28} className='dark:text-[#efc11c] text-typography-secondary cursor-pointer' />
                </button>
                <button onClick={() => openProposalsModal()} className='flex flex-nowrap whitespace-nowrap gap-2 bg-typography-primary dark:bg-typography-primary/40 items-center relative hover:opacity-80 duration-150 justify-center p-2 rounded-xl'>
                  <MdOpenInNew size={22} className='dark:text-typography-primary text-[#fff] cursor-pointer my-1' />
                  <p className='dark:text-typography-primary text-[#fff] font-semibold'>
                    ver propostas
                  </p>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Slides
        show={modal_image.show}
        images={modal_image?.images}
        image_selected={modal_image?.index}
        close={() => setModalImage({ show: false, index: 0, images: property?.images })}
      />
      <Modal
        show={modal_delete}
        close={() => setModalDelete(false)}
        title='Excluir terreno'
      >
        <div className='!w-[400px] flex flex-col gap-6'>
          <div className='flex flex-col items-center gap-2'>
            <IoIosWarning size={90} className='self-center text-[#e82f51] dark:text-[#e82f51]' />
            <p>
              Tem certeza que deseja excluir terreno <br /> <span className='font-semibold italic text-lg'>{property?.title}</span>?
            </p>
          </div>
          <div className='flex gap-4 w-full items-center justify-center'>
            <Button onClick={() => setModalDelete(false)} className='bg-[#777] dark:bg-[#777]/40 hover:!opacity-70'>
              Cancelar
            </Button>
            <Button onClick={() => deleteProperty(property?.id)}>
              Confirmar
            </Button>
          </div>
        </div>
      </Modal>
    </>
  )
}