import React from 'react'

//deeps
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
import PropertyForm from '@/components/PropertyForm';
import PropertyItem from '@/components/PropertyItem';
import PaginationBox from '@/components/PaginationBox';
import ProposalListSection from '@/components/ProposalList';

export default function PropertyListSection({ property_id }) {
  const [properties, setProperties] = React.useState([])
  const [is_loaded, setIsLoaded] = React.useState(false)
  const { setLoginModal, current_user } = React.useContext(AppContext)
  const current_user_id = current_user?.id
  const [modal_create_property, setModalCreateProperty] = React.useState(false)
  const [modal_proposals, setModalProposals] = React.useState({ show: false, property_id: null })

  React.useEffect(() => {
    getProperties()
  }, [current_user_id])

  React.useEffect(() => {
    if (property_id && properties?.results?.length > 0) {
      setModalProposals({ show: true, property: (properties?.results?.find(property => property?.id === parseInt(property_id))) })
    }
  }, [property_id, properties])

  async function getProperties() {
    setIsLoaded(false)
    return await api_client.get('/admin/properties/')
      .then(({ data }) => setProperties(data))
      .catch(error => {
        if (!current_user_id) {
          return setLoginModal(true, true)
        }
        console.error(error)
      })
      .finally(() => setIsLoaded(true))
  }

  async function deleteProperty(property_id) {
    return await api_client.delete('/properties/' + property_id)
      .then(() => {
        getProperties()
        toast.success('Terreno deletado com sucesso')
      })
      .catch(error => {
        console.error(error)
        toast.error('Não foi possível deletar o terreno')
      })
  }

  return (
    <React.Fragment>
      {is_loaded ?
        <section className='w-full flex items-center gap-4 h-[95vh] rounded-2xl '>
          <div className='flex flex-col gap-6 sm:py-8 md:p-8 justify-center w-full h-full'>
            <div className='flex md:flex-row sm:flex-col gap-4 items-center justify-between px-3'>
              <h1 className='md:text-3xl sm:text-3xl font-semibold text-center ms:p-0 sm:px-3'>
                Meus Terrenos
              </h1>
              <div className='flex gap-4 items-center justify-center sm:flex-col md:flex-row md:w-auto sm:w-full'>
                <Button onClick={() => setModalCreateProperty({ ...modal_create_property, show: true })} className={'md:!w-fit sm:!w-full px-5 gap-2'}>
                  <TiPlus size={24} />
                  <p>Criar Terreno</p>
                </Button>
                <PaginationBox
                  className='rounded-full pr-3'
                  paginated_value={properties}
                  set_paginated_value={setProperties}
                  total_pages={properties.total_pages}
                  current_page={properties?.current_page}
                />
              </div>
            </div>
            <div className='flex items-center gap-3 p-6 flex-col w-full h-full rounded-3xl overflow-y-auto dark:border-dark-typography-light/20 border-[2px] dark:bg-dark-background-base bg-background-base'>
              {properties?.results?.length ?
                properties?.results?.map((property, idx) =>
                  <PropertyItem
                    key={idx}
                    property={property}
                    deleteProperty={deleteProperty}
                    openProposalsModal={() => setModalProposals({ show: true, property })}
                    openEditModal={() => setModalCreateProperty({ ...modal_create_property, show: true, property })}
                  />
                )
                : <EmptyState title='Nenhum terreno encontrado' description='Você ainda não possui nenhum terreno cadastrado' />
              }
            </div>
          </div>
        </section>
        :
        Array(9).fill(0).map((_, index) =>
          <Skeleton className='!w-full' key={index}>
            <PropertyItem />
          </Skeleton>
        )
      }
      <Modal show={modal_proposals.show} close={() => setModalProposals({ show: false, property: null })}>
        <ProposalListSection property={modal_proposals?.property} />
      </Modal>
      <Modal show={modal_create_property.show} close={() => setModalCreateProperty({ property: null, show: false })} className="md:!rounded-3xl sm:!rounded-none">
        <PropertyForm property_to_update={modal_create_property?.property} getProperties={() => [getProperties(), setModalCreateProperty({ property: null, show: false })]} />
      </Modal>
    </React.Fragment>
  )
}
