import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '../../components/layout';
import DashboardLayout from '../../components/nested-layout/DashboardLayout';
import { useRouter } from 'next/router';
import { Space, Switch, Tag, Typography } from 'antd';
import TableGeneral from '@/components/table';
import Link from 'next/link';
import moment from "moment";
// import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_CAMPAIGN_BUDGET, BREADCRUMB_TARGETING_BIDDING } from '@/Constant/index';
import { useAppDispatch } from '@/store/hook';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import {
  DeleteOutlined,
  EditOutlined,
  FundOutlined,
  GoldOutlined
} from '@ant-design/icons';
import { changeNextPageUrl } from '@/utils/CommonUtils';

export interface ITargetDetailProps {
}

const BUDGET_UPDATE_LOG = [
  {
    id: 1,
    before: null,
    after: 15000,
    status: "active",
    updateTime: "2023-08-28T09:27:24.000Z",
    settingType: "One-time",
    userUpdate: "Bao"
  },
  {
    id: 2,
    before: null,
    after: 10000,
    status: "upcoming",
    updateTime: "2023-08-28T02:30:42.000Z",
    settingType: "One-time",
    userUpdate: "Tai"
  },
  {
    id: 3,
    before: 10000,
    after: 15000,
    status: "active",
    updateTime: "2023-08-25T12:10:59.000Z",
    settingType: "Daily with Weight",
    userUpdate: "Bao"
  },
  {
    id: 4,
    before: 10000,
    after: 15000,
    status: "inactive",
    updateTime: "2023-08-25T11:04:54.000Z",
    settingType: "One-time",
    userUpdate: "Tai"
  },
]

export default function TargetDetail (props: ITargetDetailProps) {
  const { Title } = Typography
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)
  const [budgetLog, setBudgetLog] = useState<any[]>([])
  const [statusLog, setStatusLog] = useState<any[]>([])
  const id = router && router.query && router.query.targetId ? router.query.targetId : ""
  const dispatch = useAppDispatch()

  const [budgetPagination, setBudgetPagination] = useState<any>({
    pageSize: 3,
    current: 1,
    total: 0,
  })
  const [statusPagination, setStatusPagination] = useState<any>({
    pageSize: 2,
    current: 1,
    total: 0,
  })

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (!id) return
    dispatch(setBreadcrumb({data: [BREADCRUMB_TARGETING_BIDDING, {label: id, url: ''}]}))
  }, [id])

  const init = () => {
    getBudgetLog()
    getStatusLog()
  }

  const getBudgetLog = async () => {
    setLoading(true)
    try {
      setTimeout(() => {
        setBudgetLog(BUDGET_UPDATE_LOG)
        setLoading(false)
      }, 1000);
    } catch (error) {
      setLoading(false)
      console.log(">>> Get Budget Log Error", error)
    }
  }
  
  const getStatusLog = async () => {
    setLoading(true)
    try {
      setTimeout(() => {
        setStatusLog(BUDGET_UPDATE_LOG)
        setLoading(false)
      }, 1000);
    } catch (error) {
      setLoading(false)
      console.log(">>> Get Budget Log Error", error)
    }
  }

  const handleOnChangeBudgetTable = (pagination: any, filters: any, sorter: any) => {
    const { current } = pagination
    changeNextPageUrl(router, current)
    setBudgetPagination(pagination)
  }

  const handleOnChangeStatusTable = (pagination: any, filters: any, sorter: any) => {
    const { current } = pagination
    changeNextPageUrl(router, current)
    setStatusPagination(pagination)
  }

  const columnsBudgetLog: any = useMemo(
    () => [
      {
        title: <div className='text-center'>Before</div>,
        dataIndex: 'before',
        key: 'before',
        render: (text: any) => <p className='text-end'>{text ? `￥ ${text}` : "NA"}</p>,

        onFilter: (value: string, record: any) => record.before.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.before - b.before,
      },
      {
        title: <div className='text-center'>After</div>,
        dataIndex: 'after',
        key: 'after',
        render: (text: any) => <p className='text-end'>{text ? `￥ ${text}` : "NA"}</p>,

        onFilter: (value: string, record: any) => record.after.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.after - b.after,
      },
      {
        title: <div className='text-center'>Status</div>,
        dataIndex: 'status',
        key: 'status',
        render: (text: any) => {
          const renderStatus = () => {
            let status = ''
            let type = ''
            if (text == "active") {
              status = 'ACTIVE'
              type = 'success'
            } else if (text == 'inactive') {
              status = 'INACTIVE'
              type = 'error'
            } else if (text == 'upcoming') {
              status = 'UPCOMING'
              type = 'processing'
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
        title: <div className='text-center'>Update Time</div>,
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("YYYY-MM-DD / hh:mm:ss") : ""}</p>,
      },
      {
        title: <div className='text-center'>Setting Type</div>,
        dataIndex: 'settingType',
        key: 'settingType',
        render: (text: any) => <p>{text}</p>,

        sorter: (a: any, b: any) => a.settingType - b.settingType
      },
      {
        title: <div className='text-center'>Updated By</div>,
        dataIndex: 'userUpdate',
        key: 'userUpdate',
        render: (text: any) => <p>{text}</p>,

        sorter: (a: any, b: any) => a.userUpdate - b.userUpdate
      },
      {
        title: <div className='text-center'>Action</div>,
        dataIndex: 'action',
        key: 'action',
        render: (_: any, record: any) => {
            const {id} = record
            return (
              <div className='flex justify-center'>
                <Space size="middle" className='flex justify-center'>
                  <EditOutlined className='text-lg cursor-pointer' />
                  <DeleteOutlined className='text-lg cursor-pointer'/>
                  <FundOutlined className='text-lg cursor-pointer is-link' onClick={() => router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/${router.query.campaignId}/history/${id}`)}/>
                  <GoldOutlined className='text-lg cursor-pointer' />
                </Space>
              </div>
            )
        },
      },
    ], [budgetLog]
  )

  const columnsStatusLog: any = useMemo(
    () => [
      {
        title: <div className='text-center'>Action</div>,
        dataIndex: 'action',
        key: 'action',
        render: (_: any, record: any) => {
            const { status } = record
            return (
                <div className='flex justify-center'>
                    <Switch checked={status == "active" ? true : false} />
                </div>
            )
        }
      },
      {
        title: <div className='text-center'>Status</div>,
        dataIndex: 'status',
        key: 'status',
        render: (text: any) => {
          const renderStatus = () => {
            let status = ''
            let type = ''
            if (text == "active") {
              status = 'ACTIVE'
              type = 'success'
            } else if (text == 'inactive') {
              status = 'INACTIVE'
              type = 'error'
            } else if (text == 'upcoming') {
              status = 'UPCOMING'
              type = 'processing'
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
        title: <div className='text-center'>Update Time</div>,
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("YYYY-MM-DD / hh:mm:ss") : ""}</p>,
      },
      {
        title: <div className='text-center'>Setting Type</div>,
        dataIndex: 'settingType',
        key: 'settingType',
        render: (text: any) => <p>{text}</p>,

        sorter: (a: any, b: any) => a.settingType - b.settingType
      },
      {
        title: <div className='text-center'>Updated By</div>,
        dataIndex: 'userUpdate',
        key: 'userUpdate',
        render: (text: any) => <p>{text}</p>,

        sorter: (a: any, b: any) => a.userUpdate - b.userUpdate
      },
      {
        title: <div className='text-center'>Log</div>,
        dataIndex: 'log',
        key: 'log',
        render: (_: any, record: any) => {
          return (
            <div className='flex justify-center'>
              <Space size="middle">
                <EditOutlined className='text-lg cursor-pointer' />
                <DeleteOutlined className='text-lg cursor-pointer'/>
                <FundOutlined className='text-lg cursor-pointer'/>
                <GoldOutlined className='text-lg cursor-pointer' />
              </Space>
            </div>
          )
        },
      },
    ], [budgetLog]
  )

  return (
    <div>      
      <div>
        <div className='panel-heading flex items-center justify-between'>
          <h2>Schedule Adtran log: Target A - Campaign A</h2>
        </div>
        <TableGeneral loading={loading} columns={columnsBudgetLog} data={budgetLog} pagination={budgetPagination} handleOnChangeTable={handleOnChangeBudgetTable} />
      </div>
      <div className='mt-6'>
        <div className='panel-heading flex items-center justify-between'>
          <h2>Status Update</h2>
        </div>
        <TableGeneral loading={loading} columns={columnsStatusLog} data={statusLog} pagination={statusPagination} handleOnChangeTable={handleOnChangeStatusTable} />
      </div>
    </div>
  );
}

TargetDetail.getLayout = (page: any) => (
  <RootLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </RootLayout>
);