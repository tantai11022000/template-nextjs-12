import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useRouter } from 'next/router'
import { Form, Input, Space } from 'antd';
import FText from '@/components/form/FText';
import FTextArea from '@/components/form/FTextArea';
import FRadio from '@/components/form/FRadio';
import { BREADCRUMB_ADD, BREADCRUMB_EDIT, BREADCRUMB_WEIGHT_TEMPLATE } from '@/Constant/index';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { useAppDispatch } from '@/store/hook';
import ActionButton from '@/components/commons/buttons/ActionButton';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useTranslation } from 'next-i18next';
import { createWeightTemplate, editWeightTemplate, getWeightTemplateDetail } from '@/services/weight-template';
import TableGeneral from '@/components/table';
import { notificationSimple } from '@/utils/CommonUtils';
import { NOTIFICATION_ERROR, NOTIFICATION_SUCCESS } from '@/utils/Constants';
import { getDaily30MinsSlot } from '@/services/commons-service';
import TableWeightTemplate from '@/components/table-weight-template';

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

function AddWeightTemplate() {
    const [form]:any = Form.useForm();
    const { t } = useTranslation()
    const router = useRouter()
    const id = router && router.query && router.query.type && router.query.type.length && router.query.type[1] ? router.query.type[1] : ""
    const valueEdit = router && router.query && router.query.type && router.query.type.length && router.query.type[0] === 'edit' ? true : false
    const dispatch = useAppDispatch()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [timeSlot, setTimeSlot] = useState<number>(1)
    const [loading, setLoading] = useState<boolean>(false)
    const [timeMinutes, setTimeMinutes] = useState<any[]>([])
    const [timeHours, setTimeHours] = useState<any[]>([])
    const [percentage, setPercentage] = useState<number>(0);
    const timeType = [
      {
        value: 0,
        label: t('weight_template_page.form.30_minute')
      },
      {
        value: 1,
        label: t('weight_template_page.form.1_hour')
      },
    ]

    useEffect(() => {
      init()
    }, [])

    const init = () => {
      fetchDaily30MinsSlot()
    }

    useEffect(() => {
      const valueEdit = router.query && router.query.type && router.query.type[0] === 'edit' ? true : false
      setIsEdit(valueEdit)
      if (valueEdit) {
        handleMapEditData()
        dispatch(setBreadcrumb({data: [{label: t('breadcrumb.target_bidding') , url: '/targeting-bidding'}, {label: t('breadcrumb.edit') , url: ''}, { label: id, url: '' }]}))
      } else {
        dispatch(setBreadcrumb({data: [{label: t('breadcrumb.target_bidding') , url: '/targeting-bidding'}, {label: t('breadcrumb.add') , url: ''}]}))
      }
    },[router])

    const fetchDaily30MinsSlot =async () => {
      setLoading(true)
      try {
        const result = await getDaily30MinsSlot()
        if (result && result.data) {
          const minsData = result.data.map((item:any) => ({
            slot: item.code,
            time: item.name,
            weight: 0
          }))
          setTimeMinutes(minsData)
          const hourData = minsData.filter((time: any, index: number) => index % 2 === 0)
          setTimeHours(hourData)
        }
        setLoading(false)
      } catch (error) {
        console.log(">>> Fetch Daily 30Mins Slot Error", error)
        setLoading(false)
      }
    }

    const handleChangeValueTable = (weight:number, slot:number) => {
        let newData = timeSlot == 1 ? [...timeHours] : [...timeMinutes]
        newData.find(item => item.slot === slot).weight = weight
        const percent = newData.reduce((sum:number,item:any) => sum + (item?.weight ? item.weight : 0),0)
        setPercentage(percent);
        if (timeSlot == 1) {
          setTimeHours(newData)
        } else {
          setTimeMinutes(newData)
        }
    };

    const handleMapEditData = async () => {
      setLoading(true)
      try {
        const result = await getWeightTemplateDetail(id)
        if (result && result.data) {
          const { name, description, type, weightSetting } = result.data
          form.setFieldsValue({
            name: name,
            description: description,
            type: type,
          })
          setTimeSlot(type)
          if (type === 1) {
            setTimeHours(weightSetting)
          } else {
            setTimeMinutes(weightSetting)
          }
          const percent = weightSetting.reduce((sum:number,item:any) => sum + (item?.weight ? item.weight : 0),0)
          setPercentage(percent)
        }
        setLoading(false)
      } catch (error) {
       console.log(">>> Get Account Info Error", error)
       setLoading(false)
      }
    }

    const onSave = async (values: any) => {
      try {
        if (values.description === undefined) values.description = ''
        const updatedValues = {
          ...values,
          description: values.description || '',
          type: timeSlot,
          weightSetting: timeSlot === 1 ? timeHours : timeMinutes,
        };
        if (valueEdit) {
          await editWeightTemplate(id, updatedValues)
        } else {
          await createWeightTemplate(updatedValues)
          notificationSimple(renderTranslateToastifyText(t('weight_template_page.weight_template')), NOTIFICATION_SUCCESS)
        }
        router.push(BREADCRUMB_WEIGHT_TEMPLATE.url)
      } catch (error:any) {
        console.log(">>> Create Weight Template Error", error)
        notificationSimple(error.message ? error.message : t('toastify.error.default_error_message'), NOTIFICATION_ERROR);
      }
    };
    
    const onSaveFailed = (e:any) => {
      console.log('>>> handle Finish Failed ', e);
    }

    const handleChangeTimeType = (e: any) => {
      const {value} = e.target
      setTimeSlot(value)
      let data = value == 1 ? timeHours : timeMinutes
      const percent = data.reduce((sum:number,item:any) => sum + (item?.weight ? item.weight : 0),0)
      setPercentage(percent);
    }

    const renderTranslateTitleText = (text: any) => {
      let translate = isEdit ? t("commons.action_type.edit_text") : t("commons.action_type.add_text");
      return translate.replace("{text}", text);
    }

    const renderTranslateInputText = (text: any) => {
      let translate = t("commons.action_type.input");
      return translate.replace("{text}", text);
    }

    const renderTranslateToastifyText = (text: any) => {
      let translate = t("toastify.success.created_text")
      return translate.replace("{text}", text);
    }

    return (
      <div>
        <div className='panel-heading flex items-center justify-between'>
          <h2>{renderTranslateTitleText(t('weight_template_page.weight_template'))}</h2>
        </div>
        <div className='form-container'>
          <Form
            form= {form}
            onFinish={onSave}
            onFinishFailed={onSaveFailed}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            <FText name={"name"} label={t('commons.name')} errorMessage={renderTranslateInputText(t('commons.name'))} required/>
            <FTextArea name={"description"} label={t('commons.description')} errorMessage={renderTranslateInputText(t('commons.description'))} />
            <FRadio name={"type"} value={timeSlot} defaultValue={timeSlot} label={t('weight_template_page.form.time_slot')} options={timeType} onChange={handleChangeTimeType} />
            <div className='weight-table-css w-[80%] m-auto'>
                <TableWeightTemplate dataWeight={timeSlot == 1 ? timeHours : timeMinutes} 
                handleChangeValueTable={handleChangeValueTable} percentage={percentage} 
                isLoading={loading} timeSlot={timeSlot}/>
            </div>

            <Space size="middle" className='w-full flex justify-center mt-8'>
              <ActionButton className={'cancel-button'} label={t('commons.action_type.cancel')} onClick={() => router.back()}/>
              <ActionButton htmlType={"submit"} className={'finish-button'} label={isEdit ? t('commons.action_type.save') : t('commons.action_type.submit')}/>
            </Space>
          </Form>
        </div>
      </div>
    );
}

AddWeightTemplate.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  )
};

export default AddWeightTemplate;