import React from 'react'
import AddressForm from '@/components/AddressForm/index';

export default function ThirdStep({ organization, setOrganization}) {
  return (
    <div className='md:mb-5 sm:mb-0'>
      <AddressForm
        address_values={organization?.address}
        setAddressValues={address => setOrganization({ ...organization, address })}
       />
    </div>
  )
}