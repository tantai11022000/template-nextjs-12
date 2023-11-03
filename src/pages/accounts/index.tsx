import React, {useEffect, useMemo, useState} from 'react';
import Link from 'next/link';

import { Input, Space, Tag } from 'antd';
import TableGeneral from '@/components/table';
import { Button } from 'antd';
import { useRouter } from 'next/router';
import { changeNextPageUrl, updateUrlQuery } from '@/utils/CommonUtils';
import { getAllPartnerAccounts } from '@/services/accounts-service';
import { BREADCRUMB_ACCOUNT } from '@/components/breadcrumb-context/constant';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import RootLayout from '@/components/layout';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { useAppDispatch } from '@/store/hook';

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

export default function Accounts (props: IAccountsProps) {
  const { Search } = Input;
  const router = useRouter()
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [accounts, setAccounts] = useState<any[]>([])
  const [keyword, setKeyword] = useState<string>("")
  const [pagination, setPagination] = useState<any>({
    pageSize: 10,
    current: 1,
    showSizeChanger: true,
    showQuickJumper: true,
  })

  useEffect(() => {
    init()
    dispatch(setBreadcrumb({data: [BREADCRUMB_ACCOUNT]}))
  }, [])

  const init = () => {
    getAllAccounts()
  }
  
  const getAllAccounts = async () => {
    setLoading(true)
    try {
      const result = await getAllPartnerAccounts()
      setAccounts(result && result.data ? result.data : [])
      setLoading(false)
    } catch (error) {
      console.log(">>> Get All Accounts Error", error)
      setLoading(false)
    }
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
          const status = record.isActive
          return (
            <div className='flex justify-center'>
              <Tag>{status == true ? "Active" : "isActive"}</Tag>
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
              <a onClick={() => router.push(`${BREADCRUMB_ACCOUNT.url}/edit/${record.id}`)}>Edit</a>
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
        <Search className='w-96' value={keyword} name="keyword" placeholder="Search by name" onChange={(event: any) => setKeyword(event.target.value)} onSearch={handleSearch} />
        <Button type="primary" className='bg-primary'>
          <Link href={`${BREADCRUMB_ACCOUNT.url}/add`}>Add</Link>
        </Button>
      </Space>
      <div>
        <TableGeneral loading={loading} columns={columns} data={accounts} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
      </div>
    </div>
  );
}

Accounts.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  )
};
