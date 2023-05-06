import React, { useEffect } from 'react'
import { CgSpinner } from 'react-icons/cg'
import EmptyState from '../EmptyState/index';

import searching_address from '../../assets/world_map.svg'

export default function GoogleMaps({ organization, map_error }) {
  const organizaton_address = organization?.address
  const [is_empty, setIsEmpty] = React.useState(false)
  const [loaded, setLoaded] = React.useState(!(organizaton_address?.latitude && organizaton_address?.longitude))

  useEffect(() => {
    setIsEmpty(!(organizaton_address?.latitude && organizaton_address?.longitude))
  }, [organizaton_address])

  useEffect(() => {
    if (map_error) {
      setLoaded(true)
    }
  }, [map_error])

  return (
    <div className="flex w-full h-full items-center justify-center relative">
      {!loaded ? <CgSpinner size={64} className="animate-spin absolute self-center" /> : null}
      {(is_empty || map_error) ?
        <EmptyState
          image={searching_address}
          title={map_error ? "Endereço não encontrado" : "Insira um endereço válido"}
          description={map_error ? "Não foi possível encontrar o endereço" : "Não foi possível carregar o mapa"}
          imageClassName="!h-40 mt-0"
          className='!gap-2 !my-0'
        />
        :
        <iframe
          title='Google Maps'
          src={`https://www.google.com/maps/embed/v1/view?center=${organizaton_address?.latitude},${organizaton_address?.longitude}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}&zoom=15`}
          width="100%"
          height="100%"
          onLoad={() => setLoaded(true)}
          loading="lazy"
          style={{ border: 0, borderRadius: '1rem' }}
          allowFullScreen=""
          aria-hidden="false"
          tabIndex="0"
        />
      }
    </div >
  )
}