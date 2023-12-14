import { Col, Row, Space, Spin, Typography } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'next-i18next';
import ActionButton from '../commons/buttons/ActionButton';
import TableGeneral from '../table';
import { useRouter } from 'next/router';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant';
import Link from 'next/link';

export interface IConfirmSetupBudgetScheduleProps {
  title: string,
  onCancel: any,
  onOk: any,
  scheduledCampaignData: any,
  loading?: any
}


export default function ConfirmSetupBudgetSchedule (props: IConfirmSetupBudgetScheduleProps) {
  const { t } = useTranslation()
  const { Text } = Typography;
  const { title, onCancel, onOk, scheduledCampaignData, loading } = props

  const columns: any = useMemo(
    () => [
      {
        title: <div className='text-center'>{t('campaign_budget_page.campaign_name')}</div>,
        dataIndex: 'name',
        key: 'name',
        render: (text: any) => <p>{text}</p>,
      },
      {
        title: <div className='text-center'>{t('commons.action')}</div>,
        key: 'action',
        align: 'center',
        render: (_: any, record: any) => {
          const { id, name } = record
          const campaign = {
            id,
            name
          }
          return (
            <Link 
              href={{
                pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/${id}`,
                query: {campaign: JSON.stringify(campaign)}
              }}
              >
              <a target="_blank" rel="noopener noreferrer">{t('schedule_budget_for_campaign.modal.view_schedule')}</a>
            </Link>
          )
        },
      },
    ], [scheduledCampaignData, t]
  )

  const renderTranslateText = (number: any) => {
    let translate = t("schedule_budget_for_campaign.modal.campaigns_already_have_budget_schedule");
    return translate.replace("{number}", number);
  }

  return (
    <div>
      <div className='panel-heading flex items-center justify-between'>
        <h2>{title ? title : `${t('weight_template_page.clone_weight_template')}`}</h2>
      </div>
      <h3 className='my-4'>{renderTranslateText(scheduledCampaignData.length)}</h3>
      <TableGeneral columns={columns} data={scheduledCampaignData ? scheduledCampaignData : []} pagination={false}/>
      <Text>{t("schedule_budget_for_campaign.modal.warning_overlapped")}</Text>
      <div className='form-container'>
        <Space size="middle" className='w-full flex justify-end mt-8'>
          <ActionButton className={'cancel-button'} label={t('commons.action_type.cancel')} onClick={onCancel}/>
          {loading ? <Spin/> : <ActionButton className={'finish-button'} label={t('commons.action_type.confirm')} onClick={onOk}/>}
        </Space>
      </div>
    </div>
  );
}
