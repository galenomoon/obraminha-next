import React from 'react'

//icons
import { FaStar, FaRegStar } from 'react-icons/fa'

export default function Rating({ value = 0, setValue = () => { }, size = 20, input_mode, disabled }) {
  const [rating, setRating] = React.useState(0);
  const [hover, setHover] = React.useState(0);

  React.useEffect(() => {
    setRating(value)
    setHover(value)
    setValue(value)
  }, [value])

  return (
    <section className={`flex items-center duration-100 ${disabled ? "text-dark-typography-light" : "text-typography-primary"}`}>
      {[...Array(5)].map((_, index) => {
        index += 1;
        return (
          <button
            type='button'
            disabled={disabled}
            key={index}
            onClick={() => (input_mode && !disabled) ? [setRating(index), setValue(index)] : {}}
            onMouseEnter={() => (input_mode && !disabled) ? setHover(index) : {}}
            onMouseLeave={() => (input_mode && !disabled) ? setHover(rating) : {}}
          >
            {index <= (hover || rating) ? <FaStar size={size} /> : <FaRegStar size={size} />}
          </button>
        )
      }
      )}
    </section>
  )
}