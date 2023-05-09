import React, { useState, useEffect, useContext } from 'react'

//components
import Skeleton from '../Skeleton';
import Button from '../../components/Button/index';

//styles
import { FaStar } from 'react-icons/fa'
import { MdArrowBack } from 'react-icons/md';

//deeps
import { useRouter } from 'next/router';

//context
import { AppContext } from '@/pages/_app';

export default function OrganizationDetailBox({ organization, is_loaded }) {
  const { setLoginModal, current_user } = useContext(AppContext)
  const tab = useRouter()?.query?.tab
  const current_user_id = current_user?.id
  const [is_organization_owner, setIsOrganizationOwner] = useState(false)
  const { push: navigate } = useRouter()
  const organization_slug = organization?.slug
  const [is_budget, setIsBudget] = useState(false)

  useEffect(() => {
    setIsOrganizationOwner(organization?.user_owner_id === current_user_id)
  }, [organization, current_user_id])

  useEffect(() => {
    setIsBudget(tab === 'orçamento')
  }, [tab])

  return (
    <div className='flex md:flex-row sm:flex-col items-center p-3 w-full md:gap-0 sm:gap-[18px]'>
      <div className='w-full md:h-0 sm:h-[58px]' />
      <div className='flex items-center md:gap-6 w-full justify-center'>
        <Skeleton conditional={is_loaded}>
          <div className='flex flex-col items-center justify-center md:w-auto sm:w-full'>
            <p className='text-xl font-semibold flex items-center gap-1'>
              {organization?.reviews_informations?.average?.toFixed(1) || 0}
              <FaStar className='text-typography-danger' />
            </p>
            <p className='text-sm font-light text-typography-light whitespace-nowrap'>
              {organization?.reviews_informations?.reviews?.length || 0} avaliações
            </p>
          </div>
        </Skeleton>
        <div className='bg-typography-light/20 dark:bg-dark-typography-light/20 w-[2px] h-[50px] md:block sm:hidden' />
        {organization?.site_url ?
          <>
            <Skeleton conditional={is_loaded}>
              <div className='sm:hidden md:flex flex-col items-center justify-center'>
                <a href={organization?.site_url} target='_blank' rel='noreferrer' title="Abrir site da empresa" className='text-typography-primary underline text-lg whitespace-nowrap'>
                  {organization?.site_url}
                </a>
                <p className='text-sm font-light text-typography-light whitespace-nowrap'>
                  site do perfil
                </p>
              </div>
            </Skeleton>
            <div className='bg-typography-light/20 dark:bg-dark-typography-light/20 w-[2px] h-[50px]' />
          </> : null
        }
        <Skeleton conditional={is_loaded}>
          <div className='flex flex-col items-center justify-center md:w-auto sm:w-full'>
            <p className='text-typography-primary underline text-lg  whitespace-nowrap'>
              {(organization?.cellphone)}
            </p>
            <p className='text-sm font-light text-typography-light whitespace-nowrap'>
              telefone do perfil
            </p>
          </div>
        </Skeleton>
      </div>
      <div className='w-full flex items-center justify-center'>
        {!is_organization_owner &&
          <Button onClick={(e) => current_user_id ? navigate(`/${organization_slug}/${is_budget ? "sobre" : "orçamento"}`) : setLoginModal(true)} name={is_budget ? 'About' : 'Budget'} className='md:!w-[250px] relative sm:!w-full flex items-center justify-center'>
            {is_budget && <MdArrowBack size={22} className='absolute left-6' />}
            {is_budget ? "Voltar" : "Fazer Orçamento"}
          </Button>
        }
      </div>
    </div>
  )
}
