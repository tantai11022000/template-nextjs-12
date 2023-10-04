import React, { useEffect, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useRouter } from 'next/router';
import { Button, Form } from 'antd';
import FText from '@/components/form/FText';
import FMultipleCheckbox from '@/components/form/FMultipleCheckbox';
import { GetServerSideProps } from 'next';
export interface IAddAccountProps {
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const type = context && context.query && context.query.type && context.query.type.length ? context.query.type[0] : ""
  const id = context && context.query && context.query.type && context.query.type.length ? context.query.type[1] : ""

  let breadcrumb = [
    { label: 'Accounts', url: '/amazon/accounts' },
  ];

  if (type == "add") breadcrumb.push({ label: "Add", url: `/amazon/accounts/add`})
  else if (type == "edit") breadcrumb.push({ label: id, url: '' })

  return {
    props: {
      breadcrumb,
    },
  };
};

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
  const [form]:any = Form.useForm();

  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [partnerAccount, setPartnerAccount] = useState<any[]>(PARTNER_ACCOUNT)

  useEffect(() => {
    const valueEdit = router.query && router.query.type && router.query.type[0] === 'edit' ? true : false
    setIsEdit(valueEdit)
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

AddAccount.getLayout = (page: any) => {
  const breadcrumb = page && page.props && page.props.breadcrumb ? page.props.breadcrumb : [];
  return (
    <RootLayout>
      <DashboardLayout breadcrumb={breadcrumb}>{page}</DashboardLayout>
    </RootLayout>
  )
};