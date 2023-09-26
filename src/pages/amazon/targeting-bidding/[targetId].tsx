import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';
import { useRouter } from 'next/router';
import { Space, Switch, Tag, Typography } from 'antd';
import TableGeneral from '@/components/table';
import Link from 'next/link';
import moment from "moment";
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_CAMPAIGN_BUDGET, BREADCRUMB_TARGETING_BIDDING } from '@/components/breadcrumb-context/constant';

const { Title } = Typography;

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
  const { setBreadcrumb } = useBreadcrumb();
  const router = useRouter()
  const [budgetLog, setBudgetLog] = useState<any[]>(BUDGET_UPDATE_LOG)
  const id = router && router.query && router.query.targetId ? router.query.targetId : ""

  useEffect(() => {
    if (id) {
      setBreadcrumb([BREADCRUMB_TARGETING_BIDDING, {label: id.toString(), url: ''}])
    }
  }, [router])
  

  const columnsBudgetLog: any = useMemo(
    () => [
      {
        title: 'Before',
        dataIndex: 'before',
        key: 'before',
        render: (text: any) => <p className='text-end'>{text ? `JPY ${text}` : "NA"}</p>,

        onFilter: (value: string, record: any) => record.before.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.before - b.before,
      },
      {
        title: 'After',
        dataIndex: 'after',
        key: 'after',
        render: (text: any) => <p className='text-end'>{text ? `JPY ${text}` : "NA"}</p>,

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
                <Space size="middle" className='flex justify-center'>
                    <Link href={`/amazon/campaign-budgets/${id}/history`}>Edit</Link>
                    <a>Delete</a>
                </Space>
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
                    <a>Edit</a>
                    <a>Delete</a>
                </Space>
            )
        },
      },
    ], [budgetLog]
  )

  return (
    <div className='text-black'>
      <div>
        <Title level={4}>Schedule Adtran log: Target A - Campaign A</Title>
        <TableGeneral columns={columnsBudgetLog} data={budgetLog}/>
      </div>
      <div>
        <Title level={4}>Status Update</Title>
        <TableGeneral columns={columnsStatusUpdate} data={budgetLog}/>
      </div>
    </div>
  );
}

TargetDetail.getLayout = (page: any) => (
  <RootLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </RootLayout>
);