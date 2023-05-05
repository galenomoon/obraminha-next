import React, { useContext, useEffect } from 'react'

//components
import Logo from '../../../components/Logo'
import Input from '../../../components/Input'
import Button from '../../../components/Button'

//deeps
import api_client from '../../../config/api_client'
import { useRouter } from 'next/router'
import { setCookie } from 'nookies'

//styles
import { BiLock } from 'react-icons/bi'
import { toast } from 'react-hot-toast'
import { CgSpinner } from 'react-icons/cg';
import { AiOutlineUser } from 'react-icons/ai'
import { MdArrowBack, MdOutlineMail } from 'react-icons/md'

//context
import { AppContext } from '@/pages/_app'

export default function AuthForm({ is_login, is_modal }) {
  const { push: navigate } = useRouter()
  const { setCurrentUser, setLoginModal } = useContext(AppContext)
  const [is_loading, setIsLoading] = React.useState(false)
  const [is_login_form, setIsLoginForm] = React.useState(is_login)
  const [forget_password, setForgetPassword] = React.useState(false)
  const [user, setUser] = React.useState({
    first_name: '',
    last_name: '',
    email: '',
    password: '',
    password_confirmation: '',
  })

  useEffect(() => {
    setForgetPassword(false)
  }, [is_login_form])

  useEffect(() => {
    if (!is_modal) {
      setIsLoginForm(is_login)
    }
  }, [is_login, is_modal])

  const sendEmailToRecoveryPassword = async () => {
    setIsLoading(true)
    try {
      const { status } = await api_client.post('/auth/users/reset_password/', { email: user.email })
      if (status === 204) {
        toast.success('Email enviado com sucesso')
        setForgetPassword(false)
      }
    } catch (error) {
      toast.error('Algo deu errado, tente novamente mais tarde')
      console.error(error)
    } finally {
      setIsLoading(false)
    }
  }

  async function handleAuth(e) {
    e.preventDefault()
    if (forget_password) {
      return sendEmailToRecoveryPassword()
    }

    if (!is_login_form && user.password !== user.password_confirmation) {
      toast.error('As senhas não conferem')
      return
    }
    if (user.password.length < 6) {
      toast.error('A senha deve ter no mínimo 6 caracteres')
      return
    }

    setIsLoading(true)
    const endpoint = is_login_form ? '/login/' : '/register/'

    await api_client.post(endpoint, user).then(({ data }) => {

      if (!is_login_form) {
        api_client.post('/login/', user).then(({ data }) => {
          setCookie(null, 'token', data?.token?.access)
          setCurrentUser(data)
        })
      }
      else {
        setCookie(null, 'token', data?.token?.access)
        setCurrentUser(data)
      }

      toast.success('Usuário logado com sucesso')

      return is_modal ? setLoginModal(false) : navigate('/')
    }).catch(({ response }) => {
      if (response) {
        const { password, email, message } = response.data
        if (password) {
          return toast.error(password[0])
        }
        if (email) {
          return toast.error(email[0])
        }
        if (message) {
          return toast.error(message)
        }
      }
      return toast.error('Algo deu errado.')
    })
      .finally(() => setIsLoading(false))
  }


  return (
    <>
      <Logo is_modal={is_modal} className={`w-[200px] ${is_modal ? "cursor-default" : "absolute"} sm:top-[120px] md:top-8 sm:self-center md:right-8`} />
      {forget_password ?
        <button onClick={() => setForgetPassword(false)} className='text-typography-danger group duration-100 flex gap-1 items-center justify-center font-bold text-xl absolute sm:top-[264px] md:top-8 sm:self-center md:left-8'>
          <MdArrowBack size={22} className="group-hover:-translate-x-2 duration-100" />
          <p>Voltar</p>
        </button>
        : null}
      <p className='text-4xl font-bold text-typography-primary'>
        {forget_password ? 'Esqueceu a Senha?' : (is_login_form ? 'Entrar' : 'Cadastrar-se')}
      </p>
      <form onSubmit={handleAuth} className='animate-slide-up dark:text-dark-typography-base flex flex-col items-center justify-center gap-6'>
        <div className='flex flex-col gap-2 items-center justify-center'>
          {!is_login_form &&
            <>
              <Input
                required
                value={user.first_name}
                icon={<AiOutlineUser size={22} />}
                placeholder='Nome'
                onChange={(text) => setUser({ ...user, first_name: text })}
              />
              <Input
                required
                value={user.last_name}
                icon={<AiOutlineUser size={22} />}
                placeholder='Sobrenome'
                onChange={(text) => setUser({ ...user, last_name: text })}
              />
            </>
          }
          <Input
            required
            value={user.email}
            type='email'
            icon={<MdOutlineMail size={22} />}
            placeholder='Email'
            onChange={(text) => setUser({ ...user, email: text })}
          />
          {forget_password ? null :
            <Input
              required
              value={user.password}
              type='password'
              icon={<BiLock size={22} />}
              placeholder='Senha'
              onChange={(text) => setUser({ ...user, password: text })}
            />
          }
          {!is_login_form &&
            <Input
              required
              value={user.password_confirmation}
              type='password'
              icon={<BiLock size={22} />}
              placeholder='Confirmar Senha'
              onChange={(text) => setUser({ ...user, password_confirmation: text })}
            />
          }
        </div>
        <Button disabled={is_loading} >
          {is_loading ? <CgSpinner className='animate-spin' size={22} /> :
            (forget_password ? "Enviar Email" : (is_login_form ? 'Entrar' : 'Cadastre-se'))
          }
        </Button>
      </form>
      <div className='text-sm flex gap-1 text-typography-light'>
        <p>
          {is_login_form ? 'Não tem uma conta?' : 'Já tem uma conta?'}
        </p>
        <Button onClick={() => is_modal ? setIsLoginForm(!is_login_form) : {}} to={is_modal ? "#" : (is_login_form ? '/cadastro' : '/entrar')} className="!text-typography-danger capitalize !bg-transparent !h-fit !p-0 !w-fit font-bold">
          {(is_login_form ? 'Cadastre-se' : 'Entrar')}
        </Button>
      </div>
      {is_login_form && !forget_password && !is_modal ?
        <button disabled={is_loading} onClick={() => setForgetPassword(true)} className='text-sm flex gap-1 duration-100 hover:text-typography-primary text-typography-light'>
          Esqueci minha senha
        </button>
        : null}
    </>
  )
}