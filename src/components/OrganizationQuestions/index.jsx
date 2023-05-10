import React, { useState, useEffect, useContext } from 'react'

//components
import Input from '../Input';
import Button from '../Button';
import QuestionsList from '../QuestionsList';

//styles
import { toast } from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';

//deeps
import api_client from '../../config/api_client';

//context
import { AppContext } from '@/pages/_app';

export default function OrganizationQuestions({ organization }) {
  const [question, setQuestion] = useState('');
  const { setLoginModal, current_user } = useContext(AppContext)
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOrganizationOwner, setIsOrganizationOwner] = useState(false)

  useEffect(() => {
    getQuestions()
  }, [organization])

  useEffect(() => {
    setIsOrganizationOwner(organization?.user_owner_id === current_user?.id)
  }, [current_user, organization])

  async function getQuestions() {
    if (!organization?.slug) return
    
    return await api_client.get(`/organizations/${organization.slug}/comments/`)
      .then(({ data }) => setQuestions(data))
      .catch(console.error)
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!current_user) {
      setLoginModal(true)
      return
    }

    setLoading(true)
    return await api_client.post(`/comments/new/`, { content: question, organization_id: organization.id, user_id: current_user.id })
      .then(() => {
        toast.success('Pergunta enviada com sucesso!')
        setQuestion('')
        getQuestions()
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }

  return (
    <div className='flex flex-col w-full h-full sm:px-4 md:px-24 justify-center gap-[18px]'>
      {!isOrganizationOwner ?
        <>
          <p className='md:text-2xl sm:text-xl font-semibold md:text-start sm:text-center'>
            Faça um pergunta para {organization?.name}
          </p>
          <form onSubmit={handleSubmit} className='flex md:flex-row sm:flex-col gap-[18px] justify-center w-full'>
            <Input
              value={question}
              onChange={setQuestion}
              required
              type='textarea'
              placeholder='Digite sua pergunta...'
              className='w-full bg-background-optional'
            />
            <div className='flex flex-col gap-3'>
              <Button disabled={!question?.length || loading} type='submit' className='md:w-[225px] sm:w-full h-fit'>
                {loading ? <CgSpinner size={26} className="animate-spin" /> : "ENVIAR PERGUNTA"}
              </Button>
            </div>
          </form>
        </>
        : null}
      <QuestionsList questions={questions} organization={organization} getQuestions={getQuestions} />
    </div>
  )
}
