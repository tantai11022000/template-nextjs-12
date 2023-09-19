import * as React from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';

export interface IExecutionLogProps {
}

export default function ExecutionLog (props: IExecutionLogProps) {
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
