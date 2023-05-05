import React, { createContext, useEffect, useState } from 'react'

// styles
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast';

//assets
import Image from 'next/image'
import background_base from '@/assets/base-light.svg'
import background_base_dark from '@/assets/base-dark.svg'

// components
import Footer from '@/components/Footer'
import Navbar from '@/components/NavBar';

export const AppContext = createContext();

export default function App({ Component, pageProps }) {
  const [current_user, setCurrentUser] = useState(null)
  const [user_address, setUserAddress] = useState(null)
  const [is_dark_theme, setIsDarkTheme] = useState(false)
  const [login_modal, setLoginModal] = useState({ show: false, is_private_route: false })

  const context_value = {
    current_user,
    setCurrentUser,
    user_address,
    setUserAddress,
    is_dark_theme,
    switchTheme: () => setIsDarkTheme(!is_dark_theme),
    setLoginModal
  }

  useEffect(() => {
    const theme = localStorage.getItem('theme')
    if (theme === 'dark') {
      setIsDarkTheme(true)
    }
  }, [])

  useEffect(() => {
    (is_dark_theme) ? localStorage.setItem('theme', 'dark') : localStorage.setItem('theme', 'light')
  }, [is_dark_theme])

  return (
    <AppContext.Provider value={context_value}>
      <div className={is_dark_theme ? "dark " : ""}>
        <Navbar />
        <div className='text-typography-base dark:text-dark-typography-base relative flex flex-col w-full h-fit overflow-y-auto'>
          <Image src={background_base} alt="bg-base" fill className="dark:hidden h-full absolute z-0 object-cover" />
          <Image src={background_base_dark} alt="bg-base-dark" fill className="dark:block hidden absolute z-0 object-cover " />
          <div className='z-[10]'>
            <Component {...pageProps} />
          </div>
        </div>
        <Footer />
      </div>
      <Toaster position="top-right" />
    </AppContext.Provider>
  )
}
