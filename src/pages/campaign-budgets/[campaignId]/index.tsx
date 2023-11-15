import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useRouter } from 'next/router';
import { Space, Switch, Tag } from 'antd';
import TableGeneral from '@/components/table';
import moment from "moment";
import RangeDatePicker from '@/components/dateTime/RangeDatePicker';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import { useAppDispatch } from '@/store/hook';
import {
  DeleteOutlined,
  EditOutlined,
  FundOutlined,
  GoldOutlined
} from '@ant-design/icons';
import SelectFilter from '@/components/commons/filters/SelectFilter';
import { changeNextPageUrl } from '@/utils/CommonUtils';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';

export const getStaticPaths = async () => {
  const campaignIds: any[] = [];
  const paths = campaignIds.map((id: any) => ({
    params: { type: [id.toString()] },
  }));
  return { paths, fallback: true };
};

export async function getStaticProps(context: any) {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale: 'en'
    },
  }
}

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
  const { t } = useTranslation()
  const router = useRouter()
  const id = router && router.query && router.query.campaignId ? router.query.campaignId : ""
  const dispatch = useAppDispatch()
  const [budgetLog, setBudgetLog] = useState<any[]>([])
  const [statusLog, setStatusLog] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [turnOn, setTurnOn] = useState<boolean>(false)
  const [pagination, setPagination] = useState<any>({
    budgetLog: {
      pageSize: 2,
      current: 1,
      total: 0,
    },
    statusLog: {
      pageSize: 3,
      current: 1,
      total: 0,
    }
  })
  useEffect(() => {
    init()
  }, [])

  useEffect(() => {
    if (!id) return
    dispatch(setBreadcrumb({data: [BREADCRUMB_CAMPAIGN_BUDGET, {label: id , url: ''}]}))
  },[id])

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

  const handleOnChangeTable = (pagination: any, type: string) => {
    console.log(">>> handleOnChangeTable pagination", pagination)
    if (type === "BUDGET") {
      setPagination({
        ...pagination,
        budgetLog: {
          ...pagination.budgetLog,
          total: pagination.total,
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
      });
    } else if (type === "STATUS") {
      setPagination({
        ...pagination,
        statusLog: {
          ...pagination.statusLog,
          total: pagination.total,
          current: pagination.current,
          pageSize: pagination.pageSize,
        },
      });
    }
  };

  const handleChange = (value: string) => {
    console.log(`selected ${value}`);
  };

  const columnsBudgetLog: any = useMemo(
    () => [
      {
        title: <div className='text-center'>{t('commons.before')}</div>,
        dataIndex: 'before',
        key: 'before',
        render: (text: any) => <p className='text-end'>{text ? `￥ ${text}` : "NA"}</p>,

        onFilter: (value: string, record: any) => record.before.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.before - b.before,
      },
      {
        title: <div className='text-center'>{t('commons.after')}</div>,
        dataIndex: 'after',
        key: 'after',
        render: (text: any) => <p className='text-end'>{text ? `￥ ${text}` : "NA"}</p>,

        onFilter: (value: string, record: any) => record.after.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.after - b.after,
      },
      {
        title: <div className='text-center'>{t('commons.status')}</div>,
        dataIndex: 'status',
        key: 'status',
        render: (text: any) => {
          const renderStatus = () => {
            let status = ''
            let type = ''
            if (text == "active") {
              status = t('commons.status_enum.active')
              type = 'success'
            } else if (text == 'inactive') {
              status = t('commons.status_enum.inactive')
              type = 'error'
            } else if (text == 'upcoming') {
              status = t('commons.status_enum.upcoming')
              type = 'processing'
            }
            return <Tag color={type} className='uppercase'>{status}</Tag>
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
        title: <div className='text-center'>{t('commons.update_time')}</div>,
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("YYYY-MM-DD / hh:mm:ss") : ""}</p>,
      },
      {
        title: <div className='text-center'>{t('commons.setting_type')}</div>,
        dataIndex: 'settingType',
        key: 'settingType',
        render: (text: any) => <p>{text == "One-time" ? t('commons.weight_type.one_time') : t('commons.weight_type.daily_with_weight')}</p>,

        sorter: (a: any, b: any) => a.settingType - b.settingType
      },
      {
        title: <div className='text-center'>{t('commons.updated_by')}</div>,
        dataIndex: 'userUpdate',
        key: 'userUpdate',
        render: (text: any) => <p>{text}</p>,

        sorter: (a: any, b: any) => a.userUpdate - b.userUpdate
      },
      {
        title: <div className='text-center'>{t('commons.action')}</div>,
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
        title: <div className='text-center'>{t('commons.action')}</div>,
        dataIndex: 'action',
        key: 'action',
        render: (_: any, record: any) => {
          let { status } = record

          const handleChangeStatus = (value: any) => {
            console.log(`Status is ${value}`);
            if (value == false) {
              setTurnOn(false)
            } else if (value == true) {
              setTurnOn(true)
            }
          };

          return (
              <div className='flex justify-center'>
                <Switch checked={turnOn ? true : false} onChange={handleChangeStatus}/>
              </div>
          )
        }
      },
      {
        title: <div className='text-center'>{t('commons.status')}</div>,
        dataIndex: 'status',
        key: 'status',
        render: (text: any) => {
          const renderStatus = () => {
            let status = ''
            let type = ''
            if (text == "active") {
              status = t('commons.status_enum.active')
              type = 'success'
            } else if (text == 'inactive') {
              status = t('commons.status_enum.inactive')
              type = 'error'
            } else if (text == 'upcoming') {
              status = t('commons.status_enum.upcoming')
              type = 'processing'
            }
            return <Tag color={type} className='uppercase'>{status}</Tag>
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
        title: <div className='text-center'>{t('commons.update_time')}</div>,
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("YYYY-MM-DD / hh:mm:ss") : ""}</p>,
      },
      {
        title: <div className='text-center'>{t('commons.setting_type')}</div>,
        dataIndex: 'settingType',
        key: 'settingType',
        render: (text: any) => <p>{text == "One-time" ? t('commons.weight_type.one_time') : t('commons.weight_type.daily_with_weight')}</p>,

        sorter: (a: any, b: any) => a.settingType - b.settingType
      },
      {
        title: <div className='text-center'>{t('commons.updated_by')}</div>,
        dataIndex: 'userUpdate',
        key: 'userUpdate',
        render: (text: any) => <p>{text}</p>,

        sorter: (a: any, b: any) => a.userUpdate - b.userUpdate
      },
      {
        title: <div className='text-center'>{t('commons.log')}</div>,
        dataIndex: 'log',
        key: 'log',
        render: (_: any, record: any) => {
          return (
            <div className='flex justify-center'>
              <Space size="middle" className='flex justify-center'>
                  <EditOutlined className='text-lg cursor-pointer' />
                  <DeleteOutlined className='text-lg cursor-pointer'/>
                  <FundOutlined className='text-lg cursor-pointer'/>
                  <GoldOutlined className='text-lg cursor-pointer' />
                </Space>
            </div>
          )
        },
      },
    ], [statusLog]
  )



  return (
    <div>
      <div>
        <div className='panel-heading flex items-center justify-between'>
          <h2>{t('update_log_page.budget_update_log')}</h2>
          <Space>
            <RangeDatePicker/>
            <SelectFilter placeholder={"Update Budget"} onChange={handleChange} options={statusLog}/>
          </Space>
        </div>
        <TableGeneral loading={loading} columns={columnsBudgetLog} data={budgetLog} pagination={pagination.budgetLog} handleOnChangeTable={(pagination: any) => handleOnChangeTable(pagination, "BUDGET")} />
      </div>
      <div className='mt-6'>
        <div className='panel-heading flex items-center justify-between'>
          <h2>{t('update_log_page.status_update')}</h2>
          <RangeDatePicker/>
        </div>
        <TableGeneral loading={loading} columns={columnsStatusLog} data={statusLog} pagination={pagination.statusLog} handleOnChangeTable={(pagination: any) => handleOnChangeTable(pagination, "STATUS")} />
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
