import React, { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant';

export async function getStaticProps(context: any) {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale: 'en'
    },
  }
}

export interface IAppProps {
}

export default function App (props: IAppProps) {
  const router = useRouter()
  useEffect(() => {
    router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}`)
  })
  
  return (
    <div className='index-container'>
      <div className='main-content'>
        <h1 className='status-code'>404</h1>
      </div>
      <div className='content'>
        <h2 className='status-code'>This page could not be found.</h2>
      </div>
    </div>
  );
}
