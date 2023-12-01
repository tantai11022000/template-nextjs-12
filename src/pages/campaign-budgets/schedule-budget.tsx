import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import FMultipleCheckbox from '@/components/form/FMultipleCheckbox';
import { getCampaignBudgets, setScheduleBudgetForCampaigns } from '@/services/campaign-budgets-services';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getCurrentAccount } from '@/store/account/accountSlice';
import { Button, Checkbox, Col, Form, InputNumber, Modal, Radio, Row, Select, Space, Spin, Typography, Slider, DatePicker } from 'antd';
import { useRouter } from 'next/router';
import DateTimePicker from '@/components/dateTime/DateTimePicker';
import FText from '@/components/form/FText';
import TableGeneral from '@/components/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddWeightTemplate from '../weight-template/[...type]';
import EditWeightTemplate from '@/components/modals/EditWeightTemplate';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { changeNextPageUrl, notificationSimple } from '@/utils/CommonUtils';
import ActionButton from '@/components/commons/buttons/ActionButton';

import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import FSelect from '@/components/form/FSelect';
import FRadio from '@/components/form/FRadio';
import RangeDatePicker from '@/components/dateTime/RangeDatePicker';
import type { Dayjs } from 'dayjs';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { ADJUST_CODE } from '@/enums/adjust';
import { SETTING_BUDGET_MODE } from '@/enums/mode';
import { getAllWeightTemplates } from '@/services/weight-template';
import { NOTIFICATION_ERROR, NOTIFICATION_SUCCESS } from '@/utils/Constants';
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

export default function ScheduleBudget (props: IScheduleBudgetProps) {
  const { t } = useTranslation()
  const MODES = [
    {
      value: 0,
      label: t('schedule_budget_for_campaign.exact')
    },
    {
      value: 1,
      label: "%"
    },
    {
      value: 2,
      label: t('schedule_budget_for_campaign.fixed')
    },
    {
      value: 3,
      label: t('schedule_budget_for_campaign.daily')
    },
  ]

  const [form]:any = Form.useForm();
  const currentAccount = useAppSelector(getCurrentAccount)
  const dispatch = useAppDispatch()
  const router = useRouter()
  const campaignIDsFromQuery: any = router && router.query && router.query.campaignIds && router.query.campaignIds.length ? router.query.campaignIds : [];
  const campaignIDs = Array.isArray(campaignIDsFromQuery) ? campaignIDsFromQuery : [campaignIDsFromQuery];
  const isWeight = router && router.query && router.query.isWeight ? true : false
  const [campaignIds, setCampaignIds] = useState<any[]>(campaignIDs);
  const [selectMode, setSelectMode] = useState<number>(isWeight ? 3 : 0)
  const [loading, setLoading] = useState<boolean>(false);
  const [campaignBudgets, setCampaignBudgets] = useState<any[]>([])
  const [weightTemplates, setWeightTemplates] = useState<any>([]);
  const [mappingWeightTemplates, setMappingWeightTemplates] = useState<any[]>([])
  const [modes, setModes] = useState<any[]>(MODES)
  const [showMore, setShowMore] = useState<boolean>(false);
  const [displayedCampaigns, setDisplayedCampaigns] = useState<any[]>([]);
  const [openModalEditBudgetWeightTemplate, setOpenModalEditBudgetWeightTemplate] = useState<boolean>(false);
  const [selectedWeight, setSelectedWeight] = useState<any>("");
  const [pagination, setPagination] = useState<any>({
    pageSize: 30,
    current: 1,
    total: 0,
  })
  const [budgets, setBudgets] = useState<any[]>([])

  const date = new Date();

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
    dispatch(setBreadcrumb({data: [BREADCRUMB_CAMPAIGN_BUDGET, {label: 'Schedule Budget' , url: ''}]}))
  },[])

  useEffect(() => {
    const newData = weightTemplates.map((weight: any) => ({
      value: weight.id,
      label: weight.name
    }))
    setMappingWeightTemplates(newData)
  }, [weightTemplates])

  const init = () => {
    getCampaignBudgetsList(currentAccount)
    fetchAllWeightTemplates()
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

  const fetchAllWeightTemplates = async () => {
    try {
      const {pageSize, current, total} = pagination
      var params = {
        pageSize: 999999,
      }
      const result = await getAllWeightTemplates(params)
      if (result && result.data) {
        setWeightTemplates(result.data)
        setPagination({...pagination, total: result.pagination.total})
      }
    } catch (error) {
      console.log(">>> Get Weight Template Error", error)
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
    if (selectMode == 1) {
      return `${value}%`;
    } else {
      return `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }
  };

  const budgetParser = (value: string | undefined) => {
    if (selectMode == 1) {
      return value!.replace('%', '');
    } else {
      return value!.replace(/\$\s?|(,*)/g, '')
    }
  };

  const handleChangeWeightTemplate = (weight: any) => {
    console.log(">>> weight", weight)
    setSelectedWeight(weight.label)
  }

  const handleEditWeightTemplate = (id: any) => {
    setOpenModalEditBudgetWeightTemplate(!openModalEditBudgetWeightTemplate)
  }

  const handleOk = () => {
    setOpenModalEditBudgetWeightTemplate(false);
  };

  const handleCancel = () => {
    setOpenModalEditBudgetWeightTemplate(false);
  };

  const handleOnChangeTable = (pagination:any, filters:any, sorter:any) => {
    const { current } = pagination
    // changeNextPageUrl(router, current)
    setPagination(pagination)
  }

  const onSaveModeForm = (fieldsValue: any) => {
    if (fieldsValue.mode == 0 ) {
      fieldsValue.adjust = 0
      fieldsValue.schedule = fieldsValue && fieldsValue.schedule ? fieldsValue.schedule.format('YYYY-MM-DD HH:mm') : ""
    } else if (fieldsValue.mode == 1 || fieldsValue.mode == 2) {
      if (fieldsValue.value < 0) {
        fieldsValue.adjust = 2
      } else if (fieldsValue.value > 0) {
        fieldsValue.adjust = 1
      }
      fieldsValue.schedule = fieldsValue && fieldsValue.schedule ? fieldsValue.schedule.format('YYYY-MM-DD HH:mm') : ""
    } else if (fieldsValue.mode == 3) {
      fieldsValue.adjust = 0
      fieldsValue.schedule = fieldsValue && fieldsValue.schedule ? fieldsValue.schedule.format('YYYY-MM-DD') : ""
    }

    fieldsValue.value = Math.abs(fieldsValue.value)
    setBudgets((budgets: any) => [fieldsValue, ...budgets]);
  };

  const onSaveModeFormFail = (value: any) => {
    console.log('>>> value', value);
  }

  const handleOnChangeModeForm = (changedValues: any) => {
    console.log(">>> changedValues", changedValues)
  }

  const renderTranslateToastifyText = (text: any) => {
    let translate = t("toastify.success.created_text");
    return translate.replace("{text}", text);
  }

  const onSaveSchedule = async () => {
    try {
      if (campaignIds.length == 0) {
        notificationSimple(t('schedule_budget_for_campaign.warning_select_at_least_one_campaign'), NOTIFICATION_ERROR)
        return;
      }
      const body = {
        budgets: budgets,
        partnerAccountId: currentAccount,
        campaignIds
      }
      const result = await setScheduleBudgetForCampaigns(body)
      if (result && result.message == "OK") notificationSimple(renderTranslateToastifyText(t('schedule_budget_for_campaign.title')), NOTIFICATION_SUCCESS)
      router.push(BREADCRUMB_CAMPAIGN_BUDGET.url)
    } catch (error: any) {
      console.log(">>> Set Schedule Budget For Campaigns Error", error)
      notificationSimple(error.message, NOTIFICATION_ERROR)
    }
  }

  const columns: any = useMemo(
    () => [
      {
        title: <div className='text-center'>{t('schedule_budget_for_campaign.mode')}</div>,
        dataIndex: 'mode',
        key: 'mode',
        render: (_: any, record: any) => {
          const mode = record.mode
          const adjust = record.adjust
          const renderModeName = () => {
            let modeText = ''
            if (mode == SETTING_BUDGET_MODE.EXACT) {
              modeText = 'EXACT'
            } else if (mode == SETTING_BUDGET_MODE.PERCENTAGE) {
              modeText = 'By %'
            } else if (mode == SETTING_BUDGET_MODE.FIXED) {
              modeText = 'By Fixed Amount'
            } else if (mode == SETTING_BUDGET_MODE.DAILY) {
              modeText = 'Daily with Weight'
            }
            return modeText
          }
          const renderAdjustName = () => {
            let adjustText = ''
            if (adjust == ADJUST_CODE.INCREASE) {
              adjustText = 'Increase'
            } else if (adjust == ADJUST_CODE.DECREASE) {
              adjustText = 'Decrease'
            }
            return adjustText
          }

          return (
            <div className='flex justify-center'>
              {renderAdjustName()} {renderModeName()}
            </div>
          )
        },

        onFilter: (value: string, record: any) => record.name.indexOf(value) === 0,
        // sorter: (a: any, b: any) => a.name.localeCompare(b.name),
      },
      {
        title: <div className='text-center'>{t('schedule_budget_for_campaign.time')}</div>,
        dataIndex: 'schedule',
        key: 'schedule',
        render: (text: any) => <p className='text-center'>{text}</p>,
      },
      {
        title: <div className='text-center'>{t('schedule_budget_for_campaign.budget_change')}</div>,
        dataIndex: 'value',
        key: 'value',
        render: (text: any, record: any) => {
          const { value, mode } = record
          return (
            <div className='flex justify-center'>{mode != SETTING_BUDGET_MODE.PERCENTAGE && "￥"} {value} {mode == SETTING_BUDGET_MODE.PERCENTAGE && "%"}</div>
          )
        },

        // sorter: (a: any, b: any) => a.imp - b.imp
      },
      {
        title: <div className='text-center'>{t('schedule_budget_for_campaign.weight')}</div>,
        dataIndex: 'weightTemplateId',
        key: 'weightTemplateId',
        render: (text: any, record: any) => {
          const weight = weightTemplates.find((template: any) => template.id === text);
          return (
            <div className='flex justify-center'>{weight ? weight.name : "-"}</div>
          )
        },
      },
      {
        title: <div className='text-center'>{t('commons.action')}</div>,
        key: 'action',
        render: (_: any, record: any) => {
          return (
            <div className='flex justify-center'>
              <Space size="middle">
                <DeleteOutlined className='text-lg cursor-pointer'/>
              </Space>
            </div>
          )
        },
      },
    ], [budgets, t]
  )

  const renderTranslateCountExistingUpcomingSchedule = (number: any) => {
    let translate = t("schedule_budget_for_campaign.count_existing_upcomning_schedule");
    return translate.replace("{number}", number);
  }

  const renderTranslateFilterText = (text: any) => {
    let translate = t("commons.filter_text");
    return translate.replace("{text}", text);
  }

  return (
    <div>
      <div>
        <div className='panel-heading flex items-center justify-between'>
          <h2>{t('schedule_budget_for_campaign.title')}</h2>
        </div>
        <Space className='w-full flex items-center justify-between my-6'>
          {campaignBudgets && campaignBudgets.filter((campaign: any) => campaign.isHaveSchedule == true).length > 0 
            ? <h3>{renderTranslateCountExistingUpcomingSchedule(campaignBudgets.filter((campaign: any) => campaign.isHaveSchedule == true).length)}</h3>
            : <h3>{renderTranslateCountExistingUpcomingSchedule(0)}</h3>}
          <Space className='flex items-center'>
            <div className='bg-red p-2 mr-1'></div>
            <span className='text-red'>{t('schedule_budget_for_campaign.note_existing_upcomning_schedule')}</span>
          </Space>
        </Space>
          <div className='checkbox-group-container'> 
            <Checkbox.Group onChange={onChangeCheck} value={campaignIds}>
              <Row>
                {displayedCampaigns && displayedCampaigns.length ? displayedCampaigns.map((campaign: any) => (
                  <Col key={campaign.id} span={8}>
                    <Checkbox value={campaign.id.toString()} className={`${campaign.isHaveSchedule ? 'upcoming' : ''}`}>{campaign.name}</Checkbox>
                  </Col>
                )) : <Spin/>}
              </Row>
            </Checkbox.Group>
          </div>
          <div className='w-full flex justify-end'>
            {showMore && (
              <button onClick={() => handleShowMore()}>{t('schedule_budget_for_campaign.view_more')}</button>
            )}
          </div>

          {/* FORM FOR MODE */}
          <Form
            form={form}
            onFinish={onSaveModeForm}
            onFinishFailed={onSaveModeFormFail}
            labelCol={{ span: 9 }}
            wrapperCol={{ span: 9 }}
            layout="horizontal"
            initialValues={{
              'mode': isWeight ? 3 : 0,
            }}
            onValuesChange={handleOnChangeModeForm}
          >
            <FRadio required name={'mode'} label={t('schedule_budget_for_campaign.mode')} options={modes} onChange={handleChangeMode} value={selectMode}/>
            {(selectMode == 3 && isWeight) || selectMode == 3 ? 
            // <div className='flex'>

              <FSelect required name={'weightTemplateId'} label={t('schedule_budget_for_campaign.weight_template')} placeholder={renderTranslateFilterText(t('schedule_budget_for_campaign.weight_template'))} options={mappingWeightTemplates} specialCustom={<EditOutlined className='ml-6 text-xl cursor-pointer' onClick={() => setOpenModalEditBudgetWeightTemplate(true)} />}/>
              // {/* <EditOutlined/> */}
            // {/* </div> */}
            : null}
            <Form.Item 
              name="schedule" 
              label={t('schedule_budget_for_campaign.time')}
              rules={[{
                required: true, 
                message: 'Please choose time',
              }]}
              className='range-date-picker-container'
            >
              <DatePicker showTime={selectMode == 3 ? false : true} format={selectMode == 3 ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"} />
            </Form.Item>
            <Form.Item 
              name="value" 
              label={t('schedule_budget_for_campaign.budget_change')}
              rules={[
                {
                  required: true,
                  message: 'Please input Budget',
                },
                ({ getFieldValue }) => ({
                  validator(_: any, value: any) {
                    if ((getFieldValue('mode') == 0 || getFieldValue('mode') == 3) && value <= 0) {
                      return Promise.reject(t('schedule_budget_for_campaign.warning_budget_must_be_greater_than_zero'));
                    }
                    return Promise.resolve();
                  },
                }),
              ]}
            >
              <InputNumber
                min={selectMode == 0 || selectMode == 3 ? 0 : undefined}
                prefix={selectMode == 1 ? "" : "￥"}
                formatter={budgetFormatter}
                parser={budgetParser}
                onChange={handleBudgetChange}
              />    
            </Form.Item> 

            <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
              <div className='flex justify-center mt-6'>
                <ActionButton htmlType={"submit"} className={'finish-button'} label={t('commons.action_type.add')}/>
              </div>
            </Form.Item>
          </Form>
      </div>
      <div>
        <TableGeneral loading={loading} columns={columns} data={budgets} pagination={false} handleOnChangeTable={handleOnChangeTable}/>
      </div>
      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <div className='flex justify-center mt-6'>
          <ActionButton htmlType={"submit"} className={'finish-button'} label={t('commons.action_type.save')} onClick={onSaveSchedule}/>
        </div>
      </Form.Item>
      {openModalEditBudgetWeightTemplate && (
        <Modal width={1000} title="Set Weight for Daily Budget" open={openModalEditBudgetWeightTemplate} onOk={handleOk} onCancel={handleCancel}>
          {/* <EditWeightTemplate/> */}
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
