import React, { useEffect, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useBreadcrumb } from '@/components/breadcrumb-context';
import { BREADCRUMB_ACCOUNT, BREADCRUMB_ADD, BREADCRUMB_EDIT } from '@/components/breadcrumb-context/constant';
import { useRouter } from 'next/router';
import { Button, Form } from 'antd';
import FText from '@/components/form/FText';
import FMultipleCheckbox from '@/components/form/FMultipleCheckbox';
export interface IAddAccountProps {
}

const fakeDataForm = {
  name: "Name Edit",
  clientId: "Client ID Edit",
  secretId: "Secret ID Edit",
  refreshToken: "Refresh Token Edit",
  partnerAccount: ['jack', 'tom']
}

const PARTNER_ACCOUNT = [
  {
    value: 'jack',
    label: 'Jack',
  },
  {
    value: 'lucy',
    label: 'Lucy',
  },
  {
    value: 'tom',
    label: 'Tom',
  },
]

export default function AddAccount (props: IAddAccountProps) {
  const router = useRouter()
  const { setBreadcrumb } = useBreadcrumb();
  const [form]:any = Form.useForm();

  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [partnerAccount, setPartnerAccount] = useState<any[]>(PARTNER_ACCOUNT)

  useEffect(() => {
    const valueEdit = router.query && router.query.type && router.query.type[0] === 'edit' ? true : false
    setIsEdit(valueEdit)
    setBreadcrumb([BREADCRUMB_ACCOUNT, valueEdit ? BREADCRUMB_EDIT : BREADCRUMB_ADD])

    if (valueEdit) {
      handleMapEditData()
    } else {
      form.setFieldsValue({
        timeSlot: 1
      })
    }
  },[router])

  const handleMapEditData = () => {
    form.setFieldsValue(fakeDataForm)
  }

  const onChangeCheck = (value: any) => {
    console.log(">>> value", value)
  }

  const onSave = (value:any) => {
    console.log('>>> value', value);
  }

  const onSaveFail = (value:any) => {
    console.log('>>> value', value);
  }

  return (
    <Form
      form= {form}
      onFinish={onSave}
      onFinishFailed={onSaveFail}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      // initialValues={{ size: componentSize }}
      // onValuesChange={onFormLayoutChange}
      // size={componentSize as SizeType}
    >
      <FText name={'name'} label='Name'/>
      <FText name={'clientId'} label='Client ID'/>
      <FText name={'secretId'} label='Secret ID'/>
      <FText name={'refreshToken'} label='Refresh Token'/>
      <FMultipleCheckbox name={'partnerAccount'} label='Who can see?' data={partnerAccount} onChange={onChangeCheck}/>
      
      <div className='flex justify-center'>
        <Button onClick={() => router.back()}>Cancel</Button>
        <Button className='bg-primary' htmlType="submit">Create</Button>
      </div>
    </Form>
  );
}

AddAccount.getLayout = (page: any) => (
  <RootLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </RootLayout>
);