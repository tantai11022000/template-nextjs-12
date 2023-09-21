import React, { useEffect } from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';
import Link from 'next/link';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_WEIGHT_TEMPLATE } from '@/components/breadcrumb-context/constant';

function WeightTemplate() {
  const { setBreadcrumb } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumb([BREADCRUMB_WEIGHT_TEMPLATE])
  },[])
    return (
        <>
            <h1 className='text-black'>
                Weight Template
            </h1>
            <h1 className='text-black'>
                <Link href={'/amazon/weight-template/add'}>Add item</Link>
            </h1>
        </>
    );
}

WeightTemplate.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);

export default WeightTemplate;