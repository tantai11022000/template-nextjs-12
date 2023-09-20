import React, { useEffect } from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_ADD, BREADCRUMB_WEIGHT_TEMPLATE } from '@/components/breadcrumb-context/constant';


function AddWeightTemplate() {
    const { setBreadcrumb } = useBreadcrumb();
    useEffect(() => {
        setBreadcrumb([BREADCRUMB_WEIGHT_TEMPLATE,BREADCRUMB_ADD])
      },[])
    return (
        <>
            <h1 className='text-black'>
            Add Weight Template
            </h1>
        </>
    );
}

AddWeightTemplate.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);

export default AddWeightTemplate;