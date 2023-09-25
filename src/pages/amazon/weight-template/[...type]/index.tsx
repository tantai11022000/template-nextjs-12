import React, { useEffect, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_ADD, BREADCRUMB_EDIT, BREADCRUMB_WEIGHT_TEMPLATE } from '@/components/breadcrumb-context/constant';
import { useRouter } from 'next/router'
import { Button, Form, Input, Radio } from 'antd';
import FText from '@/components/form/FText';
import FTextArea from '@/components/form/FTextArea';
import FRatio from '@/components/form/FRatio';
import FMultipleCheckbox from '@/components/form/FMultipleCheckbox';
import FSwitch from '@/components/form/FSwitch';

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

function AddWeightTemplate() {
    const { setBreadcrumb } = useBreadcrumb();
    const router = useRouter()
    const [isEdit, setIsEdit] = useState<boolean>(false)
    const [checkedList, setCheckedList] = useState<any[]>(DATA);
    const [form]:any = Form.useForm();
    const handleMapEditData = () => {
      form.setFieldsValue(fakeDataForm)
    }
    const handleFinish = (value:any) => {
      console.log('value :>> ', value);
    }
    const handleFinishFailed = (e:any) => {
      console.log('e :>> ', e);
    }
    useEffect(() => {
        const valueEdit = router.query && router.query.type && router.query.type[0] === 'edit' ? true : false
        setIsEdit(valueEdit)
        setBreadcrumb([BREADCRUMB_WEIGHT_TEMPLATE,valueEdit ? BREADCRUMB_EDIT : BREADCRUMB_ADD])
        if (valueEdit) {
          handleMapEditData()
        } else {
          form.setFieldsValue({
            timeSlot: 1
          })
        }
      },[router])

    const onChangeCheck = (value: any) => {
      console.log(">>> value", value)
    }
    
    return (
        <>
            <Form
            form= {form}
            onFinish={handleFinish}
            onFinishFailed={handleFinishFailed}
            labelCol={{ span: 2 }}
            // wrapperCol={{ span: 16 }}
            layout='vertical'
            >
                <FText name={"name"} label={'Name'} errorMessage={'Please input your Name'} required/>
                <FTextArea name={"description"} label={'Description'} errorMessage={'Please input your Description'} />
                <FRatio name={"timeSlot"} label={'Time slot'} options={options} />
                <FSwitch name={"rememberMe"} label={'Remember Me'} errorMessage={'This field must be ON mode'} required/>
                <FMultipleCheckbox name={"favorite"} label={""} errorMessage={'Please select AT LEAST ONE'} required data={checkedList} onChange={onChangeCheck}/>


                <Form.Item className='flex justify-end'>
                  <Button type="primary" className='bg-secondary text-white w-28 cursor-pointer mr-5' onClick={() => router.back()}>Cancel</Button>
                  <Button type="primary" className='bg-blue text-white w-28 cursor-pointer mr-5'>Clone</Button>
                  <Button type="primary" htmlType="submit" className='bg-primary text-white w-28 cursor-pointer'>Submit</Button>
                </Form.Item>
            </Form>
        </>
    );
}

AddWeightTemplate.getLayout = (page: any) => (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
);

export default AddWeightTemplate;