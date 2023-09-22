import React from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';

export interface IAddPartnerAccountProps {
}

export default function AddPartnerAccount (props: IAddPartnerAccountProps) {
  return (
    <div className='text-black'>
      Add here
    </div>
  );
}

AddPartnerAccount.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);