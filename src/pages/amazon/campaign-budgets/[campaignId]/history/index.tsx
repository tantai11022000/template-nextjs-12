import React, { useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { Space, Switch, Tag, Typography } from 'antd';
import TableGeneral from '@/components/table';
import moment from 'moment';

const { Title } = Typography;

export interface IBudgetHistoryProps {
}

const BUDGET_HISTORY = [
  {
    id: 1,
    before: null,
    after: 15000,
    status: "active",
    updateTime: "2023-08-28T09:27:24.000Z",
    settingType: "One-time",
    userUpdate: "Bao",
    imp: 1000,
    click: 100,
    sale: 1000,
    cpm: 1.1,
    cv: 1,
    cost: 10
  },
  {
    id: 2,
    before: null,
    after: 10000,
    status: "upcoming",
    updateTime: "2023-08-28T02:30:42.000Z",
    settingType: "One-time",
    userUpdate: "Tai",
    imp: 5000,
    click: 500,
    sale: 5000,
    cpm: 5.5,
    cv: 5,
    cost: 50
  },
  {
    id: 3,
    before: 10000,
    after: 15000,
    status: "active",
    updateTime: "2023-08-25T12:10:59.000Z",
    settingType: "Daily with Weight",
    userUpdate: "Bao",
    imp: 3000,
    click: 300,
    sale: 3000,
    cpm: 3.3,
    cv: 3,
    cost: 30
  },
  {
    id: 4,
    before: 10000,
    after: 15000,
    status: "inactive",
    updateTime: "2023-08-25T11:04:54.000Z",
    settingType: "One-time",
    userUpdate: "Tai",
    imp: 9000,
    click: 900,
    sale: 9000,
    cpm: 9.9,
    cv: 9,
    cost: 90
  },
]

export default function BudgetHistory (props: IBudgetHistoryProps) {
  const [budgetHistory, setBudgetHistory] = useState<any[]>(BUDGET_HISTORY)

  const columnsBudgetLog: any = useMemo(
    () => [
      {
        title: 'Time',
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text: any) => <p className='text-end'>{text ? moment(text).format("hh:mm:ss") : ""}</p>,
      },
      {
        title: <div className='text-center'>Status</div>,
        dataIndex: 'status',
        key: 'status',
        render: (text: any) => {
        return (
            <div className='flex justify-center'>
            <Tag>{text}</Tag>
            </div>
        );
        },
        sorter: (a: any, b: any) => a.status.localeCompare(b.status),
      },
      {
        title: 'IMP',
        dataIndex: 'imp',
        key: 'imp',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.imp - b.imp
      },
      {
        title: 'Click',
        dataIndex: 'click',
        key: 'click',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.click - b.click
      },
      {
        title: 'CPM',
        dataIndex: 'cpm',
        key: 'cpm',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.cpm - b.cpm
      },
      {
        title: 'Sale',
        dataIndex: 'sale',
        key: 'sale',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.sale - b.sale
      },
      {
        title: 'CV',
        dataIndex: 'cv',
        key: 'cv',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.cv - b.cv
      },
      {
        title: 'Cost',
        dataIndex: 'cost',
        key: 'cost',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.cost - b.cost
      },
    ], [budgetHistory]
  )
  return (
    <div className='text-black'>
      <div>
          <Title level={4}>Budget Update on 17 23rd-Aug-2023</Title>
          <TableGeneral columns={columnsBudgetLog} data={budgetHistory}/>
      </div>
    </div>
  );
}

BudgetHistory.getLayout = (page: any) => (
  <RootLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </RootLayout>
);