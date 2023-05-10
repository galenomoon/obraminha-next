import React from "react";

import { CgSoftwareDownload } from 'react-icons/cg';

export default function DownloadButton({ file, budget_id }) {

  return (
    <a href={`${process.env.REACT_APP_API_URL}/budgets/${budget_id}/attached_files/${file?.id}/`} className='md:w-fit sm:w-fit min-w-[136px] text-typography-secondary dark:text-typography-primary  flex font-semibold bg-typography-primary gap-2 dark:bg-typography-primary/30 items-center justify-center hover:opacity-80 duration-150 p-3 rounded-xl'>
      <CgSoftwareDownload className='text-2xl' />
      <p className='text-lg'>download</p>
    </a>
  )
}