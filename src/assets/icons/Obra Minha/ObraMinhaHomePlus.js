import React from 'react'

//assets
import ObraMinhaHomePlusSvg from './ObraMinhaHomePlus.svg'
import ObraMinhaHomePlusDarkSvg from './ObraMinhaHomePlusDark.svg'

//context
import { ThemeContext } from '../../../routes/ApplicationRoutes'

const ObraMinhaHomePlus = ({ size = 24 }) => {
  const { isDarkTheme } = React.useContext(ThemeContext)

  const ObraMinhaHomePlus = isDarkTheme ? ObraMinhaHomePlusDarkSvg : ObraMinhaHomePlusSvg

  return <img src={ObraMinhaHomePlus} alt='Obra Minha Home Plus' width={size} height={size} />
}

export default ObraMinhaHomePlus