import { Button, Form, Input, Space } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import FRadio from '../form/FRadio';
import TableGeneral from '../table';
import FText from '../form/FText';
import { useTranslation } from 'next-i18next';
import ActionButton from '../commons/buttons/ActionButton';
import { useRouter } from 'next/router';
import { getDaily30MinsSlot } from '@/services/commons-service';
import { createWeightTemplate, getWeightTemplateDetail } from '@/services/weight-template';
import { notificationSimple } from '@/utils/CommonUtils';
import { NOTIFICATION_ERROR, NOTIFICATION_SUCCESS } from '@/utils/Constants';
import { BREADCRUMB_WEIGHT_TEMPLATE } from '@/Constant';
import FTextArea from '../form/FTextArea';

export interface IEditWeightTemplateProps {
  weightTemplate: any,
  onCancel: any,
  onOk: any,
  refreshData?: any,
  title?: string,
  preview?: boolean
}

export default function EditWeightTemplate (props: IEditWeightTemplateProps) {
  const { weightTemplate, onCancel, onOk, refreshData, title, preview } = props
  const { t } = useTranslation()
  const router = useRouter()
  const [form]:any = Form.useForm();
  const [timeSlot, setTimeSlot] = useState<number>(1)
  const [timeMinutes, setTimeMinutes] = useState<any[]>([])
  const [timeHours, setTimeHours] = useState<any[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [weightTemplateName, setWeightTemplateName] = useState<string>("")
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
    if (weightTemplate.id) handleMapEditData()
  }, [])

  const init = () => {
    fetchDaily30MinsSlot()
  }

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

  const handleMapEditData = async () => {
    setLoading(true)
    try {
      const result = await getWeightTemplateDetail(weightTemplate.id)
      if (result && result.data) {
        const { name, description, type, weightSetting } = result.data
        form.setFieldsValue({
          name: !preview ? `Copy of ${name}` : name,
          description: description,
          type: type,
          weightSetting: weightSetting
        })
        setTimeSlot(type)
        setWeightTemplateName(name)
      }
      setLoading(false)
    } catch (error) {
     console.log(">>> Get Account Info Error", error)
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
      // setPercentage(calculatedPercentage);
    }
  };
  
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
        clonedFromWeightTemplateId: weightTemplate && weightTemplate.id ? weightTemplate.id : ""
      };

      await createWeightTemplate(updatedValues)
      notificationSimple("Create Weight Template Success", NOTIFICATION_SUCCESS);
      refreshData()
      onOk()
    } catch (error: any) {
      console.log(">>> Create Weight Template Error", error)
      notificationSimple(error.message, NOTIFICATION_ERROR);
    }
  };

  const onSaveFail = (value: any) => {
    console.log('>>> value', value);
  }

  const handleChangeTimeType = (value: any) => {
    setTimeSlot(value.target.value)
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
            {/* <div className='text-red'>{percentage}% / 100%</div> */}
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
      // {
      //   title: <div className='text-center'>Estimate Hourly Budget</div>,
      //   dataIndex: 'estimateBudget',
      //   key: 'estimateBudget',
      //   render: (text: any) => <span>{text}</span>
      // },
      // {
      //   title: <div className='text-center'>Accumulative Budget</div>,
      //   dataIndex: 'accumulativeBudget',
      //   key: 'accumulativeBudget',
      //   render: (text: any) => <span>{text}</span>
      // },
    ], [timeSlot, t])

  return (
    <div>
      <div className='panel-heading flex items-center justify-between'>
        {preview 
          ? <h2>{title ? `${title}: ${weightTemplateName}` : ""}</h2>
          : <h2>{title ? title : `${t('weight_template_page.clone_weight_template')} ${weightTemplate.name}`}</h2>
        }
      </div>
      <div className='form-container'>
        <Form
          form= {form}
          onFinish={onSave}
          onFinishFailed={onSaveFail}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          layout="horizontal"
          disabled={preview}
        > 
          <FText name={"name"} label={t('commons.name')} errorMessage={renderTranslateInputText(t('commons.name'))} required/>
          <FTextArea name={"description"} label={t('commons.description')} errorMessage={renderTranslateInputText(t('commons.description'))} />
          <FRadio disabled name={"type"} value={timeSlot} defaultValue={timeSlot} label={t('weight_template_page.form.time_slot')} options={timeType} onChange={handleChangeTimeType} />
          
          <div className='weight-clone-table-css'>
            <Form.Item name="weightSetting">
              <TableGeneral columns={columns} data={timeSlot == 0 ? timeMinutes : timeHours} pagination={false} scrollY={300} loading={loading}/>
            </Form.Item>
          </div>
          {!preview && (
            <Space size="middle" className='w-full flex justify-end mt-8'>
              <ActionButton className={'cancel-button'} label={t('commons.action_type.cancel')} onClick={onCancel}/>
              <ActionButton htmlType={"submit"} className={'finish-button'} label={t('commons.action_type.save')}/>
            </Space>
          )}
        </Form>
      </div>
    </div>
  );
}
