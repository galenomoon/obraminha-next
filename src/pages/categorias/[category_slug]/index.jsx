import React, { useState, useEffect } from 'react'

//deeps
import { useRouter } from 'next/router'
import api_client from '@/config/api_client';

//components
import Header from '@/components/Header';
import Skeleton from '@/components/Skeleton';
import Banner from '@/components/Banner/index';
import EmptyState from '@/components/EmptyState';
import SearchBar from '@/components/SearchBar/index';
import SearchByAddress from '@/components/SearchByAddress';
import OrganizationBox from '@/components/OrganizationBox';
import PaginationBox from '@/components/PaginationBox/index';

//assets
import searching_man from '../../../assets/searching_man.svg'

//hooks
import useDebounce from '../../../hooks/useDebounce';

export async function getStaticProps({ params }) {
  if (!params || !params.category_slug) return { props: {} }

  const { data: category } = await api_client.get(`/categories/${params.category_slug}`)

  return { props: { category } }
}

export async function getStaticPaths() {
  const { data: categories } = await api_client.get('/categories/main/') || []

  const paths = categories?.map(category => ({ params: { category_slug: category.slug } })) || []
  return { paths, fallback: false }
}

export default function Organizations({ category }) {
  const { query } = useRouter()
  const { category_slug } = query
  const [search, setSearch] = useState('');
  const [search_address, setSearchAddress] = useState('');
  const [address_on_slug, setAddressOnSlug] = useState(false);
  const [organizations, setOrganizations] = useState()
  const [is_loaded, setIsLoaded] = useState(false);
  const [radius, setRadius] = useState(null);
  const [is_loaded_category, setLoadedCategory] = useState(false);
  const debounced_query_search = useDebounce(search);
  const debounced_address_search = useDebounce(search_address);

  useEffect(() => {
    if (debounced_address_search) {
      getOrganizationByAddress(debounced_query_search)
    } else {
      getOrganizationsByQuery(debounced_query_search)
    }
  }, [debounced_address_search, debounced_query_search])

  useEffect(() => {
    const fetchOrganizations = async () => {
      const { data: organizations_results } = await api_client.get(`/categories/${category?.slug}/organizations`);
      setOrganizations(organizations_results);
    };

    if (category?.slug) {
      fetchOrganizations();
    }
  }, [category]);

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

  async function getOrganizationsByQuery(name) {

    if (!category_slug) return
    setIsLoaded(false)

    try {
      const { data } = await api_client.post(`/categories/${category_slug}/search/organizations/`, { name })
      setOrganizations(data)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoaded(true)
      setLoadedCategory(true)
    }
  }

  return (
    <div className="flex w-full pb-20 min-h-screen h-fit flex-col overflow-hidden">
      <Header
        subtitle={`${category?.name}${address_on_slug ? ` em ${address_on_slug}` : ""}`}
        description={`Encontre serviços de ${category?.name} ${address_on_slug ? `em ${address_on_slug}` : ""} próximos a você | Obraminha - Encontre os melhores prestadores de serviços para a sua obra!`}
      />
      <Banner is_loaded={is_loaded_category} title={`${category?.name}${address_on_slug ? ` em ${address_on_slug}` : ""}`} link_to='/categorias' />
      <div className='w-full h-full flex flex-col items-center md:gap-8 sm:gap-2 px-2'>
        <div className='md:w-[80vw] sm:w-full my-6'>
          <SearchByAddress
            placeholder="Busca em cidade, estado"
            category_slug={{ category_slug: category?.slug }}
            get_options_endpoint="/organizations/autocomplete/address/"
            setSelectedAddress={setSearchAddress}
            setAddressOnSlug={setAddressOnSlug}
            selected_address={search_address}
            address_on_slug={address_on_slug}
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
          <EmptyState
            image={searching_man}
            title="Nenhuma organização encontrada"
            description="Não encontramos nenhuma organização com o endereço informado. Tente novamente com outro endereço."
          />
          : null
        }
      </div>
    </div>
  )
}
