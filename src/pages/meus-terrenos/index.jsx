import React from 'react'

//components
import Banner from '@/components/Banner'
import Header from '@/components/Header';
import PropertyListSection from '@/components/PropertyListSection';

//assets
import property_manager from '@/assets/organization-manager.svg'

export default function MyProperties() {

  return (
    <div className="flex w-full min-h-screen h-fit flex-col overflow-hidden">
      <Header subtitle="Meus Terrenos" />
      <Banner
        title="Gerencie seus terrenos"
        subtitle='Aqui você pode gerenciar seus terrenos'
        image={property_manager}
      />
      <section className='flex items-center flex-col w-full h-full sm:p-3 md:p-10'>
        <PropertyListSection />
      </section>
    </div>
  )
}