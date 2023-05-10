import React from 'react'

//deeps
import moment from 'moment'
import { useRouter } from 'next/router';
import api_client from '@/config/api_client';

//styles
import { BsFillFileEarmarkFill } from 'react-icons/bs';
import { AiOutlinePaperClip } from 'react-icons/ai';
import { IoMdArrowBack } from 'react-icons/io'
import { GoInfo } from 'react-icons/go'

//components
import Skeleton from '@/components/Skeleton/index';
import EmptyState from '@/components/EmptyState/index';
import DownloadButton from '@/components/DownloadButton';
import PaginationBox from '@/components/PaginationBox/index';

export default function BudgetsList({ budgets, setBudgets, is_loaded: is_loaded_from_parent }) {
  const { query } = useRouter()
  const budget_id = query?.budget_id
  const [selected_budget_id, setSelectedBudget] = React.useState(budget_id ? parseInt(budget_id) : null)
  const [is_loaded, setIsLoaded] = React.useState(false)
  const [show_files, setShowFiles] = React.useState(false)
  const [budget, setBudget] = React.useState(null)

  React.useEffect(() => {
    if (selected_budget_id) {
      getBudget()
    }
  }, [selected_budget_id])

  async function getBudget() {
    try {
      setIsLoaded(false)
      const { data: budget_informations } = await api_client.get(`/budgets/${selected_budget_id}/`)
      const { data: attached_files } = await api_client.get(`/budgets/${selected_budget_id}/attached_files/`)
      setBudget({ ...budget_informations, attached_files })
    } catch (error) {
      console.error(error)
    } finally {
      setIsLoaded(true)
    }
  }

  const is_image = (path) => path?.includes('.png') || path?.includes('.jpg') || path?.includes('.jpeg') || path?.includes('.svg')

  return (
    selected_budget_id ?
      <div className='flex flex-col gap-6 h-full'>
        <div className='flex items-center justify-between w-full px-2'>
          <div className='w-full flex justify-start'>
            <button onClick={() => setSelectedBudget(null)} className=''>
              <IoMdArrowBack className='text-3xl hover:opacity-80 duration-150' />
            </button>
          </div>
          <div className='w-full flex items-center justify-center'>
            <Skeleton conditional={is_loaded} >
              <p className='text-2xl font-semibold whitespace-nowrap'>
                Orçamento: <span className='font-semibold text-typography-primary dark:text-dark-typography-primary'>{budget?.id}</span>
              </p>
            </Skeleton>
          </div>
          <div className='w-full flex justify-end'>
            <Skeleton conditional={is_loaded} >
              {budget?.attached_files?.length ?
                <button onClick={() => setShowFiles(!show_files)} type="button" className='w-fit text-typography-secondary dark:text-typography-primary flex font-semibold bg-typography-primary gap-2 dark:bg-typography-primary/30 items-center justify-center hover:opacity-80 duration-150 p-3 rounded-xl'>
                  <AiOutlinePaperClip className="text-2xl" />
                  <p className='text-xl whitespace-nowrap md:block sm:hidden'>
                    {show_files ? "ocultar" : `ver anexos: ${budget?.attached_files?.length}`}
                  </p>
                </button>
                : <div className='w-12 h-12 rounded-xl' />
              }
            </Skeleton>
          </div>
        </div>
        <div className='flex gap-3 h-full md:flex-row sm:flex-col'>
          <Skeleton conditional={is_loaded} className="!w-full h-full">
            <div className='dark:bg-dark-background-light bg-background-optional rounded-2xl p-6 gap-6 text-start h-full w-full overflow-auto'>
              <p className='text-2xl font-semibold'>
                {budget?.title}
              </p>
              <p className='text-typography-light dark:text-dark-typography-light mt-2'>
                {budget?.description}
              </p>
            </div>
          </Skeleton>
          {show_files ?
            <div className='md:w-fit sm:w-full flex-shrink-0'>
              <p className='md:hidden sm:block text-2xl font-semibold'>
                Arquivos anexados: {budget?.attached_files?.length}
              </p>
              <div className='dark:bg-dark-background-light bg-background-optional rounded-2xl flex flex-col md:w-fit sm:w-full p-3 text-start sm:h-full md:overflow-visible sm:overflow-auto md:h-full'>
                <div className='flex items-center flex-col h-fit overflow-y-auto overflow-x-hidden gap-2'>
                  {budget?.attached_files?.map((file, index) =>
                    <div key={index} className='flex items-center gap-3 sm:w-full md:w-fit justify-between p-3 bg-background-light dark:bg-dark-background-base rounded-2xl'>
                      {is_image(file?.attached_file) ?
                        <img id={index} alt='file' src={file.attached_file} className='md:w-[64px] md:h-[64px] sm:w-[64px] sm:h-[64px] object-cover rounded-2xl' />
                        :
                        <div className='md:w-[64px] md:h-[64px] sm:w-[64px] sm:h-[64px] object-cover rounded-2xl flex items-center justify-center bg-background-optional dark:bg-dark-background-light/40' >
                          <BsFillFileEarmarkFill className='text-typography-light dark:text-dark-typography-light sm:text-3xl md:text-3xl' />
                        </div>
                      }
                      <DownloadButton file={file} budget_id={selected_budget_id} />
                    </div>
                  )}
                </div>
              </div>
            </div>
            : null
          }
        </div>
      </div>
      :
      <div className='h-full flex flex-col pt-3'>
        <div className='flex items-center justify-end w-full'>
          <PaginationBox
            paginated_value={budgets}
            set_paginated_value={setBudgets}
            current_page={budgets?.current_page}
            total_pages={budgets?.total_pages}
          />
        </div>
        <div className='flex items-center gap-3 flex-col w-full min-h-full max-h-hull p-3 rounded-3xl overflow-x-hidden overflow-y-scroll dark:border-dark-typography-light/20  dark:bg-dark-background-base bg-background-base'>
          {is_loaded_from_parent ? (budgets?.results?.length ?
            budgets?.results?.map(budget =>
              <div key={budget?.id} className='flex justify-between rounded-2xl overflow-hidden p-5 w-full flex-shrink-0 md:h-[100px] bg-background-neutral dark:bg-dark-background-neutral'>
                <div className='flex flex-col sm:w-[80%] h-full'>
                  <p className='text-start font-md truncate'>
                    {budget?.title}
                  </p>
                  <p className='text-start truncate text-sm text-typography-light dark:text-dark-typography-light'>
                    {budget?.description}
                  </p>
                  <p className='text-start truncate mt-1 text-xs text-typography-light dark:text-dark-typography-light'>
                    {moment(budget?.created_at).format('L')} - {moment(budget?.created_at).format('LT')}
                  </p>
                </div>
                <div className='flex items-center gap-5 flex-shrink-0'>
                  <p className='md:block sm:hidden text-start truncate mt-1 text-typography-light dark:text-dark-typography-light'>
                    Orçamento: <span className='font-semibold text-typography-primary dark:text-dark-typography-primary'>{budget?.id}</span>
                  </p>
                  <button onClick={() => setSelectedBudget(budget.id)} className='md:w-14 md:h-14 sm:w-full flex bg-[#038cfc] gap-2 dark:bg-[#038cfc]/40 flex-shrink-0 items-center justify-center hover:opacity-80 duration-150 p-3 rounded-xl'>
                    <GoInfo size={28} className="dark:text-[#038cfc] text-[#fff] font-semibold" />
                  </button>
                </div>
              </div>
            )
            :
            <EmptyState
              title='Nenhum orçamento encontrado'
              description='Não foi encontrado nenhum orçamento, tente novamente mais tarde'
            />
          ) : <Skeleton length={6} className='!w-full flex-shrink-0 !h-[100px]' />
          }
        </div>
      </div>
  )
}