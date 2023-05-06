import React, { useState, useEffect, useContext } from 'react'

//components
import Input from '@/components/Input'
import Button from '@/components/Button/index';
import InputImage from '@/components/InputImage';
import SeparatorLabel from '@/components/SeparatorLabel';
import AddressForm from '@/components/AddressForm/index';

//styles
import { toast } from 'react-hot-toast';

//assets
import default_profile_pic from '../../assets/default_profile_pic.svg'

//deeps
import api_client from '../../config/api_client';
import { AppContext } from '../_app';
import Header from '@/components/Header';

export default function UserProfile() {
  const address_model = {
    city: '',
    state: '',
    district: '',
    zip_code: '',
    street: '',
    number: '',
    latitude: '',
    longitude: '',
  }

  const { setCurrentUser, current_user, current_user_address = address_model, setCurrentUserAddress } = useContext(AppContext)
  const [user_name, setUserName] = useState({ first_name: '', last_name: '' })
  const [address, setAddress] = useState(current_user_address)
  const [profile_picture, setProfilePicture] = useState({ image: null })

  const profile_picture_has_changed = profile_picture?.image !== current_user?.profile_picture
  const fields_has_changed = user_name?.first_name !== current_user?.first_name || user_name?.last_name !== current_user?.last_name
  const address_has_changed = address?.street !== current_user_address?.street || address?.district !== current_user_address?.district || address?.city !== current_user_address?.city || address?.state !== current_user_address?.state || address?.zip_code !== current_user_address?.zip_code || address?.number !== current_user_address?.number
  const disabled = fields_has_changed === false && profile_picture_has_changed === false && address_has_changed === false

  useEffect(() => {
    if (current_user) {
      const { first_name, last_name, profile_picture } = current_user
      setUserName({ first_name, last_name })
      setProfilePicture({ image: profile_picture })
    }
  }, [current_user])

  useEffect(() => {
    if (current_user_address?.id) {
      setAddress(current_user_address)
    }
  }, [current_user_address])

  async function handleSubmit(e) {
    e.preventDefault()

    const formData = new FormData()
    formData.append('image', profile_picture.image)

    if (profile_picture_has_changed) {
      await api_client.post('/current_user/upload/profile_picture/', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
        .then(({ data }) => setCurrentUser(data))
    }

    if (fields_has_changed) {
      await api_client.post('/current_user/update/fields/', user_name)
        .then(({ data }) => setCurrentUser(data))
    }

    if (address_has_changed) {
      let route_method = current_user_address?.id ? 'update' : 'create'
      let method = current_user_address?.id ? 'patch' : 'post'
      await api_client[method](`/current_user/address/${route_method}/`, address)
        .then(({ data }) => setCurrentUserAddress(data))
        .catch(console.error)
    }

    return toast.success('Perfil atualizado com sucesso')
  }

  return (
    <div className="flex w-full min-h-screen items-center sm:px-3 sm:py-6 md:p-10 h-fit flex-col overflow-hidden">
      <Header subtitle={'Meu Perfil'} />
      <form onSubmit={e => disabled ? e.preventDefault() : handleSubmit(e)} className='flex flex-col items-center rounded-3xl p-12 dark:bg-dark-background-neutral bg-background-neutral shadow-2xl shadow-black/10'>
        <span className="font-bold sm:text-3xl md:text-4xl sm:mb-4 md:mb-8">
          Editar perfil
        </span>
        <SeparatorLabel label="dados pessoais" />
        <div className='flex sm:flex-col md:flex-row w-full gap-6 justify-center items-center sm:py-4 md:pt-3 md:pb-0'>
          <div className='flex flex-col gap-2 justify-center items-center'>
            <div className='group cursor-pointer rounded-full !w-32 !h-32 relative border-[3px] border-typography-base/60 flex flex-col items-center justify-end overflow-hidden'>
              <InputImage
                className="!w-32 !h-32"
                image={(profile_picture_has_changed ? profile_picture?.image : current_user?.profile_picture) || default_profile_pic}
                onChange={e => setProfilePicture({ image: e.target.files[0] })}
              />
            </div>
            {profile_picture_has_changed ?
              <button disabled={!profile_picture_has_changed} onClick={() => setProfilePicture({ image: null })} type='button' className='hover:text-typography-primary duration-100'>
                <p className='duration-150'>
                  Remover Imagem
                </p>
              </button> : null}
          </div>
          <div className='flex flex-col gap-2 items-center md:w-auto sm:w-full'>
            <Input
              value={user_name.first_name}
              onChange={text => setUserName({ ...user_name, first_name: text })}
              label='Nome'
              required
            />
            <Input
              value={user_name.last_name}
              onChange={text => setUserName({ ...user_name, last_name: text })}
              label='Sobrenome'
              required
            />
          </div>
        </div>
        <div className='md:w-[700px] mt-8'>
          <AddressForm is_user_edit setAddressValues={setAddress}  />
        </div>
        <div className='h-[2px] sm:my-6 md:my-4 w-full bg-background-light dark:bg-dark-background-light' />
        <Button disabled={disabled} className='md:!w-[240px] sm:!w-full self-end'>
          Salvar
        </Button>
      </form>
    </div>
  )
}