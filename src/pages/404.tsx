import React, { useEffect } from 'react';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant';
import { useTranslation } from 'next-i18next';

export async function getStaticProps(context: any) {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale: 'en'
    },
  }
}

export interface ICustom404Props {
}

export default function Custom404 (props: ICustom404Props) {
  const { t } = useTranslation()
  return (
    <div className='index-container'>
      <div className='main-content'>
        <h1 className='status-code'>404</h1>
      </div>
      <div className='content'>
        <h2 className='status-code'>{t('error_messages.not_found_page')}</h2>
      </div>
    </div>
  );
}
