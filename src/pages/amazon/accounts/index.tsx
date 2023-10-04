import React, {useEffect, useMemo, useState} from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import Link from 'next/link';

import { Input, Space, Switch, Tag } from 'antd';
import { Select } from 'antd';
import TableGeneral from '@/components/table';
import { Button, Modal } from 'antd';
import { useRouter } from 'next/router';
import { changeNextPageUrl, updateUrlQuery } from '@/utils/CommonUtils';

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
    name: "Phan Nhat Minh",
    status: "Running",
  },
  {
    id: 2,
    name: "Trinh Vu Trong Bao",
    status: "Running",
  },
  {
    id: 3,
    name: "Nguyen Tan Tai",
    status: "Pending",
  },
  {
    id: 4,
    name: "Huynh Ngoc Tho",
    status: "Pending",
  },
  {
    id: 5,
    name: "Le Cao Huy",
    status: "Pending",
  },
]

export default function Accounts (props: IAccountsProps) {
  const router = useRouter()

  const [accounts, setAccounts] = useState<any[]>(DATA)
  const [keyword, setKeyword] = useState<string>("")
  const [pagination, setPagination] = useState<any>({
    pageSize: 2,
    current: 1,
    showSizeChanger: true,
    showQuickJumper: true,
  })

  useEffect(() => {
    init()
  }, [])

  const init = () => {
  }
  

 
  const handleSearch= async(value:string) => {
    setKeyword(value)
    const params = {
      keyword: value,
      page: 1
    }
    setPagination({
      ...pagination,
      current: 1
    })
    updateUrlQuery(router, params)
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
        render: (text: any) => <p>{text}</p>,
      },
      {
        title: 'Name',
        dataIndex: 'name',
        key: 'name',
        render: (text: any) => <p>{text}</p>,

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
              <a onClick={() => router.push(`/amazon/accounts/edit/${record.id}`)}>Edit</a>
              <a>Delete</a>
            </Space>
          )
        },
      },
    ], [accounts]
  )

  const handleOnChangeTable = (pagination:any, filters:any, sorter:any) => {
    const { current } = pagination
    changeNextPageUrl(router, current)
    setPagination(pagination)
  }

  return (
    <div className='text-black'>
      <Space direction="vertical" className='flex flex-row justify-between'>
        <Search value={keyword} name="keyword" placeholder="Search by name" onChange={(event: any) => setKeyword(event.target.value)} onSearch={handleSearch} />
        <Button type="primary" className='bg-primary'>
          <Link href={`/amazon/accounts/add`}>Add</Link>
        </Button>
      </Space>
      <div>
        <TableGeneral columns={columns} data={accounts} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
      </div>
    </div>
  );
}

Accounts.getLayout = (page: any) => {
  const breadcrumb = [{label: 'Accounts' , url: '/amazon/accounts'}]
  return (
    <RootLayout>
      <DashboardLayout breadcrumb={breadcrumb}>{page}</DashboardLayout>
    </RootLayout>
  )
};