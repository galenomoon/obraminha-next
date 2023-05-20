import React, { useState, useEffect } from 'react'

//deep
import { useRouter } from 'next/router'
import api_client from '@/config/api_client'

//assets
import not_found from '../../assets/not_found.svg'

//components
import Image from 'next/image'
import Banner from '@/components/Banner'
import Header from '@/components/Header'
import Skeleton from '@/components/Skeleton'
import NotFound from '@/components/NotFound'
import BudgetForm from '@/components/BudgetForm'
import OrganizationAbout from '@/components/OrganizationAbout'
import OrganizationReviews from '@/components/OrganizationReviews'
import OrganizationPictures from '@/components/OrganizationPictures'
import OrganizationQuestions from '@/components/OrganizationQuestions'
import OrganizationDetailBox from '@/components/OrganizationDetailBox'
import OrganizationTabNavigation from '@/components/OrganizationTabNavigation'

export default function Organization() {
  const { query } = useRouter()
  const tab = query?.tab || 'sobre'
  const organization_slug = query?.organization_slug
  const category_slug = query?.category_slug

  const [is_not_found, setIsNotFound] = useState(false)
  const [is_loaded, setIsLoaded] = useState(false)
  const [tab_selected, setTabSelected] = useState(tab)
  const [category, setCategory] = useState()
  const [organization, setOrganization] = useState()

  const is_about = tab_selected === 'sobre'
  const is_comments = tab_selected === 'perguntas'
  const is_reviews = tab_selected === 'avaliações'
  const is_pictures = tab_selected === 'fotos'
  const is_budget = tab_selected === 'orçamento'

  useEffect(() => {
    if (organization_slug) {
      getOrganization()
    }
  }, [organization_slug])

  useEffect(() => {
    if (category_slug) {
      getCategory()
    }
  }, [category_slug])

  useEffect(() => {
    setTabSelected(tab)
  }, [tab])

  async function getCategory() {
    if (!category_slug || category_slug === 'organizacao') return
    try {
      const { data: current_category } = await api_client.get(`/categories/${category_slug}/`)
      setCategory(current_category?.name)
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoaded(true)
    }
  }

  async function getOrganization() {
    try {
      const { data: current_organization } = await api_client.get(`/organizations/${organization_slug}/informations/`)
      setOrganization(current_organization)
    } catch (error) {
      console.error(error)
      setIsNotFound(true)
    } finally {
      setIsLoaded(true)
    }
  }

  return (
    is_not_found ? <NotFound title="Organização não encontrada" subtitle="A organização que você está procurando não existe ou foi removida." /> :
      <div className="flex w-full min-h-screen h-fit flex-col overflow-hidden gap-6 pb-10">
        <Header
          subtitle={`${organization?.name} - ${organization?.categories?.[0]?.name}`}
          description={organization?.description}
        />
        <div className='flex flex-col w-full h-fit'>
          <Banner is_loaded={is_loaded} organization={organization} category={category || organization?.categories?.[0]?.name} show_back hide_image />
          <div className='flex relative w-full sm:items-center sm:justify-center'>
            <Skeleton className="absolute md:left-16 sm:-top-[70px] sm:w-[150px] md:w-[250px] sm:h-[150px] md:h-[250px] object-cover rounded-full" conditional={is_loaded}>
              <Image
                width={250}
                height={250}
                onError={e => e.target.src = not_found}
                src={organization?.profile_image?.image}
                alt="organization"
                className='absolute md:left-16 sm:-top-[70px] sm:w-[150px] md:w-[250px] sm:h-[150px] md:h-[250px] border-[4px] object-cover rounded-full'
              />
            </Skeleton>
            <OrganizationDetailBox is_loaded={is_loaded} is_budget={is_budget} setTabSelected={(e) => setTabSelected(e.target.name)} organization={organization} />
          </div>
        </div>
        {is_budget ? null : <OrganizationTabNavigation tab={tab} organization={organization} />}
        <>
          <div className='w-full h-full flex flex-col items-center md:gap-8 sm:gap-2'>
            <p className='md:text-4xl sm:text-3xl font-semibold my-4 text-center ms:p-0 sm:px-3'>
              {is_about && "Sobre nós"}
              {is_comments && "Perguntas e Respostas"}
              {is_reviews && "Avaliações dos nossos clientes"}
              {is_pictures && "Algumas fotos dos nossos serviços"}
              {is_budget && "Faça seu Orçamento"}
            </p>
          </div>
          <div className='flex flex-col w-full max-w-[1500px] self-center h-full'>
            {is_about && <OrganizationAbout organization={organization} />}
            {is_comments && <OrganizationQuestions organization={organization} />}
            {is_reviews && <OrganizationReviews organization={organization} />}
            {is_pictures && <OrganizationPictures organization={organization} />}
            {is_budget && <BudgetForm organization_id={organization?.id} />}
          </div>
        </>
      </div>
  )
}