import React, { useContext } from 'react'

//deeps
import api_client from '@/config/api_client';
import { useRouter } from 'next/router'

//components
import Modal from '@/components/Modal';
import Alert from '@/components/Alert';
import Header from '@/components/Header';
import Slides from '@/components/Slides';
import Button from '@/components/Button';
import NotFound from '@/components/NotFound';
import GoogleMaps from '@/components/GoogleMaps';
import ProposalForm from '@/components/ProposalForm';
import Skeleton, { SkeletonText } from '@/components/Skeleton/index';

//assets
import not_found from '../../../assets/not_found.svg'

//styles
import moment from 'moment';
import { toast } from 'react-hot-toast';
import { MdArrowBackIos, MdArrowForwardIos, MdOpenInNew } from 'react-icons/md'

//helpers
import currencyFormatter from '../../../helpers/currencyFormatter';

//context
import { AppContext } from '../../_app';
import Image from 'next/image';

export default function Property() {
  const { query } = useRouter()
  const property_id = query?.property_id
  const { setLoginModal, current_user } = useContext(AppContext)
  const current_user_id = current_user?.id
  const [is_not_found, setIsNotFound] = React.useState(false)
  const [is_modal_opened, setIsModalOpened] = React.useState(false)
  const [is_slide_opened, setIsSlideOpened] = React.useState(false)
  const [is_alert_opened, setIsAlertOpened] = React.useState(false)
  const [send_proposal, setSendProposal] = React.useState({ is_loaded: true, status: '' })
  const [property, setProperty] = React.useState({})
  const [image_index, setImageIndex] = React.useState(0)
  const [is_loaded, setIsLoaded] = React.useState(false)

  React.useEffect(() => {
    getProperty(property_id)
  }, [property_id])

  React.useEffect(() => {
    if (!send_proposal.is_loaded) {
      setIsAlertOpened(true)
    }
  }, [send_proposal])

  React.useEffect(() => {
    if (!is_alert_opened) {
      setSendProposal({ is_loaded: true, status: '' })
    }
  }, [is_alert_opened])

  async function getProperty(property_id) {
    if (!property_id) return
    try {
      const { data: $property } = await api_client.get(`/properties/${property_id}/`)
      const { data: address } = await api_client.get(`/addresses/${$property?.address_id}/`)
      setProperty({ ...$property, address })
    } catch (error) {
      console.error(error)
      setIsNotFound(true)
    } finally {
      setIsLoaded(true)
    }
  }

  function handleProposalModal() {
    if (current_user_id) {
      if (current_user_id === property?.owner?.id) {
        return toast('Você não pode enviar uma proposta para o seu próprio terreno', { icon: '🔒' })
      }
      setIsModalOpened(true)
    } else {
      setLoginModal(true)
    }
  }

  return (
    is_not_found ? <NotFound title="Terreno não encontrado" subtitle="O terreno que você está procurando não existe ou foi removidao." /> :
      <>
        <Header subtitle={property?.title} />
        <div className="flex min-h-screen self-center items-center md:px-10 sm:px-0 sm:w-full py-10 gap-8 h-fit flex-col overflow-hidden">
          <section className='flex md:flex-row sm:flex-col w-full sm:max-w-auto md:max-w-[1300px] gap-5 shadow-[0_0px_34px_0px_rgba(25,25,25,0.088)] sm:py-4 md:p-10 bg-background-neutral dark:bg-dark-background-neutral sm:rounded-none md:rounded-3xl'>
            <div className='w-full flex flex-col'>
              <div className='w-full flex flex-col pb-2 md:p-0 sm:px-3'>
                <Skeleton conditional={is_loaded}>
                  <p className='md:text-3xl sm:text-lg'>
                    {property?.title}
                  </p>
                </Skeleton>
                <div className='text-dark-typography-light sm:my-1 md:my-3 flex gap-1'>
                  Públicado em
                  <Skeleton conditional={is_loaded} className='!m-0'>
                    <span>
                      {moment(property?.created_at).format('L')} - {moment(property?.created_at).format('LT')}
                    </span>
                  </Skeleton>
                </div>
              </div>
              <div className='flex w-full h-[24rem] gap-2 overflow-hidden'>
                <Skeleton conditional={is_loaded}>
                  <section className='sm:w-full md:w-fit h-fit relative'>
                    <section className='sm:w-full md:w-fit flex justify-center relative'>
                      <button onClick={() => setIsSlideOpened(true)} className='bg-[#333]/70 absolute top-2 right-2 hover:opacity-80 duration-100 rounded-xl px-2 py-1 text-white flex items-center justify-center gap-2'>
                        <MdOpenInNew size={18} />
                        <p>
                          Ver em tela cheia
                        </p>
                      </button>
                      <Image
                        alt='property'
                        onError={e => e.target.src = not_found}
                        className='sm:w-full md:w-[40rem] h-[24rem] sm:rounded-none md:rounded-2xl object-cover'
                        src={property?.images?.[image_index]?.image}
                      />
                      <div className='absolute bottom-3 animate-slide-in-t h-[42px] w-[64px] bg-[#333]/60 flex items-center justify-center rounded-xl'>
                        <p className='text-white font-semibold'>
                          {image_index + 1}/{property?.images?.length}
                        </p>
                      </div>
                    </section>
                    <button onClick={() => image_index !== 0 ? setImageIndex(image_index - 1) : {}} className={image_index === 0 ? 'hidden' : 'absolute top-[45%] left-5 p-3'}>
                      <MdArrowBackIos size={42} color="#fff" className='hover:opacity-80 duration-100 hover:-translate-x-2 animate-slide-in-r' />
                    </button>
                    <button onClick={() => (image_index + 1) !== property?.images?.length ? setImageIndex(image_index + 1) : {}} className={(image_index + 1) === property?.images?.length ? 'hidden' : 'absolute top-[45%] right-5 p-3'}>
                      <MdArrowForwardIos size={42} color="#fff" className='hover:opacity-80 duration-100 hover:translate-x-2 animate-slide-in-l' />
                    </button>
                  </section>
                </Skeleton>
                {property?.images?.length > 1 && <section className='md:flex sm:hidden flex-col gap-2 overflow-y-scroll scrollbar-hide '>
                  <div className='md:flex flex-col h-fit gap-2 sm:hidden'>
                    {
                      is_loaded ?
                        property?.images?.map((image, index) => (
                          <Image
                            onError={e => e.target.src = not_found}
                            key={index}
                            alt='property'
                            src={image?.image}
                            className={`${index === image_index ? "" : "opacity-80"} animate-slide-in-b hover:opacity-100 duration-100 w-[82px] cursor-pointer h-[82px] rounded-2xl object-cover`}
                            onClick={() => setImageIndex(index)}
                          />
                        ))
                        :
                        Array(5).fill(0).map((_, index) =>
                          <Skeleton key={index}>
                            <div className="animate-slide-in-b hover:opacity-100 duration-100 w-[82px] cursor-pointer h-[82px] rounded-2xl object-cover" />
                          </Skeleton>
                        )
                    }
                  </div>
                </section>}
              </div>
            </div>
            <div className='flex flex-col items-center sm:w-full md:p-0 sm:px-2 md:w-[50%]'>
              <section className='rounded-2xl w-full py-6 gap-6 overflow-hidden h-full flex flex-col items-center bg-background-optional dark:bg-dark-background-light'>
                <div className='flex items-center justify-center py-3 w-full rounded-lg bg-background-'>
                  <Skeleton conditional={is_loaded}>
                    <p className='text-4xl font-light'>
                      {currencyFormatter(property?.price)}
                    </p>
                  </Skeleton>
                </div>
                <div className='w-full h-full relative gap-3 flex flex-col bg-background-neutral/60 dark:bg-dark-background-neutral/60 p-3'>
                  <p className='text-lg font-semibold'>
                    Descrição:
                  </p>
                  <div className='flex flex-col w-full h-[200px] overflow-x-hidden overflow-y-auto text-typography-light dark:text-dark-typography-light'>
                    <SkeletonText conditional={is_loaded} rows={4}>
                      {property?.description}
                    </SkeletonText>
                  </div>
                </div>
                <div className='px-6 w-full'>
                  <Button onClick={() => handleProposalModal()} className='!w-full'>
                    FAZER PROPOSTA
                  </Button>
                </div>
              </section>
            </div>
          </section>
          <section className='flex md:flex-row sm:flex-col w-full sm:max-w-auto md:max-w-[1300px] gap-5 shadow-[0_0px_34px_0px_rgba(25,25,25,0.088)] sm:py-4 md:p-10 bg-background-neutral dark:bg-dark-background-neutral sm:rounded-none md:rounded-3xl'>
            <div className='w-full h-full relative gap-3 flex flex-col bg-background-neutral/60 dark:bg-dark-background-neutral/60 p-3'>
              <p className='text-lg font-semibold'>
                Descrição:
              </p>
              <div className='flex flex-col w-full h-[200px] overflow-x-hidden overflow-y-auto text-typography-light dark:text-dark-typography-light'>
                <SkeletonText conditional={is_loaded} rows={4}>
                  {property?.description}
                </SkeletonText>
              </div>
            </div>
            <div className='flex flex-col w-full text-center sm:gap-1 md:gap-3 items-center justify-self-center'>
              <p className='sm:text-sm md:text-xl font-light text-typography-light dark:text-dark-typography-light'>
                {property?.address?.city} | {property?.address?.street}, {property?.address?.number} - {property?.address?.state}
              </p>
              <div className='flex flex-col rounded-3xl bg-background-optional dark:bg-dark-background-base border-typography-light/40 dark:border-dark-background-light border-[3px] w-full max-w-[650px] h-[325px]'>
                <GoogleMaps organization={property} />
              </div>
            </div>
          </section>
        </div>
        <Slides
          show={is_slide_opened}
          close={() => setIsSlideOpened(false)}
          image_selected={image_index}
          images={property?.images}
        />
        <Modal show={is_modal_opened && send_proposal?.status !== 'success'} close={() => setIsModalOpened(false)}>
          <ProposalForm property={property} setSendProposal={setSendProposal} />
        </Modal>
        <Alert
          show={is_alert_opened}
          is_loaded={send_proposal?.is_loaded}
          navigate_to="/terrenos/"
          text={{ title: 'Proposta enviada com sucesso!', subtitle: 'Aguarde o retorno do proprietário.' }}
          response={send_proposal?.status}
          close={() => [setIsAlertOpened(false), setIsModalOpened(false)]}
        />
      </>
  )
}