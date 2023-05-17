import React, { useContext } from 'react'

//components
import Input from '@/components/Input'
import Button from '@/components/Button'
import SeparatorLabel from '@/components/SeparatorLabel'
import AddressForm from '@/components/AddressForm/index';

//deeps
import api_client from '@/config/api_client'

//styles
import { toast } from 'react-hot-toast'
import { MdClose } from 'react-icons/md'
import { HiPlusSm } from 'react-icons/hi'
import { CgSpinner } from 'react-icons/cg';

//context
import { AppContext } from '@/pages/_app';

//helpers
import { numberFormatter } from '../../helpers/numberFormatter';
import Image from 'next/image';

export default function PropertyForm({ getProperties, property_to_update }) {
  const [is_loaded, setIsLoaded] = React.useState(true)
  const { current_user } = useContext(AppContext)
  const current_user_id = current_user?.id
  const [images, setImages] = React.useState(images_from_property_to_update() || [])
  const [images_to_delete, setImagesToDelete] = React.useState([])
  const [is_valid_address, setIsValidAddress] = React.useState(false)
  const input_ref = React.useRef(null)
  const [step, setStep] = React.useState(1)
  const [property, setProperty] = React.useState(property_to_update ?
    {
      ...property_to_update,
      square_meters: numberFormatter(property_to_update?.square_meters),
      price: `R$ ${numberFormatter(property_to_update?.price)}`,
    }
    :
    {
      title: '',
      description: '',
      square_meters: '',
      price: '',
      user_id: current_user_id,
    })

  React.useEffect(() => {
    getPropertyAddress()
  }, [property_to_update?.id])

  async function getPropertyAddress() {
    if (!property_to_update?.id) return
    return await api_client.get(`/properties/${property_to_update?.id}/address/`)
      .then(({ data }) => setProperty({ ...property, address: data }))
      .catch(console.error)
  }

  function images_from_property_to_update() {
    if (!property_to_update) return null
    return property_to_update?.images?.map(image => image)
  }

  async function handleSubmit(e) {
    e?.preventDefault()

    if (!images?.length) {
      toast.error('Você precisa adicionar pelo menos uma imagem')
      return
    }

    if (step === 1) {
      setStep(2)
      return
    }

    if (step === 2) {
      if (!is_valid_address) {
        return toast.error('Você precisa adicionar uma localização válida para o terreno')
      }
    }

    let method = property_to_update ? 'patch' : 'post'
    let route = property_to_update ? `/properties/${property_to_update.id}/` : '/properties/'

    let payload = {
      ...property,
      square_meters: typeof (property?.square_meters) === 'number' ? property?.square_meters : parseInt(property?.square_meters?.replace('.', '')),
      price: typeof (property?.price) === 'number' ? property?.price :
        parseInt(property?.price?.replace(/[^0-9]/g, '')?.replace('R$', '')?.replace('.', '')),
    }


    setIsLoaded(false)
    return await api_client[method](route, payload)
      .then(async ({ data }) => {

        if (property_to_update) {
          if (images_to_delete?.length) {
            for (const image of images_to_delete) {
              await api_client.delete(`/properties/${image.property_id}/delete/image/${image.id}`).catch(console.error)
            }
          }
        }

        if (images?.map(image => !image.id).includes(true)) {
          for await (const image of images?.filter(image => !image.id)) {
            const formData = new FormData();
            formData.append('image', image?.image || image);
            await api_client.post(`/properties/${data.id}/upload/image/`, formData, { headers: { 'Content-Type': 'multipart/form-data' } }).catch(console.error)
          }
        }

        let route_method = property_to_update?.id ? 'update' : 'create'
        let method = property_to_update?.id ? 'patch' : 'post'
        await api_client[method](`/properties/${data?.id}/address/${route_method}/`, { ...property?.address })
          .catch(error => {
            console.error(error)
            toast.error(`Não foi possível ${property_to_update ? "atualizar" : "criar"} o endereço do terreno`)
          })


        getProperties()
        toast.success(`Terreno ${property_to_update ? "atualizado" : "criado"} com sucesso!`)
      })
      .catch(error => {
        console.error(error)
        toast.error(`Erro ao ${property_to_update ? "atualizar" : "criar"} terreno!`)
      })
      .finally(() => {
        setIsLoaded(true)
        setImagesToDelete([])
      })
  }

  function handleSetFiles(e) {
    const image = (e.target.files[0])
    setImages([...images, image]);
  }

  function handleRemoveImage(index) {
    if (property_to_update) {
      setImagesToDelete([...images_to_delete, images[index]])
    }
    return setImages(images.filter((_, i) => i !== index))
  }

  return (
    <section className='flex flex-col w-fit gap-6 justify-between'>
      <div className='flex flex-col justify-center items-center'>
        <div className='flex flex-col items-center justify-center'>
          <p className='text-3xl font-semibold'>
            {property_to_update ? "Atualizar Terreno" : "Novo Terreno"}
          </p>
          <p className='text-md text-typography-light dark:text-typography-light'>
            {property_to_update ? "Atualize os dados do terreno" : "Preencha os dados abaixo para criar um novo terreno"}
          </p>
        </div>
      </div>
      <form onSubmit={handleSubmit} className='flex flex-col items-center gap-2 w-full px-10'>
        {step === 1 ?
          <>
            <SeparatorLabel label="principais dados" />
            <Input
              value={property?.title}
              onChange={text => setProperty({ ...property, title: text })}
              placeholder='Título'
              className='w-full'
              required
            />
            <Input
              value={property?.description}
              onChange={text => setProperty({ ...property, description: text })}
              placeholder='Descrição'
              className='w-full'
              rows={2}
              type='textarea'
              required
            />
            <div className='flex sm:flex-col md:flex-row w-full justify-between gap-2'>
              <Input
                value={property?.square_meters}
                onChange={text => setProperty({ ...property, square_meters: numberFormatter(text) })}
                placeholder='Metros quadrados'
                className='w-full'
                required
              />
              <Input
                value={property?.price}
                onChange={text => setProperty({ ...property, price: text === "R$ " ? "" : `R$ ${numberFormatter(text)}` })}
                placeholder='Valor do terreno'
                className='w-full'
                required
              />
            </div>
            <SeparatorLabel label="imagens e endereço" />
            <div className='flex flex-col gap-4 overflow-hidden w-full'>
              <div className='flex gap-3 items-center w-full justify-between'>
                <div className='flex flex-col text-start justify-center'>
                  <p className='font-semibold text-2xl'>
                    Anexar imagens
                  </p>
                  <p className='text-typography-light dark:text-dark-typography-light'>
                    Adicione imagens do terreno
                  </p>
                </div>
                <button onClick={() => input_ref?.current.click()} type='button' className='flex bg-typography-primary dark:bg-typography-primary/40 items-center w-12 h-12 hover:opacity-80 duration-150 justify-center p-2 rounded-xl'>
                  <HiPlusSm size={32} className='dark:text-typography-primary text-typography-secondary cursor-pointer' />
                </button>
              </div>
              <div className='flex flex-col'>
                <div className='overflow-x-auto flex pr-3'>
                  <div className='flex gap-2 w-fit'>
                    {images?.map((image, index) =>
                      <div key={index} className='duration-200 relative cursor-pointer md:w-[88px] group md:h-[88px] sm:w-[80px] sm:h-[80px] rounded-2xl'>
                        <Image src={image?.name ? URL.createObjectURL(image) : image?.image} alt={'property'} className='md:w-[80px] md:h-[80px] sm:w-[80px] sm:h-[80px] object-cover rounded-2xl' />
                        <div className='flex absolute top-0 flex-col items-end justify-start sm:p-1 md:p-2 w-full h-full'>
                          <MdClose title='Excluir Arquivo' onClick={() => handleRemoveImage(index)} className='text-white sm:text-2xl md:text-2xl hover:scale-110 duration-100 cursor-pointer' />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
                <div className='flex md:flex-row sm:flex-col items-center sm:gap-2 md:gap-4'>
                  <input ref={input_ref} type='file' accept="image/png , image/jpeg , image/jpg , image/webp, image/svg+xml" className='absolute inset-0 w-full h-full opacity-0 invisible' onChange={handleSetFiles} />
                </div>
              </div>
            </div>
          </>
          :
          <div className='md:!w-[750px] sm:!w-auto mb-5 flex flex-col items-center gap-3'>
            <AddressForm
              show_lat_lng_fields
              setDisabled={bool => setIsValidAddress(!bool)}
              address_values={property?.address}
              setAddressValues={address => setProperty({ ...property, address })}
            />
          </div>
        }
        <div className='flex sm:flex-col md:flex-row sm:gap-2 md:gap-5 w-full items-center justify-center'>
          <Button onClick={() => setStep(1)} type="button" disabled={!is_loaded} className={`${step === 1 ? "hidden" : ""} !px-[128px] md:w-auto sm:!w-full`}>
            Voltar
          </Button>
          <Button disabled={!is_loaded} className='!px-[128px] md:w-auto sm:!w-full'>
            {is_loaded ? (step === 2 ? "Salvar" : "Próximo") : <CgSpinner size={25} className='animate-spin' />}
          </Button>
        </div>
      </form>
    </section>
  )
}
