import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { Space, Tag, Typography } from 'antd';
import TableGeneral from '@/components/table';
import moment from 'moment';
import RangeDatePicker from '@/components/dateTime/RangeDatePicker';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import { useAppDispatch } from '@/store/hook';
import { useRouter } from 'next/router';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import SelectFilter from '@/components/commons/filters/SelectFilter';
import { changeNextPageUrl } from '@/utils/CommonUtils';

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

const EXPORT_TYPE = [
  {
    value: 'csv',
    label: 'CSV'
  },
  {
    value: 'excel',
    label: 'Excel'
  },
]

export default function BudgetHistory (props: IBudgetHistoryProps) {
  const { Title } = Typography
  const dispatch = useAppDispatch()
  const router = useRouter()
  const campaignId = router && router.query && router.query.campaignId ? router.query.campaignId : ""
  const historyId = router && router.query && router.query.historyId ? router.query.historyId : ""
  const [loading, setLoading] = useState<boolean>(false)
  const [budgetHistory, setBudgetHistory] = useState<any[]>([])
  const [exportType, setExportType] = useState<any[]>(EXPORT_TYPE)
  const [pagination, setPagination] = useState<any>({
    pageSize: 10,
    current: 1,
    total: 0,
  })

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (!historyId || !campaignId) return
    dispatch(setBreadcrumb({data: [BREADCRUMB_CAMPAIGN_BUDGET, { label: campaignId, url: `${BREADCRUMB_CAMPAIGN_BUDGET}/${campaignId}`}, { label: 'History', url: ''}, { label: historyId, url: ``}]}))
  }, [historyId, campaignId])

  const init = () => {
    getBudgetHistory()
  }

  const getBudgetHistory = async () => {
    setLoading(true)
    try {
      setTimeout(() => {
        setBudgetHistory(BUDGET_HISTORY)
        setLoading(false)
      }, 1000);
    } catch (error) {
      setLoading(false)
      console.log(">>> Get Budget History Error", error)
    }
  }

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const handleOnChangeTable = (pagination:any, filters: any, sorter: any) => {
    const { current } = pagination
    changeNextPageUrl(router, current)
    setPagination(pagination)
  }
  
  const columnsBudgetLog: any = useMemo(
    () => [
      {
        title: <div className='text-center'>Time</div>,
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("hh:mm:ss") : ""}</p>,
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
        title: <div className='text-center'>IMP</div>,
        dataIndex: 'imp',
        key: 'imp',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.imp - b.imp
      },
      {
        title: <div className='text-center'>Click</div>,
        dataIndex: 'click',
        key: 'click',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.click - b.click
      },
      {
        title: <div className='text-center'>CPM</div>,
        dataIndex: 'cpm',
        key: 'cpm',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.cpm - b.cpm
      },
      {
        title: <div className='text-center'>Sale</div>,
        dataIndex: 'sale',
        key: 'sale',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.sale - b.sale
      },
      {
        title: <div className='text-center'>CV</div>,
        dataIndex: 'cv',
        key: 'cv',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.cv - b.cv
      },
      {
        title: <div className='text-center'>Cost</div>,
        dataIndex: 'cost',
        key: 'cost',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.cost - b.cost
      },
    ], [budgetHistory]
  )

  return (
    <div className='text-black'>
      <div className='panel-heading flex items-center justify-between'>
        <h2>Budget Update on 17 23rd-Aug-2023</h2>
        <Space>
          <RangeDatePicker/>
          <SelectFilter placeholder={"Export"} onChange={handleChange} options={exportType}/>
        </Space>
      </div>
        <TableGeneral loading={loading} columns={columnsBudgetLog} data={budgetHistory} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
    </div>
  );
}

BudgetHistory.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};
