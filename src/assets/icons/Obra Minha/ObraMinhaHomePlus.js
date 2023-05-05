import React from 'react'

//assets
import ObraMinhaHomePlusSvg from './ObraMinhaHomePlus.svg'
import ObraMinhaHomePlusDarkSvg from './ObraMinhaHomePlusDark.svg'

//context
import { AppContext } from '@/pages/_app'

const ObraMinhaHomePlus = ({ size = 24 }) => {
  const { is_dark_theme } = React.useContext(AppContext)

  const ObraMinhaHomePlus = is_dark_theme ? ObraMinhaHomePlusDarkSvg : ObraMinhaHomePlusSvg

  return <img src={ObraMinhaHomePlus} alt='Obra Minha Home Plus' width={size} height={size} />
}

export default ObraMinhaHomePlus