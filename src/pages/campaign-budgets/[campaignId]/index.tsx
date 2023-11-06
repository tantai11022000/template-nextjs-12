import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useRouter } from 'next/router';
import { Select, Space, Switch, Tag, Typography } from 'antd';
import TableGeneral from '@/components/table';
import Link from 'next/link';
import moment from "moment";
import { GetServerSideProps } from 'next';
import RangeDatePicker from '@/components/dateTime/RangeDatePicker';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/components/breadcrumb-context/constant';
import { useAppDispatch } from '@/store/hook';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';

// export const getServerSideProps: GetServerSideProps = async (context) => {
//   const { campaignId } = context.query;

//   const breadcrumb = [
//     { label: 'Campaign Budgets', url: BREADCRUMB_CAMPAIGN_BUDGET.url },
//     { label: campaignId ? campaignId : "Detail", url: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/${campaignId}` },
//   ];

//   return {
//     props: {
//       breadcrumb,
//     },
//   };
// };

export interface ICampaignDetailProps {
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

const UPDATE_BUDGET = [
  {
    value: 'one_time',
    label: 'One Time'
  },
  {
    value: 'daily_with_weight',
    label: 'Daily With Weight'
  },
]

export default function CampaignDetail (props: ICampaignDetailProps) {
  const { Title } = Typography
  const router = useRouter()
  const id = router && router.query && router.query.type && router.query.type.length ? router.query.type[1] : ""
  const dispatch = useAppDispatch()
  const [budgetLog, setBudgetLog] = useState<any[]>([])
  const [updateBudgetOptions, setUpdateBudgetOptions] = useState<any[]>(UPDATE_BUDGET)
  const [loading, setLoading] = useState<boolean>(false)

  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (!id) return
    dispatch(setBreadcrumb({data: [BREADCRUMB_CAMPAIGN_BUDGET, {label: id , url: ''}]}))
  },[id])

  const init = () => {
    getBudgetLog()
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

  const columnsBudgetLog: any = useMemo(
    () => [
      {
        title: 'Before',
        dataIndex: 'before',
        key: 'before',
        render: (text: any) => <p className='text-end'>{text ? `￥ ${text}` : "NA"}</p>,

        onFilter: (value: string, record: any) => record.before.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.before - b.before,
      },
      {
        title: 'After',
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
        return (
            <div className='flex justify-center'>
            <Tag>{text}</Tag>
            </div>
        );
        },
        sorter: (a: any, b: any) => a.status - b.status,
      },
      {
        title: <div className='text-center'>Update Time</div>,
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("DD/MM/YYYY - hh:mm:ss") : ""}</p>,
      },
      {
        title: 'Setting Type',
        dataIndex: 'settingType',
        key: 'settingType',
        render: (text: any) => <p>{text}</p>,

        sorter: (a: any, b: any) => a.settingType - b.settingType
      },
      {
        title: 'Updated By',
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
                  <EditOutlined className='text-lg cursor-pointer' onClick={() => router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/${router.query.campaignId}/history/${id}`)}/>
                  <DeleteOutlined className='text-lg cursor-pointer'/>
                </Space>
              </div>
            )
        },
      },
    ], [budgetLog]
  )

  const columnsStatusUpdate: any = useMemo(
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
        return (
            <div className='flex justify-center'>
                <Tag>{text}</Tag>
            </div>
        );
        },
        sorter: (a: any, b: any) => a.status - b.status,
      },
      {
        title: <div className='text-center'>Update Time</div>,
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("DD/MM/YYYY - hh:mm:ss") : ""}</p>,
      },
      {
        title: 'Setting Type',
        dataIndex: 'settingType',
        key: 'settingType',
        render: (text: any) => <p>{text}</p>,

        sorter: (a: any, b: any) => a.settingType - b.settingType
      },
      {
        title: 'Updated By',
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
                <Space size="middle" className='flex justify-center'>
                    <EditOutlined className='text-lg cursor-pointer'/>
                    <DeleteOutlined className='text-lg cursor-pointer'/>
                </Space>
            )
        },
      },
    ], [budgetLog]
  )

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  return (
    <div className='text-black'>
      <div>
        <div className='flex items-center justify-between'>
          <Title level={4}>Budget Update Log</Title>
          <Space>
            <RangeDatePicker/>
            <Select
              placeholder="Update Budget"
              style={{ width: 150 }}
              onChange={handleChange}
              options={updateBudgetOptions}
            />
          </Space>
        </div>
        <TableGeneral loading={loading} columns={columnsBudgetLog} data={budgetLog}/>
      </div>
      <div>
        <div className='flex items-center justify-between'>
          <Title level={4}>Status Update</Title>
          <RangeDatePicker/>
        </div>
          <TableGeneral loading={loading} columns={columnsStatusUpdate} data={budgetLog}/>
      </div>
    </div>
  );
}

CampaignDetail.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  );
};
