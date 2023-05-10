import React from 'react'

//components
import BudgetsList from '@/components/BudgetsList';
import ReviewsList from '@/components/ReviewsList';
import QuestionsList from '@/components/QuestionsList/index';
import TitleAndSubtitle from '@/components/TitleAndSubtitle';

//deeps
import { useRouter } from 'next/router';
import api_client from '@/config/api_client';

export default function OrganizationInteractions({ organization }) {
  const { query } = useRouter()
  const comment_id = query?.comment_id
  const [tab, setTab] = React.useState(comment_id ? "perguntas" : "orçamentos")
  const [questions, setQuestions] = React.useState([])
  const [is_loaded, setIsLoaded] = React.useState(false)
  const [reviews, setReviews] = React.useState([])
  const [budgets, setBudgets] = React.useState([])

  React.useEffect(() => {
    fetchAll()
  }, [organization])


  async function fetchAll() {
    try {
      await getQuestions()
      await getReviews()
      await getBudgets()
    } finally {
      setIsLoaded(true)
    }
  }

  async function getQuestions() {
    if (!organization?.slug) return

    return await api_client.get(`/organizations/${organization.slug}/comments/`)
      .then(({ data }) => setQuestions(data))
      .catch(console.error)
  }

  async function getReviews() {
    if (!organization?.slug) return

    return await api_client.get(`/organizations/${organization.slug}/informations/`)
      .then(({ data }) => setReviews(data?.reviews_informations?.reviews))
      .catch(console.error)
  }

  async function getBudgets() {
    if (!organization?.slug) return

    return await api_client.get(`/admin/organizations/${organization.slug}/budgets/`)
      .then(({ data }) => setBudgets(data))
      .catch(console.error)
  }

  return (
    <div className='md:w-[70vw] sm:w-full sm:h-[90vh] md:h-[80vh] flex flex-col items-center'>
      <TitleAndSubtitle title='Interações' subtitle='Veja as interações da sua empresa' />
      <div className='flex items-center md:justify-center sm:justify-around font-light w-full'>
        <button onClick={() => setTab('orçamentos')} className={`${tab === 'orçamentos' ? 'border-background-secondary' : 'text-typography-light dark:text-dark-typography-light border-transparent'} border-b-[4px] flex items-center justify-center py-3 sm:w-fit sm:px-2 md:w-[150px] uppercase`}>
          Orçamentos
        </button>
        <button onClick={() => setTab('perguntas')} className={`${tab === 'perguntas' ? 'border-background-secondary' : 'text-typography-light dark:text-dark-typography-light border-transparent'} border-b-[4px] flex items-center justify-center py-3 sm:w-fit sm:px-2 md:w-[150px] uppercase`}>
          Perguntas
        </button>
        <button onClick={() => setTab('avaliações')} className={`${tab === 'avaliações' ? 'border-background-secondary' : 'text-typography-light dark:text-dark-typography-light border-transparent'} border-b-[4px] flex items-center justify-center py-3 sm:w-fit sm:px-2 md:w-[150px] uppercase`}>
          Avaliações
        </button>
      </div>
      <div className='overflow-y-auto h-full w-full flex flex-col'>
        {tab === 'orçamentos' ? <BudgetsList organization_slug={organization?.slug} is_loaded={is_loaded} budgets={budgets} setBudgets={setBudgets} /> : null}
        {tab === 'perguntas' ? <QuestionsList show_title={false} organization={organization} getQuestions={getQuestions} questions={questions} /> : null}
        {tab === 'avaliações' ? <ReviewsList reviews={reviews} setReviews={setReviews} className='px-3' /> : null}
      </div>
    </div>
  )
}
