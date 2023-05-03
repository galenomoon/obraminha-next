import React from 'react'

import Head from 'next/head'

export default function Header({ title = "Obraminha - Encontre os melhores prestadores de serviços para a sua obra!", subtitle, description }) {
  return (
    <Head>
      <title>
        {subtitle ? `Obraminha | ${subtitle}` : title}
      </title>
      <meta name="description" content={description || "Encontre os melhores prestadores de serviços para a sua obra!"} />
    </Head>
  )
}
