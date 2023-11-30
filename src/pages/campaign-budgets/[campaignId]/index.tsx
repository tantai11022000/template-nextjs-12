import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useRouter } from 'next/router';
import { Space, Switch, Tag } from 'antd';
import TableGeneral from '@/components/table';
import moment from "moment";
import RangeDatePicker from '@/components/dateTime/RangeDatePicker';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import {
  DeleteOutlined,
  EditOutlined,
  FundOutlined,
  GoldOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined
} from '@ant-design/icons';
import SelectFilter from '@/components/commons/filters/SelectFilter';
import { changeNextPageUrl } from '@/utils/CommonUtils';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import type { Dayjs } from 'dayjs';
import DateTimePicker from '@/components/dateTime/DateTimePicker';
import { getCurrentAccount } from '@/store/account/accountSlice';
import { getScheduleBudgetLog } from '@/services/campaign-budgets-services';
import { SCHEDULE_STATUS } from '@/enums/status';

export const getStaticPaths = async () => {
  return {
    paths: [],
    fallback: 'blocking'
  }
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
    value: 1,
    label: 'One Time'
  },
  {
    value: 2,
    label: 'Daily With Weight'
  },
]

export default function CampaignDetail (props: ICampaignDetailProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const currentAccount = useAppSelector(getCurrentAccount);
  const campaignId = router && router.query && router.query.campaignId ? router.query.campaignId : ""
  const campaignName = router && router.query && router.query.name ? router.query.name : ""
  const dispatch = useAppDispatch()
  const [budgetLog, setBudgetLog] = useState<any[]>([])
  const [statusLog, setStatusLog] = useState<any[]>([])
  const [filterModeOptions, setFilterModeOptions] = useState<any[]>([
    {
      value: 'all',
      label: 'All'
    },
    {
      value: 'one-time',
      label: t('commons.weight_type.one_time')
    },
    {
      value: 'daily',
      label: t('commons.weight_type.daily_with_weight')
    },
  ])
  const [mode, setMode] = useState<string>('')
  const [filterOptions, setFilterOptions] = useState<any[]>([
    {
      value: 1,
      label: t('update_log_page.update_status_schedule')
    },
    {
      value: 2,
      label: t('update_log_page.update_budget_schedule')
    },
    {
      value: 3,
      label: t('update_log_page.export')
    },
  ])

  const date = new Date();
  const [duration, setDuration] = useState<any>({
    startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 30),
    endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate()),
  });
  
  const [loading, setLoading] = useState<boolean>(false)
  const [turnOn, setTurnOn] = useState<boolean>(false)
  const [pagination, setPagination] = useState<any>({
    budgetLog: {
      pageSize: 30,
      current: 1,
      total: 0,
    },
    statusLog: {
      pageSize: 2,
      current: 1,
      total: 0,
    }
  })
  useEffect(() => {
    if (currentAccount) fetchScheduleBudgetLog(mode, duration)
  }, [currentAccount, pagination.budgetLog.pageSize, pagination.budgetLog.current])

  useEffect(() => {
    if (!campaignId) return
    dispatch(setBreadcrumb({data: [BREADCRUMB_CAMPAIGN_BUDGET, {label: campaignId , url: ''}]}))
  },[campaignId])
  
  const fetchScheduleBudgetLog = async (mode: string, duration: any) => {
    setLoading(true)
    try {
      const {pageSize, current, total} = pagination.budgetLog
      const paths = {
        campaignId,
        partnerAccountId: currentAccount
      }
      const params = {
        page: current,
        pageSize,
        total,
        mode,
        from: duration && duration.startDate ? moment(duration.startDate).format("YYYY-MM-DD") : "",
        to: duration && duration.endDate ? moment(duration.endDate).format("YYYY-MM-DD") : "",
      }
      const result = await getScheduleBudgetLog(paths, params)
      if (result && result.data) {
        setBudgetLog(result.data)
        setPagination({
          ...pagination,
          budgetLog: {
            ...pagination.budgetLog,
            pageSize: result.pagination.pageSize,
            total: result.pagination.total,
          },
        });
      }
      setLoading(false)
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

  const handleChangeModeFilter = (values: any) => {
    const { value } = values
    setMode(value)
    fetchScheduleBudgetLog(value, duration)
  };

  const handleChangeUpdateFilter = (value: any) => {
    if (value.value == 3) {
      router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-status`)
    } else if (value.value == 4) {
      router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-budget`)
    }
  };

  const columnsBudgetLog: any = useMemo(
    () => [
      {
        title: <div className='text-center'>{t('commons.before')}</div>,
        dataIndex: 'oldBudget',
        key: 'oldBudget',
        render: (text: any) => <p className='text-end'>{text ? `￥ ${text}` : "NA"}</p>,

        onFilter: (value: string, record: any) => record.oldBudget.indexOf(value) === 0,
        // sorter: (a: any, b: any) => a.oldBudget - b.oldBudget,
      },
      {
        title: <div className='text-center'>{t('commons.after')}</div>,
        dataIndex: 'newBudget',
        key: 'newBudget',
        render: (text: any) => <p className='text-end'>{text ? `￥ ${text}` : "NA"}</p>,

        onFilter: (value: string, record: any) => record.newBudget.indexOf(value) === 0,
        // sorter: (a: any, b: any) => a.newBudget - b.newBudget,
      },
      {
        title: <div className='text-center'>{t('commons.status')}</div>,
        dataIndex: 'status',
        key: 'status',
        render: (_: any, record: any) => {
          const statusData = record.status
          const renderStatus = () => {
            let status: any = ''
            let type = ''
            if (statusData == SCHEDULE_STATUS.UPCOMING) {
              status = t('commons.status_enum.upcoming')
              type = 'success'
            } else if (statusData == SCHEDULE_STATUS.SUCCESSFULLY_EXECUTED) {
              status = <CheckCircleOutlined />
              type = 'warning'
            } else if (statusData == SCHEDULE_STATUS.FAILED_EXECUTED) {
              status = <InfoCircleOutlined />
              type = 'processing'
            }
            return (
              <>
                {typeof status == 'string' ? <Tag className='text-center uppercase' color={type}>{status}</Tag> : <>{status}</>}
              </>
            )
          }
        return (
            <div className='flex justify-center uppercase'>
              {renderStatus()}
            </div>
        );
        },
        // sorter: (a: any, b: any) => a.status - b.status,
      },
      {
        title: <div className='text-center'>{t('commons.update_time')}</div>,
        dataIndex: 'updatedDate',
        key: 'updatedDate',
        render: (text: any) => <p className='text-center'>{text ? moment(text).format("YYYY-MM-DD | hh:mm:ss") : ""}</p>,
      },
      {
        title: <div className='text-center'>{t('commons.setting_type')}</div>,
        dataIndex: 'mode',
        key: 'mode',
        render: (_: any, record: any) => {
          const mode = record.detailedBySetting && record.detailedBySetting.mode ? record.detailedBySetting.mode : ""
          return <p className='text-center'>{mode != 3 ? t('commons.weight_type.one_time') : t('commons.weight_type.daily_with_weight')}</p>
        },

        // sorter: (a: any, b: any) => a.settingType - b.settingType
      },
      {
        title: <div className='text-center'>{t('commons.updated_by')}</div>,
        dataIndex: 'updatedBy',
        key: 'updatedBy',
        render: (_: any, record: any) => {
          const firstName = record.detailedBySetting && record.detailedBySetting.modifier.firstName ? record.detailedBySetting.modifier.firstName : ""
          const lastName = record.detailedBySetting && record.detailedBySetting.modifier.lastName ? record.detailedBySetting.modifier.lastName : ""
          return <p className='text-center'>{firstName + ' ' + lastName}</p>
        },

        // sorter: (a: any, b: any) => a.userUpdate - b.userUpdate
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
                  <FundOutlined className='text-lg cursor-pointer is-link' onClick={() => router.push({pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/${campaignId}/history/${id}`, query: { campaignName }})}/>
                  <GoldOutlined className='text-lg cursor-pointer' />
                </Space>
              </div>
            )
        },
      },
    ], [budgetLog, t]
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
        // sorter: (a: any, b: any) => a.status - b.status,
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

        // sorter: (a: any, b: any) => a.settingType - b.settingType
      },
      {
        title: <div className='text-center'>{t('commons.updated_by')}</div>,
        dataIndex: 'userUpdate',
        key: 'userUpdate',
        render: (text: any) => <p>{text}</p>,

        // sorter: (a: any, b: any) => a.userUpdate - b.userUpdate
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
    ], [statusLog, t]
  )

  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      // console.log('From: ', dates[0], ', to: ', dates[1]);
      // console.log('From: ', dateStrings[0], ', to: ', dateStrings[1]);
      const duration = {
        startDate: dateStrings[0],
        endDate: dateStrings[1]
      }
      setDuration(duration)
      fetchScheduleBudgetLog(mode, duration)
    } else {
      console.log('Clear');
    }
  };

  return (
    <div>
      <div>
        <div className='panel-heading flex items-center justify-between max-lg:flex-col max-lg:items-start'>
          <h2 className='max-lg:mb-2'>{t('update_log_page.budget_update_log')}</h2>
          <Space className='max-sm:flex-col'>
            <RangeDatePicker duration={duration} onRangeChange={onRangeChange}/>
            <SelectFilter placeholder={filterModeOptions[0].label} onChange={handleChangeModeFilter} options={filterModeOptions}/>
            {/* <SelectFilter placeholder={t('update_log_page.update_budget')} onChange={handleChangeUpdateFilter} options={filterOptions}/> */}
          </Space>
        </div>
        <TableGeneral loading={loading} columns={columnsBudgetLog} data={budgetLog} pagination={pagination.budgetLog} handleOnChangeTable={(pagination: any) => handleOnChangeTable(pagination, "BUDGET")} />
      </div>
      <div className='mt-6'>
        <div className='panel-heading flex items-center justify-between'>
          <h2>{t('update_log_page.status_update')}</h2>
          <RangeDatePicker duration={duration} onRangeChange={onRangeChange}/>
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
