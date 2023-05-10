import React, { useState } from 'react'

//deeps
import Link from 'next/link';

//styles
import { TbEdit, TbMessages } from 'react-icons/tb'
import { HiPhone } from 'react-icons/hi';
import { FaYoutube } from 'react-icons/fa';
import { BiCategory } from 'react-icons/bi';
import { IoIosWarning, IoMdPhotos } from 'react-icons/io';
import { MdDeleteForever, MdOpenInNew, MdOutlineOpenInNew } from 'react-icons/md';

//components
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import YoutubeEmbed from '@/components/YoutubeEmbed/';
import OrganizationPictures from '@/components/OrganizationPictures/';

export default function OrganizationItem({ organization, deleteOrganization, openEditModal, openInteractionsModal }) {
  const [modal, setModal] = useState({ delete_show: false, youtube_show: false, work_images_show: false })

  return (
    <>
      <div key={organization?.id} className='flex md:h-fit md:flex-row flex-col items-center justify-center rounded-2xl shadow-lg w-full dark:bg-dark-background-neutral bg-background-neutral' >
        <section className='flex md:flex-row sm:flex-col items-center justify-start w-full md:pl-2 sm:p-0 '>
          <div className='md:w-[200px] overflow-hidden md:h-[125px]  flex-shrink-0 sm:h-[126px] relative flex items-center sm:rounded-t-2xl'>
            <img
              className='md:w-[200px] md:h-[125px]  flex-shrink-0 cursor-pointer object-cover sm:rounded-t-2xl md:rounded-xl border-background-optional dark:border-x-dark-background-light'
              src={organization?.profile_image?.image}
              alt="Organização"
            />
          </div>
          <div className='flex flex-col items-center justify-center p-3 gap-2 w-full'>
            <div className='flex items-center w-full justify-between'>
              <p className='text-lg font-semibold w-[80%]'>
                {organization?.name?.length > 90 ? organization?.name?.slice(0, 90) + '...' : organization?.name}
              </p>
              <div className='flex items-center gap-2 justify-center'>
                <Link href={`/${organization?.slug}/sobre`} className="sm:hidden md:flex pl-3 pr-1 truncate gap-2 hover:opacity-80 duration-120 items-center justify-center text-typography-primary">
                  <p>
                    ver página completa
                  </p>
                  <MdOpenInNew size={16} />
                </Link>
              </div>
            </div>
            <div className='bg-typography-light/20 h-[1px] w-full' />
            <div className='flex sm:flex-col md:flex-row w-full md:justify-between '>
              <div className='flex flex-col sm:w-full md:w-[50%]'>
                <div className='flex flex-col'>
                  <a href={organization?.site_url} target='_blank' rel="noopener noreferrer" className='hover:opacity-80 duration-150 text-sm w-fit flex items-center gap-1'>
                    <MdOutlineOpenInNew size={18} className='text-typography-primary' />
                    <p>Abrir site</p>
                  </a>
                  <p className='font-semibold text-sm text-typography-primary flex items-center gap-1'>
                    <HiPhone size={17} className='text-typography-primary' />
                    {organization?.cellphone}
                  </p>
                  <div className='font-semibold text-sm text-typography-primary flex items-center gap-1'>
                    <div>
                      <BiCategory size={17} className='text-typography-primary' />
                    </div>
                    {organization?.categories?.map((category, idx) => idx < 4 &&
                      <p key={idx} className='whitespace-nowrap'>
                        {category?.name}{idx === 3 ? '...' : ' | '}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className='flex sm:flex-col md:flex-row gap-3 mt-3 items-center justify-center'>
                <div className='flex gap-3 md:w-auto sm:w-full justify-center'>
                  {organization?.work_images?.length > 0 ?
                    <button onClick={() => setModal({ work_images_show: true, organization })} className='flex bg-[#9b40e6] dark:bg-[#9b40e6]/40 items-center justify-center hover:opacity-80 duration-150 p-2 rounded-xl'>
                      <IoMdPhotos size={28} className='dark:text-[#b780e4] text-typography-secondary cursor-pointer' />
                    </button>
                    : null
                  }
                  {organization?.youtube_apresentation_video_url ?
                    <button onClick={() => setModal({ youtube_show: true })} className='flex bg-[#FF0000] dark:bg-[#FF0000]/40 items-center justify-center hover:opacity-80 duration-150 p-2 rounded-xl'>
                      <FaYoutube size={28} className='dark:text-[#FFff]/80 text-typography-secondary cursor-pointer' />
                    </button>
                    : null
                  }
                  <div className='gap-3 sm:p-0 md:px-4 flex md:border-x-[2px] sm:border-0 border-typography-light/20 dark:border-x-dark-typography-light/20'>
                    <button onClick={() => setModal({ delete_show: true })} className='flex bg-[#c22945] dark:bg-[#c22945]/40 items-center justify-center hover:opacity-80 duration-150 p-2 rounded-xl'>
                      <MdDeleteForever size={28} className='dark:text-[#e82f51] text-typography-secondary cursor-pointer' />
                    </button>
                    <button onClick={() => openEditModal()} className='flex bg-[#efc11c] dark:bg-[#efc11c]/40 items-center hover:opacity-80 duration-150 justify-center p-2 rounded-xl'>
                      <TbEdit size={28} className='dark:text-[#efc11c] text-typography-secondary cursor-pointer' />
                    </button>
                  </div>
                </div>
                <button onClick={() => openInteractionsModal()} className='flex md:w-fit sm:w-full flex-nowrap whitespace-nowrap gap-2 bg-typography-primary dark:bg-typography-primary/40 items-center relative hover:opacity-80 duration-150 justify-center p-2 rounded-xl'>
                  <TbMessages size={22} className='dark:text-typography-primary text-[#fff] cursor-pointer my-1' />
                  <p className='dark:text-typography-primary text-[#fff] font-semibold'>
                    ver interações
                  </p>
                </button>
              </div>
            </div>
          </div>
        </section>
      </div>
      <Modal
        show={modal?.youtube_show || modal?.delete_show || modal?.work_images_show}
        close={() => setModal({})}
        title={modal?.delete_show ? 'Excluir organização' : modal?.title}
      >
        {modal?.youtube_show ?
          <div className='flex flex-col items-center gap-4'>
            <div className='flex flex-col justify-center items-center'>
              <div className='flex flex-col items-center justify-center'>
                <p className='text-3xl font-semibold'>
                  Vídeo de apresentação
                </p>
                <p className='text-md flex text-typography-light dark:text-typography-light'>
                  você pode atualizar o link do vídeo de <br />
                  apresentação da sua organização clicando no botão de editar
                </p>
              </div>
            </div>
            <YoutubeEmbed youtube_link={organization?.youtube_apresentation_video_url} />
          </div>
          : null}
        {modal?.delete_show ?
          <div className='!w-[400px] flex flex-col gap-6'>
            <div className='flex flex-col items-center gap-2'>
              <IoIosWarning size={90} className='self-center text-[#e82f51] dark:text-[#e82f51]' />
              <p>
                Tem certeza que deseja excluir a organização: <br /> <span className='font-semibold italic text-lg'>{organization?.name}</span>?
              </p>
            </div>
            <div className='flex gap-4 w-full items-center justify-center'>
              <Button onClick={() => setModal({})} className='bg-[#777] dark:bg-[#777]/40 hover:!opacity-70'>
                Cancelar
              </Button>
              <Button onClick={() => deleteOrganization(organization?.slug)}>
                Confirmar
              </Button>
            </div>
          </div>
          : null}
        {modal?.work_images_show ?
          <div>
            <div className='flex flex-col items-center justify-center'>
              <p className='text-3xl font-semibold'>
                Imagens de trabalhos
              </p>
              <p className='text-md flex text-typography-light dark:text-typography-light'>
                você pode atualizar as imagens de trabalhos <br />
                da sua organização clicando no botão de editar
              </p>
            </div>
            <div className='h-[50vh] sm:w-[90vw] md:w-[50vw] overflow-y-scroll mt-8 dark:bg-dark-background-neutral bg-background-base p-4 rounded-2xl'>
              <OrganizationPictures
                admin_side={true}
                organization={modal?.organization}
                className="flex !items-start !justify-start"
                imageClassName="md:!w-[170px] md:!h-[170px] object-cover"
              />
            </div>
          </div>
          : null}
      </Modal>
    </>
  )
}