import React, { useEffect } from 'react'

// components
import ProposalItem from '@/components/ProposalItem'
import EmptyState from '@/components/EmptyState'
import Skeleton from '@/components/Skeleton/index';
import PaginationBox from '@/components/PaginationBox'

// deeps
import api_client from '@/config/api_client'

export default function ProposalListSection({ property, proposal_id }) {
  const [proposals, setProposals] = React.useState([])
  const [selected_proposal, setSelectedProposal] = React.useState(null)
  const [is_loaded, setIsLoaded] = React.useState(false)

  useEffect(() => {
    getProposals()
  }, [property])

  useEffect(() => {
    if (proposal_id && proposals?.results?.length > 0) {
      setSelectedProposal(proposals?.results?.find(proposal => proposal?.id === parseInt(proposal_id)))
    }
  }, [proposal_id, proposals])

  async function getProposals() {
    setIsLoaded(false)
    await api_client.get('/admin/properties/' + property?.id + '/proposals/')
      .then(({ data }) => setProposals(data))
      .catch(console.error)
      .finally(() => setIsLoaded(true))
  }

  return (
    <section className='sm:w-[90vw] md:w-[70vw] h-full flex flex-col'>
      <div className='flex flex-col items-center justify-center'>
        <p className='text-3xl font-semibold'>
          Propostas
        </p>
        <p className='text-md text-typography-light dark:text-typography-light'>
          Aqui você pode ver as propostas de seu terreno
        </p>
        <p className='text-lg sm:w-[80%] md:w-[50%] truncate font-bold italic text-typography-light dark:text-typography-light'>
          {property?.title}
        </p>
      </div>
      <section className='flex flex-col h-[100%] mt-4 gap-4'>
        <div className='flex gap-3 sm:flex-col md:flex-row items-center justify-between'>
          <h1 className='md:text-3xl sm:text-3xl font-semibold text-center ms:p-0 sm:px-3'>
            Suas propostas
          </h1>
          <PaginationBox
            className='rounded-full pr-3'
            paginated_value={proposals}
            set_paginated_value={setProposals}
            total_pages={proposals.total_pages}
            current_page={proposals?.current_page}
          />
        </div>
        <div className='flex items-center gap-3 flex-col w-full h-[55vh] p-3 rounded-3xl overflow-x-hidden overflow-y-scroll dark:border-dark-typography-light/20 border-[2px] dark:bg-dark-background-base bg-background-base'>
          {is_loaded ?
            proposals?.results?.length ?
              proposals.results.map((proposal) => <ProposalItem is_selected={selected_proposal?.id === proposal?.id} proposal={proposal} key={proposal?.id} />)
              :
              <EmptyState
                imageClassName='!h-[164px]'
                className='!gap-3'
                title='Esse terreno não possui propostas'
                description='Quando alguém enviar uma proposta, você poderá ver aqui'
              />
            :
            Array(9).fill(0).map((_, idx) =>
              <Skeleton key={idx} className="!w-full">
                <ProposalItem />
              </Skeleton>
            )}
        </div>
      </section>
    </section>
  )
}
