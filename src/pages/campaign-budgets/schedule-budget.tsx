import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import FMultipleCheckbox from '@/components/form/FMultipleCheckbox';
import { getCampaignBudgets } from '@/services/campaign-budgets-services';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getCurrentAccount } from '@/store/account/accountSlice';
import { Button, Checkbox, Col, Form, InputNumber, Modal, Radio, Row, Select, Space, Spin, Typography, Slider } from 'antd';
import { useRouter } from 'next/router';
import DateTimePicker from '@/components/dateTime/DateTimePicker';
import FText from '@/components/form/FText';
import TableGeneral from '@/components/table';
import { EditOutlined } from '@ant-design/icons';
import AddWeightTemplate from '../weight-template/[...type]';
import EditWeightTemplate from '@/components/modals/editWeightTemplate';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { changeNextPageUrl } from '@/utils/CommonUtils';
import ActionButton from '@/components/commons/buttons/ActionButton';

import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import FSelect from '@/components/form/FSelect';
import FRadio from '@/components/form/FRadio';
import RangeDatePicker from '@/components/dateTime/RangeDatePicker';
import type { Dayjs } from 'dayjs';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
export async function getStaticProps(context: any) {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale: 'en'
    },
  }
}

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
  const { Option } = Select;

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 14 },
};

const normFile = (e: any) => {
  console.log('Upload event:', e);
  if (Array.isArray(e)) {
    return e;
  }
  return e?.fileList;
};

  const [form]:any = Form.useForm();
  const currentAccount = useAppSelector(getCurrentAccount)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const campaignIDs: any = router && router.query && router.query.campaignIds && router.query.campaignIds.length ? router.query.campaignIds : []
  const [campaignIds, setCampaignIds] = useState<any[]>(campaignIDs);
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
  const [pagination, setPagination] = useState<any>({
    pageSize: 10,
    current: 1,
    total: 0,
  })

  const date = new Date();
  const [duration, setDuration] = useState<any>({
    startDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 5),
    endDate: new Date(date.getFullYear(), date.getMonth(), date.getDate() - 1),
  });

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

  useEffect(() => {
    dispatch(setBreadcrumb({data: [BREADCRUMB_CAMPAIGN_BUDGET, {label: 'Schedule Budget for Campaigns' , url: ''}]}))
  },[])

  const init = () => {
    getCampaignBudgetsList(currentAccount)
  }

  const getCampaignBudgetsList = async (partnerAccountId: any) => {
    setLoading(true)
    try {
      var params = {
        pageSize: 999999
      }
      const result = await getCampaignBudgets(partnerAccountId, params)
      if (result && result.data) {
        const newData = result.data.map((data: any) => {
          data.isCheck = false
          return data
        })
        setCampaignBudgets(newData)
        setDisplayedCampaigns(newData.slice(0, 10))
      }
      setLoading(false)
    } catch (error) {
      console.log(">>> error", error)
      setLoading(false)
    }
  }

  const onChangeCheck = (value: any) => {
    console.log(">>> onChangeCheck value", value)
    setCampaignIds(value);
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

  const handleBudgetChange = (value: number | string | null) => {
    console.log('changed', value);
  };

  const budgetFormatter = (value: number | string | undefined) => {
    if (selectMode == "exact" || selectMode == "fixed") {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    } else {
      return `${value} %`;
    }
  };

  const budgetParser = (value: string | undefined) => {
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

  const handleOnChangeTable = (pagination:any, filters:any, sorter:any) => {
    const { current } = pagination
    // changeNextPageUrl(router, current)
    setPagination(pagination)
  }

  const onSaveMode = (values: any) => {
    const { budgets, partnerAccountId, campaignIds, mode, time, weightTemplate } = values;
    console.log('Received values of form: ', values);
  };

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

  const onRangeChange = (dates: null | (Dayjs | null)[], dateStrings: string[]) => {
    if (dates) {
      const duration = {
        startDate: dateStrings[0],
        endDate: dateStrings[1]
      }
      setDuration(duration)
    } else {
      console.log('Clear');
    }
  };

  return (
    <div>
      <div>
        <div className='panel-heading flex items-center justify-between'>
          <h2>Schedule Budget for Campaigns</h2>
        </div>
        <Space className='w-full flex items-center justify-between my-6'>
          <h3>There are {campaignBudgets && campaignBudgets.length ? campaignBudgets.filter((campaign: any) => campaign.state != 'paused').length : ""} have existing upcoming schedule</h3>
          <Space className='flex items-center'>
            <div className='bg-red p-2 mr-1'></div>
            <span className='text-red'>Existing Upcoming Schedule</span>
          </Space>
        </Space>
        <Form >
        <div className='checkbox-group-container'> 
          <Checkbox.Group onChange={onChangeCheck} value={campaignIds}>
            <Row>
              {displayedCampaigns && displayedCampaigns.length ? displayedCampaigns.map((campaign: any) => (
                <Col key={campaign.campaignId} span={8}>
                  <Checkbox value={campaign.campaignId} className={`${campaign.isHaveSchedule ? 'upcoming' : ''}`}>{campaign.name}</Checkbox>
                </Col>
              )) : <Spin/>}
            </Row>
          </Checkbox.Group>
        </div>
        <div className='w-full flex justify-end'>
          {showMore && (
            <button onClick={() => handleShowMore()}>View more...</button>
          )}
        </div>
          <Form
            name="validate_other"
            {...formItemLayout}
            onFinish={onSaveMode}
            initialValues={{
              // 'input-number': 3,
              // 'checkbox-group': ['A', 'B'],
              // rate: 3.5,
              // 'color-picker': null,
            }}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 9 }}
            layout="horizontal"
          >
            <FRadio name={'mode'} label={'Mode'} options={modes} onChange={handleChangeMode} value={selectMode}/>
            {router && router.query && router.query.isWeight && (
              <>
                <FMultipleCheckbox name={'isWeight'} label='Daily with Weight' data={[{value: 'weight', name: ' '}]} />
                <FSelect name={'weightTemplate'} label={'Weight'} placeholder={'Select Weight Template'} options={weights}/>
              </>
            )}       
            <Form.Item name="time" label="Time">
              <RangeDatePicker duration={duration} onRangeChange={onRangeChange}/>
            </Form.Item>
            <Form.Item name="budget" label="Budget Change">
              <InputNumber
                min={1}
                defaultValue={100}
                prefix={selectMode == "percent" ? "" : "￥"}
                formatter={budgetFormatter}
                parser={budgetParser}
                onChange={handleBudgetChange}
              />    
            </Form.Item> 

            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <div className='flex justify-center mt-6'>
                <ActionButton htmlType={"submit"} className={'finish-button'} label={'Add'} onClick={handleAddSchedule}/>
              </div>
            </Form.Item>
          </Form>
        </Form>
        {/* <Space className='flex items-center justify-between my-6'>
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
              <EditOutlined className='text-lg cursor-pointer' onClick={handleEditWeightTemplate}/>
          </Space>
        </Space>
        <div className='flex justify-center mt-6'>
          <ActionButton htmlType={"submit"} className={'finish-button'} label={'Add'} onClick={handleAddSchedule}/>
        </div> */}
      </div>
      <div>
        <TableGeneral loading={loading} columns={columns} data={data} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
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
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  )
};
