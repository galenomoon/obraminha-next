import React, { useState, useEffect, useContext } from 'react'

//components
import Input from '@/components/Input';
import Button from '@/components/Button';
import Rating from '@/components/Rating/index';
import EmptyState from '@/components/EmptyState';
import ReviewsList from '@/components/ReviewsList';

//styles
import { toast } from 'react-hot-toast';

//deeps
import api_client from '../../config/api_client';

//context
import { AppContext } from '@/pages/_app';

export default function OrganizationReviews({ organization }) {
  const [review, setReview] = useState('');
  const { setLoginModal, current_user } = useContext(AppContext)
  const [reviews, setReviews] = useState([]);
  const [isOrganizationOwner, setIsOrganizationOwner] = useState(false)
  const [rate, setRate] = useState(0);

  useEffect(() => {
    getReviews()
  }, [organization])

  useEffect(() => {
    setIsOrganizationOwner(organization?.user_owner_id === current_user?.id)
  }, [current_user, organization])

  useEffect(() => {
    if (!review?.length) {
      setRate(0)
    }
  }, [review])

  async function getReviews() {
    if (!organization?.slug) return

    return await api_client.get(`/organizations/${organization?.slug}/informations/`)
      .then(({ data }) => setReviews(data?.reviews_informations?.reviews))
      .catch(console.error)
  }

  async function handleSubmit(e) {
    e.preventDefault();

    if (!current_user) {
      return setLoginModal(true)
    }

    return await api_client.post(`/reviews/`, { comment: review, organization_id: organization.id, stars: rate })
      .then(() => {
        toast.success('Avaliação enviada com sucesso!')
        setReview('')
        getReviews()
      })
      .catch(console.error)
  }

  return (
    <div className='flex flex-col w-full h-full sm:px-4 md:px-24 justify-center gap-[18px]'>
      {!isOrganizationOwner ?
        <>
          <p className='md:text-2xl sm:text-xl font-semibold md:text-start sm:text-center'>
            Faça uma avaliação para {organization?.name}
          </p>
          <form onSubmit={handleSubmit} className='flex md:flex-row sm:flex-col gap-[18px] justify-center w-full'>
            <Input
              value={review}
              onChange={setReview}
              required
              type='textarea'
              placeholder='Digite sua avaliação...'
              className='w-full bg-background-optional'
            />
            <div className='flex flex-col items-center justify-center gap-3'>
              <div className='flex flex-col items-center rounded-xl dark:bg-dark-background-light/20 bg-background-light  w-full py-2'>
                <p className='text-typography-light font-light text-xl'>
                  {rate === 0 ? 'Deixe sua avaliação' : `${rate} Estrela${rate !== 1 ? "s" : ""}`}
                </p>
                <Rating
                  input_mode
                  value={rate}
                  disabled={!review?.length}
                  size={24}
                  setValue={(star) => setRate(star)}
                />
              </div>
              <Button disabled={rate === 0} type='submit' className='md:w-[225px] sm:w-full h-fit'>
                AVALIAR
              </Button>
            </div>
          </form>
        </>
        : null
      }
      {reviews?.length ?
        <ReviewsList reviews={reviews} setReviews={setReviews} /> :
        <EmptyState title='Nenhuma avaliação feita' description='Seja o primeiro a fazer uma avaliação' />
      }
    </div>
  )
}
