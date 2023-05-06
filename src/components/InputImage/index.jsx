import React from 'react'

//styles
import { FaCamera } from 'react-icons/fa'

//assets
import not_found from '../../assets/not_found.svg'
import Image from 'next/image'

export default function InputImage({ image, defaultImage, onChange, className }) {
  let image_src = image || defaultImage

  // if (typeof image === 'object' && image !== null) {
  //   const URL = window.URL || window.webkitURL
  //   image_src = URL.createObjectURL(image)
  // }

  return (
    <div className={`flex items-center justify-center relative w-64 h-64 rounded-full group overflow-hidden ${className}`}>
      <Image
        src={image_src}
        onError={(e) => e.target.src = not_found}
        className="w-full h-full object-cover"
        alt="selected"
      />
      <div className="absolute top-0 bg-[#00000055] w-full h-full text-white justify-center items-center hidden group-hover:flex flex-col animate-fade-in ">
        <input
          accept="image/png , image/jpeg , image/jpg , image/webp, image/svg+xml"
          type="file"
          onChange={onChange}
          className="file:bg-red-400 cursor-pointer absolute w-full h-full items-center flex justify-center ease-in-out duration-300  file:invisible text-[#00000000]"
        />
        <FaCamera size={48} />
        <p className="text-center text-xs md:text-base">
          Editar foto
        </p>
      </div>
    </div>
  )
}
