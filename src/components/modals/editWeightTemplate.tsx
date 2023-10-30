import { Button, Form, Input, Space } from 'antd';
import React, { useEffect, useMemo, useState } from 'react';
import FRadio from '../form/FRadio';
import TableGeneral from '../table';
import FText from '../form/FText';

export interface IEditWeightTemplateProps {
}

const templateRecord = {
  time: '',
  weight: 0,
  estimateBudget: '',
  accumulativeBudget: ''
}

interface iRecordTable {
  time: number,
  weight: number,
}

const TIME_SLOT = [
  {
    value: 1,
    label: '1 hour'
  },
  {
    value: 2,
    label: '30 mins'
  },
]

const HOURS_DATA = [
  {
    id: 1,
    time: '',
    weight: 10,
    estimateBudget: 50,
    accumulativeBudget: 50
  },
  {
    id: 2,
    time: '',
    weight: 10,
    estimateBudget: 50,
    accumulativeBudget: 100
  },
  {
    id: 3,
    time: '',
    weight: '',
    estimateBudget: 50,
    accumulativeBudget: 150
  },
  {
    id: 4,
    time: '',
    weight: 10,
    estimateBudget: 50,
    accumulativeBudget: 200
  },
  {
    id: 5,
    time: '',
    weight: 10,
    estimateBudget: 50,
    accumulativeBudget: 250
  },
]

export default function EditWeightTemplate (props: IEditWeightTemplateProps) {
  const [form]:any = Form.useForm();
  const [timeSlots, setTimeSlots] = useState<any[]>(TIME_SLOT)
  const [timeSlot, setTimeSlot] = useState<number>(1)
  const [dataOneHour, setDataOneHour] = useState<iRecordTable[]>([])
  const [dataThirtyMins, setDataThirtyMins] = useState<iRecordTable[]>([])

  useEffect(() => {
    initDataDefaultTable()
  }, [HOURS_DATA])
  
  const onSave = async (value: any) => {
    console.log(">>> value", value)
  }

  const onSaveFail = (value: any) => {
    console.log('>>> value', value);
  }

  const handleOnChangeForm = (changedValues:any) => {
    if (changedValues.hasOwnProperty('timeSlot')) {
      setTimeSlot(+changedValues.timeSlot)
    }
  }

  const initDataDefaultTable = () => {
    const defaultDataOneHour: any = HOURS_DATA.map((data, index) => ({
      ...templateRecord,
      time: index + 1,
      weight: data.weight,
      estimateBudget: data.estimateBudget,
      accumulativeBudget: data.accumulativeBudget,
    }));
    setDataOneHour(defaultDataOneHour);

    const defaultDataThirtyMins: any = HOURS_DATA.map((data, index) => ({
      ...templateRecord,
      time: index * 30,
      weight: data.weight,
      estimateBudget: data.estimateBudget,
      accumulativeBudget: data.accumulativeBudget,
    }));
    setDataThirtyMins(defaultDataThirtyMins);
  }

  const handleChangeValueTable = (e:any,row: number) => {
    const {name, value} = e.target;
    if (timeSlot === 1) {
      const newData = {...dataOneHour[row],[name]: +value}
      dataOneHour[row] = newData;
      setDataOneHour(dataOneHour);
    } else {
      const newData = {...dataThirtyMins[row],[name]: +value}
      dataThirtyMins[row] = newData;
      setDataThirtyMins(dataThirtyMins);
    }
  }

  const columns: any = useMemo(
    () => [
      {
        title: `Time ${timeSlot === 1 ? '(Hours)' : '(Mins)'}`,
        dataIndex: 'time',
        key: 'time',
        align: 'center',
        render: (text: any) => <span>{text}</span>
      },
      {
        title: 'Weight (%)',
        dataIndex: 'weight',
        key: 'weight',
        align: 'center',
        render: (text: any, index:number) => <Input name='weight' defaultValue={text} onChange={(e:any) => handleChangeValueTable(e,index)} className='flex justify-center' />,
      },
      {
        title: 'Estimate Hourly Budget',
        dataIndex: 'estimateBudget',
        key: 'estimateBudget',
        render: (text: any) => <span>{text}</span>
      },
      {
        title: 'Accumulative Budget',
        dataIndex: 'accumulativeBudget',
        key: 'accumulativeBudget',
        render: (text: any) => <span>{text}</span>
      },
    ], [dataOneHour, dataThirtyMins, timeSlot])

  return (
    <div>
      <Form
        form= {form}
        onValuesChange={handleOnChangeForm}
        onFinish={onSave}
        onFinishFailed={onSaveFail}
        // labelCol={{ span: 4 }}
        // wrapperCol={{ span: 14 }}
        // layout="horizontal"
      >
        <FRadio name={'timeSlot'} label={''} options={timeSlots}/>
        <TableGeneral columns={columns} data={timeSlot === 1 ? dataOneHour : dataThirtyMins}/>

        <div className='flex items-center justify-between'>
          <Button type="primary" className='bg-secondary text-white cursor-pointer mr-5'>Apply for this Day Only</Button>
          <Space className='flex items-center'>
            <FText name={'templateName'} label={'Template Name'} customCss={'mb-[unset]'} />
            <Button type="primary" className='bg-secondary text-white cursor-pointer mr-5'>Save As New Template</Button>
          </Space>
        </div>
      
      </Form>
    </div>
  );
}
