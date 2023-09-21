import React, { useEffect } from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/components/breadcrumb-context/constant';

export interface ITargetingBiddingProps {
}

export default function TargetingBidding (props: ITargetingBiddingProps) {
  const { setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([BREADCRUMB_CAMPAIGN_BUDGET])
  },[])

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
