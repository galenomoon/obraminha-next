import React from 'react'

//styles
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'

export default function Input({ icon, className, classNameSection, rows = 3, type = 'text', placeholder = '', onChange = () => { }, value = '', required, invalid_message, maxLength, minLength, label }) {
  const [is_invalid, setIsInvalid] = React.useState(false)
  const [is_hidden, setIsHidden] = React.useState(type === 'password')

  React.useEffect(() => {
    setIsInvalid(false)
  }, [value])

  const defaultProps = {
    type: type === "password" ? (is_hidden ? "password" : "text") : type,
    placeholder: label || placeholder,
    onChange: (e) => onChange(type === "tel" ? e.target.value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '($1) $2').replace(/(\d{5})(\d)/, '$1-$2') : e.target.value),
    onInvalid: () => setIsInvalid(true),
    maxLength: `${maxLength}`,
    minLength,
    value,
    required,
    rows,
    className: 'outline-none bg-transparent w-full h-full'
  }

  return (
    <section className={classNameSection + ' flex flex-col w-full h-auto'}>
      {(label && !is_invalid) ?
        <label className='text-typography-light text-sm mb-1 self-start'>{label}</label>
        : null
      }
      {is_invalid ?
        <p className='text-red-600 text-sm self-start'>
          {invalid_message || "Campo obrigatório"}
        </p>
        : null
      }
      <div className={`${className} ${is_invalid ? "border-red-600 border-[2px]" : ""} flex items-center justify-center gap-2 dark:bg-dark-background-light bg-background-base px-4 py-3`}>
        <p className={`text-typography-light ${type === 'textarea' ? "self-baseline mt-1" : ""}`}>{icon}</p>
        {type === 'textarea' ? <textarea {...defaultProps} /> : <input {...defaultProps} />}
        {type === 'password' ?
          <button type="button" onClick={() => setIsHidden(!is_hidden)} className={`text-typography-light hover:opacity-80 duration-150 ${type === 'textarea' ? "self-baseline mt-1" : ""}`}>
            {is_hidden ? <AiFillEyeInvisible size={22} /> : <AiFillEye size={22} />}
          </button> : null}
      </div>
    </section>
  )
}