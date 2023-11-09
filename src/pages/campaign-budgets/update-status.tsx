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
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import {
  DeleteOutlined,
  EditOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { changeNextPageUrl } from '@/utils/CommonUtils';
import ActionButton from '@/components/commons/buttons/ActionButton';
import { LeftOutlined, RightOutlined } from '@ant-design/icons';

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
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [form]:any = Form.useForm();
  const accountList = useAppSelector(getAccountList);

  const [loading, setLoading] = useState<boolean>(false)
  const [reGenerateDataAccountList, setReGenerateDataAccountList] = useState<any[]>([])
  const [step, setStep] = useState<number>(1)
  const [previewFile, setPreviewFile] = useState<any[]>([])
  const [openModalConfirmSetupBudgetSchedule, setOpenModalConfirmSetupBudgetSchedule] = useState<boolean>(false)
  const [pagination, setPagination] = useState<any>({
    pageSize: 10,
    current: 1,
    total: 0,
  })

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

  const handleOnChangeTable = (pagination:any, filters: any, sorter: any) => {
    const { current } = pagination
    changeNextPageUrl(router, current)
    setPagination(pagination)
  }

  const columnsBudgetLog: any = useMemo(
    () => [
      {
        title: <div className='text-center'>Status</div>,
        dataIndex: 'status',
        key: 'status',
        render: (text: any) => {
          const renderStatus = () => {
            let status = ''
            let type = ''
            if (text == "valid") {
              status = 'VALID'
              type = 'success'
            } else if (text == 'invalid') {
              status = 'invalid'
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
        title: <div className='text-center'>Campaign Name</div>,
        dataIndex: 'campaign',
        key: 'campaign',
        render: (text: any) => <p>{text}</p>,

        onFilter: (value: string, record: any) => record.campaign.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.campaign - b.campaign,
      },
      {
        title: <div className='text-center'>Campaign ID</div>,
        dataIndex: 'campaignId',
        key: 'campaignId',
        render: (text: any) => <p>{text}</p>,

        onFilter: (value: string, record: any) => record.campaignId.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.campaignId - b.campaignId,
      },
      {
        title: <div className='text-center'>Budget</div>,
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
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("YYYY-MM-DD / hh:mm:ss") : ""} GMT+9</p>,
      },
      {
        title: <div className='text-center'>To Time</div>,
        dataIndex: 'toTime',
        key: 'toTime',
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("YYYY-MM-DD / hh:mm:ss") : ""} GMT+9</p>,
      },
      {
        title: <div className='text-center'>Action</div>,
        dataIndex: 'action',
        key: 'action',
        render: (_: any, record: any) => {
          const {id} = record
          return (
              <Space size="middle" className='w-full flex justify-center'>
                  <EditOutlined className='text-lg cursor-pointer' onClick={() => router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/${id}/history`)}/>
              </Space>
          )
        },
      },
    ], [previewFile]
  )

  return (
    <>
      {step == 1 ? (
        <div>
          <div className='panel-heading flex items-center justify-between'>
            <h2>Update Campaign Status Schedule</h2>
          </div>
          <div className='form-container'>
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

              <Space size="middle" className='w-full flex justify-end'>
                <ActionButton htmlType={"submit"} className={'next-button'} iconOnRight={<RightOutlined />} label={'Next'}/>
              </Space>
            </Form>
          </div>
        </div>
      ) : step == 2 ? (
        <div>
          <div className='panel-heading flex items-center justify-between'>
            <h2>Update Campaign Budgets Schedule - Validate and live Edit</h2>
          </div>
          <TableGeneral loading={loading} columns={columnsBudgetLog} data={previewFile ? previewFile : []} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
          <div className='w-full flex items-center justify-between'>
            <ActionButton className={'back-button'} iconOnLeft={<LeftOutlined />} label={'Back'} onClick={() => setStep(1)}/>
            <ActionButton className={'finish-button'} label={'Finish'} onClick={handleFinish}/>
          </div>
        </div>
      ) : null}

      {openModalConfirmSetupBudgetSchedule && (
        <Modal title="Existing Budget Schedule Warning" open={openModalConfirmSetupBudgetSchedule} onOk={handleOk} onCancel={handleCancel}>
          <ConfirmSetupBudgetSchedule/>
        </Modal>
      )}
    </>
  );
}

UpdateCampaignStatus.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  )
};