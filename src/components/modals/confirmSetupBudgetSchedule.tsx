import { Col, Row, Typography } from 'antd';
import React, { useEffect, useState } from 'react';

export interface IConfirmSetupBudgetScheduleProps {
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
  const { Text, Title } = Typography
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

  return (
    <div>
      <Text>We found following 100 Campaigns already have budget schedule set:</Text>
      <div>
        {dataExisting && dataExisting.length ? dataExisting.map((data: any) => (
          <Row key={data.id}>
            <Col span={12}><Text>{data.label}</Text></Col>
            <Col span={12}><a href="">View Schedule</a></Col>
          </Row>
          
        )) : null}
      </div>
      <div className=''>
        {showMore && (
          <button onClick={() => handleShowMore()}>More</button>
        )}
      </div>
      <Text>* Note: the newer schedule will be applied, if the timing overlapped</Text>
    </div>
  );
}
