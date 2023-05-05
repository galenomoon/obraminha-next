import React from 'react'
import Image from 'next/image'

//assets
import man_bricks from '../../assets/man-bricks.png'
import bg_dark_banner from '../../assets/dark-banner.svg'
import bg_light_banner from '../../assets/light-banner.svg'

//styles
import { MdArrowBack } from 'react-icons/md'
import Skeleton from '@/components/Skeleton'

//deeps
import Link from 'next/link'

export default function Banner({ title = 'Title', category, organization, subtitle, link_to, image, is_loaded = true }) {
  return (
    <div className='flex items-center justify-center text-center h-[225px] dark:bg-dark-banner bg-light-banner bg-cover relative overflow-hidden text-typography-secondary'>
      <Image src={bg_light_banner} alt="bg-base" fill className="dark:hidden h-full absolute z-0 object-cover" />
      <Image src={bg_dark_banner} alt="bg-base-dark" fill className="dark:block hidden absolute z-0 object-cover " />

      {organization ?
        <div className='flex flex-col items-center justify-center gap-2 text-center sm:p-0 md:px-16'>
          <Skeleton conditional={is_loaded}>
            <p className='md:text-4xl sm:text-4xl font-semibold truncate w-[90vw]'>
              {organization?.name}
            </p>
          </Skeleton>
          <Skeleton conditional={is_loaded}>
            <p className='flex gap-2 items-center text-2xl group font-light'>
              {category}
            </p>
          </Skeleton>
        </div>
        :
        <div className='sm:flex flex-col gap-2 md:absolute left-16 sm:items-center md:items-start'>
          <Skeleton conditional={is_loaded}>
            <p className='md:text-5xl sm:text-4xl font-bold'>
              {title}
            </p>
          </Skeleton>
          {link_to &&
            <Link href={link_to} className='flex gap-2 items-center text-2xl group'>
              <MdArrowBack className='group-hover:-translate-x-2  duration-150' />
              <p>
                Voltar
              </p>
            </Link>
          }
          {subtitle &&
            <p className='flex gap-2 items-center text-2xl group font-light'>
              {subtitle}
            </p>
          }
        </div>
      }
      {!organization &&
        <div className='sm:hidden md:block'>
          <Image src={image || man_bricks} alt="man bricks" className='w-[400px] absolute -bottom-6 right-6' />
        </div>
      }
    </div>
  )
}
