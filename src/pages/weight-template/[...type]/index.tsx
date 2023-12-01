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
        dispatch(setBreadcrumb({data: [BREADCRUMB_WEIGHT_TEMPLATE, BREADCRUMB_EDIT, { label: id, url: '' }]}))
      } else {
        dispatch(setBreadcrumb({data: [BREADCRUMB_WEIGHT_TEMPLATE, BREADCRUMB_ADD]}))
      }
    },[router])

    const fetchDaily30MinsSlot =async () => {
      setLoading(true)
      try {
        const result = await getDaily30MinsSlot()
        if (result && result.data) {
          setTimeMinutes(result.data)
          const hourData = result.data.filter((time: any, index: number) => index % 2 === 0)
          setTimeHours(hourData)
        }
        setLoading(false)
      } catch (error) {
        console.log(">>> Fetch Daily 30Mins Slot Error", error)
        setLoading(false)
      }
    }

    const handleChangeValueTable = (value: number, code: number) => {
      var newData = timeSlot == 1 ? [...timeHours] : [...timeMinutes];
      if (code >= 0 && code < newData.length) {
        newData[code].weight = Number(value);        
        timeSlot == 1 ? setTimeHours(newData) : setTimeMinutes(newData);

        const totalWeight = newData.reduce((sum, item) => sum + (item.weight || 0), 0);
        const calculatedPercentage = (totalWeight / 100) * 100;
        setPercentage(calculatedPercentage);
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
            weightSetting: weightSetting
          })
          setTimeSlot(type)
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

        const timeData = timeSlot === 1 ? timeHours : timeMinutes;
        const { weightSetting } = values;
        const updatedWeightSetting = timeData.map((item: any, index: number) => ({
          slot: item.code,
          time: item.name,
          weight: weightSetting[index]?.weight || 0,
        }));
  
        const updatedValues = {
          ...values,
          description: values.description || '',
          type: timeSlot,
          weightSetting: updatedWeightSetting,
        };
        if (valueEdit) {
          await editWeightTemplate(id, updatedValues)
        } else {
          await createWeightTemplate(updatedValues)
          notificationSimple("Create Weight Template Success", NOTIFICATION_SUCCESS);
        }
        router.push(BREADCRUMB_WEIGHT_TEMPLATE.url)
      } catch (error) {
        console.log(">>> Create Weight Template Error", error)
        notificationSimple("Create Weight Template Fail", NOTIFICATION_ERROR);
      }
    };
    
    const onSaveFailed = (e:any) => {
      console.log('>>> handle Finish Failed ', e);
    }

    const handleChangeTimeType = (value: any) => {
      setTimeSlot(value.target.value)
    }

    const renderTranslateTitleText = (text: any) => {
      let translate = isEdit ? t("commons.action_type.edit_text") : t("commons.action_type.add_text");
      return translate.replace("{text}", text);
    }

    const renderTranslateInputText = (text: any) => {
      let translate = t("commons.action_type.input");
      return translate.replace("{text}", text);
    }

    const columns: any = useMemo(
      () => [
        {
          title: <div className='text-center'>{`${t('weight_template_page.form.time')} ${timeSlot === 1 ? t('weight_template_page.form.hour') : t('weight_template_page.form.minute')}`}</div>,
          dataIndex: 'name',
          key: 'name',
          align: 'center',
          render: (text: any) => <span>{text}</span>
        },
        {
          title: (
            <div className='text-center'>
              {t('weight_template_page.form.weight_%')}
              <div className='text-red'>{percentage}% / 100%</div>
            </div>
          ),
          dataIndex: 'weight',
          key: 'weight',
          render: (text: any, record: any) => {
            const code = record && record.code ? record.code : '';
            const weight = record && record.weight ? record.weight : 0;
            return (
              <Form.Item
                name={['weightSetting', code, 'weight']}
                initialValue={weight}
                getValueFromEvent={(e) => (isNaN(e.target.value) ? e.target.value : parseFloat(e.target.value))}
              >
                <Input type='number' min={0} onChange={(e) => handleChangeValueTable(+e.target.value, code)} />
              </Form.Item>
            );
          },
        },
      ], [timeSlot, t, percentage])

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
              <Form.Item name="weightSetting">
                <TableGeneral columns={columns} data={timeSlot == 0 ? timeMinutes : timeHours} pagination={false} scrollY={500} loading={loading}/>
              </Form.Item>
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