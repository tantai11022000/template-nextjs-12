import React, { useEffect } from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_EXECUTION_LOG } from '@/components/breadcrumb-context/constant';

export interface IExecutionLogProps {
}

export default function ExecutionLog (props: IExecutionLogProps) {
  const { setBreadcrumb } = useBreadcrumb();

  useEffect(() => {
    setBreadcrumb([BREADCRUMB_EXECUTION_LOG])
  },[])

  return (
    <h1 className='text-black'>
      Execution Log
    </h1>
  );
}

ExecutionLog.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);
