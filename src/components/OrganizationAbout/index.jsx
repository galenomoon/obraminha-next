import React from 'react'
import Link from 'next/link'

//components
import GoogleMaps from '../GoogleMaps'
import YoutubeEmbed from '@/components/YoutubeEmbed'
import Skeleton, { SkeletonText } from '../Skeleton'

//icons
import { FaWhatsapp } from 'react-icons/fa'
import { MdOutlineOpenInNew } from 'react-icons/md'

export default function OrganizationAbout({ organization }) {
  const organization_slug = organization?.slug

  return (
    <>
      <div className="flex md:flex-row sm:flex-col sm:gap-6 items-start justify-between">
        {organization?.youtube_apresentation_video_url ?
          <div className='flex flex-col w-full items-center gap-4'>
            <p className='md:text-2xl sm:text-xl font-semibold sm:text-center'>Veja um pouco do nosso trabalho:</p>
            <YoutubeEmbed youtube_link={organization?.youtube_apresentation_video_url} />
          </div> : null
        }
        <div className='flex flex-col gap-4 w-full items-center sm:px-6 md:px-12 h-[300px]'>
          <Skeleton conditional={organization?.name}>
            <p className='md:text-2xl sm:text-xl font-semibold'>Sobre {organization?.name}</p>
          </Skeleton>
          <SkeletonText conditional={organization?.description}>
            <p className='text-xl font-light text-typography-light dark:text-dark-typography-light'>
              {organization?.description}
            </p>
            {!organization?.work_images?.length ? null :
              <Link href={`/${organization_slug}/fotos`} className='text-xl text-typography-primary hover:underline duration-100 text-center'>
                Veja as {organization?.work_images?.length} fotos do trabalho de <br className='sm:block md:hidden' /> {organization?.name}
              </Link>
            }
          </SkeletonText>
        </div>
      </div>
      <div className='w-[95%] self-center h-[3px] bg-background-light dark:bg-dark-background-light my-6' />
      <div className='flex flex-col items-center justify-center gap-3 w-full'>
        <p className='md:text-4xl sm:text-2xl font-semibold my-4'>Entre em contato conosco:</p>
        <div className='flex md:flex-row sm:flex-col px-4 items-end justify-between gap-3 w-full'>
          <div className='flex flex-col w-full items-center justify-self-center'>
            <div className='flex flex-col gap-6 items-center justify-center rounded-3xl bg-background-optional dark:bg-dark-background-base border-typography-light/40 dark:border-dark-background-light border-[3px] w-full max-w-[650px] sm:h-fit sm:py-6 md:h-[325px]'>
              <div className='flex flex-col items-center'>
                <p className='text-xl items-center flex text-typography-light justify-center font-light dark:text-dark-typography-light'>
                  <FaWhatsapp className='mr-2' />
                  WhatsApp
                </p>
                <a href={`https://api.whatsapp.com/send?phone=55${organization?.cellphone?.replace(/\D/g, '')}`} target='_blank' rel='noreferrer' title='Abrir WhatsApp da Empresa' className='md:text-2xl sm:text-xl underline text-typography-primary'>
                  {organization?.cellphone}
                </a>
              </div>
              {organization?.site_url ?
                <div className='flex flex-col items-center'>
                  <p className='text-xl items-center flex text-typography-light font-light justify-center dark:text-dark-typography-light'>
                    <MdOutlineOpenInNew className='mr-2' />
                    Nosso site
                  </p>
                  <a href={organization?.site_url} target='_blank' rel='noreferrer' title="Abrir site da empresa" className='md:text-2xl sm:text-xl underline text-typography-primary'>
                    {organization?.site_url}
                  </a>
                </div>
                : null
              }
            </div>
          </div>
          <div className='flex flex-col w-full text-center sm:gap-1 md:gap-3 items-center justify-self-center'>
            <p className='sm:text-sm md:text-xl font-light text-typography-light dark:text-dark-typography-light'>
              {organization?.address?.city} | {organization?.address?.street}, {organization?.address?.number} - {organization?.address?.state}
            </p>
            <div className='flex flex-col rounded-3xl bg-background-optional dark:bg-dark-background-base border-typography-light/40 dark:border-dark-background-light border-[3px] w-full max-w-[650px] h-[325px]'>
              <GoogleMaps organization={organization} />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
