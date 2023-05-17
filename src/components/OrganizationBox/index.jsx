import React from 'react'

//styles
import { MdOutlineOpenInNew, MdArrowBackIos, MdArrowForwardIos } from 'react-icons/md';

//components
import Rating from '../Rating';
import Button from '../Button/index';

//deeps
import Link from 'next/link'
import { useRouter } from 'next/router';

//helpers
import Slides from '../Slides/index';

//assets
import not_found from '../../assets/not_found.svg'
import Image from 'next/image';

export default function OrganizationBox({ organization }) {
  const { push: navigate } = useRouter()
  const [image_index, setImageIndex] = React.useState(0)
  const [modal_image, setModalImage] = React.useState({ show: false, index: 0, images: organization?.work_images })

  const DynamicLink = organization?.site_url ? "a" : Link
  const dynamic_link_props = organization?.site_url ? { href: organization?.site_url, target: '_blank', rel: "noopener noreferrer" } : { href: `/${organization?.slug}/sobre` }

  return (
    <>
      <div key={organization?.id} className='flex flex-col items-center justify-center rounded-2xl shadow-lg md:w-[400px] sm:w-full dark:bg-dark-background-neutral bg-background-neutral' >
        <div className='flex justify-center h-[160px] sm:w-full md:w-[400px] relative'>
          {
            organization?.work_images?.length > 1 &&
            <>
              <MdArrowBackIos color="#fff" onClick={() => setImageIndex(image_index - 1)} className={`${image_index !== 0 ? "" : "invisible"} absolute text-4xl cursor-pointer hover:scale-125 duration-100 left-3 self-center drop-shadow-lg`} />
              <MdArrowForwardIos color="#fff" onClick={() => setImageIndex(image_index + 1)} className={`${image_index !== organization?.work_images?.length - 1 ? "" : "invisible"} absolute text-4xl cursor-pointer hover:scale-125 duration-100 right-3 self-center drop-shadow-lg`} />
            </>
          }
          <Image
            alt={'Organization Portifolio'}
            onError={(e) => e.target.src = not_found}
            src={organization?.work_images?.[image_index]?.image || organization?.profile_image?.image || not_found}
            onClick={() => navigate(`/${organization?.slug}/sobre`)}
            className='object-cover cursor-pointer sm:w-full md:w-[400px] rounded-t-2xl '
          />
        </div>
        <div className='flex flex-col items-center justify-center p-4 gap-2 w-full'>
          <div className='py-1 flex items-center justify-between w-full'>
            <p className='sm:text-xl md:text-xl font-semibold truncate pr-5'>
              {organization?.name}
            </p>
            <Rating value={organization?.reviews_informations?.average} />
          </div>
          <div className='bg-typography-light/20 h-[1px] w-full' />
          <div className='py-1 flex items-center justify-between w-full'>
            <DynamicLink {...dynamic_link_props} className='text-md underline flex items-center gap-1 hover:opacity-80'>
              <MdOutlineOpenInNew size={22} className='text-typography-primary' />
              <p className='sm:text-md md:text-lg'>Abrir site</p>
            </DynamicLink>
            <p className='text-lg whitespace-nowrap font-semibold text-typography-primary'>
              {organization?.cellphone}
            </p>
          </div>
          <div className='bg-typography-light/20 h-[1px] w-full' />
          <div className='sm:p-0 md:py-2 md:my-3 sm:mt-4 sm:mb-3'>
            <Button to={`/${organization?.slug}/sobre`}>
              Ver Detalhes
            </Button>
          </div>
        </div>
      </div >
      <Slides
        show={modal_image.show}
        images={modal_image.images}
        image_selected={modal_image.index}
        close={() => setModalImage({ show: false, index: 0, images: organization?.images })}
      />
    </>
  )
}
