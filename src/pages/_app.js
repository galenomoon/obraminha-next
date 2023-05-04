import '@/styles/globals.css'
import Image from 'next/image'
import background_base from '@/assets/base-light.svg'
import background_base_dark from '@/assets/base-dark.svg'

export default function App({ Component, pageProps }) {
  const isDarkTheme = false

  return (
    <div className={isDarkTheme ? "dark" : ""}>
      <div className='text-typography-base dark:text-dark-typography-base relative overflow-hidden flex flex-col w-full h-fit overflow-y-auto'>
        <Image src={background_base} alt="bg-base" fill className="dark:hidden h-full absolute z-0 object-cover" />
        <Image src={background_base_dark} alt="bg-base-dark" fill className="dark:block hidden absolute z-0 object-fill " />
        <div className='z-[10]'>
          <Component {...pageProps} />
        </div>
      </div>
    </div>
  )
}
