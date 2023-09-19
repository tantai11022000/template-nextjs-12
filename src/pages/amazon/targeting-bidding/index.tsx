import * as React from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';

export interface ITargetingBiddingProps {
}

export default function TargetingBidding (props: ITargetingBiddingProps) {
  return (
    <h1 className='text-black'>
      Targeting Bidding
    </h1>
  );
}

TargetingBidding.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);
