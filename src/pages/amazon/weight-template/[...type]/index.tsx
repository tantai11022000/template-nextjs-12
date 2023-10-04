import React, { useEffect, useMemo, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useRouter } from 'next/router'
import { Button, Form, Input, Radio } from 'antd';
import FText from '@/components/form/FText';
import FTextArea from '@/components/form/FTextArea';
import FRatio from '@/components/form/FRatio';
import TableGeneral from '@/components/table';
import { GetServerSideProps } from 'next';

const fakeDataForm = {
  name: "fake data",
  description: "This is a fake data",
  timeSlot: 2
}

const options = [
  {
    value: 1,
    label: '1 hour'
  },
  {
    value: 2,
    label: '30 mins'
  },
]

const DATA = [
  {
    id: 1,
    value: 'A'
  },
  {
    id: 2,
    value: 'B'
  },
  {
    id: 3,
    value: 'C'
  },
]

const templateRecord = {
  time: '',
  weight: 0
}

interface iRecordTable {
  time: number,
  weight: number,
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const type = context && context.query && context.query.type && context.query.type.length ? context.query.type[0] : ""
  const id = context && context.query && context.query.type && context.query.type.length ? context.query.type[1] : ""

  let breadcrumb = [
    { label: 'Weight Template', url: '/amazon/weight-template' },
  ];

  if (type == "add") breadcrumb.push({ label: "Add", url: `/amazon/weight-template/add`})
  else if (type == "edit") breadcrumb.push({ label: id, url: '' })

  return {
    props: {
      breadcrumb,
    },
  };
};

function AddWeightTemplate() {
    const router = useRouter()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [dataOneHour, setDataOneHour] = useState<iRecordTable[]>([])
    const [dataThirtyMins, setDataThirtyMins] = useState<iRecordTable[]>([])
    const [timeSlot, setTimeSlot] = useState<number>(1)
    const [checkedList, setCheckedList] = useState<any[]>(DATA);
    const [form]:any = Form.useForm();

    const initDataDefaultTable = () => {
      const defaultDataOneHour = Array.from({ length: 24 }, (_, index) => ({
        ...templateRecord,
        time: index,
      }));
      const defaultDataThirtyMins = Array.from({ length: 48 }, (_, index) => ({
        ...templateRecord,
        time: index * 30,
      }));
      setDataOneHour(defaultDataOneHour);
      setDataThirtyMins(defaultDataThirtyMins);
    }

    const handleOnChangeForm = (changedValues:any) => {
      if (changedValues.hasOwnProperty('timeSlot')) {
        setTimeSlot(+changedValues.timeSlot)
      }
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

    const handleMapEditData = () => {
      form.setFieldsValue(fakeDataForm)
      setTimeSlot(+fakeDataForm.timeSlot)
    }
    const handleFinish = (value:any) => {
      console.log('value :>> ', value);
    }
    const handleFinishFailed = (e:any) => {
      console.log('e :>> ', e);
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
      ], [dataOneHour, dataThirtyMins, timeSlot])
    useEffect(() => {
        initDataDefaultTable()
        const valueEdit = router.query && router.query.type && router.query.type[0] === 'edit' ? true : false
        setIsEdit(valueEdit)
        if (valueEdit) {
          handleMapEditData()
        } else {
          form.setFieldsValue({
            timeSlot: 1
          })
          setTimeSlot(1)
        }
      },[router])

    const onChangeCheck = (value: any) => {
      console.log(">>> value", value)
    }

    return (
        <>
            <Form
            form= {form}
            onValuesChange={handleOnChangeForm}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            labelCol={{ span: 2 }}
            layout='vertical'
            >
                <FText name={"name"} label={'Name'} errorMessage={'Please input your Name'} required/>
                <FTextArea name={"description"} label={'Description'} errorMessage={'Please input your Description'} />
                <FRatio name={"timeSlot"} label={'Time slot'} options={options} />

                <TableGeneral columns={columns} data={timeSlot === 1 ? dataOneHour : dataThirtyMins} pagination={false} customCss={'max-h-80 w-[50%] m-auto overflow-y-auto'} />

                <Form.Item className='flex justify-end mt-5'>
                  <Button type="primary" className='bg-secondary text-white w-28 cursor-pointer mr-5' onClick={() => router.back()}>Cancel</Button>
                  <Button type="primary" className='bg-blue text-white w-28 cursor-pointer mr-5'>Clone</Button>
                  <Button type="primary" htmlType="submit" className='bg-primary text-white w-28 cursor-pointer'>Submit</Button>
                </Form.Item>
            </Form>
        </>
    );
}

AddWeightTemplate.getLayout = (page: any) => {
  const breadcrumb = page && page.props && page.props.breadcrumb ? page.props.breadcrumb : [];
  return (
    <RootLayout>
      <DashboardLayout breadcrumb={breadcrumb}>{page}</DashboardLayout>
    </RootLayout>
  )
};

export default AddWeightTemplate;