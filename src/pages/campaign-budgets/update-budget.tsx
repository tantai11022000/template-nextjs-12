import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { Button, Form, Modal, Select, Space, Tag, Tooltip, Typography } from 'antd';
import UploadFile from '@/components/uploadFile';
import TableGeneral from '@/components/table';
import Link from 'next/link';
import moment from 'moment';
import FSelect from '@/components/form/FSelect';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { getAccountList } from '@/store/account/accountSlice';
import FUploadFile from '@/components/form/FUploadFile';
import { BREADCRUMB_CAMPAIGN_BUDGET } from '@/Constant/index';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { EditOutlined, LeftOutlined, RightOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useRouter } from 'next/router';
import { changeNextPageUrl, notificationSimple, readAsBinaryString } from '@/utils/CommonUtils';
import ActionButton from '@/components/commons/buttons/ActionButton';

import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { uploadBudgetScheduleCSVFile, uploadBudgetScheduleCSVFile2 } from '@/services/campaign-budgets-services';
import { useTranslation } from 'next-i18next';
import { NOTIFICATION_ERROR, NOTIFICATION_SUCCESS, NOTIFICATION_WARN } from '@/utils/Constants';
import ConfirmSetupBudgetSchedule from '@/components/modals/confirmSetupBudgetSchedule';
export async function getStaticProps(context: any) {
  const { locale } = context

  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale: 'en'
    },
  }
}
export interface IUpdateCampaignBudgetProps {
}

const FILES = [
  {
    id: 1,
    status: "valid",
    campaign: "Campaign A",
    campaignId: "CA121313",
    budget: 10000,
    fromTime: "2023-08-25T12:10:59.000Z",
    toTime: "2023-08-28T09:27:24.000Z"
  },
  {
    id: 2,
    status: "valid",
    campaign: "Campaign A",
    campaignId: "CA121313",
    budget: 10000,
    fromTime: "2023-08-25T12:10:59.000Z",
    toTime: "2023-08-28T09:27:24.000Z"
  },
  {
    id: 3,
    status: "invalid",
    campaign: "Campaign A",
    campaignId: "CA121313",
    budget: 10000,
    fromTime: "2023-08-25T12:10:59.000Z",
    toTime: "2023-08-28T09:27:24.000Z"
  },
  {
    id: 4,
    status: "invalid",
    campaign: "Campaign A",
    campaignId: "CA121313",
    budget: 10000,
    fromTime: "2023-08-25T12:10:59.000Z",
    toTime: "2023-08-28T09:27:24.000Z"
  },
  {
    id: 5,
    status: "invalid",
    campaign: "Campaign A",
    campaignId: "CA121313",
    budget: 10000,
    fromTime: "2023-08-25T12:10:59.000Z",
    toTime: "2023-08-28T09:27:24.000Z"
  },
]

export default function UpdateCampaignBudget (props: IUpdateCampaignBudgetProps) {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [form]:any = Form.useForm();
  const accountList = useAppSelector(getAccountList);
  const [file, setFile] = useState<any>()
  const [partnerAccountId, setPartnerAccountId] = useState<any>()
  const [loading, setLoading] = useState<boolean>(false)
  const [reGenerateDataAccountList, setReGenerateDataAccountList] = useState<any[]>([])
  const [step, setStep] = useState<number>(1)
  const [mappingData, setMappingData] = useState<any[]>([])
  const [previewFile, setPreviewFile] = useState<any[]>([])
  const [totalError, setTotalError] = useState<number>(0)
  const [totalPassed, setTotalPassed] = useState<number>(0)
  const [campaignsHaveSchedule, setCampaignsHaveSchedule] = useState<any[]>([])
  const [openModalWarning, setOpenModalWarning] = useState<boolean>(false)
  const [errorFiles, setErrorFiles] = useState<any>()
  const [pagination, setPagination] = useState<any>({
    pageSize: 30,
    current: 1,
    total: 0,
  })

  useEffect(() => {
    const newData = accountList.map((account:any) => ({
      value: account.id,
      label: account.name
    }))
    setReGenerateDataAccountList(newData)
  }, [accountList])

  useEffect(() => {
    const newData = previewFile.map((item: any, index: any) => ({
      item,
      errorFields: errorFiles[index + 1]
    }))
    setMappingData(newData)
  }, [previewFile, errorFiles])
  

  useEffect(() => {
    dispatch(setBreadcrumb({data: [{label: t('breadcrumb.campaign_budgets') , url: '/campaign-budgets'}, {label: t('breadcrumb.update_budget') , url: ''}]}))
  }, [])

  const onUploadCSVFile = async (value: any) => {
    try {
      const { partnerAccountId, file } = value;
      setFile(file)
      setPartnerAccountId(partnerAccountId)
      const CSVFile = file && file.length && file[0] && file[0].originFileObj ? file[0].originFileObj : null
      var formData = new FormData();
      formData.append('file', CSVFile);
      
      const result = await uploadBudgetScheduleCSVFile(partnerAccountId, formData)
      if (result && result.data) {
        setPreviewFile(result.data.results)
        setErrorFiles(result.data.errorsFile)
        setTotalError(result.data.totalError)
        setTotalPassed(result.data.totalPassed)
        setCampaignsHaveSchedule(result.data.infoCampaignHaveSchedule)
        setStep(2)
      } 
    } catch (error: any) {
      console.log(">>> Upload CSV File Error", error)
      notificationSimple(error.message, NOTIFICATION_ERROR)
    }
  }

  const onUploadCSVFileFail = (value: any) => {
    console.log('>>> value', value);
  }

  const handleFinish = async () => {
    try {
      if (totalError <= 0) {
        if (campaignsHaveSchedule && campaignsHaveSchedule.length) {
          setOpenModalWarning(true)
          return
        }
        const CSVFile = file && file.length && file[0] && file[0].originFileObj ? file[0].originFileObj : null
        var formData = new FormData();
        formData.append('file', CSVFile);
        
        const result = await uploadBudgetScheduleCSVFile2(partnerAccountId, formData)
        if (result && result.data && result.data.status == "OK") {
          notificationSimple(renderTranslateToastifyText(t('update_campaign_schedule_page.schedule_file')), NOTIFICATION_SUCCESS)
        }
        router.push(BREADCRUMB_CAMPAIGN_BUDGET.url)
      } else {
        notificationSimple(t('error_messages.field_empty_or_unreadable_and_upload_again'), NOTIFICATION_WARN)
      }
    } catch (error) {
      console.log(">>> Upload CSV File Error", error)
    }
  }

  const handleConfirmSettingSchedule = () => {
    handleFinish()
    setOpenModalWarning(false);
    notificationSimple(renderTranslateToastifyText(t('update_campaign_schedule_page.schedule_file')), NOTIFICATION_SUCCESS)
    setTimeout(() => {
      router.push(BREADCRUMB_CAMPAIGN_BUDGET.url)
    }, 1000);
  };

  const handleCancelSettingSchedule = () => {
    setOpenModalWarning(false);
  };

  const normFile = (e: any) => {
    console.log('Upload event:', e);
    if (Array.isArray(e)) {
      return e;
    }
    return e?.fileList;
  };

  const handleOnChangeTable = (pagination:any, filters: any, sorter: any) => {
    const { current } = pagination
    // changeNextPageUrl(router, current)
    setPagination(pagination)
  }

  const renderTranslateFilterText = (text: any) => {
    let translate = t("commons.filter_text");
    return translate.replace("{text}", text);
  }

  const renderTranslateErrorMessageText = (text: any) => {
    let translate = t("error_messages.no_selected");
    return translate.replace("{text}", text);
  }

  const renderTranslateToastifyText = (text: any) => {
    let translate = t("toastify.success.uploaded_text")
    return translate.replace("{text}", text);
  }

  const columnsBudgetLog: any = useMemo(
    () => [
      {
        title: <div className='text-center'>{t('upload_csv.status')}</div>,
        dataIndex: 'status',
        key: 'status',
        render: (text: any, record: any) => {
          const errorFields = record && record.errorFields ? record.errorFields : []
          const renderStatus = () => {
            let status : any = ''
            let type = ''
            if (errorFields.length > 0) {
              status = <Tooltip placement="top" title={t('commons.status_enum.fail')} arrow={true}><InfoCircleOutlined className='text-lg text-red'/></Tooltip>
              type = 'success'
            } else {
              status = <Tooltip placement="top" title={t('commons.status_enum.success')} arrow={true}><CheckCircleOutlined className='text-lg'/></Tooltip>
              type = 'error'
            }
            return <>{status}</>
          }
        return (
            <div className='flex justify-center uppercase'>
              {renderStatus()}
            </div>
        );
        }
      },
      {
        title: <div className='text-center'>{t('upload_csv.campaign_id')}</div>,
        dataIndex: 'campaignId',
        key: 'campaignId',
        render: (text: any, record: any) => {
          const campaignId = record && record.item && record.item.campaignId ? record.item.campaignId : <Tooltip placement="top" title={t('error_messages.field_empty_or_unreadable')} arrow={true}><InfoCircleOutlined className='text-lg'/></Tooltip>
          const errorFields = record && record.errorFields ? record.errorFields.filter((field: any) => field.key == 'campaignId') : []
          const checkHaveErrorField = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].key == 'campaignId'
          const errorMessage = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].message ? errorFields[0].message : ""
          return (
            <Tooltip placement="top" title={errorMessage} arrow={true}>
              <p className={checkHaveErrorField ? 'text-red' : ''}>{campaignId}</p>
            </Tooltip>
          )
        }
      },
      {
        title: <div className='text-center'>{t('upload_csv.campaign_name')}</div>,
        dataIndex: 'campaignName',
        key: 'campaignName',
        render: (text: any, record: any) => {
          const campaignName = record && record.item && record.item.campaignName ? record.item.campaignName : <Tooltip placement="top" title={t('error_messages.field_empty_or_unreadable')} arrow={true}><InfoCircleOutlined className='text-lg'/></Tooltip>
          const errorFields = record && record.errorFields ? record.errorFields.filter((field: any) => field.key == 'campaignName') : []
          const checkHaveErrorField = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].key == 'campaignName'
          const errorMessage = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].message ? errorFields[0].message : ""
          return (
            <Tooltip placement="top" title={errorMessage} arrow={true}>
              <p className={checkHaveErrorField ? 'text-red' : ''}>{campaignName}</p>
            </Tooltip>
          )
        }
      },
      {
        title: <div className='text-center'>{t('upload_csv.update_schedule')}</div>,
        dataIndex: 'schedule',
        key: 'schedule',
        render: (text: any, record: any) => {
          const mode = record && record.item && record.item.mode ? record.item.mode : ""
          const schedule = record && record.item && record.item.schedule ? record.item.schedule : <Tooltip placement="top" title={t('error_messages.field_empty_or_unreadable')} arrow={true}><InfoCircleOutlined className='text-lg'/></Tooltip>
          const errorFields = record && record.errorFields ? record.errorFields.filter((field: any) => field.key == 'schedule') : []
          const checkHaveErrorField = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].key == 'schedule'
          const errorMessage = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].message ? errorFields[0].message : ""
          return (
            <Tooltip placement="top" title={errorMessage} arrow={true}>
              <p className={checkHaveErrorField ? 'text-red' : ''}>{mode == 'DAILY' ? moment(schedule).format("YYYY-MM-DD") : moment(schedule).format("YYYY-MM-DD | HH:mm:ss")}</p>
            </Tooltip>
          )
        }
      },
      {
        title: <div className='text-center'>{t('upload_csv.mode')}</div>,
        dataIndex: 'mode',
        key: 'mode',
        render: (text: any, record: any) => {
          const mode = record && record.item && record.item.mode ? record.item.mode : <Tooltip placement="top" title={t('error_messages.field_empty_or_unreadable')} arrow={true}><InfoCircleOutlined className='text-lg'/></Tooltip>
          const errorFields = record && record.errorFields ? record.errorFields.filter((field: any) => field.key == 'mode') : []
          const checkHaveErrorField = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].key == 'mode'
          const errorMessage = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].message ? errorFields[0].message : ""
          return (
            <Tooltip placement="top" title={errorMessage} arrow={true}>
              <p className={`text-center ${checkHaveErrorField ? 'text-red' : ''}`}>{mode}</p>
            </Tooltip>
          )
        }
      },
      {
        title: <div className='text-center'>{t('upload_csv.trend')}</div>,
        dataIndex: 'trend',
        key: 'trend',
        render: (text: any, record: any) => {
          const trend = record && record.item && record.item.trend ? record.item.trend : <Tooltip placement="top" title={t('error_messages.field_empty_or_unreadable')} arrow={true}><InfoCircleOutlined className='text-lg'/></Tooltip>
          const errorFields = record && record.errorFields ? record.errorFields.filter((field: any) => field.key == 'trend') : []
          const checkHaveErrorField = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].key == 'trend'
          const errorMessage = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].message ? errorFields[0].message : ""
          return (
            <Tooltip placement="top" title={errorMessage} arrow={true}>
              <p className={`text-center ${checkHaveErrorField ? 'text-red' : ''}`}>{trend}</p>
            </Tooltip>
          )
        }
      },
      {
        title: <div className='text-center'>{t('upload_csv.value')}</div>,
        dataIndex: 'value',
        key: 'value',
        render: (text: any, record: any) => {
          const value = record && record.item && record.item.value ? record.item.value : <Tooltip placement="top" title={t('error_messages.field_empty_or_unreadable')} arrow={true}><InfoCircleOutlined className='text-lg'/></Tooltip>
          const errorFields = record && record.errorFields ? record.errorFields.filter((field: any) => field.key == 'value') : []
          const checkHaveErrorField = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].key == 'value'
          const errorMessage = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].message ? errorFields[0].message : ""
          return (
            <Tooltip placement="top" title={errorMessage} arrow={true}>
              <p className={`text-center ${checkHaveErrorField ? 'text-red' : ''}`}>{value ? `￥${value}` : "NA"}</p>
            </Tooltip>
          )
        }
      },  
      {
        title: <div className='text-center'>{t('upload_csv.weight_template_id')}</div>,
        dataIndex: 'weightTemplateId',
        key: 'weightTemplateId',
        render: (text: any, record: any) => {
          const mode = record && record.item && record.item.mode ? record.item.mode : ""
          const weightTemplateId = mode == 'DAILY' ? record && record.item && record.item.weightTemplateId ? record.item.weightTemplateId : <Tooltip placement="top" title={t('error_messages.field_empty_or_unreadable')} arrow={true}><InfoCircleOutlined className='text-lg'/></Tooltip> : " - "
          const errorFields = record && record.errorFields ? record.errorFields.filter((field: any) => field.key == 'weightTemplateId') : []
          const checkHaveErrorField = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].key == 'weightTemplateId'
          const errorMessage = errorFields && errorFields.length > 0 && errorFields[0] && errorFields[0].message ? errorFields[0].message : ""
          return (
            <Tooltip placement="top" title={errorMessage} arrow={true}>
              <p className={`text-center ${checkHaveErrorField ? 'text-red' : ''}`}>{weightTemplateId}</p>
            </Tooltip>
          )
        }
      },
    ], [mappingData, t]
  )

  return (
    <div>
      {step == 1 ? (
        <div>
          <div className='panel-heading flex items-center justify-between'>
            <h2>{t('update_campaign_schedule_page.update_campaign_budget_schedule')}</h2>
          </div>
          <div className='form-container'>
            <Form
              form= {form}
              onFinish={onUploadCSVFile}
              onFinishFailed={onUploadCSVFileFail}
              labelCol={{ span: 4 }}
              wrapperCol={{ span: 14 }}
              layout="horizontal"
            >
              <FSelect required name={'partnerAccountId'} label={t('update_campaign_schedule_page.partner_account')} placeholder={renderTranslateFilterText(t('update_campaign_schedule_page.partner_account'))} options={reGenerateDataAccountList} errorMessage={renderTranslateErrorMessageText(t('update_campaign_schedule_page.partner_account'))}/>
              <FUploadFile acceptType={'.csv'} required name={'file'} label={t('update_campaign_schedule_page.schedule_file')} onUploadFile={normFile} multiple={false} errorMessage={t('error_messages.file_empty_or_unreadable')}/>

              <Space size="middle" className='w-full flex justify-end'>
                <ActionButton htmlType={"submit"} className={'next-button'} iconOnRight={<RightOutlined />} label={t('pagination.next')}/>
              </Space>
            </Form>
          </div>
        </div>
      ) : step == 2 ? (
        <div>
          <div className='panel-heading flex items-center justify-between'>
            <h2>{t('update_campaign_schedule_page.update_campaign_budget_schedule')} - {t('update_campaign_schedule_page.validate_and_live_edit')}</h2>
          </div>
          <div className='w-full text-center mt-4'>
            <h3 className='w-full flex items-center justify-center'>{t('upload_csv.rows_passed')}: <h3 className='text-green ml-1'>{totalPassed}</h3></h3>
            <h3 className='w-full flex items-center justify-center'>{t('upload_csv.rows_failed')}: <h3 className='text-red ml-1'>{totalError}</h3></h3>
          </div>
          <TableGeneral loading={loading} columns={columnsBudgetLog} data={mappingData ? mappingData  : []} pagination={pagination} handleOnChangeTable={handleOnChangeTable}/>
          <div className='w-full flex items-center justify-between'>
            <ActionButton className={'back-button'} iconOnLeft={<LeftOutlined />} label={t('pagination.back')} onClick={() => setStep(1)}/>
            <ActionButton className={'finish-button'} label={t('commons.action_type.finish')} onClick={handleFinish}/>
          </div>
        </div>
      ) : null}

      {openModalWarning && (
        <Modal width={1000} open={openModalWarning} onOk={handleConfirmSettingSchedule} onCancel={handleCancelSettingSchedule} footer={null}>
          <ConfirmSetupBudgetSchedule title={'Existing Budget Schedule Warning'} onCancel={handleCancelSettingSchedule} onOk={handleConfirmSettingSchedule} scheduledCampaignData={campaignsHaveSchedule}/>
        </Modal>
      )}
    </div>
  );
}

UpdateCampaignBudget.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  )
};