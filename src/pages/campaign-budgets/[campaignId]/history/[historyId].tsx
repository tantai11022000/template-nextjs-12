import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { Button, Space, Tag, Typography } from 'antd';
import TableGeneral from '@/components/table';
import moment from 'moment-timezone';
import RangeDatePicker from '@/components/dateTime/RangeDatePicker';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import { useAppDispatch } from '@/store/hook';
import { useRouter } from 'next/router';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import SelectFilter from '@/components/commons/filters/SelectFilter';
import { changeNextPageUrl } from '@/utils/CommonUtils';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { getCampaignPerformanceHistoryLog } from '@/services/campaign-budgets-services';
import type { Dayjs } from 'dayjs';

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

export interface IBudgetHistoryProps {
  
}

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
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const campaignName = router && router.query && router.query.campaignName ? router.query.campaignName : ""
  const campaignId = router && router.query && router.query.campaignId ? router.query.campaignId : ""
  const historyId = router && router.query && router.query.historyId ? router.query.historyId : ""
  const [loading, setLoading] = useState<boolean>(false)
  const [budgetHistory, setBudgetHistory] = useState<any[]>([])
  const [exportType, setExportType] = useState<any[]>([])
  const [pagination, setPagination] = useState<any>({
    pageSize: 30,
    current: 1,
    total: 0,
  })

  const date = new Date();
  const [duration, setDuration] = useState<any>({
    startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 5),
    endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
  });
  const [showTimePanel, setShowTimePanel] = useState<boolean>(false)

  useEffect(() => {
    setExportType([
      { value: 'csv', label: t('commons.csv') },
      { value: 'excel', label: t('commons.excel') }
    ])
  }, [t])
  

  useEffect(() => {
    getBudgetHistory(duration)
  }, [pagination.pageSize, pagination.current])

  useEffect(() => {
    if (!historyId || !campaignId) return
    dispatch(setBreadcrumb({data: [{label: t('breadcrumb.campaign_budgets') , url: '/campaign-budgets'}, { label: campaignName, url: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/${campaignId}`}, { label: t('breadcrumb.performance_history'), url: ``}]}))
  }, [historyId, campaignId])

  const init = () => {
    getBudgetHistory(duration)
  }

  const getBudgetHistory = async (duration: any) => {
    setLoading(true)
    try {
      const { pageSize, current } = pagination
      var params = {
        page: current,
        pageSize,
        from: duration && duration.startDate ? moment(duration.startDate).format(showTimePanel ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD") : "",
        to: duration && duration.endDate ? moment(duration.endDate).format(showTimePanel ? "YYYY-MM-DD HH:mm" : "YYYY-MM-DD") : "",
      }
      const result = await getCampaignPerformanceHistoryLog(campaignId, params)
      if (result && result.data) {
        setBudgetHistory(result.data)
      }
      setLoading(false)
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
    // changeNextPageUrl(router, current)
    setPagination(pagination)
  }
  
  const columnsBudgetLog: any = useMemo(
    () => [
      {
        title: <div className='text-center'>{t('commons.time')}</div>,
        dataIndex: 'updateTime',
        key: 'updateTime',
        render: (_: any, record: any) => {
          const time = record.date ? record.date : "-"
          return <p className='text-center'>{moment.tz(time, `${process.env.NEXT_PUBLIC_TIMEZONE}`).format(showTimePanel ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD")}</p>
        },
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
        }
      },
      {
        title: <div className='text-center'>{t('metrics.imp')}</div>,
        dataIndex: 'imp',
        key: 'imp',
        render: (_: any, record: any) => {
          const imp = record.metrics && record.metrics.impressions ? record.metrics.impressions : "-"
          return <p className='text-end'>{imp}</p>
        }
      },
      {
        title: <div className='text-center'>{t('metrics.click')}</div>,
        dataIndex: 'click',
        key: 'click',
        render: (_: any, record: any) => {
          const click = record.metrics && record.metrics.clicks ? record.metrics.clicks : "-"
          return <p className='text-end'>{click}</p>
        }
      },
      {
        title: <div className='text-center'>{t('metrics.cpm')}</div>,
        dataIndex: 'cpm',
        key: 'cpm',
        render: (text: any, record: any) => {
          const cpm = record.metrics && record.metrics.cpm ? Number(record.metrics.cpm) : 0
          return  <p className='text-end'>{cpm ? cpm % 1 != 0 ? `￥${Number(cpm).toFixed(2)}` : `￥${Number(cpm)}` : "-"}</p>
        }
      },
      {
        title: <div className='text-center'>{t('metrics.sale')}</div>,
        dataIndex: 'sale',
        key: 'sale',
        render: (text: any, record: any) => {
          const sales = record.metrics && record.metrics.sales ? Number(record.metrics.sales) : 0
          return  <p className='text-end'>{sales ? sales % 1 != 0 ? `￥${Number(sales).toFixed(2)}` : `￥${Number(sales)}` : "-"}</p>
        }
      },
      {
        title: <div className='text-center'>{t('metrics.cv')}</div>,
        dataIndex: 'cv',
        key: 'cv',
        render: (text: any, record: any) => {
          const cv = record.metrics && record.metrics.cv ? Number(record.metrics.cv) : 0
          return  <p className='text-end'>{cv ? cv % 1 != 0 ? `￥${Number(cv).toFixed(2)}` : `￥${Number(cv)}` : "-"}</p>
        }
      },
      {
        title: <div className='text-center'>{t('metrics.cost')}</div>,
        dataIndex: 'cost',
        key: 'cost',
        render: (text: any, record: any) => {
          const cost = record.metrics && record.metrics.cost ? Number(record.metrics.cost) : 0
          return  <p className='text-end'>{cost ? cost % 1 != 0 ? `￥${Number(cost).toFixed(2)}` : `￥${Number(cost)}` : "-"}</p>
        }
      },
    ], [budgetHistory, t]
  )

  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      const duration = {
        startDate: dateStrings[0],
        endDate: dateStrings[1]
      }
      setDuration(duration)
      getBudgetHistory(duration)
    } else {
      console.log('Clear');
    }
  };

  const renderTranslateTitleText = (text: any) => {
    let translate = t("campaign_performance_history_log_page.title");
    return translate.replace("{text}", text);
  }

  const renderExtraFooter = () => {
    const handleShowTimePannel = () => {
      if (showTimePanel) setShowTimePanel(false)
      else setShowTimePanel(true)
    }
    return (
      <Button onClick={handleShowTimePannel}>
        {showTimePanel ? t('commons.close_time_panel') : t('commons.open_time_panel')}
      </Button>
    );
  };

  return (
    <div className='text-black'>
      <div className='panel-heading'>
        <h2>{renderTranslateTitleText(campaignName ? campaignName : "")}</h2>
      </div>
        <div className='flex items-center justify-between mt-5'>
        <h3>
          {t('campaign_performance_history_log_page.budget_update')} {duration && duration.startDate ? moment.tz(duration.startDate, `${process.env.NEXT_PUBLIC_TIMEZONE}`).format(showTimePanel ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD") : ""} - {duration && duration.endDate ? moment.tz(duration.endDate, `${process.env.NEXT_PUBLIC_TIMEZONE}`).format(showTimePanel ? "YYYY/MM/DD HH:mm" : "YYYY/MM/DD") : ""}
        </h3>
        <Space>
          <RangeDatePicker renderExtraFooter={renderExtraFooter} showTime={showTimePanel ? true : false} duration={duration} onRangeChange={onRangeChange}/>
          <SelectFilter placeholder={t('commons.action_type.export')} onChange={handleChange} options={exportType}/>
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
