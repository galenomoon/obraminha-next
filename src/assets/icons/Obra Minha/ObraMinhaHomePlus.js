import React from 'react'
import Image from 'next/image'

//assets
import ObraMinhaHomePlusSvg from '../Obra Minha/ObraMinhaHomePlus.svg'
import ObraMinhaHomePlusDarkSvg from '../Obra Minha/ObraMinhaHomePlusDark.svg'

//context
import { AppContext } from '@/pages/_app'

const ObraMinhaHomePlus = ({ size = 24 }) => {
  const { is_dark_theme } = React.useContext(AppContext)

  const ObraMinhaHomePlus = is_dark_theme ? ObraMinhaHomePlusDarkSvg : ObraMinhaHomePlusSvg

  return <Image src={ObraMinhaHomePlus} alt='Obra Minha Home Plus' width={size} height={size} />
}

export default ObraMinhaHomePlus