import React, { useEffect } from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_ACCOUNT } from '@/components/breadcrumb-context/constant';

export interface IAccountsProps {
}

export default function Accounts (props: IAccountsProps) {
  const { setBreadcrumb } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumb([BREADCRUMB_ACCOUNT])
  },[])
  return (
    <h1 className='text-black'>
      Accounts
    </h1>
  );
}

Accounts.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);