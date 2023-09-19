import * as React from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';

export interface IAccountsProps {
}

export default function Accounts (props: IAccountsProps) {
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