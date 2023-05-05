import React from 'react'

//deeps
import Link from 'next/link'
import api_client from '@/config/api_client';

//components
import Banner from '@/components/Banner/index';
import Skeleton from '@/components/Skeleton';

//mock
import { categories_mock } from '../../mocks/categories.js';
import Header from '@/components/Header/index.jsx';

export default function Categories() {
  const [categories, setCategories] = React.useState([]);
  const [is_loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    getCategories()
  }, [])

  async function getCategories() {
    return await api_client.get('/categories/')
      .then(({ data }) => setCategories(data))
      .catch(console.error)
      .finally(() => setLoaded(true));
  }

  return (
    <div className="flex w-full min-h-screen h-fit flex-col overflow-hidden">
      <Header subtitle={'Categorias'} />
      <Banner title="O que você precisa?" subtitle='Pra construir o seu sonho?' />
      <div className='w-full h-full flex flex-col py-12 items-center md:gap-8 sm:gap-2'>
        <p className='md:text-5xl sm:text-3xl font-semibold mb-4'>
          O que você precisa?
        </p>
        {is_loaded ?
          categories?.results?.length ?
            <div className='grid sm:grid-cols-2 md:grid-cols-4 sm:gap-3 md:gap-4 pb-20 text-typography-secondary'>
              {categories?.results?.map((category, index) => {
                let Icon = categories_mock[index]?.Icon

                return (
                  <Link href={`/categorias/${category.slug}`} key={category.id} className='md:min-w-[186px] sm:min-w-[120px] bg-background-secondary md:p-4 sm:p-2 rounded-lg flex flex-col items-center gap-2' >
                    <Icon className='text-5xl' />
                    <p className='sm:text-xl md:text-2xl'>
                      {category.name}
                    </p>
                  </Link>
                )
              })}
            </div>
            :
            <div className='w-full h-[50vh] flex justify-center'>
              <p className='text-4xl text-center font-semibold self-center text-typography-primary/80'>
                Nenhuma categoria encontrada
              </p>
            </div>
          :
          <div className='grid sm:grid-cols-2 md:grid-cols-4 sm:gap-3 md:gap-4 pb-20 text-typography-secondary'>
            {Array(9).fill(0).map((_, index) =>
              <Skeleton key={index} className='md:!min-w-[186px] sm:!min-w-[120px] md:!min-h-[186px] sm:!min-h-[120px] bg-background-secondary md:p-4 sm:p-2 rounded-lg flex flex-col items-center gap-2' />
            )}
          </div>
        }
      </div>
    </div >
  )
}