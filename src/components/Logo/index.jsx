import React from 'react'
import Image from 'next/image'

//deeps
import Link from 'next/link'

//assets
import logo_dark from '../../assets/logo_dark.svg'
import logo_light from '../../assets/logo_light.svg'

export default function Logo({ className, is_modal }) {
  return (
    <Link href={is_modal ? "#" : '/'} className='flex items-center justify-center w-fit- h-fit'>
      <Image src={logo_dark} alt='logo' className={`${className || "w-[100px]"} object-contain hidden dark:block`} />
      <Image src={logo_light} alt='logo' className={`${className || "w-[100px]"} object-contain block dark:hidden`} />
    </Link>
  )
}
