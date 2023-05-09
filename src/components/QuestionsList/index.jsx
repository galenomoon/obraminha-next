import React from 'react'

//components
import Question from '../Question'
import EmptyState from '../EmptyState'

//deeps
import { useRouter } from 'next/router'

export default function QuestionsList({ show_title = true, questions = [], organization, getQuestions = () => { } }) {
  const { query: comment_id } = useRouter()

  return (
    questions?.length ?
      <>
        {show_title ?
          <p className='text-xl sm:my-[9px] md:my-[18px] font-semibold' >
            Últimas perguntas feitas
          </p>
          : null
        }
        <div className='flex flex-col w-full text-start'>
          {questions?.map((question, index) =>
            <Question
              key={index}
              is_selected={parseInt(comment_id) === question?.id}
              question={question}
              organization={organization}
              getQuestions={getQuestions}
            />
          )}
        </div>
      </> :
      <EmptyState title='Nenhuma pergunta feita' description='Seja o primeiro a fazer uma pergunta' />
  )
}