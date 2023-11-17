import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useRouter } from 'next/router'
import { Form, Input, Space, Table } from 'antd';
import FText from '@/components/form/FText';
import FTextArea from '@/components/form/FTextArea';
import FRadio from '@/components/form/FRadio';
import { BREADCRUMB_ADD, BREADCRUMB_EDIT, BREADCRUMB_WEIGHT_TEMPLATE } from '@/Constant/index';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { useAppDispatch } from '@/store/hook';
import ActionButton from '@/components/commons/buttons/ActionButton';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { LeftOutlined, RightOutlined } from '@ant-design/icons';
import { useTranslation } from 'next-i18next';
import { createWeightTemplate, editWeightTemplate, getWeightTemplateDetail } from '@/services/weight-template';
import TableGeneral from '@/components/table';
import { changeNextPageUrl, notificationSimple } from '@/utils/CommonUtils';
import { NOTIFICATION_ERROR, NOTIFICATION_SUCCESS } from '@/utils/Constants';

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

const templateRecord = {
  time: '',
  weight: 0
}

interface iRecordTable {
  time: number,
  weight: number,
}

function AddWeightTemplate() {
    const [form]:any = Form.useForm();
    const { t } = useTranslation()
    const router = useRouter()
    const id = router && router.query && router.query.type && router.query.type.length && router.query.type[1] ? router.query.type[1] : ""
    const valueEdit = router && router.query && router.query.type && router.query.type.length && router.query.type[0] === 'edit' ? true : false
    const dispatch = useAppDispatch()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [dataOneHour, setDataOneHour] = useState<iRecordTable[]>([])
    const [dataThirtyMins, setDataThirtyMins] = useState<iRecordTable[]>([])
    const [timeSlot, setTimeSlot] = useState<number>(1)
    const [weightSetting, setWeightSetting] = useState<any[]>([]);
    const [loading, setLoading] = useState<boolean>(false)
    const [weights, setWeights] = useState<any>([])
    const [pagination, setPagination] = useState<any>({
      pageSize: 10,
      current: 1,
      total: 0,
    })

    const options = [
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
      form.setFieldsValue({
        type: options[1].value
      });
    }

    useEffect(() => {
      initDataDefaultTable()
      const valueEdit = router.query && router.query.type && router.query.type[0] === 'edit' ? true : false
      setIsEdit(valueEdit)
      if (valueEdit) {
        handleMapEditData()
        dispatch(setBreadcrumb({data: [BREADCRUMB_WEIGHT_TEMPLATE, BREADCRUMB_EDIT, { label: id, url: '' }]}))
      } else {
        dispatch(setBreadcrumb({data: [BREADCRUMB_WEIGHT_TEMPLATE, BREADCRUMB_ADD]}))
      }
    },[router])

    const fetchWeightTemplateDetail = async () => {
      setLoading(true)
      try {
        const result = await getWeightTemplateDetail(3)
        if (result && result.data) {
          setWeights(result.data)

          if (result.data.weightSetting && result.data.weightSetting.length) {
            setWeightSetting(result.data.weightSetting)
          }
        }
        setLoading(false)
      } catch (error) {
        console.log(">>> Get Weight Template Detail Error", error)
        setLoading(false)
      }
    }
    

    const initDataDefaultTable = () => {
      const formatTime = (hours: any, minutes: any) => {
        const formattedHours = hours < 10 ? `0${hours}` : hours;
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
        return `${formattedHours}:${formattedMinutes}`;
      };
    
      const defaultDataOneHour: any = Array.from({ length: 24 }, (_, index) => ({
        ...templateRecord,
        time: formatTime(index, 0),
        weight: 0
      }));
    
      const defaultDataThirtyMins: any = Array.from({ length: 48 }, (_, index) => ({
        ...templateRecord,
        time: formatTime(Math.floor(index / 2), (index % 2) * 30),
        weight: 0
      }));
    
      setDataOneHour(defaultDataOneHour);
      setDataThirtyMins(defaultDataThirtyMins);
    };

    const handleChangeValueTable = (value: number, row: number) => {
      const newData = timeSlot === 1 ? [...dataOneHour] : [...dataThirtyMins];
      if (row >= 0 && row < newData.length) {
        newData[row].weight = Number(value);        
        timeSlot === 1 ? setDataOneHour(newData) : setDataThirtyMins(newData);
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
        }
        setLoading(false)
      } catch (error) {
       console.log(">>> Get Account Info Error", error)
       setLoading(false)
      }
    }

    const handleFinish = async (values: any) => {
      try {
        if (values.description === undefined) values.description = ''

        const { weightSetting } = values;
        const updatedWeightSetting = weightSetting.map((item: any, index: number) => ({
          slot: index + 1,
          time: `${index}:00`,
          ...item,
        }));
  
        const updatedValues = {
          ...values,
          description: values.description || '',
          weightSetting: updatedWeightSetting,
        };
        console.log(">>> updatedValues", updatedValues)
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
    
    const handleFinishFailed = (e:any) => {
      console.log('>>> handle Finish Failed ', e);
    }

    const handleChangeTimeSlot = (value: any) => {
      setTimeSlot(value)
    }

    const handleOnChangeTable = (pagination:any, filters:any, sorter:any) => {
      const { current } = pagination
      // changeNextPageUrl(router, current)
      setPagination(pagination)
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
          dataIndex: 'time',
          key: 'time',
          align: 'center',
          render: (text: any) => <span>{text}</span>
        },
        {
          title: <div className='text-center'>{t('weight_template_page.form.weight_%')}</div>,
          dataIndex: 'weight',
          key: 'weight',
          render: (text: any, record: any, index: number) => {
            const weight = record && record.weight ? record.weight : 0;
            return (
              <Form.Item
                name={['weightSetting', index, 'weight']}
                initialValue={weight}
                getValueFromEvent={(e) => (isNaN(e.target.value) ? e.target.value : parseFloat(e.target.value))}
              >
                <Input type='number' onChange={(e) => handleChangeValueTable(+e.target.value, index)} />
              </Form.Item>
            );
          },
        },
      ], [weightSetting, timeSlot, t])

    return (
      <div>
        <div className='panel-heading flex items-center justify-between'>
          <h2>{renderTranslateTitleText(t('weight_template_page.weight_template'))}</h2>
        </div>
        <div className='form-container'>
          <Form
            form= {form}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 14 }}
            layout="horizontal"
          >
            <FText name={"name"} label={t('commons.name')} errorMessage={renderTranslateInputText(t('commons.name'))} required/>
            <FTextArea name={"description"} label={t('commons.description')} errorMessage={renderTranslateInputText(t('commons.description'))} />
            <FRadio name={"type"} value={timeSlot} defaultValue={timeSlot} label={t('weight_template_page.form.time_slot')} options={options} onChange={(e: any) => handleChangeTimeSlot(e.target.value)} />
            <div className='weight-table-css w-[80%] m-auto'>
              <Form.Item name="weightSetting">
                <TableGeneral columns={columns} data={timeSlot === 1 ? dataOneHour : dataThirtyMins} pagination={false} scrollY={true} handleOnChangeTable={handleOnChangeTable}/>
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