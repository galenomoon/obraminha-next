import React from 'react'

//components
import Button from '@/components/Button'
import Input from '@/components/Input'

//assets
import send_proposal from '../../assets/send_proposal.svg'

//deeps
import api_client from '@/config/api_client'
import { toast } from 'react-hot-toast'
import Image from 'next/image'

export default function ProposalForm({ property, setSendProposal }) {
  const [is_loaded, setIsLoaded] = React.useState(true)
  const [proposal, setProposal] = React.useState({
    contact_email: '',
    contact_cellphone: '',
    offer_value: '',
  })

  async function handleSubmit(e) {
    e?.preventDefault()

    const offer_value = parseInt(proposal?.offer_value?.replace(/[^0-9]/g, '')?.replace('R$', '')?.replace('.', ''))

    if (offer_value === 0) {
      toast.error("Informe um valor válido para a proposta")
      return
    }

    let payload = {
      ...proposal,
      offer_value,
    }

    setIsLoaded(false)
    setSendProposal({ is_loaded: false, status: 'loading' })
    return api_client.post(`/properties/${property?.id}/create_new_proposal/`, payload)
      .then(() => {
        toast.success('Proposta enviada com sucesso!')
        setSendProposal({ is_loaded: true, status: 'success' })
      })
      .catch(error => {
        console.error(error)
        setSendProposal({ is_loaded: true, status: 'error' })
        toast.error('Erro ao enviar proposta')
      })
      .finally(() => setIsLoaded(true))
  }

  return (
    <section className='flex flex-col w-fit gap-6 justify-between'>
      <div className='flex flex-col justify-center items-center'>
        <Image src={send_proposal} alt='send email' className='w-1/2' />
        <div className='flex flex-col items-center justify-center'>
          <h1 className='text-3xl font-semibold'>
            Mande sua proposta
          </h1>
          <p className='text-lg text-typography-light dark:text-typography-light'>
            Em breve entraremos em contato.
          </p>
        </div>
      </div>
      <section className='flex items-center gap-3 px-2'>
        <div className='bg-typography-light/40 dark:bg-dark-typography-light/40 h-[1px] w-full' />
        <p className='font-semibold text-md text-typography-light dark:text-dark-typography-light whitespace-nowrap'>
          dados da proposta
        </p>
        <div className='bg-typography-light/40 dark:bg-dark-typography-light/40 h-[1px] w-full' />
      </section>
      <form onSubmit={handleSubmit} className='flex flex-col items-center gap-3 w-full px-10'>
        <Input
          value={proposal?.offer_value}
          onChange={text => setProposal({ ...proposal, offer_value: text === "R$ " ? "" : `R$ ${text.replace(/[^0-9]/g, '').replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')}` })}
          icon=''
          required
          placeholder='Valor proposto'
          label='Valor proposto'
          className='w-full'
        />
        <Input
          value={proposal?.contact_cellphone}
          onChange={text => setProposal({ ...proposal, contact_cellphone: text.replace(/[^0-9]/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2') })}
          icon=''
          required
          maxLength={15}
          placeholder='Telefone para contato'
          label='Telefone para contato'
          className='w-full'
          type='tel'
        />
        <Input
          value={proposal?.contact_email}
          onChange={text => setProposal({ ...proposal, contact_email: text })}
          icon=''
          required
          placeholder='Email para contato'
          label='Email para contato'
          className='w-full'
          type='email'
        />
        <Button disabled={!is_loaded} className='!w-full mt-5'>
          Enviar
        </Button>
      </form>
    </section>
  )
}
