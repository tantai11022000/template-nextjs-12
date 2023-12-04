import { Col, Row, Space, Typography } from 'antd';
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
  scheduledCampaignData: any
}

const EXISTING = [
  {
    id: 1,
    value: 'campaign_a',
    label: 'Campaign A'
  },
  {
    id: 2,
    value: 'campaign_b',
    label: 'Campaign B'
  },
  {
    id: 3,
    value: 'campaign_c',
    label: 'Campaign C'
  },
  {
    id: 4,
    value: 'campaign_d',
    label: 'Campaign D'
  },
  {
    id: 5,
    value: 'campaign_e',
    label: 'Campaign E'
  },
  {
    id: 1,
    value: 'campaign_a',
    label: 'Campaign A'
  },
]

export default function ConfirmSetupBudgetSchedule (props: IConfirmSetupBudgetScheduleProps) {
  const { t } = useTranslation()
  const { Text } = Typography;
  const router = useRouter()
  const { title, onCancel, onOk, scheduledCampaignData } = props
  const [dataExisting, setDataExisting] = useState<any[]>(EXISTING)
  const [displayedData, setDisplayedData] = useState<any[]>([]);
  const [showMore, setShowMore] = useState<boolean>(false);

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    // getCampaigns()
  }
  const getCampaigns = async () => {
    try {
      setDataExisting(EXISTING)
      setDisplayedData(EXISTING.slice(0, 2))
    } catch (error) {
      
    }
  }
  
  const handleShowMore = () => {
    const currentDisplayedCount = displayedData.length;
    const newDisplayedCount = currentDisplayedCount + 2;

    if (newDisplayedCount >= dataExisting.length) {
      setDisplayedData(dataExisting);
      setShowMore(false);
    } else {
      const newDisplayedDatas = dataExisting.slice(0, newDisplayedCount);
      setDisplayedData(newDisplayedDatas);
    }
  };

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
          const {id, name} = record
          return (
            <Link href={{pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/${id}`, query: { id, name}}}>
              <a target="_blank" rel="noopener noreferrer">View Schedule</a>
            </Link>
          )
        },
      },
    ], [scheduledCampaignData, t]
  )

  return (
    <div>
      <div className='panel-heading flex items-center justify-between'>
        <h2>{title ? title : `${t('weight_template_page.clone_weight_template')}`}</h2>
      </div>
      <h3 className='my-4'>We found following {scheduledCampaignData.length} Campaigns already have budget schedule set:</h3>
      <TableGeneral columns={columns} data={scheduledCampaignData ? scheduledCampaignData : []}pagination={false}/>
      <Text>* Note: The newer schedule will be applied, if the timing overlapped</Text>
      <div className='form-container'>
        <Space size="middle" className='w-full flex justify-end mt-8'>
          <ActionButton className={'cancel-button'} label={t('commons.action_type.cancel')} onClick={onCancel}/>
          <ActionButton className={'finish-button'} label={t('commons.action_type.confirm')} onClick={onOk}/>
        </Space>
      </div>
    </div>
  );
}
