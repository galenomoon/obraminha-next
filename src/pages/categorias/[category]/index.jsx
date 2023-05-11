import React, { useState, useEffect } from 'react'

//deeps
import { useRouter } from 'next/router'
import api_client from '@/config/api_client';

//components
import Header from '@/components/Header';
import Skeleton from '@/components/Skeleton';
import Banner from '@/components/Banner/index';
import SearchBar from '@/components/SearchBar/index';
import SearchByAddress from '@/components/SearchByAddress';
import OrganizationBox from '@/components/OrganizationBox';
import PaginationBox from '@/components/PaginationBox/index';

//hooks
import useDebounce from '../../../hooks/useDebounce';

export default function Organizations() {
  const { query } = useRouter()
  const category_slug = query?.category
  const [search, setSearch] = useState('');
  const [search_address, setSearchAddress] = useState('');
  const [category, setCategory] = useState()
  const [organizations, setOrganizations] = useState([])
  const [is_loaded, setIsLoaded] = useState(false);
  const [radius, setRadius] = useState(null);
  const [is_loaded_category, setLoadedCategory] = useState(false);
  const debounced_query_search = useDebounce(search);
  const debounced_address_search = useDebounce(search_address);

  useEffect(() => {
    if (debounced_address_search) {
      getOrganizationByAddress(debounced_query_search)
    } else {
      getOrganizationsByCategory(debounced_query_search)
    }
  }, [debounced_address_search, debounced_query_search, category_slug])

  async function getOrganizationByAddress(organization_name) {
    if (!category?.slug) return

    let payload = {
      ...search_address,
      district: "",
      category_slug: category?.slug,
      radius: parseInt(radius) ? parseInt(radius) * 100 : 50 * 100,
      organization_name
    }

    return await api_client.post('/organizations/search/address/', payload)
      .then(({ data }) => setOrganizations(data))
      .catch(console.error)
      .finally(() => setIsLoaded(true))
  }

  async function getOrganizationsByCategory(search) {
    setIsLoaded(false)
    try {
      const { data: category_res } = await api_client.get(`/categories/${category_slug}/`)
      setCategory(category_res)

      let method = search ? 'post' : 'get'
      let url = search ? `/categories/${category_slug}/search/organizations/` : `/categories/${category_slug}/organizations`
      let payload = search ? { name: search } : null

      const { data: organization_res } = await api_client[method](url, payload)
      setOrganizations(organization_res)

    } catch (error) {
      console.error(error)
    } finally {
      setIsLoaded(true)
      setLoadedCategory(true)
    }
  }

  return (
    <div className="flex w-full pb-20 min-h-screen h-fit flex-col overflow-hidden">
      <Header subtitle={category?.name} />
      <Banner is_loaded={is_loaded_category} title={category?.name} link_to='/categorias' />
      <div className='w-full h-full flex flex-col items-center md:gap-8 sm:gap-2 px-2'>
        <div className='md:w-[80vw] sm:w-full my-6'>
          <SearchByAddress
            placeholder="Busca em cidade, estado"
            category_slug={{ category_slug: category?.slug }}
            get_options_endpoint="/organizations/autocomplete/address/"
            setSelectedAddress={setSearchAddress}
            selected_address={search_address}
            setIsLoaded={setIsLoaded}
            setRadius={setRadius}
            radius={radius}
          />
        </div>
        <div className='flex items-center md:flex-row sm:flex-col sm:gap-4 justify-center mb-4 md:w-[80vw] sm:w-full relative'>
          <div className='flex md:flex-row sm:flex-col w-full gap-2 items-center justify-between'>
            <p className='md:text-5xl sm:text-3xl font-semibold whitespace-nowrap'>
              {category?.name}
            </p>
            <div className='flex sm:flex-col sm:w-full md:w-auto self-center sm:justify-start md:justify-end md:flex-row '>
              <SearchBar
                value={search}
                onChange={setSearch}
                placeholder='Buscar por nome'
                className="sm:w-full mx-0 md:w-[500px]"
              />
            </div>
            <PaginationBox
              paginated_value={organizations}
              set_paginated_value={setOrganizations}
              current_page={organizations?.current_page}
              total_pages={organizations?.total_pages}
              className="self-center"
            />
          </div>
        </div>
        <div className='flex flex-wrap items-center justify-center md:flex-row sm:flex-col sm:gap-3 md:gap-4 pb-20 w-full'>
          {is_loaded ?
            organizations?.results?.map(organization => <OrganizationBox key={organization.id} organization={organization} />)
            :
            Array.from(Array(6))?.map((_, index) =>
              <Skeleton key={index} className="md:!w-fit sm:!w-full">
                <OrganizationBox />
              </Skeleton>
            )}
          <div className='w-full mt-10'>
            <PaginationBox
              paginated_value={organizations}
              set_paginated_value={setOrganizations}
              current_page={organizations?.current_page}
              total_pages={organizations?.total_pages}
              className="md:absolute sm:static right-[100px]"
            />
          </div>
        </div>
        {(!organizations?.results?.length && is_loaded) ?
          <p className='text-4xl text-center font-semibold self-center text-typography-primary/80'>
            Nenhuma organização encontrada
          </p>
          : null
        }
      </div>
    </div>
  )
}
