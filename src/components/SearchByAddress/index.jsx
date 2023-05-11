import React, { useEffect, useContext } from 'react'

//context
import { AppContext } from '@/pages/_app'

//hooks
import useDebounce from '../../hooks/useDebounce'

//deeps
import axios from 'axios'
import api_client from '../../config/api_client'
import { useRouter } from 'next/router'

//components
import Modal from '../Modal'
import Button from '../Button'
import SearchBar from '../SearchBar'
import TitleAndSubtitle from '../TitleAndSubtitle'

//styles
import { RiMapPin2Line, RiMapPinAddFill } from 'react-icons/ri'
import { HiLocationMarker } from 'react-icons/hi'
import { GiPathDistance } from 'react-icons/gi'
import { IoCloseSharp } from 'react-icons/io5'
import { MdGpsFixed } from 'react-icons/md'

export default function SearchByAddress({ setSelectedAddress = () => { }, selected_address, setIsLoaded = () => { }, placeholder, setRadius = () => { }, get_options_endpoint, category_slug }) {
  const { push: navigate, query } = useRouter()
  const address_slug = query?.address_slug
  const { current_user, current_user_address, setLoginModal } = useContext(AppContext)
  const current_user_id = current_user?.id
  const [current_radius, setCurrentRadius] = React.useState(selected_address?.radius ?? null)
  const [is_getting_current_location, setIsGettingCurrentLocation] = React.useState(false)
  const [getting_by_user_address, setGettingByUserAddress] = React.useState(false)
  const [permission_has_rejected, setPermissionHasRejected] = React.useState(false)
  const [show_auto_complete, setShowAutoComplete] = React.useState(false)
  const [show_radius_modal, setShowRadiusModal] = React.useState(false)
  const [search_value, setSearchValue] = React.useState(address_slug)
  const [options, setOptions] = React.useState([])
  const debouncedSearch = useDebounce(search_value)

  useEffect(() => {
    if (address_slug && !search_value) {
      getAddressesOptions(address_slug)
    }
  }, [address_slug])

  useEffect(() => {
    getAddressesOptions()
  }, [debouncedSearch])

  useEffect(() => {
    if (show_radius_modal) {
      setCurrentRadius(selected_address?.radius ?? null)
    } else { setCurrentRadius(null) }
  }, [show_radius_modal])

  useEffect(() => {
    if (!selected_address) {
      setCurrentRadius(null)
      setIsGettingCurrentLocation(false)
    }
  }, [selected_address])

  const addressInJSON = (param) => {
    return {
      state: param.address?.split("-")[1]?.trim(),
      city: param.address?.split("-")[0]?.split(",")[1]?.trim(),
      district: param.address?.split(",")[0]?.trim(),
      latitude: param.latitude,
      longitude: param.longitude,
    }
  }

  async function getAddressesOptions(get_by_address_slug = false) {

    return await api_client.post(get_options_endpoint, { query: (get_by_address_slug ? address_slug.replace("-", " ") : debouncedSearch), ...category_slug })
      .then(({ data }) => {
        setShowAutoComplete(data?.options?.length && !getting_by_user_address && !!search_value && !(data?.options?.[0]?.address === debouncedSearch))
        setOptions(data?.options)
        if (get_by_address_slug) {
          const { options } = data
          setSelectedAddress(addressInJSON(options?.[0]))
          setSearchValue(options?.[0]?.address)
          return
        }
      })
      .catch(console.error)
      .finally(() => setGettingByUserAddress(false))
  }

  async function getCurrentLocation() {
    setGettingByUserAddress(true)

    if (is_getting_current_location) return setSelectedAddress()
    if (permission_has_rejected) return setPermissionHasRejected(false)

    setIsLoaded(false)
    navigator.geolocation.getCurrentPosition(async (position) => {
      const { latitude, longitude } = position.coords
      setSelectedAddress({ latitude, longitude })
      setIsGettingCurrentLocation(true)
      setIsLoaded(true)
      const { data: google_response } = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.REACT_APP_GOOGLE_GEOLOCATION_API_KEY}`)
      const { results } = google_response
      setSearchValue(`${results[0]?.address_components[1]?.long_name}, ${results[0]?.address_components[2]?.long_name} - ${results[0]?.address_components[4]?.short_name ?? results[0]?.address_components[2]?.short_name}`)
    }, () => [setPermissionHasRejected(true), setIsLoaded(true)])
  }

  function handleSelectRadius(radius) {
    setRadius(radius)
    setSelectedAddress({ ...selected_address, radius: parseInt(radius) })
    setShowRadiusModal(false)
  }

  function handleSelectOption(option) {
    let formatted_address

    if (option?.address) {
      formatted_address = addressInJSON(option)
    } else {
      formatted_address = {
        state: option?.split("-")[1]?.trim(),
        city: option?.split("-")[0]?.split(",")[1]?.trim(),
        district: option?.split(",")[0]?.trim(),
      }
    }

    setSelectedAddress(formatted_address)
    setSearchValue(option?.address ?? option)
    setGettingByUserAddress(true)
    setShowAutoComplete(false)
  }

  function handleSearchByUserAddress() {
    setGettingByUserAddress(true)
    if (!current_user_address?.id) {
      if (!current_user_id) return setLoginModal(true)
      return navigate('/meu-perfil')
    }
    const { latitude, longitude } = current_user_address
    setSearchValue(`${current_user_address?.district}, ${current_user_address?.city} - ${current_user_address?.state}`)
    setSelectedAddress({ latitude, longitude })
  }

  return (
    <>
      <div className='w-full sm:flex-col relative flex items-center'>
        <div className='flex md:flex-row sm:flex-col w-full items-center gap-2'>
          <div className='w-full sm:flex-col relative flex items-center'>
            <SearchBar
              icon={RiMapPin2Line}
              placeholder={placeholder ?? "Digite o endereço"}
              className='w-full !mx-0'
              onClean={() => setSelectedAddress()}
              value={search_value}
              onChange={setSearchValue}
            />
            {(show_auto_complete) ?
              <div className='flex flex-col max-h-[300px] overflow-y-auto shadow-md z-10 w-full absolute top-16 items-start rounded-2xl border-[2px] dark:border-dark-typography-light/20 border-typography-light'>
                {options?.map((option, idx) =>
                  <button onClick={() => handleSelectOption(option)} key={idx} className='flex items-center w-full hover:dark:bg-dark-background-base hover:bg-background-neutral bg-background-optional dark:bg-dark-background-neutral  first:rounded-t-2xl last:rounded-b-2xl p-3'>
                    {option?.address ? option?.address : option}
                  </button>
                )}
              </div>
              : null
            }
          </div>
          <div className='flex sm:flex-wrap md:flex-nowrap flex-grow items-center gap-2 md:w-fit sm:w-full'>
            <button onClick={() => getCurrentLocation()} className={`md:w-fit sm:w-full text-typography-secondary ${permission_has_rejected ? "dark:text-[#e82f51] bg-[#c22945] dark:bg-[#e82f51]/30" : "dark:text-typography-primary bg-typography-primary dark:bg-typography-primary/30"} flex font-semibold gap-1  items-center justify-center hover:opacity-80 duration-150 p-3 rounded-2xl`}>
              {is_getting_current_location ? <IoCloseSharp size={28} /> : <MdGpsFixed size={28} />}
              <p className='whitespace-nowrap'>
                {permission_has_rejected ? "Pemissão de GPS negada" : (is_getting_current_location ? "Limpar busca" : "Usar localização atual")}
              </p>
            </button>
            <button onClick={() => handleSearchByUserAddress()} className={`md:w-fit sm:w-full text-typography-secondary dark:text-typography-primary bg-typography-primary dark:bg-typography-primary/30 flex font-semibold gap-1  items-center justify-center hover:opacity-80 duration-150 p-3 rounded-2xl`}>
              {current_user_address?.id ?
                <>
                  <HiLocationMarker size={28} />
                  <p className='whitespace-nowrap'>
                    Usar endereço salvo
                  </p>
                </>
                :
                <>
                  <RiMapPinAddFill size={28} />
                  <p className='whitespace-nowrap'>
                    Salvar um endereço
                  </p>
                </>
              }
            </button>
            {selected_address?.latitude ?
              <button onClick={() => setShowRadiusModal(true)} className='md:w-fit sm:w-full text-typography-secondary dark:text-typography-primary bg-typography-primary dark:bg-typography-primary/30 flex font-semibold gap-1  items-center justify-center hover:opacity-80 duration-150 p-3 rounded-2xl'>
                {selected_address?.radius ? <p className='whitespace-nowrap font-black'>{selected_address?.radius} km -</p> : <GiPathDistance size={28} />}
                <p className='whitespace-nowrap'>Raio de busca</p>
              </button>
              : null
            }
          </div>
        </div>
      </div>
      <Modal
        show={show_radius_modal}
        close={() => setShowRadiusModal(false)}
        className='md:h-[350px]'
      >
        <TitleAndSubtitle title='Raio de busca' subtitle='Defina o raio de busca para encontrar terrenos próximos a você' />
        <p className='text-typography-primary text-2xl font-semibold'>{current_radius ?? 50} km</p>
        <div className='flex w-full gap-3 h-[64px] px-4 items-center justify-center rounded-2xl bg-background-light dark:bg-dark-background-light'>
          <p className='text-typography-light dark:text-typography-light'>
            50km
          </p>
          <input
            type="range"
            min="50"
            max="150"
            value={current_radius ?? 5}
            onChange={(e) => setCurrentRadius(e.target.value)}
          />
          <p className='text-typography-light dark:text-typography-light'>
            150km
          </p>
        </div>
        <div className='flex gap-2 items-center justify-center'>
          <Button onClick={() => setShowRadiusModal(false)} className="bg-[#777] dark:bg-[#777]/40 hover:!opacity-70">
            cancelar
          </Button>
          <Button onClick={() => handleSelectRadius(current_radius)}>
            Salvar
          </Button>
        </div>
      </Modal>
    </>
  )
}
