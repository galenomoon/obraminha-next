import React from 'react'
import { useRouter } from 'next/router';

//components
import Banner from '@/components/Banner'
import PropertyListSection from '@/components/PropertyListSection';

//assets
import property_manager from '../../../assets/organization-manager.svg'

export default function MyProperties() {
  const { query } = useRouter()

  return (
    <div className="flex w-full min-h-screen h-fit flex-col overflow-hidden">
      <Banner
        title="Gerencie seus terrenos"
        subtitle='Aqui você pode gerenciar seus terrenos'
        image={property_manager}
      />
      <section className='flex items-center flex-col w-full h-full sm:p-3 md:p-10'>
        <PropertyListSection property_id={query?.property_id} />
      </section>
    </div>
  )
}