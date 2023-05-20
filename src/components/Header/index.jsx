import React from 'react'

import Head from 'next/head'

export default function Header({ title = "Encontre os melhores prestadores de serviços para a sua obra!", subtitle, description = "Trabalhamos com prestadores de serviços qualificados e comprometidos. Descubra como podemos ajudá-lo a tornar seus projetos de construção realidade" }) {
  return (
    <Head>
      <title>
        {subtitle ? `${subtitle?.includes("undefined") ? title : subtitle} | Obraminha` : (title)}
      </title>
      <meta name="description" content={description} />
      <meta property="og:title" content={subtitle ? `${subtitle === "undefined" ? title : subtitle} | Obraminha` : (title)} />
      <meta property="og:description" content={description} />
    </Head>
  )
}
