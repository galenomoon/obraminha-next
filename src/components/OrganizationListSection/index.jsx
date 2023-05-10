import React from 'react'

//deeps
import { useRouter } from 'next/router';
import api_client from '@/config/api_client'

//context
import { AppContext } from '@/pages/_app';

//styles
import { TiPlus } from 'react-icons/ti'
import { toast } from 'react-hot-toast';

//components
import Modal from '@/components/Modal';
import Button from '@/components/Button';
import Skeleton from '@/components/Skeleton';
import EmptyState from '@/components/EmptyState';
import PaginationBox from '@/components/PaginationBox';
import OrganizationForm from '@/components/OrganizationForm';
import OrganizationItem from '@/components/OrganizationItem';
import OrganizationInteractions from '@/components/OrganizationInteractions';

export default function OrganizationListSection() {
  const { query } = useRouter()
  const organization_slug = query?.organization_slug
  const [organization, setOrganizations] = React.useState([])
  const { setLoginModal, current_user } = React.useContext(AppContext)
  const current_user_id = current_user?.id
  const [is_loaded, setIsLoaded] = React.useState(false)
  const [modal, setModal] = React.useState({ show: false, organization: null, type: 'form' })

  React.useEffect(() => {
    getOrganizations()
  }, [current_user_id])

  React.useEffect(() => {
    if (organization_slug && organization?.results?.length > 0) {
      setModal({ type: 'interactions', show: true, organization: (organization?.results?.find(organization => organization?.slug === organization_slug)) })
    }
  }, [organization_slug, organization])

  async function getOrganizations() {
    setIsLoaded(false)
    return await api_client.get('/admin/organizations/')
      .then(({ data }) => setOrganizations(data))
      .catch(error => {
        if (!current_user_id) {
          return setLoginModal(true, true)
        }
        console.error(error)
      })
      .finally(() => setIsLoaded(true))
  }

  async function deleteOrganization(organization_slug) {
    return await api_client.delete(`/organizations/${organization_slug}/`)
      .then(() => {
        getOrganizations()
        toast.success('Organização deletada com sucesso')
      })
      .catch(error => {
        console.error(error)
        toast.error('Não foi possível deletar o organização')
      })
  }

  return (
    <React.Fragment>
      <section className='w-full flex items-center gap-4 h-[95vh] rounded-2xl '>
        <div className='flex flex-col gap-6 sm:py-8 md:p-8 justify-center w-full h-full'>
          <div className='flex md:flex-row sm:flex-col gap-4 items-center justify-between px-3'>
            <h1 className='md:text-3xl sm:text-3xl font-semibold text-center ms:p-0 sm:px-3'>
              Minhas Organizações
            </h1>
            <div className='flex gap-4 items-center justify-center sm:flex-col md:flex-row md:w-auto sm:w-full'>
              <Button onClick={() => setModal({ type: 'form', show: true })} className={'md:!w-fit sm:!w-full px-5 gap-2'}>
                <TiPlus size={24} />
                <p>Criar Organização</p>
              </Button>
              <PaginationBox
                className='rounded-full pr-3'
                paginated_value={organization}
                set_paginated_value={setOrganizations}
                total_pages={organization.total_pages}
                current_page={organization?.current_page}
              />
            </div>
          </div>
          <div className='flex items-center gap-3 p-6 flex-col w-full h-full rounded-3xl overflow-y-auto dark:border-dark-typography-light/20 border-[2px] dark:bg-dark-background-base bg-background-base'>
            {is_loaded ?
              organization?.results?.length ?
                organization?.results?.map((organization, idx) =>
                  <OrganizationItem
                    key={idx}
                    organization={organization}
                    deleteOrganization={deleteOrganization}
                    openInteractionsModal={() => setModal({ type: 'interactions', show: true, organization })}
                    openEditModal={() => setModal({ type: 'form', show: true, organization })}
                  />
                )
                : <EmptyState title='Nenhuma organização encontrada' description='Você ainda não possui nenhuma organização cadastrada' />

              :
              Array(9).fill(0).map((_, index) =>
                <Skeleton className='!w-full' key={index}>
                  <OrganizationItem />
                </Skeleton>
              )
            }
          </div>
        </div>
      </section>
      <Modal show={modal.show} close={() => setModal({ type: '', organization: null, show: false })}>
        {modal.type === 'form' ?
          <OrganizationForm
            organization_to_update={modal?.organization}
            close={() => setModal({ type: null, organization: null, show: false })}
            getOrganizations={() => [getOrganizations(), setModal({ type: 'form', organization: null, show: false })]}
          />
          : null
        }
        {modal.type === 'interactions' ?
          <OrganizationInteractions
            organization={modal?.organization}
            close={() => setModal({ type: null, organization: null, show: false })}
          />
          : null
        }
      </Modal>
    </React.Fragment>
  )
}
