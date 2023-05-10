import React from 'react'
import Header from '@/components/Header';

//components
import Banner from '@/components/Banner'

//components
import OrganizationListSection from '@/components/OrganizationListSection';

//assets
import organization_manager from '../../assets/organization-manager.svg'

export default function MyOrganizations() {

  return (
    <div className="flex w-full min-h-screen h-fit flex-col overflow-hidden">
      <Header subtitle="Minha Empresa" />
      <Banner
        title="Gerencie suas empresas"
        subtitle='Aqui você pode gerenciar suas empresas'
        image={organization_manager}
      />
      <section className='flex items-center flex-col w-full h-full sm:p-3 md:p-10'>
        <OrganizationListSection />
      </section>
    </div>
  )
}