import React from 'react'
import OrganizationsPage from '../index'

export default function OrganizationsByAddressSlug({params}) {
  return <OrganizationsPage search_by_address={params?.address_slug} />
}

export async function getStaticProps({ params }) {
  return {
    props: {
      params
    },
    revalidate: 1
  }
}

export async function getStaticPaths() {
  return { paths: [], fallback: true };
}