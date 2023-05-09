import React, { useContext } from 'react'

// styles
import { toast } from 'react-hot-toast';
import { CgSpinner } from 'react-icons/cg';
import { BiSubdirectoryRight } from 'react-icons/bi'

// context
import { AppContext } from '@/pages/_app';

// components
import Button from '../Button';
import Input from '../Input';

// deeps
import api_client from '../../config/api_client';

export default function Question({ question, organization, getQuestions, is_selected }) {
  const [show_input, setShowInput] = React.useState(false)
  const [answer, setAnswer] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const { current_user } = useContext(AppContext)
  const user_id = current_user?.id
  const question_ref = React.useRef(null)

  React.useEffect(() => {
    if (is_selected) {
      question_ref?.current.scrollIntoView({ behavior: 'smooth' })
    }
  }, [is_selected])

  React.useEffect(() => {
    setAnswer('')
  }, [show_input])

  async function handleSubmit() {
    if (answer.length < 1) {
      toast.error('Digite uma resposta')
      return
    }

    setLoading(true)
    return await api_client.post(`/comments/${question.id}/answer/`, { content: answer, organization_id: organization.id, user_id })
      .then(() => {
        toast.success('Resposta enviada com sucesso!')
        setAnswer('')
        setShowInput(false)
        getQuestions()
      })
      .catch(error => {
        console.error(error)
        toast.error('Erro ao enviar resposta')
      })
      .finally(() => setLoading(false))
  }

  return (
    <>
      <div ref={question_ref} className={`flex  ${is_selected ? "border-[3px] border-typography-primary rounded-lg" : "border-b-[2px] border-typography-light/20 dark:border-dark-background-light/40"}  md:flex-row sm:flex-col gap-[12px] items-center justify-between w-full px-4 py-[12px]`}>
        <section className='flex h-full flex-col w-full group'>
          <div className="flex w-full justify-between">
            <p className='text-lg font-light'>
              {question?.content}
            </p>
          </div>
          {(question?.answer) ?
            <div className='flex gap-[12px] '>
              <div className='flex flex-col items-center'>
                <BiSubdirectoryRight size={38} className='text-typography-light/50 dark:text-dark-typography-light/60' />
              </div>
              <p className='text-typography-light font-light text-md mt-2'>
                {question?.answer?.content}
              </p>
            </div>
            :
            show_input ?
              <div className='flex md:flex-row sm:flex-col gap-[12px] mt-3'>
                <Input
                  type='textarea'
                  value={answer}
                  onChange={setAnswer}
                  placeholder="Digite sua resposta"
                />
                {
                  !question?.answer ?
                    <div className='flex h-full flex-col items-center justify-between gap-2'>
                      <Button
                        className="sm:!w-full md:!w-[300px]"
                        onClick={() => handleSubmit()}
                        disabled={loading || (!answer && show_input)}
                      >
                        {loading ?
                          <CgSpinner className='animate-spin' size={24} />
                          : "Enviar"
                        }
                      </Button>
                      <button
                        onClick={() => setShowInput(!show_input)}
                        className="hover:bg-[#00000011] hover:dark:bg-[#ffffff11] duration-200 rounded-full px-5 py-3 w-full "
                      >
                        <p className=' text-typography-light dark:text-dark-typography-light font-semibold text-lg'>
                          {show_input ? "cancelar" : ""}
                        </p>
                      </button>
                    </div>
                    : null
                }
              </div>
              :
              <p className='text-typography-light/50 font-light text-lg'>
                Nenhuma resposta
              </p>
          }
        </section>
        {
          (!show_input && organization.user_owner_id === user_id) && !question?.answer ?
            <Button
              className="sm:!w-full md:!w-[300px]"
              onClick={() => setShowInput(true)}
              disabled={loading || (!answer && show_input)}
            >
              Responder
            </Button>
            : null
        }
      </div>
    </>
  )
}