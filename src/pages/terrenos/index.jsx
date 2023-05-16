import React, { useEffect, useState } from 'react'

//components
import Banner from '@/components/Banner'
import Header from '@/components/Header'
import Skeleton from '@/components/Skeleton'
import EmptyState from '@/components/EmptyState'
import PropertyBox from '@/components/PropertyBox'
import PaginationBox from '@/components/PaginationBox'
import SearchByAddress from '@/components/SearchByAddress'

//deeps
import api_client from '@/config/api_client';

//assets
import searching_man from "../../assets/searching_man.svg"

export default function Properties() {
  const [is_loaded, setIsLoaded] = useState(false)
  const [properties, setProperties] = useState([])
  const [radius, setRadius] = useState(50)
  const [address_on_slug, setAddressOnSlug] = useState(false);
  const [selected_address, setSelectedAddress] = useState()

  useEffect(() => {
    getProperties()
  }, [selected_address])

  async function getProperties() {
    return await api_client.post('/properties/search/address/', {
      ...selected_address,
      district: "",
      radius: parseInt(radius) ? parseInt(radius) * 100 : 50 * 100
    })
      .then(({ data }) => setProperties(data))
      .catch(console.error)
      .finally(() => setIsLoaded(true))
  }

  return (
    <div className='w-full h-full flex flex-col'>
      <Header
        subtitle={`Terrenos${address_on_slug ? ` em ${address_on_slug}` : ""}`}
        description={`Encontre os melhores terrenos${address_on_slug ? ` em ${address_on_slug}` : ""} para a sua obra!`}
      />
      <Banner title={`Terrenos${address_on_slug ? ` em ${address_on_slug}` : ""}`} />
      <div className="flex min-h-screen self-center items-center md:w-[80vw] sm:w-full py-10 gap-8 h-fit flex-col overflow-hidden">
        <div className='flex flex-col items-center gap-4 w-full sm:px-4 md:px-8'>
          <div className='w-full sm:flex-col relative flex items-center'>
            <SearchByAddress
              get_options_endpoint="/properties/autocomplete/address/"
              placeholder="Digite o endereço do terreno"
              setSelectedAddress={setSelectedAddress}
              selected_address={selected_address}
              setAddressOnSlug={setAddressOnSlug}
              address_on_slug={address_on_slug}
              setIsLoaded={setIsLoaded}
              setRadius={setRadius}
              radius={radius}
            />
          </div>
          <div className='w-full items-center flex justify-end'>
            <PaginationBox
              request={{ method: 'post', payload: { state: null } }}
              paginated_value={properties}
              set_paginated_value={setProperties}
              current_page={properties?.current_page}
              total_pages={properties?.total_pages} />
          </div>
        </div>
        <div className='flex md:flex-row sm:flex-col sm:px-4 md:px-8 w-full'>
          <div className='flex flex-col gap-4 w-full'>
            {!is_loaded ?
              <Skeleton length={9} className='!w-full' >
                <PropertyBox />
              </Skeleton>
              : (
                properties?.results?.length ?
                  properties?.results?.map(property => <PropertyBox property={property} key={property?.id} />)
                  :
                  <EmptyState
                    image={searching_man}
                    title="Nenhum terreno encontrado"
                    description="Não encontramos nenhum terreno com o endereço informado. Tente novamente com outro endereço."
                  />
              )}
          </div>
        </div>
      </div>
    </div>
  )
}