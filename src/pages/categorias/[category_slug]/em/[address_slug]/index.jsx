import React from 'react'
import Organizations from '../../index'
import { useRouter } from 'next/router'
import api_client from '@/config/api_client'

export default function OrganizationsByAddress() {
  const { query } = useRouter()
  const [category, setCategory] = React.useState()

  React.useEffect(() => {
    getCategory(query?.category_slug)
  }, [query?.category_slug])

  async function getCategory(category_slug) {
    if (!category_slug) return
    const { data: category } = await api_client.get(`/categories/${category_slug}/`)
    return setCategory(category)
  }

  return <Organizations category={category} />
}