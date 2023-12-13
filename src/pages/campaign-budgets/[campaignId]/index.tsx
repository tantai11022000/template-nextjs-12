import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useRouter } from 'next/router';
import { Modal, Space, Switch, Tag, Tooltip } from 'antd';
import TableGeneral from '@/components/table';
import moment from "moment-timezone";
import RangeDatePicker from '@/components/dateTime/RangeDatePicker';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import {
  DeleteOutlined,
  EditOutlined,
  FundOutlined,
  GoldOutlined,
  CheckCircleOutlined,
  InfoCircleOutlined,
  FileTextOutlined,
  LoadingOutlined,
  UnorderedListOutlined,
  CaretUpOutlined,
  CaretDownOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined
} from '@ant-design/icons';
import SelectFilter from '@/components/commons/filters/SelectFilter';
import { changeNextPageUrl, notificationSimple } from '@/utils/CommonUtils';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import type { Dayjs } from 'dayjs';
import DateTimePicker from '@/components/dateTime/DateTimePicker';
import { getCurrentAccount } from '@/store/account/accountSlice';
import { deleteBudgetScheduleById, deleteStatusScheduleById, getScheduleBudgetLog, getScheduleStatusLog } from '@/services/campaign-budgets-services';
import { CAMPAIGN_STATUS, SCHEDULE_STATUS } from '@/enums/status';
import { NOTIFICATION_ERROR, NOTIFICATION_SUCCESS } from '@/utils/Constants';
import { SETTING_BUDGET_MODE } from '@/enums/mode';
import { ADJUST_CODE } from '@/enums/adjust';
import EditWeightTemplate from '@/components/modals/editWeightTemplate';
import { getItem } from '@/utils/StorageUtils';
import { CURRENT_ACCOUNT } from '@/utils/StorageKeys';

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

export default function CampaignDetail (props: ICampaignDetailProps) {
  const { t } = useTranslation()
  const router = useRouter()
  const currentAccount = getItem(CURRENT_ACCOUNT)
  const campaignId = router && router.query && router.query.campaignId ? router.query.campaignId : ""
  const campaignNameFromQuery = router && router.query && router.query.name ? router.query.name : ""
  const dispatch = useAppDispatch()
  const [campaignName, setCampaignName] = useState<any>(campaignNameFromQuery)
  const [budgetLog, setBudgetLog] = useState<any[]>([])
  const [statusLog, setStatusLog] = useState<any[]>([])
  const [openModalPreviewWeightTemplate, setOpenModalPreviewWeightTemplate] = useState<boolean>(false);
  const [weightTemplateInfo, setWeightTemplateInfo] = useState<any>({
    id: "",
    name: ""
  })
  const [tabs, setTabs] = useState<any[]>([])
  const [currentTab, setCurrentTab] = useState<number>(1)
  const [filterModeOptions, setFilterModeOptions] = useState<any[]>([])
  const [mode, setMode] = useState<string>('')
  const [filterOptions, setFilterOptions] = useState<any[]>([])

  const date = new Date();
  const [duration, setDuration] = useState<any>({
    startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
    endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1),
  });
  
  const [loading, setLoading] = useState<boolean>(false)
  const [paginationBudgetLog, setPaginationBudgetLog] = useState<any>({
      pageSize: 30,
      current: 1,
      total: 0,
  })
  const [paginationStatusLog, setPaginationStatusLog] = useState<any>({
      pageSize: 10,
      current: 1,
      total: 0,
  })

  useEffect(() => {
    if (campaignNameFromQuery) setCampaignName(campaignNameFromQuery)
  }, [router.query])
  
  useEffect(() => {
    setTabs([
      { id: 1, label: t('update_log_page.budget_update_log') },
      { id: 2, label: t('update_log_page.status_update') }
    ])
    setFilterModeOptions([
      { value: 'all', label: t('commons.all') },
      { value: 'one-time', label: t('commons.weight_type.one_time') },
      { value: 'daily', label: t('commons.weight_type.daily_with_weight') }
    ])
    setFilterOptions([
      { value: 1, label: t('update_log_page.update_status_schedule') },
      { value: 2, label: t('update_log_page.update_budget_schedule') },
      { value: 3, label: t('update_log_page.export') }
    ])
  }, [t])
  

  useEffect(() => {
    if (currentAccount) {
      if (currentTab == 1) fetchScheduleBudgetLog(mode, duration)
      else if (currentTab == 2) fetchScheduleStatusLog(mode, duration)
    }
  }, [currentAccount, currentTab, paginationBudgetLog?.pageSize, paginationBudgetLog?.current, paginationStatusLog?.pageSize, paginationStatusLog?.current])

  useEffect(() => {
    if (!campaignName) return
    dispatch(setBreadcrumb({data: [{label: t('breadcrumb.campaign_budgets') , url: '/campaign-budgets'}, {label: campaignName , url: ''}]}))
  },[campaignName])
  
  const fetchScheduleBudgetLog = async (mode: string, duration: any) => {
    setLoading(true)
    try {
      const {pageSize, current, total} = paginationBudgetLog
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
        setPaginationBudgetLog({
          ...paginationBudgetLog,
          pageSize: result.pagination.pageSize,
          total: result.pagination.total,
        });
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(">>> Get Budget Log Error", error)
    }
  }

  const fetchScheduleStatusLog = async (mode: string, duration: any) => {
    setLoading(true)
    try {
      const {pageSize, current, total} = paginationStatusLog
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
      const result = await getScheduleStatusLog(paths, params)
      if (result && result.data) {
        setStatusLog(result.data)
        setPaginationStatusLog({
          ...paginationStatusLog,
          pageSize: result.pagination.pageSize,
          total: result.pagination.total,
        });
      }
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.log(">>> Get Status Log Error", error)
    }
  }

  const handleOnChangeTable = (pagination: any, type: string) => {
    if (type === "BUDGET") {
      setPaginationBudgetLog({
        ...paginationBudgetLog,
        pageSize: pagination.pageSize,
        total: pagination.total,
        current: pagination.current,
      });
    } else if (type === "STATUS") {
      setPaginationStatusLog({
        ...paginationStatusLog,
        pageSize: pagination.pageSize,
        total: pagination.total,
        current: pagination.current,
      });
    }
  };

  const handleChangeModeFilter = (values: any) => {
    const { value } = values
    setMode(value)
    fetchScheduleBudgetLog(value, duration)
    fetchScheduleStatusLog(value, duration)
  };

  const handleChangeUpdateFilter = (value: any) => {
    if (value.value == 3) {
      router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-status`)
    } else if (value.value == 4) {
      router.push(`${BREADCRUMB_CAMPAIGN_BUDGET.url}/update-budget`)
    }
  };

  const renderTranslateToastifyText = (text: any) => {
    let translate = t("toastify.success.deleted_text")
    return translate.replace("{text}", text);
  }

  const handleOk = () => {
    setOpenModalPreviewWeightTemplate(false);
  };

  const handleCancel = () => {
    setOpenModalPreviewWeightTemplate(false);
  };

  const columnsBudgetLog: any = useMemo(
    () => [
      {
        title: <div className='text-center'>{t('commons.before')}</div>,
        dataIndex: 'oldBudget',
        key: 'oldBudget',
        render: (text: any, record: any) => {
          const oldBudget = Number(text)
          return <p className='text-end'>{text ? oldBudget % 1 != 0 ? `￥${Number(text).toFixed(2)}` : `￥${Number(text)}` : "NA"}</p>
        }
      },
      {
        title: <div className='text-center'>{t('commons.after')}</div>,
        dataIndex: 'newBudget',
        key: 'newBudget',
        render: (text: any, record: any) => {
          const { status, newBudget } = record
          const { adjust, mode, value } = record.detailedBySetting
          const renderBudgetValue = () => {
            let renderAdjust: any
            let renderMode: any
            let renderValue: any
            let renderColor = ''
            if (status == SCHEDULE_STATUS.UPCOMING || status == SCHEDULE_STATUS.IN_QUEUE || status == SCHEDULE_STATUS.PROCESSING) {
              if (mode == SETTING_BUDGET_MODE.DAILY || mode == SETTING_BUDGET_MODE.EXACT) {
                renderAdjust = ''
                renderValue = value
                renderMode = '￥'
              } else if (mode == SETTING_BUDGET_MODE.PERCENTAGE || mode == SETTING_BUDGET_MODE.FIXED) {
                if (mode == SETTING_BUDGET_MODE.PERCENTAGE) {
                  renderMode = '%'
                } else {
                  renderMode = '￥'
                }
                if (adjust == ADJUST_CODE.INCREASE) {
                  renderAdjust = <ArrowUpOutlined />
                  renderValue = value
                  renderColor = 'text-green'
                } else if (adjust == ADJUST_CODE.DECREASE) {
                  renderAdjust = <ArrowDownOutlined />
                  renderValue = value
                  renderColor = 'text-red'
                }
              }
            }
            return (
              <>
                {status == SCHEDULE_STATUS.UPCOMING || status == SCHEDULE_STATUS.IN_QUEUE || status == SCHEDULE_STATUS.PROCESSING 
                  ? <p className={renderColor}> {mode != SETTING_BUDGET_MODE.PERCENTAGE && '￥'}{renderValue}{mode == SETTING_BUDGET_MODE.PERCENTAGE && '%'} {renderAdjust}</p>
                  : <p>{newBudget ? Number(newBudget) % 1 != 0 ? `￥${Number(newBudget).toFixed(2)}` : `￥${Number(newBudget)}` : "NA"}</p>
                }
              </>
            )
          }
          return <p className='text-end'>{renderBudgetValue()}</p>
        }
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
              type = 'warning'
            } else if (statusData == SCHEDULE_STATUS.SUCCESSFULLY_EXECUTED) {
              status = <Tooltip placement="top" title={t('commons.status_enum.success')} arrow={true}><CheckCircleOutlined className='text-lg'/></Tooltip>
              type = 'success'
            } else if (statusData == SCHEDULE_STATUS.FAILED_EXECUTED) {
              status = <Tooltip placement="top" title={t('commons.status_enum.fail')} arrow={true}><InfoCircleOutlined className='text-lg'/></Tooltip>
              type = 'error'
            } else if (statusData == SCHEDULE_STATUS.PROCESSING) {
              status = <Tooltip placement="top" title={t('commons.status_enum.in_process')} arrow={true}><LoadingOutlined className='text-lg'/></Tooltip>
              type = 'processing'
            } else if (statusData == SCHEDULE_STATUS.IN_QUEUE) {
              status = <Tooltip placement="top" title={t('commons.status_enum.in_queue')} arrow={true}><UnorderedListOutlined className='text-lg' /></Tooltip>
              type = 'default'
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
      },
      {
        title: <div className='text-center'>{t('commons.update_time')}</div>,
        dataIndex: 'updatedDate',
        key: 'updatedDate',
        render: (_: any, record: any) => {
          const schedule = record.scheduledTime ? record.scheduledTime : ""
          return <p className='text-center'>{schedule ? moment.tz(schedule, `${process.env.NEXT_PUBLIC_TIMEZONE}`).format("YYYY-MM-DD | HH:mm:ss") : ""}</p>
        }
      },
      {
        title: <div className='text-center'>{t('commons.setting_type')}</div>,
        dataIndex: 'mode',
        key: 'mode',
        render: (_: any, record: any) => {
          const mode = record.detailedBySetting && !isNaN(record.detailedBySetting.mode) ? record.detailedBySetting.mode : ""
          const adjust = record.detailedBySetting && !isNaN(record.detailedBySetting.adjust) ? record.detailedBySetting.adjust : ""
          return (
            <Tooltip placement="top" title={`${SETTING_BUDGET_MODE[mode]} - ${ADJUST_CODE[adjust]}`} arrow={true}>
              <p className='text-center'>{mode != 3 ? t('commons.weight_type.one_time') : t('commons.weight_type.daily_with_weight')}</p>
            </Tooltip>
          )
        }
      },
      {
        title: <div className='text-center'>{t('commons.updated_by')}</div>,
        dataIndex: 'updatedBy',
        key: 'updatedBy',
        render: (_: any, record: any) => {
          const firstName = record.detailedBySetting && record.detailedBySetting.modifier.firstName ? record.detailedBySetting.modifier.firstName : ""
          const lastName = record.detailedBySetting && record.detailedBySetting.modifier.lastName ? record.detailedBySetting.modifier.lastName : ""
          return <p className='text-center'>{firstName + ' ' + lastName}</p>
        }
      },
      {
        title: <div className='text-center'>{t('commons.action')}</div>,
        dataIndex: 'action',
        key: 'action',
        render: (_: any, record: any) => {
          const { status, id, detailedBySettingId, note, scheduledTime } = record
          const { mode, adtranWeightTemplateId } = record && record.detailedBySetting
          const today = new Date();

          const handleOpenWeightTemplateInfo = (id: any) => {
            setWeightTemplateInfo({...weightTemplateInfo, id: adtranWeightTemplateId})
            setOpenModalPreviewWeightTemplate(!openModalPreviewWeightTemplate)
          }
          const renderActionType = () => {
            let action: any = ''
            if (status == SCHEDULE_STATUS.UPCOMING) {
              if (mode == SETTING_BUDGET_MODE.DAILY) {
                if (moment.tz(today, `${process.env.NEXT_PUBLIC_TIMEZONE}`).format("YYYY-MM-DD") != moment.tz(scheduledTime, `${process.env.NEXT_PUBLIC_TIMEZONE}`).format("YYYY-MM-DD")) {
                  action = (
                    <Space size="middle" className='flex justify-center'>
                      <Tooltip placement="top" title={t('commons.action_type.edit')} arrow={true}>
                        <EditOutlined className='text-lg cursor-pointer' 
                          onClick={() => router.push({
                            pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/schedule-budget`,
                            query: {
                              isEdit: true,
                              campaignIds: campaignId,
                              campaignNames: campaignName ? campaignName : "",
                              scheduleId: detailedBySettingId
                            }
                          })}
                        />
                      </Tooltip>
                      <Tooltip placement="top" title={t('commons.action_type.delete')} arrow={true}>
                        <DeleteOutlined className='text-lg cursor-pointer' onClick={() => onDeleteSchedule(id)}/>
                      </Tooltip>
                    </Space>
                  )
                } else {
                  action = ''
                }
              } else {
                action = (
                  <Space size="middle" className='flex justify-center'>
                    <Tooltip placement="top" title={t('commons.action_type.edit')} arrow={true}>
                      <EditOutlined className='text-lg cursor-pointer' 
                        onClick={() => router.push({
                          pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/schedule-budget`,
                          query: {
                            isEdit: true,
                            campaignIds: campaignId,
                            campaignNames: campaignName ? campaignName : "",
                            scheduleId: detailedBySettingId
                          }
                        })}
                      />
                    </Tooltip>
                    <Tooltip placement="top" title={t('commons.action_type.delete')} arrow={true}>
                      <DeleteOutlined className='text-lg cursor-pointer' onClick={() => onDeleteSchedule(id)}/>
                    </Tooltip>
                  </Space>
                )
              }
            } else if (status == SCHEDULE_STATUS.SUCCESSFULLY_EXECUTED) {
              if (mode == SETTING_BUDGET_MODE.DAILY) {
                action = (
                  <Space size="middle" className='flex justify-center'>
                    <Tooltip placement="top" title={t('campaign_performance_history_log_page.performance_history')} arrow={true}>
                      <FundOutlined className='text-lg cursor-pointer' onClick={() => router.push({pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/${campaignId}/history/${id}`, query: { campaignName }})}/>
                    </Tooltip>
                    <Tooltip placement="top" title={t('weight_template_page.preview_weight_template')} arrow={true}>
                      <GoldOutlined className='text-lg cursor-pointer' onClick={() => handleOpenWeightTemplateInfo(adtranWeightTemplateId)} />
                    </Tooltip>
                  </Space>
                )
              } else {
                action = (
                  <Space size="middle" className='flex justify-center'>
                    <Tooltip placement="top" title={t('campaign_performance_history_log_page.performance_history')} arrow={true}>
                      <FundOutlined className='text-lg cursor-pointer' onClick={() => router.push({pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/${campaignId}/history/${id}`, query: { campaignName }})}/>
                    </Tooltip>
                  </Space>
                )
              }
            } else if (status == SCHEDULE_STATUS.FAILED_EXECUTED) {
              action = <Tooltip placement="top" title={note ? note : t('commons.action_type.log')} arrow={true}><FileTextOutlined className='text-lg'/></Tooltip>
            } else if (status == SCHEDULE_STATUS.PROCESSING) {
              action = ''
            } else if (status == SCHEDULE_STATUS.IN_QUEUE) {
              action = ''
            }
            return action
          }

          const onDeleteSchedule = async (id: any) => {
            try {
              const params = {
                partnerAccountId: currentAccount,
                scheduleId: id
              }
              const result = await deleteBudgetScheduleById(params)
              if (result && result.message == "OK") {
                notificationSimple(renderTranslateToastifyText(t('commons.schedule')), NOTIFICATION_SUCCESS)
                fetchScheduleBudgetLog(mode, duration)
              }
            } catch (error: any) {
              console.log(">>> Delete Budget Schedule Error", error)
              notificationSimple(error.message ? error.message : t('toastify.error.default_error_message'), NOTIFICATION_ERROR)
            }
          }
          return (
            <div className='flex justify-center'>
              {renderActionType()}
            </div>
          )
        },
      },
    ], [budgetLog, t]
  )

  const columnsStatusLog: any = useMemo(
    () => [
      {
        title: <div className='text-center'>{t('commons.before')}</div>,
        dataIndex: 'oldStatus',
        key: 'oldStatus',
        render: (text: any, record: any) => {
          const oldStatus = text ? text : 'NA'
          return <p className='text-center'>{oldStatus}</p>
        }
      },
      {
        title: <div className='text-center'>{t('commons.after')}</div>,
        dataIndex: 'newStatus',
        key: 'newStatus',
        render: (_: any, record: any) => {
          const statusData = record.newStatus
          const renderStatus = () => {
            let status = ''
            let type = ''
            if (statusData == CAMPAIGN_STATUS.ENABLE) {
              status = t('commons.status_enum.enable')
              type = 'success'
            } else if (statusData == CAMPAIGN_STATUS.PAUSED) {
              status = t('commons.status_enum.paused')
              type = 'warning'
            } else if (statusData == CAMPAIGN_STATUS.ARCHIVED) {
              status = t('commons.status_enum.archived')
              type = 'processing'
            } else if (statusData == CAMPAIGN_STATUS.OTHER) {
              status = t('commons.status_enum.other')
              type = 'default'
            }
            return <Tag className='text-center uppercase' color={type}>{status}</Tag>
          }
          return (
            <div className='flex justify-center'>
                {renderStatus()}
            </div>
          );
        }
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
              type = 'warning'
            } else if (statusData == SCHEDULE_STATUS.SUCCESSFULLY_EXECUTED) {
              status = <Tooltip placement="top" title={t('commons.status_enum.success')} arrow={true}><CheckCircleOutlined className='text-lg'/></Tooltip>
              type = 'success'
            } else if (statusData == SCHEDULE_STATUS.FAILED_EXECUTED) {
              status = <Tooltip placement="top" title={t('commons.status_enum.fail')} arrow={true}><InfoCircleOutlined className='text-lg'/></Tooltip>
              type = 'error'
            } else if (statusData == SCHEDULE_STATUS.PROCESSING) {
              status = <Tooltip placement="top" title={t('commons.status_enum.in_process')} arrow={true}><LoadingOutlined className='text-lg'/></Tooltip>
              type = 'processing'
            } else if (statusData == SCHEDULE_STATUS.IN_QUEUE) {
              status = <Tooltip placement="top" title={t('commons.status_enum.in_queue')} arrow={true}><UnorderedListOutlined className='text-lg' /></Tooltip>
              type = 'default'
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
      },
      {
        title: <div className='text-center'>{t('commons.update_time')}</div>,
        dataIndex: 'updatedDate',
        key: 'updatedDate',
        render: (_: any, record: any) => {
          const schedule = record.scheduledTime ? record.scheduledTime : ""
          return <p className='text-center'>{schedule ? moment.tz(schedule, `${process.env.NEXT_PUBLIC_TIMEZONE}`).format("YYYY-MM-DD | HH:mm:ss") : ""}</p>
        }
      },
      {
        title: <div className='text-center'>{t('commons.updated_by')}</div>,
        dataIndex: 'updatedBy',
        key: 'updatedBy',
        render: (_: any, record: any) => {
          const firstName = record && record.modifier && record.modifier.firstName ? record.modifier.firstName : ""
          const lastName = record && record.modifier && record.modifier.lastName ? record.modifier.lastName : ""
          return <p className='text-center'>{firstName + ' ' + lastName}</p>
        }
      },
      {
        title: <div className='text-center'>{t('commons.log')}</div>,
        dataIndex: 'log',
        key: 'log',
        render: (_: any, record: any) => {
          const { status, id, note, scheduledTime } = record

          const renderActionType = () => {
            let action: any = ''
            if (status == SCHEDULE_STATUS.UPCOMING) {
              action = (
                <Space size="middle" className='flex justify-center'>
                  <Tooltip placement="top" title={t('commons.action_type.delete')} arrow={true}>
                    <DeleteOutlined className='text-lg cursor-pointer' onClick={() => onDeleteStatus(id)}/>
                  </Tooltip>
                </Space>
              )
            } else if (status == SCHEDULE_STATUS.SUCCESSFULLY_EXECUTED) {
              action = ''
            } else if (status == SCHEDULE_STATUS.FAILED_EXECUTED) {
              action = <Tooltip placement="top" title={note ? note : t('commons.action_type.log')} arrow={true}><FileTextOutlined className='text-lg'/></Tooltip>
            } else if (status == SCHEDULE_STATUS.PROCESSING) {
              action = ''
            } else if (status == SCHEDULE_STATUS.IN_QUEUE) {
              action = ''
            }
            return action
          }
          
          const onDeleteStatus = async (id: any) => {
            try {
              const params = {
                partnerAccountId: currentAccount,
                scheduleId: id
              }
              const result = await deleteStatusScheduleById(params)
              if (result && result.message == "OK") {
                notificationSimple(renderTranslateToastifyText(t('commons.status')), NOTIFICATION_SUCCESS)
                fetchScheduleBudgetLog(mode, duration)
              }
            } catch (error: any) {
              console.log(">>> Delete Status Schedule Error", error)
              notificationSimple(error.message ? error.message : t('toastify.error.default_error_message'), NOTIFICATION_ERROR)
            }
          }
          return (
            <div className='flex justify-center'>
              {renderActionType()}
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
      fetchScheduleStatusLog(mode, duration)
    } else {
      console.log('Clear');
    }
  };

  const onChangeTab = (id: number) => {
    setCurrentTab(id)
  }

  return (
    <div>
      <div>
        <div className='panel-heading flex items-center justify-between max-lg:flex-col max-lg:items-center'>
          <div className='tabs-container'>
            {tabs.map((tab: any) => (
              <div key={tab.id} className="tabs" onClick={() => onChangeTab(tab.id)}>
                <h2  className={`tab-item max-lg:mb-2 ${currentTab === tab.id ? "active remove-text-transform" : "remove-text-transform"}`}>{tab.label}</h2>
                <div className="line"></div>
              </div>
              ))}
          </div>
          <Space className='max-sm:flex-col max-sm:items-start'>
            <RangeDatePicker duration={duration} onRangeChange={onRangeChange}/>
            <SelectFilter placeholder={filterModeOptions && filterModeOptions.length > 0 ? filterModeOptions[0].label : ""} onChange={handleChangeModeFilter} options={filterModeOptions}/>
            {/* <SelectFilter placeholder={t('update_log_page.update_budget')} onChange={handleChangeUpdateFilter} options={filterOptions}/> */}
          </Space>
        </div>
        {currentTab == 1 
          ? <TableGeneral loading={loading} columns={columnsBudgetLog} data={budgetLog} pagination={paginationBudgetLog} handleOnChangeTable={(pagination: any) => handleOnChangeTable(pagination, "BUDGET")} />
          : <TableGeneral loading={loading} columns={columnsStatusLog} data={statusLog} pagination={paginationStatusLog} handleOnChangeTable={(pagination: any) => handleOnChangeTable(pagination, "STATUS")} />
        } 
      </div>

      {openModalPreviewWeightTemplate && (
        <Modal width={1000} open={openModalPreviewWeightTemplate} onOk={handleOk} onCancel={handleCancel} footer={null}>
          <EditWeightTemplate preview title={t('weight_template_page.preview_weight_template')} weightTemplate={weightTemplateInfo} onOk={handleOk} onCancel={handleCancel}/>
        </Modal>
      )}

      {/* {openModalConfirm && (
        <Modal open={openModalConfirm} onOk={confirmDelete} onCancel={cancelDelete} footer={null}>
          <ModalConfirmDelete openModal={openModalConfirm} onOk={confirmDelete} onCancel={cancelDelete}/>
        </Modal>
      )} */}
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
