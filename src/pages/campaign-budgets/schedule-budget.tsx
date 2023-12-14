import React, { useEffect, useLayoutEffect, useMemo, useState } from 'react';
import dayjs from 'dayjs';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import FMultipleCheckbox from '@/components/form/FMultipleCheckbox';
import { getCampaignBudgets, getScheduleById, setScheduleBudgetForCampaigns } from '@/services/campaign-budgets-services';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getCurrentAccount } from '@/store/account/accountSlice';
import { Button, Checkbox, Col, Form, InputNumber, Modal, Radio, Row, Select, Space, Spin, Typography, Slider, DatePicker } from 'antd';
import { useRouter } from 'next/router';
import DateTimePicker from '@/components/dateTime/DateTimePicker';
import FText from '@/components/form/FText';
import TableGeneral from '@/components/table';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import AddWeightTemplate from '../weight-template/[...type]';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { changeNextPageUrl, notificationSimple, parseDate } from '@/utils/CommonUtils';
import ActionButton from '@/components/commons/buttons/ActionButton';

import { InboxOutlined, UploadOutlined } from '@ant-design/icons';
import FSelect from '@/components/form/FSelect';
import FRadio from '@/components/form/FRadio';
import RangeDatePicker from '@/components/dateTime/RangeDatePicker';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { ADJUST_CODE } from '@/enums/adjust';
import { SETTING_BUDGET_MODE } from '@/enums/mode';
import { getAllWeightTemplates } from '@/services/weight-template';
import { NOTIFICATION_ERROR, NOTIFICATION_SUCCESS, NOTIFICATION_WARN } from '@/utils/Constants';
import EditWeightTemplate from '@/components/modals/editWeightTemplate';
import ConfirmSetupBudgetSchedule from '@/components/modals/confirmSetupBudgetSchedule';
import moment from 'moment-timezone';
import type { RangePickerProps } from 'antd/es/date-picker';
import { getItem } from '@/utils/StorageUtils';
import { CURRENT_ACCOUNT } from '@/utils/StorageKeys';
import Link from 'next/link';

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
  const [form]:any = Form.useForm();
  const currentAccount = getItem(CURRENT_ACCOUNT)
  const dispatch = useAppDispatch()
  const router = useRouter()
  
  const params =  new URLSearchParams(window.location.search)
  const campaignsInfo: any = params.get("campaigns")
  const decodeCampaignsInfo = decodeURIComponent(escape(window.atob(campaignsInfo)))
  const parseCampaignsInfo = JSON.parse(decodeCampaignsInfo)
  const [scheduleId, setScheduleId] = useState<any>(parseCampaignsInfo && parseCampaignsInfo.scheduleId ? parseCampaignsInfo.scheduleId : '')
  const [isEdit, setIsEdit] = useState<boolean>(parseCampaignsInfo && parseCampaignsInfo.isEdit ? true : false)
  const [isWeight, setIsWeight] = useState<boolean>(parseCampaignsInfo && parseCampaignsInfo.isWeight ? true : false)
  const [campaignIds, setCampaignIds] = useState<any[]>(parseCampaignsInfo && parseCampaignsInfo.campaignIds ? parseCampaignsInfo.campaignIds : []);
  const [selectMode, setSelectMode] = useState<number>(isWeight ? 3 : 0)
  const [loading, setLoading] = useState<any>(false);
  const [campaignBudgets, setCampaignBudgets] = useState<any[]>([])
  const [weightTemplates, setWeightTemplates] = useState<any>([]);
  const [mappingWeightTemplates, setMappingWeightTemplates] = useState<any[]>([])
  const [modes, setModes] = useState<any[]>([])
  const [showMore, setShowMore] = useState<boolean>(false);
  const [displayedCampaigns, setDisplayedCampaigns] = useState<any[]>([]);
  const [openModalEditBudgetWeightTemplate, setOpenModalEditBudgetWeightTemplate] = useState<boolean>(false);
  const [openModalWarning, setOpenModalWarning] = useState<boolean>(false);
  const [isScheduleNeedEdit, setIsScheduleNeedEdit] = useState<boolean>(true)
  const [isShowEditIcon, setIsShowEditIcon] = useState<boolean>(false)
  const [selectedWeight, setSelectedWeight] = useState<any>("");
  const [isPreview, setIsPreview] = useState<boolean>(false)
  const [pagination, setPagination] = useState<any>({
    pageSize: 30,
    current: 1,
    total: 0,
  })
  const [budgets, setBudgets] = useState<any[]>([])
  const [weightTemplateInfo, setWeightTemplateInfo] = useState<any>({
    id: "",
    name: ""
  })

  useEffect(() => {
    const newData = parseCampaignsInfo.campaignIds.map((id: any, index: any) => ({
      id,
      name: parseCampaignsInfo.campaignNames[index],
      isHaveSchedule: parseCampaignsInfo.isHaveSchedule[index],
    }));
    setCampaignBudgets(newData)
    setDisplayedCampaigns(newData.slice(0, 10)) 
  }, [])
  
  useEffect(() => {
    if (isEdit) {
      handleMapEditData()
    }
  },[isEdit])

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
    dispatch(setBreadcrumb({data: [{label: t('breadcrumb.campaign_budgets') , url: '/campaign-budgets'}, isEdit ? {label: parseCampaignsInfo.campaignNames[0] , url: ''} : {label: t('breadcrumb.schedule_budget') , url: ''}]}))
  },[])

  useEffect(() => {
    const newData = weightTemplates.map((weight: any) => ({
      value: weight.id,
      label: weight.name
    }))
    setMappingWeightTemplates(newData)
  }, [weightTemplates])

  useEffect(() => {
    setModes([
      { value: 0, label: t('schedule_budget_for_campaign.exact') },
      { value: 1, label: "%" },
      { value: 2, label: t('schedule_budget_for_campaign.fixed') },
      { value: 3, label: t('schedule_budget_for_campaign.daily') }
    ])
  }, [t])
  

  const init = () => {
    fetchAllWeightTemplates()
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

  const handleConfirmSettingSchedule = async () => {
    setLoading(true)
    try {
      const body = {
        budgets: budgets,
        partnerAccountId: currentAccount,
        campaignIds
      }
      const result = await setScheduleBudgetForCampaigns(body)
      if (result && result.message == "OK") {
        notificationSimple(renderTranslateToastifyText(t('schedule_budget_for_campaign.title')), NOTIFICATION_SUCCESS)
        router.push(BREADCRUMB_CAMPAIGN_BUDGET.url)
        setLoading(false)
        setOpenModalWarning(false);
      }
    } catch (error: any) {
      console.log(">>> Set Schedule Budget For Campaigns Error", error)
      notificationSimple(error.message ? error.message : t('toastify.error.default_error_message'), NOTIFICATION_ERROR)
      setLoading(false)
    }
  };

  const handleCancelSettingSchedule = () => {
    setOpenModalWarning(false);
  };

  const handleOnChangeTable = (pagination:any, filters:any, sorter:any) => {
    const { current } = pagination
    // changeNextPageUrl(router, current)
    setPagination(pagination)
  }

  const onSaveModeForm = (fieldsValue: any) => {
    if (isScheduleNeedEdit && isEdit) {
      fieldsValue.settingScheduleId = Number(scheduleId);
      setIsScheduleNeedEdit(false); 
    }

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

    const validateBudgets = [...budgets]
    if (validateBudgets.some((budget: any) => budget.schedule == fieldsValue.schedule)) {
      notificationSimple(t('schedule_budget_for_campaign.the_time_already_exists'), NOTIFICATION_WARN)
    } else {
      const today = new Date()
      if (fieldsValue.mode == 3) {
        if (moment(today).format("YYYY-MM-DD") == moment(fieldsValue.schedule).format("YYYY-MM-DD")) {
          notificationSimple(t('schedule_budget_for_campaign.schedule_must_be_in_the_future'), NOTIFICATION_ERROR)
          return
        } else {
          setBudgets((budgets: any) => [fieldsValue, ...budgets]);
        }
      } else {
        setBudgets((budgets: any) => [fieldsValue, ...budgets]);
      }
    }
  };

  const onSaveModeFormFail = (value: any) => {
    console.log('>>> value', value);
  }

  const handleOnChangeModeForm = (changedValues: any) => {
    if (changedValues && changedValues.weightTemplateId) {
      setIsShowEditIcon(true)
      setWeightTemplateInfo({...weightTemplateInfo, id: changedValues.weightTemplateId})
    }
  }

  const renderTranslateToastifyText = (text: any) => {
    let translate = t("toastify.success.created_text");
    return translate.replace("{text}", text);
  }

  const onSaveSchedule = async () => {
    setLoading(true)
    try {
      if (campaignIds.length == 0) {
        notificationSimple(t('schedule_budget_for_campaign.warning_select_at_least_one_campaign'), NOTIFICATION_ERROR)
        return;
      }

      if (hasUpcomingSchedule()) {
        setOpenModalWarning(true);
        setLoading(false)
        return;
      }

      const body = {
        budgets: budgets,
        partnerAccountId: currentAccount,
        campaignIds
      }
      const result = await setScheduleBudgetForCampaigns(body)
      if (result && result.message == "OK") {
        notificationSimple(renderTranslateToastifyText(t('schedule_budget_for_campaign.title')), NOTIFICATION_SUCCESS)
        router.push(BREADCRUMB_CAMPAIGN_BUDGET.url)
      }
      setLoading(false)
    } catch (error: any) {
      console.log(">>> Set Schedule Budget For Campaigns Error", error)
      notificationSimple(error.message ? error.message : t('toastify.error.default_error_message'), NOTIFICATION_ERROR)
      setLoading(false)
    }
  }

  const handleMapEditData = async () => {
    try {
      const result = await getScheduleById(scheduleId)
      if (result && result.data) {
        const { mode, adjust, value, schedule, adtranWeightTemplateId } = result.data
        form.setFieldsValue({
          mode: mode,
          adjust: adjust,
          value: adjust != 2 ? Math.abs(value) : -Math.abs(value),
          schedule: parseDate(schedule),
          weightTemplateId: adtranWeightTemplateId ? adtranWeightTemplateId : ""
        })
        setSelectMode(mode)
      }
    } catch (error) {
     console.log(">>> Get Account Info Error", error)
    }
  }

  const hasUpcomingSchedule = () => {
    return campaignBudgets.some((campaign: any) => campaignIds.includes(campaign.id) && campaign.isHaveSchedule);
  };

  const onGoToCampaignScheduleBudget = (event: any, id: any, name: any) => {
    event.preventDefault()
    router.push({pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/${id}`, query: { id, name}})
  }

  const disabledDate: RangePickerProps['disabledDate'] = (current) => {
    if (selectMode === 3) {
      return current && current < dayjs().endOf('day');
    } else {
      return current && current < dayjs().subtract(1, 'day').endOf('day');
    }
  };

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
        }
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
        }
      },
      {
        title: <div className='text-center'>{t('schedule_budget_for_campaign.weight')}</div>,
        dataIndex: 'weightTemplateId',
        key: 'weightTemplateId',
        render: (text: any, record: any) => {
          const weight = weightTemplates.find((template: any) => template.id === text);
          const handlePreviewTemplate = () => {
            setIsPreview(true)
            setOpenModalEditBudgetWeightTemplate(true)
          }
          return (
            <div className='flex justify-center'>
              {weight ? <div className='cursor-pointer text-primary underline' onClick={handlePreviewTemplate}>{weight.name}</div> : "-"}
            </div>
          )
        },
      },
      {
        title: <div className='text-center'>{t('commons.action')}</div>,
        key: 'action',
        render: (_: any, record: any, index: any) => {
          const settingScheduleId = record.settingScheduleId
          const onDeleteSchedule = (indexSchedule: any) => {
            const updatedBudgets = budgets.filter((item: any, index: any) => index !== indexSchedule);
            setBudgets(updatedBudgets);
          }
          return (
            <div className='flex justify-center'>
              <Space size="middle">
                {settingScheduleId ? null : <DeleteOutlined className='text-lg cursor-pointer' onClick={() => onDeleteSchedule(index)}/>}
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

  const renderTranslateTitleModal = (text: any) => {
    let translate = t('schedule_budget_for_campaign.modal.existing_schedule_warning');
    return translate.replace("{text}", text);
  }

  return (
    <div>
      <div>
        <div className='panel-heading flex items-center justify-between'>
          <h2>{t('schedule_budget_for_campaign.title')}</h2>
        </div>
        {campaignBudgets && campaignBudgets.filter((campaign: any) => campaign.isHaveSchedule == true).length > 0 &&
          <Space className='w-full flex items-center justify-between mt-6'>
            <h3>{renderTranslateCountExistingUpcomingSchedule(campaignBudgets.filter((campaign: any) => campaign.isHaveSchedule == true).length)}</h3>
          <Space className='flex items-center'>
            <div className='bg-red p-2 mr-1'></div>
            <span className='text-red'>{t('schedule_budget_for_campaign.note_existing_upcomning_schedule')}</span>
          </Space>
        </Space>
        }
          <div className='checkbox-group-container my-6'> 
            <Checkbox.Group onChange={onChangeCheck} value={campaignIds}>
              <Row>
                {displayedCampaigns && displayedCampaigns.length ? displayedCampaigns.map((campaign: any) => (
                  <Col key={campaign.id} span={8}>
                    <Checkbox value={campaign.id}>
                      <Link
                        href={{
                          pathname: `${BREADCRUMB_CAMPAIGN_BUDGET.url}/${campaign.id}`,
                          query: {campaign: JSON.stringify(campaign)}
                        }}
                        passHref
                      >
                        <a style={{color: `${campaign.isHaveSchedule ? "red": "black"}`}} target='_blank'>{campaign.name}</a>
                      </Link>
                    </Checkbox>
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
          <div className='special-customize-form-wrapper'>
            <div></div>
            <Form
              form={form}
              onFinish={onSaveModeForm}
              onFinishFailed={onSaveModeFormFail}
              // labelCol={{ span: 9 }}
              // wrapperCol={{ span: 9 }}
              layout="horizontal"
              initialValues={{
                'mode': isWeight ? 3 : 0,
              }}
              onValuesChange={handleOnChangeModeForm}
              className='special-customize-form'
            >
              <FRadio required name={'mode'} label={t('schedule_budget_for_campaign.mode')} options={modes} onChange={handleChangeMode} value={selectMode}/>
              {(selectMode == 3 && isWeight) || selectMode == 3 ? 
                <div className='flex'>
                  <FSelect customCss={'max-w-[1000px] w-[1000px]'} required name={'weightTemplateId'} label={t('schedule_budget_for_campaign.weight_template')} placeholder={renderTranslateFilterText(t('schedule_budget_for_campaign.weight_template'))} options={mappingWeightTemplates} />
                  {isShowEditIcon && <EditOutlined className='text-xl mb-6 ml-5' onClick={() => setOpenModalEditBudgetWeightTemplate(true)}/>}
                </div>
              : null}
              <div className='flex items-center'>
                <Form.Item 
                  name="schedule" 
                  label={t('schedule_budget_for_campaign.time')}
                  rules={[{
                    required: true, 
                    message: 'Please choose time',
                  }]}
                  className='range-date-picker-container'
                >
                  <DatePicker 
                    disabledDate={disabledDate}
                    showTime={selectMode == 3 ? false : true} 
                    format={selectMode == 3 ? "YYYY-MM-DD" : "YYYY-MM-DD HH:mm"} 
                  />
                </Form.Item>
                <p className='mb-6 ml-5'>GMT+9</p>
              </div>
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
                  <ActionButton htmlType={"submit"} className={'finish-button'} label={t('commons.action_type.add')} disabled={loading}/>
                </div>
              </Form.Item>
            </Form>
            <div></div>
          </div>
      </div>
      <div>
        <TableGeneral columns={columns} data={budgets} pagination={false} handleOnChangeTable={handleOnChangeTable}/>
      </div>
      <Form.Item wrapperCol={{ span: 12, offset: 6 }}>
        <div className='flex justify-center mt-6'>
          {loading ? <Spin/> : <ActionButton htmlType={"submit"} className={'finish-button'} label={t('commons.action_type.save')} onClick={onSaveSchedule}/>}
        </div>
      </Form.Item>

      {openModalEditBudgetWeightTemplate && (
        <Modal width={1000} open={openModalEditBudgetWeightTemplate} onOk={handleOk} onCancel={handleCancel} footer={null}>
          <EditWeightTemplate preview={isPreview} title={t('weight_template_page.set_weight_for_daily_budget')} weightTemplate={weightTemplateInfo} onOk={handleOk} onCancel={handleCancel} refreshData={fetchAllWeightTemplates}/>
        </Modal>
      )}

      {openModalWarning && (
        <Modal open={openModalWarning} onOk={handleConfirmSettingSchedule} onCancel={handleCancelSettingSchedule} footer={null}>
          <ConfirmSetupBudgetSchedule type={t('commons.budget')} loading={loading} title={renderTranslateTitleModal(t('commons.budget'))} onCancel={handleCancelSettingSchedule} onOk={handleConfirmSettingSchedule} scheduledCampaignData={campaignBudgets.filter((campaign: any) => campaignIds.includes(campaign.id) && campaign.isHaveSchedule)}/>
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
