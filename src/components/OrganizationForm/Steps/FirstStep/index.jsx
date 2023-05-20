import React from 'react'

//styles
import { BiLink } from 'react-icons/bi'
import { BsImageAlt } from 'react-icons/bs'
import { FaPhoneAlt } from 'react-icons/fa'
import { TfiYoutube } from 'react-icons/tfi'
import { MdOutlineAlternateEmail } from 'react-icons/md'

//components
import Input from '@/components/Input'
import SeparatorLabel from '@/components/SeparatorLabel'
import Image from 'next/image'

export default function FirstStep({ organization, setOrganization, files, setFiles, profile_pic_error }) {
  const input_ref = React.useRef(null)

  return (
    <div className='flex flex-col gap-2'>
      <SeparatorLabel label="principais dados" />
      <div className='w-full flex md:flex-row sm:flex-col items-center gap-2'>
        <div>
          <button type='button' onClick={() => input_ref.current.click()} className={`${profile_pic_error ? "border-red-600 border-[2px]" : ""} sm:m-1 md:m-0 sm:rounded-full md:rounded-none !w-[127px] relative cursor-pointer hover:opacity-80 duration-100 !h-[127px] dark:bg-dark-background-light bg-background-base  flex items-center justify-center`}>
            {files?.profile_image ?
              <Image
                alt=""
                width={127}
                height={127}
                src={typeof (files?.profile_image) === 'object' ? URL.createObjectURL(files?.profile_image) : files?.profile_image}
                className='sm:m-1 md:m-0 sm:rounded-full md:rounded-none !w-full !h-full object-cover'
              />
              :
              <BsImageAlt className="text-7xl text-typography-light dark:text-dark-typography-light" />
            }
          </button>
          <input
            type="file"
            onChange={e => setFiles({ ...files, profile_image: (e.target.files[0]) })}
            ref={input_ref}
            accept="image/png , image/jpeg , image/jpg , image/webp, image/svg+xml"
            className='hidden'
          />
          {
            profile_pic_error ?
              <p className='text-red-600 text-sm self-start'>
                Selecione uma imagem
              </p>
              : null
          }
        </div>
        <div className='flex flex-col items-center gap-2 w-full'>
          <Input
            value={organization?.name}
            onChange={text => setOrganization({ ...organization, name: text })}
            placeholder='Nome'
            className='w-full'
            required
          />
          <Input
            value={organization?.description}
            onChange={text => setOrganization({ ...organization, description: text })}
            placeholder='Descrição'
            className='w-full'
            rows={2}
            type='textarea'
            required
          />
        </div>
      </div>
      <SeparatorLabel label="contatos / link do youtube" />
      <div className='flex flex-col w-full justify-between gap-2'>
        <div className='flex w-full justify-between gap-2'>
          <Input
            value={organization?.cellphone}
            onChange={text => setOrganization({ ...organization, cellphone: text })}
            placeholder='Telefone'
            type='tel'
            maxLength={15}
            minLength={14}
            className='w-full'
            icon={<FaPhoneAlt size={18} />}
            required
          />
          <Input
            value={organization?.email}
            onChange={text => setOrganization({ ...organization, email: text })}
            placeholder='Email'
            className='w-full'
            type='email'
            icon={<MdOutlineAlternateEmail size={20} />}
            required
          />
        </div>
        <div className='flex w-full justify-between gap-2'>
          <Input
            value={organization?.site_url}
            onChange={text => setOrganization({ ...organization, site_url: text })}
            placeholder='Link do site'
            className='w-full'
            icon={<BiLink size={20} />}
            type='url'
          />
          <Input
            value={organization?.youtube_apresentation_video_url}
            onChange={text => setOrganization({ ...organization, youtube_apresentation_video_url: text })}
            placeholder='Link do vídeo do youtube'
            className='w-full'
            icon={<TfiYoutube size={20} />}
            type='url'
          />
        </div>
      </div>
    </div>
  )
}
