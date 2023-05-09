import React, { useContext } from 'react'

//deeps
import axios from 'axios';

//components
import Input from '@/components/Input';
import Switch from '@/components/Switch';
import GoogleMaps from '@/components/GoogleMaps';
import SeparatorLabel from '@/components/SeparatorLabel';

//styles
import { CgSpinner } from 'react-icons/cg';
import { GoVerified } from 'react-icons/go';

//context
import { AppContext } from '@/pages/_app';

export default function AddressForm({ setAddressValues = () => { }, is_user_edit, address_values, setDisabled = () => { }, show_lat_lng_fields }) {
  const { current_user_address } = useContext(AppContext)
  const [is_loaded, setIsLoaded] = React.useState({ status: false, is_valid: null, has_changed: false })
  const [map_error, setMapError] = React.useState(false)
  const [show_lat_lng, setShowLatLng] = React.useState(false)
  const [cep, setCep] = React.useState(address_values?.zip_code?.replace(/(\d{5})(\d{3})/, "$1-$2") || '')
  const default_address_object = {
    city: '',
    state: '',
    district: '',
    zip_code: '',
    street: '',
    number: '',
    latitude: '',
    longitude: '',
  }
  const [address, setAddress] = React.useState(address_values?.id ? address_values : default_address_object)
  
  React.useEffect(() => {
    if (!show_lat_lng) {
      getAddressByCep()
    }
  }, [cep])

  React.useEffect(() => {
    if (show_lat_lng) {
      getAddressbyLatLng()
    }
  }, [address?.latitude, address?.longitude])

  React.useEffect(() => {
    setAddressValues(address)
  }, [address])

  React.useEffect(() => {
    setIsLoaded({
      status: true,
      is_valid: is_user_edit ? current_user_address?.id : !!(address_values?.longitude && address_values?.latitude),
      has_changed: false
    })
  }, [is_user_edit, current_user_address, address_values])

  React.useEffect(() => {
    if (is_user_edit && current_user_address?.id) {
      setCep(current_user_address?.zip_code)
      setAddress(current_user_address)
    }
  }, [is_user_edit, current_user_address])

  React.useEffect(() => {
    if (is_loaded.has_changed) {
      setIsLoaded({ ...is_loaded, has_changed: false })
    }
  }, [address?.number])

  React.useEffect(() => {
    setDisabled(!is_loaded?.is_valid)
  }, [is_loaded?.is_valid])

  async function getAddressbyLatLng() {
    setIsLoaded({ ...is_loaded, has_changed: false })

    if (address?.latitude?.length > 0 && address?.longitude?.length > 0 && (address?.latitude !== address_values?.latitude || address?.longitude !== address_values?.longitude)) {
      return await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${address?.latitude},${address?.longitude}&key=${process.env.REACT_APP_GOOGLE_GEOLOCATION_API_KEY}`)
        .then(({ data: google_response }) => {
          setMapError(false)
          const { results } = google_response
          const { address_components } = results?.[0]
          const { long_name: zip_code } = address_components?.find(component => component?.types?.includes("postal_code"))
          const { long_name: street } = address_components?.find(component => component?.types?.includes("route"))
          const { long_name: district } = address_components?.find(component => component?.types?.includes("sublocality"))
          const { long_name: city } = address_components?.find(component => component?.types?.includes("administrative_area_level_2"))
          const { long_name: state } = address_components?.find(component => component?.types?.includes("administrative_area_level_1"))
          setCep(zip_code)
          setAddress({
            ...address,
            zip_code,
            street,
            number: "",
            district,
            city,
            state
          })
          return setIsLoaded({ status: true, is_valid: google_response.status === "OK" })
        })
        .catch(_ => {
          setIsLoaded({ status: true, is_valid: false })
          setMapError(true)
        })
    }
  }

  async function getAddressByCep() {
    setIsLoaded({ ...is_loaded, has_changed: false })

    if (cep?.length === 0) return setAddress(default_address_object)

    if (cep?.length === 9 && (address?.zip_code !== cep)) {
      const { data: address_data } = await axios.get(`https://viacep.com.br/ws/${cep.replace("-", "")}/json/`)

      if (address_data?.erro) {
        setAddress(default_address_object)
        return setIsLoaded({ status: true, is_valid: false })
      }

      const { bairro, localidade, uf, logradouro } = address_data
      return await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${logradouro.replace(" ", "+")}+,${bairro.replace(" ", "+")}+,${localidade.replace(" ", "+")},+${uf}&key=${process.env.REACT_APP_GOOGLE_GEOLOCATION_API_KEY}`).then(({ data: google_response }) => {
        const { results } = google_response
        setAddress({
          ...address,
          district: bairro,
          city: localidade,
          state: uf,
          street: logradouro,
          zip_code: cep,
          latitude: results?.[0]?.geometry?.location?.lat,
          longitude: results?.[0]?.geometry?.location?.lng
        })
        return setIsLoaded({ status: true, is_valid: google_response.status === "OK" })
      }).catch(_ => {
        setIsLoaded({ status: true, is_valid: false })
        setMapError(true)
      })
    }
  }


  return (
    <div className='flex flex-col items-center justify-center gap-3 mb-3'>
      <SeparatorLabel label="endereço" />
      {!show_lat_lng_fields ? null :
        <div className='flex gap-2 w-full items-center justify-center text-lg font-semibold text-md text-typography-light dark:text-dark-typography-light whitespace-nowrap'>
          <p className={`${!show_lat_lng ? "text-typography-primary" : ""} w-full duration-100 flex items-center justify-end`}>
            endereço completo
          </p>
          <div className='flex-grow items-center flex justify-center px-6'>
            <Switch onChange={() => setShowLatLng(!show_lat_lng)} checked={show_lat_lng} />
          </div>
          <p className={`${show_lat_lng ? "text-typography-primary" : ""} w-full duration-100 flex items-center justify-start`}>
            coordenadas
          </p>
        </div>
      }
      {show_lat_lng &&
        <div className={`flex flex-col text-center gap-3 flex-grow w-full relative ${is_loaded.status ? "" : "opacity-30 animate-pulse"}`}>
          <div className='flex gap-2  flex-grow'>
            <Input required label='Latitude' value={address.latitude} onChange={text => setAddress({ ...address, latitude: text })} />
            <Input required label='Longitude' value={address.longitude} onChange={text => setAddress({ ...address, longitude: text })} />
          </div>
          <div className='flex flex-grow w-full h-[200px] mt-2'>
            <GoogleMaps
              map_error={map_error}
              setHasError={bool => setDisabled(!bool)}
              organization={{ address: { latitude: address.latitude, longitude: address.longitude } }}
            />
          </div>
          {is_loaded.is_valid && !map_error &&
            <p className='truncate whitespace-nowrap'>
              {address?.city} | {address?.street} - {address?.state}
            </p>
          }
        </div>
      }
      {!show_lat_lng &&
        <div className={`flex gap-2 flex-grow flex-wrap w-full relative ${is_loaded.status ? "" : "opacity-30 animate-pulse"}`}>
          <div className='flex md:flex-row sm:flex-col gap-2 w-full'>
            <Input required label='CEP' value={cep} onChange={text => setCep(text?.replace(/(\d{5})(\d{3})/, "$1-$2"))} classNameSection="md:w-[40%]" maxLength={9} minLength={9} />
            <Input required label='Rua' value={address.street} onChange={text => setAddress({ ...address, street: text })} />
            <Input label='Número' value={address.number} onChange={text => setAddress({ ...address, number: text })} classNameSection="md:w-[40%] md:flex sm:hidden" />
            <div className='flex flex-row gap-2 md:w-fit sm:w-full'>
              <Input label='Número' value={address.number} onChange={text => setAddress({ ...address, number: text })} classNameSection="md:w-[40%] md:hidden sm:flex" />
              <Input required label='Estado' value={address.state} onChange={text => setAddress({ ...address, state: text })} classNameSection="md:w-[40%] md:hidden sm:flex" />
            </div>
          </div>
          <div className='flex md:flex-row sm:flex-col gap-2 w-full'>
            <Input required label='Estado' value={address.state} onChange={text => setAddress({ ...address, state: text })} classNameSection="md:w-[70%] sm:hidden md:flex" />
            <Input required label='Cidade' value={address.city} onChange={text => setAddress({ ...address, city: text })} />
            <Input required label='Bairro' value={address.district} onChange={text => setAddress({ ...address, district: text })} />
          </div>
          <div className='flex w-full items-center justify-end'>
            {cep.length === 9 ?
              <div className={` flex font-semibold gap-2 items-center justify-center animate-fade-in`}>
                {is_loaded.status === false ? <CgSpinner className='animate-spin' size={20} /> : <GoVerified className={`text-xl ${is_loaded.is_valid ? "text-typography-primary" : "text-red-500"}`} />}
                <p>
                  {is_loaded.status === false ? "Validando endereço..." :
                    (is_loaded.is_valid ? "Endereço válido" : "Endereço inválido")}
                </p>
              </div> : null
            }
          </div>
        </div>
      }
    </div>
  )
}
