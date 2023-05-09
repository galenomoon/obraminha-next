import React, { useState } from 'react'

//components
import Slides from '@/components/Slides'

//assets
import not_found from '../../assets/not_found.svg'
import Image from 'next/image'

export default function OrganizationPictures({ organization, imageClassName, className, admin_side }) {
  const [open, setOpen] = useState(false)
  const [image_selected, setImageSelected] = useState(0)
  const [isLoaded, setIsLoaded] = useState(false)

  function handleOpenImage(e) {
    if (admin_side) {
      return
    }
    setOpen(true)
    setImageSelected(e.target.name)
  }

  return (
    <>
      <div className={`${className} flex items-center justify-center sm:gap-[6px] md:gap-[16px] w-full h-full flex-wrap`}>
        {organization?.work_images.map((image, index) =>
          <Image
            onClick={handleOpenImage}
            key={index}
            name={index}
            src={image?.image ? image.image : not_found}
            onError={(e) => e.target.src = not_found}
            onLoad={() => setIsLoaded(true)}
            alt="organization"
            width={300}
            height={300}
            className={isLoaded ?
              `sm:w-[100px] ${imageClassName} md:w-[300px] sm:h-[100px] md:h-[300px] object-cover sm:rounded-xl md:rounded-2xl cursor-pointer hover:scale-[1.02] duration-200 hover:shadow-xl`
              :
              `sm:w-[100px] ${imageClassName} md:w-[300px] sm:h-[100px] md:h-[300px] object-cover sm:rounded-xl md:rounded-2xl duration-200 hover:shadow-xl animate-[pulse_1230ms_ease-in-out_infinite] bg-[#ddd] dark:bg-[#777]`
            }
          />
        )}
      </div>
      <Slides
        show={open}
        close={() => setOpen(false)}
        organization={organization}
        image_selected={parseInt(image_selected)}
        images={organization?.work_images}
      />
    </>
  )
}
