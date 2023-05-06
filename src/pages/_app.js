import React, { createContext, useEffect, useState } from 'react'


// deeps
import api_client from '@/config/api_client';
import { useRouter } from 'next/router';
import { parseCookies, destroyCookie } from "nookies";

// styles
import '@/styles/globals.css'
import { Toaster } from 'react-hot-toast';

//assets
import Image from 'next/image'
import background_base from '@/assets/base-light.svg'
import background_base_dark from '@/assets/base-dark.svg'

// components
import Modal from '@/components/Modal';
import Footer from '@/components/Footer'
import Navbar from '@/components/NavBar';
import AuthForm from '@/components/Auth/Form';

export const AppContext = createContext();

export default function App({ Component, pageProps }) {
  const { push } = useRouter()
  const { token } = parseCookies()

  const [current_user, setCurrentUser] = useState()
  const [current_user_address, setCurrentUserAddress] = useState(null)
  const [is_dark_theme, setIsDarkTheme] = useState(false)
  const [login_modal, setLoginModal] = useState({ show: false, is_private_route: false })

  const context_value = {
    current_user,
    setCurrentUser,
    destroy_session,
    current_user_address,
    setCurrentUserAddress,
    is_dark_theme,
    switchTheme: () => setIsDarkTheme(!is_dark_theme),
    setLoginModal: (show, is_private_route) => setLoginModal({ show, is_private_route })
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

  useEffect(() => {
    if (current_user) return
    getCurrentUser()
  }, [current_user])

  function destroy_session() {
    destroyCookie(undefined, 'token')
    setCurrentUserAddress(null)
    setCurrentUser(null)
    push('/')
  }

  useEffect(() => {
    if (current_user) getCurrentUserAddress()
  }, [current_user, token])

  async function getCurrentUserAddress() {
    if (!token) return
    return await api_client.get('/current_user/address/')
      .then(({ data }) => setCurrentUserAddress(data))
      .catch(console.error)
  }

  async function getCurrentUser() {
    if (!token) return
    return await api_client.get('/current_user/')
      .then(({ data }) => setCurrentUser(data))
      .catch((error) => {
        console.error(error)
        destroyCookie(undefined, 'token')
      })
  }

  return (
    <AppContext.Provider value={context_value}>
      <div className={`duration-500 ease-in-out ${is_dark_theme ? "dark " : ""}`}>
        <Navbar />
        <div className='text-typography-base dark:text-dark-typography-base relative flex flex-col w-full h-fit overflow-y-auto'>
          <Image src={background_base} alt="bg-base" fill className=" duration-500 animate-fade-in dark:hidden h-full absolute z-0 object-cover" />
          <Image src={background_base_dark} alt="bg-base-dark" fill className=" duration-500 animate-fade-in dark:block hidden absolute z-0 object-cover " />
          <div className='z-[10]'>
            <Component {...pageProps} />
          </div>
        </div>
        <Footer />
        <Modal
          show={login_modal?.show}
          close={login_modal?.is_private_route ? null : () => setLoginModal(false)}
          children={<AuthForm is_login is_modal />}
          className="!overflow-y-auto !md:max-h-[90vh] !justify-start"
        />
      </div>
      <Toaster position="top-right" />
    </AppContext.Provider>
  )
}
