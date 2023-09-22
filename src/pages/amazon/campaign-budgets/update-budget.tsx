import React, { useMemo, useState } from 'react';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';
import Title from 'antd/es/typography/Title';
import { Button, Select, Space, Tag } from 'antd';
import UploadFile from '@/components/uploadFile';
import TableGeneral from '@/components/table';
import Link from 'next/link';
import moment from 'moment';

export interface IUpdateCampaignBudgetProps {
}

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

const FILES = [
  {
    id: 1,
    status: "valid",
    campaign: "Campaign A",
    campaignId: "CA121313",
    budget: 10000,
    fromTime: "2023-08-25T12:10:59.000Z",
    toTime: "2023-08-28T09:27:24.000Z"
  },
  {
    id: 2,
    status: "valid",
    campaign: "Campaign A",
    campaignId: "CA121313",
    budget: 10000,
    fromTime: "2023-08-25T12:10:59.000Z",
    toTime: "2023-08-28T09:27:24.000Z"
  },
  {
    id: 3,
    status: "invalid",
    campaign: "Campaign A",
    campaignId: "CA121313",
    budget: 10000,
    fromTime: "2023-08-25T12:10:59.000Z",
    toTime: "2023-08-28T09:27:24.000Z"
  },
  {
    id: 4,
    status: "invalid",
    campaign: "Campaign A",
    campaignId: "CA121313",
    budget: 10000,
    fromTime: "2023-08-25T12:10:59.000Z",
    toTime: "2023-08-28T09:27:24.000Z"
  },
  {
    id: 5,
    status: "invalid",
    campaign: "Campaign A",
    campaignId: "CA121313",
    budget: 10000,
    fromTime: "2023-08-25T12:10:59.000Z",
    toTime: "2023-08-28T09:27:24.000Z"
  },
]

export default function UpdateCampaignBudget (props: IUpdateCampaignBudgetProps) {
  const [partnerAccount, setPartnerAccount] = useState<any[]>(PARTNER_ACCOUNT)
  const [step, setStep] = useState<number>(1)
  const [previewFile, setPreviewFile] = useState<any[]>(FILES)

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  
  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const filterOption = (input: string, option: any) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const columnsBudgetLog: any = useMemo(
    () => [
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
        sorter: (a: any, b: any) => a.campaign.localeCompare(b.campaign),
      },
      {
        title: 'Campaign Name',
        dataIndex: 'campaign',
        key: 'campaign',
        render: (text: any) => <p>{text}</p>,

        onFilter: (value: string, record: any) => record.campaign.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.campaign - b.campaign,
      },
      {
        title: 'Campaign ID',
        dataIndex: 'campaignId',
        key: 'campaignId',
        render: (text: any) => <p>{text}</p>,

        onFilter: (value: string, record: any) => record.campaignId.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.campaignId - b.campaignId,
      },
      {
        title: 'Budget',
        dataIndex: 'budget',
        key: 'budget',
        render: (text: any) => <p className='text-end'>{text ? `JPY ${text}` : "NA"}</p>,

        onFilter: (value: string, record: any) => record.budget.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.budget - b.budget,
      },
      {
        title: <div className='text-center'>From Time</div>,
        dataIndex: 'fromTime',
        key: 'fromTime',
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("DD/MM/YYYY - hh:mm:ss") : ""} GMT+9</p>,
      },
      {
        title: <div className='text-center'>To Time</div>,
        dataIndex: 'toTime',
        key: 'toTime',
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("DD/MM/YYYY - hh:mm:ss") : ""} GMT+9</p>,
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
                </Space>
            )
        },
      },
    ], [previewFile]
  )

  return (
    <div className='text-black'>
      {step == 1 ? (
        <>
          <Title level={4}>Update Campaign Budgets Schedule</Title>
          <div className='flex items-center'>
            <p className='mr-2'>Status</p>
            <Select
              showSearch
              placeholder="Select Partner Account"
              optionFilterProp="children"
              onChange={onChange}
              onSearch={onSearch}
              filterOption={filterOption}
              options={partnerAccount}
            />
          </div>
          <div className='flex items-center'>
            <p className='mr-2'>Schedule File</p>
            <UploadFile/>
          </div>
          <Button onClick={() => setStep(2)}>Next</Button>
        </>
      ) : step == 2 ? (
        <>
          <Title level={4}>Update Campaign Budgets Schedule - Validate and live Edit</Title>
          <Button onClick={() => setStep(1)}>Back</Button>
          <TableGeneral columns={columnsBudgetLog} data={previewFile}/>
        </>
      ) : null}
    </div>
  );
}

UpdateCampaignBudget.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);