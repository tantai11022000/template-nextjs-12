import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import FMultipleCheckbox from '@/components/form/FMultipleCheckbox';
import { getCampaignBudgets } from '@/services/campaign-budgets-services';
import { useAppSelector } from '@/store/hook';
import { getCurrentAccount } from '@/store/account/accountSlice';
import { Button, Checkbox, Col, Form, InputNumber, Modal, Radio, Row, Select, Space, Spin, Typography } from 'antd';
import { useRouter } from 'next/router';
import DateTimePicker from '@/components/dateTime/DateTimePicker';
import FText from '@/components/form/FText';
import TableGeneral from '@/components/table';
import { EditOutlined } from '@ant-design/icons';
import AddWeightTemplate from '../weight-template/[...type]';
import EditWeightTemplate from '@/components/modals/editWeightTemplate';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/components/breadcrumb-context/constant';


export interface IScheduleBudgetProps {
}

const MODE = [
  {
    id: 1,
    value: "exact",
    label: "Exact"
  },
  {
    id: 2,
    value: "percent",
    label: "%"
  },
  {
    id: 3,
    value: "fixed",
    label: "Fixed"
  }
]

const DATA = [
  {
    id: 1,
    name: 'Exact',
    createdDate: '',
    budget: 1000,
    isIncrease: true,
    isPercent: false,
    weightName: ''
  },
  {
    id: 2,
    name: 'Increase by %',
    createdDate: '',
    budget: 5,
    isIncrease: true,
    isPercent: true,
    weightName: ''
  },
  {
    id: 3,
    name: 'Decrease by Fixed Amount',
    createdDate: '',
    budget: 100,
    isIncrease: false,
    isPercent: false,
    weightName: ''
  },
]

const WEIGHT_LIST = [
  {
    value: "weight1",
    label: 'Weight #1'
  },
  {
    value: "weight2",
    label: 'Weight #2'
  }
]

export default function ScheduleBudget (props: IScheduleBudgetProps) {
  const { Text, Title } = Typography
  const [form]:any = Form.useForm();
  const router = useRouter()
  const currentAccount = useAppSelector(getCurrentAccount)

  const [selectMode, setSelectMode] = useState<string>("exact")
  const [loading, setLoading] = useState<boolean>(false);
  const [campaignBudgets, setCampaignBudgets] = useState<any[]>([])
  const [data, setData] = useState<any[]>(DATA)
  const [modes, setModes] = useState<any[]>(MODE)
  const [showMore, setShowMore] = useState<boolean>(false);
  const [displayedCampaigns, setDisplayedCampaigns] = useState<any[]>([]);
  const [weights, setWeights] = useState<any[]>(WEIGHT_LIST)
  const [openModalEditWeightTemplate, setOpenModalEditWeightTemplate] = useState<boolean>(false);
  const [selectedWeight, setSelectedWeight] = useState<any>("");

  useEffect(() => {
    if (currentAccount) init();
  }, [currentAccount])

  useEffect(() => {
    if (campaignBudgets.length > 10) {
      setShowMore(true);
    } else {
      setShowMore(false);
    }
  }, [campaignBudgets]);

  const init = () => {
    getCampaignBudgetsList(currentAccount)
  }

  const getCampaignBudgetsList = async (partnerAccountId: any) => {
    setLoading(true)
    try {
      const result = await getCampaignBudgets(partnerAccountId)
      setCampaignBudgets(result && result.data? result.data : [])
      setDisplayedCampaigns(result.data.slice(0, 10))
      setLoading(false)
    } catch (error) {
      console.log(">>> error", error)
      setLoading(false)
    }
  }

  const onChangeCheck = (value: any) => {
    console.log(">>> value", value)
  }

  const handleShowMore = () => {
    const currentDisplayedCount = displayedCampaigns.length;
    const newDisplayedCount = currentDisplayedCount + 10;

    if (newDisplayedCount >= campaignBudgets.length) {
      setDisplayedCampaigns(campaignBudgets);
      setShowMore(false);
    } else {
      const newDisplayedCampaigns = campaignBudgets.slice(0, newDisplayedCount);
      setDisplayedCampaigns(newDisplayedCampaigns);
    }
  };

  const handleChangeMode = (e: any) => {
    setSelectMode(e.target.value);
  };

  const handleBudgetChange = (value: number | string) => {
    console.log('changed', value);
  };

  const budgetFormatter = (value: any) => {
    if (selectMode == "exact" || selectMode == "fixed") {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return `${value} %`;
    }
  };

  const budgetParser = (value: any) => {
    if (selectMode == "exact" || selectMode == "fixed") {
      return value!.replace(/\$\s?|(,*)/g, '')
    } else {
      return value!.replace('%', '');
    }
  };

  const handleOnChangeForm = (changedValues: any) => {
    console.log(">>> changedValues", changedValues)
  }

  const handleFinish = (value: any) => {
    console.log('value :>> ', value);
  }
  const handleFinishFailed = (e: any) => {
    console.log('e :>> ', e);
  }

  const columns: any = useMemo(
    () => [
      {
        title: 'Mode',
        dataIndex: 'name',
        key: 'name',
        render: (text: any) => <p>{text}</p>,

        onFilter: (value: string, record: any) => record.name.indexOf(value) === 0,
        sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: 'Time',
        dataIndex: 'createdDate',
        key: 'createdDate',
        render: (text: any) => <p>{text}</p>,
      },
      {
        title: 'Budget Change',
        dataIndex: 'budget',
        key: 'budget',
        render: (text: any) => <p className='text-end'>{text}</p>,

        sorter: (a: any, b: any) => a.imp - b.imp
      },
      {
        title: 'Weight',
        dataIndex: 'weightName',
        key: 'weightName',
        render: (text: any) => <p>{text}</p>,
      },
    ], [data]
  )

  const handleAddSchedule = () => {
    var newData: any
    if (router && router.query && router.query.isWeight) {
      newData = [...data, {
        id: 3,
        name: 'Daily with Weight',
        createdDate: '',
        budget: 1000,
        isIncrease: true,
        isPercent: false,
        weightName: 'Holiday Weight'
      }];
    } else {
      newData = [...data, {
        id: 3,
        name: 'Daily',
        createdDate: '',
        budget: 1000,
        isIncrease: true,
        isPercent: false,
        weightName: ''
      }];
    }
    setData(newData);
  }

  const handleChangeWeightTemplate = (weight: any) => {
    console.log(">>> weight", weight)
    setSelectedWeight(weight.label)
  }

  const handleEditWeightTemplate = (id: any) => {
    setOpenModalEditWeightTemplate(!openModalEditWeightTemplate)
  }

  const handleOk = () => {
    setOpenModalEditWeightTemplate(false);
  };

  const handleCancel = () => {
    setOpenModalEditWeightTemplate(false);
  };

  return (
    <div>
      <div>
      <Title level={1}>Schedule Budget for Campaigns</Title>
      <Space className='flex items-center justify-between my-6'>
        <Title level={5}>There are {campaignBudgets && campaignBudgets.length ? campaignBudgets.filter((campaign: any) => campaign.state == 'paused').length : ""} have existing upcoming schedule</Title>
        <Space className='flex items-center mb-2'>
          <div className='bg-red p-2 mr-3'></div>
          <span className='text-red'>Existing Upcoming Schedule</span>
        </Space>
      </Space>
      {/* <Form
        form= {form}
        onValuesChange={handleOnChangeForm}
        onFinish={handleFinish}
        onFinishFailed={handleFinishFailed}
        // labelCol={{ span: 2 }}
        // layout='vertical'
      >
        <FMultipleCheckbox name={'campaigns'} label='' data={displayedCampaigns} onChange={onChangeCheck}/>
        <div className='w-full flex justify-end'>
          {showMore && (
            <button onClick={() => handleShowMore()}>View more...</button>
          )}
        </div>
        <Space className='flex items-center justify-between my-6'>
          <FRadio name={"Mode"} label={'Mode'} options={modes} />
          <FRadio name={"withWeight"} label={''} options={[{ value: 'weight', label: 'Daily with Weight'}]} />
        </Space>
        <Space className='flex items-center'>
          <Space>
            <Text>Time</Text>
            <DateTimePicker/>
          </Space>
          <Space>
            <Text>Budget Change</Text>
            <InputNumber
              defaultValue={100}
              prefix={selectMode == "percent" ? "" : "￥"}
              formatter={budgetFormatter}
              parser={budgetParser}
              onChange={handleBudgetChange}
            />    
          </Space>
        </Space>

        <Form.Item className='flex justify-end mt-5'>
          <Button type="primary" className='bg-secondary text-white w-28 cursor-pointer mr-5' onClick={() => router.back()}>Cancel</Button>
          <Button type="primary" className='bg-blue text-white w-28 cursor-pointer mr-5'>Clone</Button>
          <Button type="primary" htmlType="submit" className='bg-primary text-white w-28 cursor-pointer'>Submit</Button>
        </Form.Item>
      </Form> */}
      <Checkbox.Group style={{ width: '100%' }} onChange={onChangeCheck}>
        <Row>
          {displayedCampaigns && displayedCampaigns.length ? displayedCampaigns.map((campaign: any) => (
            <Col key={campaign.campaignId} span={8}>
              <Checkbox value={campaign.campaignId} className={`${campaign.state == 'paused' ? 'text-red' : ''}`}>{campaign.name}</Checkbox>
            </Col>
          )) : <Spin/>}
        </Row>
      </Checkbox.Group>
      <div className='w-full flex justify-end'>
        {showMore && (
          <button onClick={() => handleShowMore()}>View more...</button>
        )}
      </div>
      <Space className='flex items-center justify-between my-6'>
        <Space>
          <Text>Mode</Text>
          <Radio.Group onChange={handleChangeMode} value={selectMode}>
            {modes ? modes.map((mode: any) => (
              <Radio key={mode.id} value={mode.value}>{mode.label}</Radio>
            )) : null}
          </Radio.Group>
        </Space>
        {router && router.query && router.query.isWeight && <Radio checked>Daily with Weight</Radio>}
      </Space>
      <Space className='flex justify-center'>
        <Space>
          <Text>Time</Text>
          <DateTimePicker/>
        </Space>
        <Space>
          <Text>Budget Change</Text>
          <InputNumber
            defaultValue={100}
            prefix={selectMode == "percent" ? "" : "￥"}
            formatter={budgetFormatter}
            parser={budgetParser}
            onChange={handleBudgetChange}
          />    
        </Space>
        <Space>
          <Select
            labelInValue
            style={{ width: 200 }}
            showSearch
            placeholder="Select Weight Template"
            optionFilterProp="children"
            onChange={handleChangeWeightTemplate}
            options={weights}
            />
            <EditOutlined className='w-5 h-5' onClick={handleEditWeightTemplate}/>
        </Space>
      </Space>
      <div className='flex justify-center mt-6'>
        <Button type="primary" htmlType="submit" className='bg-primary text-white w-28 cursor-pointer' onClick={handleAddSchedule}>Add</Button>
      </div>
      </div>
      <div>
        <TableGeneral loading={loading} columns={columns} data={data}/>
      </div>
      {openModalEditWeightTemplate && (
        <Modal width={1000} title="Set Weight for Daily Budget" open={openModalEditWeightTemplate} onOk={handleOk} onCancel={handleCancel}>
          <EditWeightTemplate/>
        </Modal>
      )}
    </div>
  );
}

ScheduleBudget.getLayout = (page: any) => {
  const breadcrumb = [
    {label: 'Campaign Budgets' , url: BREADCRUMB_CAMPAIGN_BUDGET.url},
    {label: 'Schedule Budget for Campaigns' , url: ''}
  ]
  return (
    <RootLayout>
      <DashboardLayout breadcrumb={breadcrumb}>{page}</DashboardLayout>
    </RootLayout>
  )
};
