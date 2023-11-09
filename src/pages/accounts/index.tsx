import React, {useEffect, useMemo, useState} from 'react';
import { Input, Space, Tag } from 'antd';
import TableGeneral from '@/components/table';
import { useRouter } from 'next/router';
import { changeNextPageUrl, updateUrlQuery } from '@/utils/CommonUtils';
import { getAllPartnerAccounts } from '@/services/accounts-service';
import { BREADCRUMB_ACCOUNT } from '@/Constant/index';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import RootLayout from '@/components/layout';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { useAppDispatch } from '@/store/hook';
import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import SearchInput from '@/components/commons/textInputs/SearchInput';
import ActionButton from '@/components/commons/buttons/ActionButton';
import { PlusOutlined } from '@ant-design/icons';


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
    total: 0,
  })

  useEffect(() => {
    dispatch(setBreadcrumb({data: [BREADCRUMB_ACCOUNT]}))
  }, [])

  useEffect(() => {
    init()
  }, [pagination.pageSize, pagination.current])

  const init = () => {
    getAllAccounts()
  }
  
  const getAllAccounts = async () => {
    setLoading(true)
    try {

      const {pageSize, current, total} = pagination
      var params = {
        page: current,
        pageSize,
        total
      }

      const result = await getAllPartnerAccounts(params)
      if (result && result.data) {
        setAccounts(result.data)
        setPagination({...pagination, total: result.pagination.total})
      }
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
        title: <div className='text-center'>No.</div>,
        dataIndex: 'id',
        key: 'id',
        render: (text: any) => <p>{text}</p>,
      },
      {
        title: <div className='text-center'>Name</div>,
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
          const statusData = record.isActive
          const renderStatus = () => {
            let status = ''
            let type = ''
            if (statusData == true) {
              status = 'ACTIVE'
              type = 'success'
            } else if (statusData == false) {
              status = 'INACTIVE'
              type = 'error'
            }
            return <Tag color={type}>{status}</Tag>
          }
        return (
            <div className='flex justify-center uppercase'>
              {renderStatus()}
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
            <div className='flex justify-center'>
              <Space size="middle">
                <EditOutlined className='text-lg cursor-pointer is-link' onClick={() => router.push(`${BREADCRUMB_ACCOUNT.url}/edit/${record.id}`)}/>
                <DeleteOutlined className='text-lg cursor-pointer'/>
              </Space>
            </div>
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
    <div>
      <Space className='w-full flex flex-row justify-between'>
        <SearchInput keyword={keyword} name="keyword" placeholder="Search by Account" onChange={(event: any) => setKeyword(event.target.value)} onSearch={handleSearch}/>
        <ActionButton className={'action-button'} iconOnLeft={<PlusOutlined />} label={'Add Account'} onClick={() => router.push(`${BREADCRUMB_ACCOUNT.url}/add`)}/>
      </Space>
      <div>
        <TableGeneral loading={loading} columns={columns} data={accounts ? accounts : []} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
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
