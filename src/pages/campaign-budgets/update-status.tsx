import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { Button, Form, Modal, Select, Space, Tag, Typography } from 'antd';
import UploadFile from '@/components/uploadFile';
import TableGeneral from '@/components/table';
import Link from 'next/link';
import moment from 'moment';
import FSelect from '@/components/form/FSelect';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getAccountList } from '@/store/account/accountSlice';
import FUploadFile from '@/components/form/FUploadFile';
import ConfirmSetupBudgetSchedule from '@/components/modals/confirmSetupBudgetSchedule';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/components/breadcrumb-context/constant';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';

export interface IUpdateCampaignStatusProps {
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

export default function UpdateCampaignStatus (props: IUpdateCampaignStatusProps) {
  const { Title } = Typography
  const dispatch = useAppDispatch()
  const [form]:any = Form.useForm();
  const [loading, setLoading] = useState<boolean>(false)
  const accountList = useAppSelector(getAccountList);
  const [reGenerateDataAccountList, setReGenerateDataAccountList] = useState<any[]>([])

  const [partnerAccount, setPartnerAccount] = useState<any[]>(PARTNER_ACCOUNT)
  const [step, setStep] = useState<number>(1)
  const [previewFile, setPreviewFile] = useState<any[]>([])
  const [openModalConfirmSetupBudgetSchedule, setOpenModalConfirmSetupBudgetSchedule] = useState<boolean>(false)

  useEffect(() => {
    const newData = accountList.map((account:any) => ({
      value: account.id,
      label: account.name
    }))
    setReGenerateDataAccountList(newData)
  }, [accountList])

  useEffect(() => {
    init()
    dispatch(setBreadcrumb({data: [BREADCRUMB_CAMPAIGN_BUDGET, {label: 'Update Campaign Status' , url: ''}]}))
  }, [])

  const init = () => {
    getFilePreview()
  }
  

  const getFilePreview = async () => {
    setLoading(true)
    try {
      setTimeout(() => {
        setPreviewFile(FILES)
        setLoading(false)
      }, 1000);
    } catch (error) {
      setLoading(false)
      console.log(">>> Get File Preview Error", error)
    }
  }

  const onChange = (value: string) => {
    console.log(`selected ${value}`);
  };
  
  const onSearch = (value: string) => {
    console.log('search:', value);
  };

  const filterOption = (input: string, option: any) =>
  (option?.label ?? '').toLowerCase().includes(input.toLowerCase());

  const onSave = async (value: any) => {
    console.log(">>> value", value)
    setStep(2)
  }

  const onSaveFail = (value: any) => {
    console.log('>>> value', value);
  }

  const handleFinish = () => {
    setOpenModalConfirmSetupBudgetSchedule(!openModalConfirmSetupBudgetSchedule)
  }

  const handleOk = () => {
    setOpenModalConfirmSetupBudgetSchedule(false);
  };

  const handleCancel = () => {
    setOpenModalConfirmSetupBudgetSchedule(false);
  };

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
        render: (text: any) => <p className='text-end'>{text ? `￥ ${text}` : "NA"}</p>,

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
                    <Link href={`${BREADCRUMB_CAMPAIGN_BUDGET.url}/${id}/history`}>Edit</Link>
                </Space>
            )
        },
      },
    ], [previewFile]
  )

  return (
    <div className='text-black'>
      {step == 1 ? (
        // <>
        //   <Title level={4}>Update Campaign Status Schedule</Title>
        //   <div className='flex items-center'>
        //     <p className='mr-2'>Status</p>
        //     <Select
        //       showSearch
        //       placeholder="Select Partner Account"
        //       optionFilterProp="children"
        //       onChange={onChange}
        //       onSearch={onSearch}
        //       filterOption={filterOption}
        //       options={partnerAccount}
        //     />
        //   </div>
        //   <div className='flex items-center'>
        //     <p className='mr-2'>Schedule File</p>
        //     <UploadFile/>
        //   </div>
        //   <Button onClick={() => setStep(2)}>Next</Button>
        // </>
        <>
          <Title level={4}>Update Campaign Status Schedule</Title>
          <Form
            form= {form}
            onFinish={onSave}
            onFinishFailed={onSaveFail}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            <FSelect name={'partnerAccount'} label={'Partner Account'} placeholder={'Select Partner Account'} options={reGenerateDataAccountList}/>
            <FUploadFile name={'file'} label={'Schedule File'}/>

            <Space size="middle" className='flex justify-center'>
              <Button className='bg-primary text-white' htmlType="submit" >Next</Button>
            </Space>
          </Form>
        </>
      ) : step == 2 ? (
        <>
          <Title level={4}>Update Campaign Budgets Schedule - Validate and live Edit</Title>
          <TableGeneral loading={loading} columns={columnsBudgetLog} data={previewFile}/>
          <div className='w-full flex items-center justify-between'>
            <Button onClick={() => setStep(1)}>Back</Button>
            <Button onClick={handleFinish}>Finish</Button>
          </div>
        </>
      ) : null}

      {openModalConfirmSetupBudgetSchedule && (
        <Modal title="Existing Budget Schedule Warning" open={openModalConfirmSetupBudgetSchedule} onOk={handleOk} onCancel={handleCancel}>
          <ConfirmSetupBudgetSchedule/>
        </Modal>
      )}
    </div>
  );
}

UpdateCampaignStatus.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  )
};