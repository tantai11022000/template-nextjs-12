import React, { useEffect, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_ADD, BREADCRUMB_EDIT, BREADCRUMB_WEIGHT_TEMPLATE } from '@/components/breadcrumb-context/constant';
import { useRouter } from 'next/router'
import { Button, Form, Input, Radio } from 'antd';

const fakeDataForm = {
  name: "fake data",
  description: "This is a fake data",
  timeSlot: 2
}

function AddWeightTemplate() {
    const { setBreadcrumb } = useBreadcrumb();
    const router = useRouter()
    const [isEdit, setIsEdit] = useState<boolean>(router.query && Array.isArray(router.query.type) && router.query.type[0] === 'edit' ? true : false)
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
        setBreadcrumb([BREADCRUMB_WEIGHT_TEMPLATE,isEdit ? BREADCRUMB_EDIT : BREADCRUMB_ADD])
        if (isEdit) {
          handleMapEditData()
        }
      },[])
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
                <Form.Item
                  name="name"
                  label="Name"
                  rules={[{
                    required: true, message: 'Please input your name'
                  }]}
                >
                  <Input />
                </Form.Item>

                <Form.Item
                  name="description"
                  label="Description"
                  rules={[{
                    required: true, message: 'Please input your description'
                  }]}
                >
                  <Input.TextArea rows={5}/>
                </Form.Item>
                
                <Form.Item
                  name="timeSlot"
                  label="Time slot"
                >
                  <Radio.Group defaultValue={1}>
                    <Radio value={1}>1 hour</Radio>
                    <Radio value={2}>30 mins</Radio>
                  </Radio.Group>
                </Form.Item>

                <Form.Item className='flex justify-end'>
                  <Button type="primary" className='bg-secondary text-white w-28 cursor-pointer mr-5'>Cancel</Button>
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