import React, {useEffect, useMemo, useState} from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';

import { Input, Space, Switch, Tag } from 'antd';
import { Select } from 'antd';
import TableGeneral from '@/components/table';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/components/breadcrumb-context/constant';
import Link from 'next/link';
import { Button, Modal } from 'antd';
import { useRouter } from 'next/router';

const { Search } = Input;

export interface IAccountsProps {
}

const STATUSES = [
  {
    id: 1,
    value: "all",
    label: "All"
  },
  {
    id: 2,
    value: "running",
    label: "Running"
  },
  {
    id: 3,
    value: "upcomming",
    label: "Upcomming"
  },
]

const BULK_ACTION = [
  {
    id: 1,
    value: "update_status",
    label: "Update Status"
  },
  {
    id: 2,
    value: "schedule_status",
    label: "Schedule Status"
  },
  {
    id: 3,
    value: "schedule_budget_once",
    label: "Schedule Budget Once"
  }, 
  {
    id: 4,
    value: "schedule_budget_with_weight",
    label: "Schedule Budget With Weight"
  }, 
  {
    id: 5,
    value: "export_schedule",
    label: "Export Schedule"
  }, 
]

const PARTNER_ACCOUNT = [
  {
    value: 'jack',
    label: 'Jack',
  },
  {
    value: 'lucy',
    label: 'Lucy',
  },
  {
    value: 'tom',
    label: 'Tom',
  },
]

const DATA = [
  {
    id: 1,
    name: "name A",
    status: "Running",
  },
  {
    id: 2,
    name: "name B",
    status: "Pending",
  },
]

export default function Accounts (props: IAccountsProps) {
  const router = useRouter()
  const [accounts, setAccounts] = useState<any[]>(DATA)

  useEffect(() => {
    init()
  }, [])

  const init = () => {
  }
  

  const { setBreadcrumb } = useBreadcrumb();
  const handleSearch = (value: any) => {

  }

  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const columns: any = useMemo(
    () => [
      {
        title: 'No.',
        dataIndex: 'id',
        key: 'id',
        render: (text: any) => <p className='text-end'>{text}</p>,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: any) => <p className='text-end'>{text}</p>,

        onFilter: (value: string, record: any) => record.name.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: <div className='text-center'>Status</div>,
        dataIndex: 'status',
        key: 'status',
        render: (_: any, record: any) => {
          return (
            <div className='flex justify-center'>
              <Tag>{record.status}</Tag>
            </div>
          );
        },
        sorter: (a: any, b: any) => a.status - b.status,
      },
      {
        title: <div className='text-center'>Action</div>,
        key: 'action',
        render: (_: any, record: any) => {
          return (
            <Space size="middle" className='flex justify-center'>
              <a>Edit</a>
              <a>Delete</a>
            </Space>
          )
        },
      },
    ], [accounts]
  )


  useEffect(() => {
    setBreadcrumb([BREADCRUMB_CAMPAIGN_BUDGET])
  },[])

  return (
    <div className='text-black'>
      <div className='grid grid-cols-4 items-center'>
        <Space direction="vertical">
          <Search placeholder="input search text" onSearch={handleSearch} style={{ width: 200 }} />
        </Space>
      </div>
      <div>
        <TableGeneral columns={columns} data={accounts}/>
      </div>
    </div>
  );
}

Accounts.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);