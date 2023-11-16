import * as React from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

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
