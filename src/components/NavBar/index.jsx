import React, { useContext, useState, useEffect } from 'react'

//deeps
import Link from 'next/link'
import Image from 'next/image';
import { useRouter } from 'next/router'

//assets
import Logo from '../Logo'
import not_found from '../../assets/not_found.svg'

//styles
import Switch from "react-switch";
import { toast } from 'react-hot-toast';
import { FaUserCog } from 'react-icons/fa'
import { IoMoonSharp } from 'react-icons/io5';
import { BsFillSunFill } from 'react-icons/bs';
import { GiHamburgerMenu } from 'react-icons/gi'
import { MdClose, MdLogout } from 'react-icons/md'
import { HiBuildingStorefront, HiUserCircle } from 'react-icons/hi2'
import ObraMinhaHomePlus from '../../assets/icons/Obra Minha/ObraMinhaHomePlus.js'

//components
import Button from '../Button'

//context
import { AppContext } from '@/pages/_app';

//hook
import { useBlur } from '../../hooks/useBlur';

export default function Navbar() {
  const { pathname } = useRouter()
  const NavBarRef = React.createRef()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false)
  const { switchTheme, is_dark_theme, setCurrentUser, setUserAddress, current_user: user } = useContext(AppContext)
  const float_nav = useBlur(() => setIsUserMenuOpen(false))

  useEffect(() => {
    setIsMenuOpen(false)
    setIsUserMenuOpen(false)
  }, [pathname])

  function logOut() {
    localStorage.removeItem('token')
    setUserAddress()
    setCurrentUser()
    toast.success('Usuário deslogado com sucesso')
  }

  return (pathname?.includes('entrar') || pathname?.includes('cadastro')) ? null :
    <>
      <div ref={NavBarRef} className='w-full md:h-fit sm:h-[100px] shadow-lg sm:px-7 flex md:px-0 justify-between items-center bg-background-base dark:bg-dark-background-neutral'>
        <div className='flex items-center sm:block md:hidden'>
          <GiHamburgerMenu onClick={() => setIsMenuOpen(true)} size={40} className='text-typography-primary cursor-pointer' />
        </div>
        <div className='sm:w-full justify-center md:w-[33%] px-10 flex items-center'>
          <Logo className='w-[180px]' />
        </div>
        <div className='w-full items-center whitespace-nowrap justify-center gap-10 uppercase sm:hidden md:flex text-typography-base dark:text-dark-typography-base'>
          <Link href="/" className='h-[100px] flex items-center duration-150 hover:text-typography-primary hover:opacity-90'>
            <p>Início</p>
          </Link>
          <Link href="/categorias" className='h-[100px] flex items-center duration-150 hover:text-typography-primary hover:opacity-90'>
            <p>Categorias</p>
          </Link>
          <Link href="/terrenos" className='h-[100px] flex items-center duration-150 hover:text-typography-primary hover:opacity-90'>
            <p>Terrenos</p>
          </Link>
          <Link href="/termos-de-uso" className='h-[100px] flex items-center duration-150 hover:text-typography-primary hover:opacity-90'>
            <p> Termos de uso</p>
          </Link>
        </div>
        {
          user ?
            <div className='relative sm:p-0 md:pr-10 md:w-full sm:w-fit flex items-center justify-end gap-6'>
              <div className='w-full items-center whitespace-nowrap justify-center gap-10 uppercase sm:hidden md:flex text-typography-base dark:text-dark-typography-base'>
                <Link href="/minha-empresa" className='h-[100px] uppercase text-typography-primary font-semibold flex justify-center gap-2 items-center hover:opacity-70'>
                  <HiBuildingStorefront size={24} />
                  <p>Minha Empresa</p>
                </Link>
                <Link href="/meus-terrenos" className='h-[100px] uppercase text-typography-primary font-semibold flex justify-center gap-2 items-center hover:opacity-70'>
                  <ObraMinhaHomePlus size={24} />
                  <p>Meus Terrenos</p>
                </Link>
              </div>
              <div ref={float_nav} className='relative'>
                <button onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                  {user?.profile_picture
                    ?
                    <div className='w-[40px]'>
                      <Image
                        src={user?.profile_picture}
                        alt="user"
                        className='w-[40px] duration-150 hover:scale-110 h-[40px] rounded-full object-cover'
                        onError={e => e.target.src = not_found}
                      />
                    </div>
                    :
                    <HiUserCircle size={40} className='text-typography-primary  duration-150 hover:scale-110' />
                  }
                </button>
                <Menu show={isUserMenuOpen} logOut={() => logOut()} close={() => setIsUserMenuOpen(false)} user={user} />
              </div>
            </div>
            :
            <div className='w-fit justify-end flex gap-4 items-center md:pr-6 sm:p-0'>
              <Button to='/entrar' className='!py-[12px] !w-[150px] md:block sm:hidden flex items-center justify-center text-center'>
                Entrar
              </Button>
              <Button to='/cadastro' className='!py-[12px] !text-typography-primary !w-[150px] md:block sm:hidden flex items-center justify-center text-center border-2 border-background-secondary bg-transparent'>
                Cadastrar
              </Button>
              <button onClick={() => switchTheme()}>
                {is_dark_theme ?
                  <BsFillSunFill
                    className='text-[#3CB0A0] animate-switch-theme'
                    size={30}
                  />
                  :
                  <IoMoonSharp
                    className='text-[#3CB0A0] animate-switch-theme'
                    size={30}
                  />
                }
              </button>
            </div>
        }
      </div>
      {
        isMenuOpen &&
        <div className='md:hidden flex flex-col overflow-scroll py-8 items-center animate-slide-in-r sm:fixed z-[999] w-full h-screen bg-background-base dark:bg-dark-background-neutral text-typography-base dark:text-dark-typography-base'>
          <div className='flex items-center justify-between w-[80%]'>
            <Logo className='w-[220px]' />
            <MdClose size={45} onClick={() => setIsMenuOpen(false)} className='cursor-pointer text-2xl' />
          </div>
          <button onClick={(() => switchTheme())} href="/termos-de-uso" className='w-[80%] py-7 text-2xl text-center flex items-center justify-between gap-2'>
            <p>
              Tema {is_dark_theme ? "Escuro" : 'Claro'}
            </p>
            <Switch
              onChange={() => switchTheme()}
              checkedIcon={false}
              uncheckedIcon={false}
              checked={!is_dark_theme}
              className='scale-[0.8]'
              activeBoxShadow={"0 0 2px 1px #3CB0A0"}
              onColor="#3CB0A0"
              offColor="#222"
            />
          </button>
          <div className='w-[80%] h-[2px] bg-typography-light/20 dark:bg-dark-typography-light/20' />
          <Link onClick={(() => setIsMenuOpen(false))} href="/" className='py-6 w-[80%] text-2xl '>Início</Link>
          <Link onClick={(() => setIsMenuOpen(false))} href="/categorias" className='py-6 w-[80%] text-2xl '>Categorias</Link>
          <Link onClick={(() => setIsMenuOpen(false))} href="/terrenos" className='py-6 w-[80%] text-2xl '>Terrenos</Link>
          <Link onClick={(() => setIsMenuOpen(false))} href="/termos-de-uso" className='py-6 w-[80%] text-2xl '>Termos de uso</Link>
          {user ?
            <>
              <Link href="/minha-empresa" className='w-full py-7 text-2xl text-center text-typography-primary font-semibold flex justify-center gap-2 items-center'>
                <HiBuildingStorefront size={24} />
                <p>Minha Empresa</p>
              </Link>
              <Link href="/meus-terrenos" className='w-full py-7 text-2xl text-center text-typography-primary font-semibold flex justify-center gap-2 items-center'>
                <ObraMinhaHomePlus size={24} />
                <p>Meus Terrenos</p>
              </Link>
            </>
            : null}
          <div className='w-[80%] h-[2px] bg-typography-light/20 dark:bg-dark-typography-light/20' />
          {
            user ? null :
              <>
                <Button to='/entrar' className='!w-[80%] my-4'>
                  Entrar
                </Button>
                <Button to='/cadastro' className='!w-[80%] mt-2 text-background-secondary border-2 border-background-secondary !bg-transparent'>
                  Cadastrar
                </Button>
              </>
          }
        </div>
      }
    </>
}

export function Menu({ show, close }) {
  const { switchTheme, is_dark_theme, destroy_session } = useContext(AppContext)

  return (show &&
    <div onBlur={() => close()} className='absolute top-14 right-0 overflow-hidden w-[300px] h-fit border-[2px] border-typography-light/60 bg-background-optional dark:bg-dark-background-light dark:text-dark-typography-base text-typography-base z-[50] rounded-2xl flex flex-col' >
      <button onClick={() => switchTheme()} className='flex w-full p-4 items-center gap-2 hover:bg-background-light hover:dark:bg-dark-background-base cursor-pointer'>
        <div className='flex items-center justify-center w-[50px]'>
          <Switch
            onChange={() => switchTheme()}
            checkedIcon={false}
            uncheckedIcon={false}
            checked={!is_dark_theme}
            className='scale-[0.8]'
            activeBoxShadow={"0 0 2px 1px #3CB0A0"}
            onColor="#3CB0A0"
            offColor="#222"
          />
        </div>
        <p>Tema {is_dark_theme ? "Escuro" : 'Claro'}</p>
      </button>
      <Link href='/meu-perfil' className='flex w-full p-4 items-center gap-2 hover:bg-background-light hover:dark:bg-dark-background-base cursor-pointer'>
        <div className='flex items-center justify-center w-[50px]'>
          <FaUserCog size={30} className='text-typography-primary ' />
        </div>
        <p>Meu Perfil</p>
      </Link>
      <button onClick={() => destroy_session()} className='flex w-full p-4 items-center gap-2 hover:bg-background-light hover:dark:bg-dark-background-base cursor-pointer'>
        <div className='flex items-center justify-center w-[50px]'>
          <MdLogout size={30} className='text-typography-primary ' />
        </div>
        <p>Sair</p>
      </button>
    </div>
  )
}