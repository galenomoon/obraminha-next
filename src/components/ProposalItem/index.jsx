import React from 'react'

//styles
import { HiPhone } from 'react-icons/hi';
import { BsWhatsapp } from 'react-icons/bs'
import { MdOutlineAlternateEmail } from 'react-icons/md';

// helpers
import moment from 'moment';
import currencyFormatter from '../../helpers/currencyFormatter';

export default function ProposalItem({ proposal, is_selected }) {
  const proposal_ref = React.createRef()

  React.useEffect(() => {
    if (is_selected) {
      proposal_ref?.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [is_selected])

  return (
    <section ref={proposal_ref} className={`flex gap-4 sm:flex-col ${is_selected ? "border-[4px] border-typography-primary" : ""} md:flex-row relative items-center rounded-2xl sm:p-6 md:p-3 md:px-10 justify-between w-full md:h-fit bg-background-neutral dark:bg-dark-background-neutral`}>
      <div className='flex items-start flex-col md:gap-2 md:w-auto sm:w-full'>
        <p className='text-sm text-typography-light dark:text-dark-typography-light  opacity-50 bottom-3 left-10'>
          Proposta feita em:{' '}{moment(proposal?.created_at).format('L')}
        </p>
        <p className="text-3xl font-light">
          {currencyFormatter(proposal?.offer_value)}
        </p>
        <div className='flex flex-col text-start'>
          <p className='font-semibold text-sm text-typography-primary flex items-center gap-1'>
            <HiPhone size={17} className='text-typography-primary' />
            <span className='text-typography-base dark:text-dark-typography-base'>{proposal?.contact_cellphone}</span>
          </p>
          <p className='font-semibold text-sm text-typography-primary flex items-center gap-1'>
            <MdOutlineAlternateEmail size={17} className='text-typography-primary' />
            <span className='text-typography-base dark:text-dark-typography-base'>{proposal?.contact_email}</span>
          </p>
        </div>
      </div>
      <div className='flex md:w-auto sm:w-full md:flex-row sm:flex-col gap-3 items-center'>
        <a href={`https://api.whatsapp.com/send?phone=55${proposal?.contact_cellphone?.replace(/\D/g, '')}`} target='_blank' rel='noreferrer' className='md:w-auto sm:w-full flex gap-2 bg-background-secondary dark:bg-background-secondary/40 items-center justify-center hover:opacity-80 duration-150 p-3 rounded-xl'>
          <BsWhatsapp size={28} className="dark:text-typography-primary text-[#fff] font-semibold" />
          <p className="sm:block md:hidden dark:text-typography-primary text-[#fff] font-semibold">
            send a message
          </p>
        </a>
      </div>
    </section>
  )
}
