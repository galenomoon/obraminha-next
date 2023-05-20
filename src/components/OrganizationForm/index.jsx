import React, { useContext } from 'react'

//components
import FirstStep from './Steps/FirstStep';
import SecondStep from './Steps/SecondStep';
import ThirdStep from './Steps/ThirdStep';
import Button from '@/components/Button';

//styles
import { CgSpinner } from 'react-icons/cg';
import { toast } from 'react-hot-toast';

//context
import { AppContext } from '@/pages/_app';

//deeps
import api_client from '@/config/api_client';

export default function OrganizationForm({ organization_to_update, close = () => { }, getOrganizations }) {
  const [is_loaded, setIsLoaded] = React.useState(true)
  const image = organization_to_update?.profile_image?.image || null
  const { current_user } = useContext(AppContext)
  const current_user_id = current_user?.id
  const [files, setFiles] = React.useState({ profile_image: (typeof image === 'object' && image !== null) ? URL.createObjectURL(image) : (image || null), images: organization_to_update?.work_images })
  const [images_to_delete, setImagesToDelete] = React.useState([])
  const [step, setStep] = React.useState(1)
  const [categories, setCategories] = React.useState([])
  const [profile_pic_error, setProfilePicError] = React.useState(false)
  const [organization, setOrganization] = React.useState(organization_to_update ?
    { ...organization_to_update, categories: organization_to_update?.categories?.map(c => c.id) }
    :
    {
      name: '',
      description: '',
      user_owner_id: current_user_id,
      email: '',
      site_url: '',
      cellphone: '',
      youtube_apresentation_video_url: '',
      categories: []
    })

  React.useEffect(() => {
    getCategories()
  }, [])

  React.useEffect(() => {
    getOrganizationAddress()
  }, [organization_to_update?.slug])

  React.useEffect(() => {
    setProfilePicError(false)
  }, [files?.profile_image])

  async function getOrganizationAddress() {
    if (!organization_to_update?.slug) return
    return await api_client.get(`/organizations/${organization_to_update?.slug}/address/`)
      .then(({ data }) => {
        setOrganization({ ...organization, address: data })
      })
      .catch(console.error)
  }

  async function getCategories() {
    return await api_client.get('/categories/')
      .then(({ data }) => setCategories(data))
      .catch(console.error)
  }

  async function handleSubmit(e) {
    e?.preventDefault()

    if (!is_loaded) return

    if (!files?.profile_image) {
      setProfilePicError(true)
      return
    }

    if (step === 2 && organization?.categories?.length === 0) {
      toast.error('Selecione pelo menos uma categoria')
      return
    }

    if (step !== 3) {
      setStep(step + 1)
      return
    }

    if (step < 1) {
      setStep(1)
      return
    }

    setIsLoaded(false)

    let method = organization_to_update ? 'patch' : 'post'
    let route = organization_to_update ? `/organizations/${organization_to_update?.slug}/` : '/organizations/'

    return await api_client[method](route, { ...organization, categories_id: organization?.categories })
      .then(async ({ data }) => {

        try {
          if (files?.profile_image?.name) {
            const formData = new FormData()
            formData.append('image', files?.profile_image)
            await api_client.post(`/organizations/${data?.slug}/images/profile/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
              .catch(console.error)
          }

          if (organization_to_update) {
            if (images_to_delete?.length) {
              for (const image of images_to_delete) {
                await api_client.delete(`/organizations/${data?.slug}/images/delete/${image.id}`)
                  .catch(console.error)
              }
            }
          }

          let route_method = organization_to_update?.id ? 'update' : 'create'
          let method = organization_to_update?.id ? 'patch' : 'post'
          await api_client[method](`/organizations/${data?.slug}/address/${route_method}/`, { ...organization?.address })
            .catch(error => {
              console.error(error)
              toast.error(`Não foi possível ${organization_to_update ? "atualizar" : "criar"} o endereço da organização`)
            })

          if (files?.images?.map(image => !image.id).includes(true)) {
            for await (const file of files?.images?.filter(image => !image.id)) {
              const formData = new FormData();
              formData.append('image', file?.image || file);
              await api_client.post(`/organizations/${data?.slug}/images/works/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } })
            }
          }

        } catch (error) {
          console.error(error)
        } finally {
          getOrganizations()
          toast.success(`Organização ${organization_to_update ? "atualizada" : "criada"} com sucesso`)
          close()
        }
      })
      .catch((err) => {
        console.error(err)
        return toast.error(`Não foi possível ${organization_to_update ? "atualizar" : "criar"} a organização`)
      })
      .finally(() => setIsLoaded(true))
  }

  function handleStep(step) {
    const CurrentStep = step === 1 ? FirstStep : (step === 2 ? SecondStep : ThirdStep)
    return (
      <CurrentStep
        setImagesToDelete={setImagesToDelete}
        profile_pic_error={profile_pic_error}
        images_to_delete={images_to_delete}
        is_update={organization_to_update}
        setOrganization={setOrganization}
        organization={organization}
        categories={categories}
        setFiles={setFiles}
        files={files}
      />
    )
  }

  return (
    <section className='flex flex-col sm:w-full md:w-fit gap-3 justify-between md:overflow-visible sm:overflow-auto scrollbar-hide md:p-0 sm:py-5'>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col items-center justify-center'>
          <p className='text-3xl font-semibold'>
            {organization_to_update ? "Atualizar Organização" : "Nova Organização"}
          </p>
          <p className='text-md text-typography-light dark:text-typography-light'>
            {organization_to_update ? "Atualize os dados da organização" : "Preencha os dados abaixo para criar uma nova organização"}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col items-center gap-2 w-full md:px-10'>
        <div className='flex items-center justify-center'>
          <div className={`duration-150 rounded-full bg-typography-primary ${step === 1 ? "w-3.5 h-3.5" : 'w-2.5 h-2.5'}`} />
          <div className={`w-[18px] h-[3px] ${step > 1 ? "bg-typography-primary" : ' bg-typography-base/40 dark:bg-dark-typography-base/40'}`} />
          <div className={`duration-150 rounded-full ${step > 1 ? "bg-typography-primary w-3.5 h-3.5" : 'w-2.5 h-2.5 bg-typography-base/40 dark:bg-dark-typography-base/40'}`} />
          <div className={`w-[18px] h-[3px] ${step > 2 ? "bg-typography-primary" : ' bg-typography-base/40 dark:bg-dark-typography-base/40'}`} />
          <div className={`duration-150 rounded-full ${step > 2 ? "bg-typography-primary w-3.5 h-3.5" : 'w-2.5 h-2.5 bg-typography-base/40 dark:bg-dark-typography-base/40'}`} />
        </div>
        <div className='md:w-[750px] '>
          {handleStep(step)}
        </div>
        <div className='flex md:flex-row sm:flex-col items-center justify-center sm:gap-0 md:gap-4 sm:w-full md:w-[80%]'>
          <Button disabled={!is_loaded} className={step === 1 ? "hidden" : 'sm:!w-full md:!w-[80%] mt-4'} onClick={() => setStep(step - 1)} type='button'>
            Voltar
          </Button>
          <Button disabled={!is_loaded} className='sm:!w-full md:!w-[80%] mt-4 whitespace-nowrap'>
            {is_loaded ? (step === 3 ? "Salvar" : "Próxima etapa") : <CgSpinner size={25} className='animate-spin' />}
          </Button>
        </div>
      </form>
    </section>
  )
}
