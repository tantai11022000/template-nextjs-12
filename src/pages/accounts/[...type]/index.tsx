import React, { useEffect, useState } from 'react';
import RootLayout from '@/components/layout';
import DashboardLayout from '@/components/nested-layout/DashboardLayout';
import { useRouter } from 'next/router';
import { Button, Form, Space, Spin } from 'antd';
import FText from '@/components/form/FText';
import FMultipleCheckbox from '@/components/form/FMultipleCheckbox';
import { GetServerSideProps } from 'next';
import { checkValidAccount, createPartnerAccount, editPartnerAccount, getAccountInfo } from '@/services/accounts-service';
import { useAppDispatch } from '@/store/hook';
import { addAccount, editAccount } from '@/store/account/accountSlice';
import { toast } from 'react-toastify';
import { BREADCRUMB_ACCOUNT, BREADCRUMB_ADD } from '@/components/breadcrumb-context/constant';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
export interface IAddAccountProps {
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
  const [form]:any = Form.useForm();
  const router = useRouter()
  const id = router && router.query && router.query.type && router.query.type.length ? router.query.type[1] : ""
  const valueEdit = router.query && router.query.type && router.query.type[0] === 'edit' ? true : false
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<boolean>(false)
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [partnerAccount, setPartnerAccount] = useState<any[]>(PARTNER_ACCOUNT)
  const [displayCreateButton, setDisplayCreateButton] = useState<boolean>(false)
  const [errorMessage, setErrorMessage] = useState<any>("")
  const [isFormChanged, setIsFormChanged] = useState(false);

  useEffect(() => {
    setIsEdit(valueEdit)
    if (valueEdit) {
      handleMapEditData()
    } else {
      form.setFieldsValue({
        timeSlot: 1
      })
    }
  },[router])

  useEffect(() => {
    let breadcrumb = [
      BREADCRUMB_ACCOUNT,
    ];
  
    if (valueEdit) {
      breadcrumb.push({ label: id, url: '' })
    } else {
      breadcrumb.push(BREADCRUMB_ADD)
    }
    dispatch(setBreadcrumb({data: breadcrumb}))
  },[valueEdit,id])

  useEffect(() => {
    const isFormDirty = form.isFieldsTouched(true);
    setIsFormChanged(isFormDirty);
  }, [form]);

  const handleMapEditData = async () => {
    try {
      const result = await getAccountInfo(id)
      if (result && result.data) {
        const { name, masterAccountConfig } = result.data
        form.setFieldsValue({
          name: name,
          masterAccountConfig: {
            client_id: masterAccountConfig.client_id,
            client_secret: masterAccountConfig.client_secret,
            refresh_token: masterAccountConfig.refresh_token,
          }
        })
      }
    } catch (error) {
     console.log(">>> Get Account Info Error", error) 
    }
    
  }

  const onChangeCheck = (value: any) => {
    console.log(">>> value", value)
  }

  const onSave = async (value: any) => {
    setLoading(true)
    try {
      if (valueEdit) {
        await editPartnerAccount(id, value)
        dispatch(editAccount({id, value}))
      } else {
        const result = await createPartnerAccount(value)
        dispatch(addAccount({data: result && result.data ? result.data : ""}))
      }
      setLoading(false)
      router.push(BREADCRUMB_ACCOUNT.url)
    } catch (error: any) {
      console.log(">>>> Create Account Error", error)
      setLoading(false)
      toast.error(error && error.message ? error.message : "")
    }
  }

  const onTestValid = async () => {
    try {
      const values = await form.validateFields();
      const result = await checkValidAccount(values)
      if (result && result.data == true) {
        setDisplayCreateButton(true)
      }
    } catch (error: any) {
      console.log(">>> Test Valid Error", error)
      toast.error(error && error.message ? error.message : "")
    }
  }

  const onSaveFail = (value: any) => {
    console.log('>>> value', value);
  }

  const handleChangeField = () => {
    setIsFormChanged(true);
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
      <FText name={['masterAccountConfig', 'client_id']} label='Client ID' onChange={handleChangeField}/>
      <FText name={['masterAccountConfig', 'client_secret']} label='Secret ID' onChange={handleChangeField}/>
      <FText name={['masterAccountConfig', 'refresh_token']} label='Refresh Token' onChange={handleChangeField}/>
      <FMultipleCheckbox name={'partnerAccount'} label='Who can see?' data={partnerAccount} onChange={onChangeCheck}/>

      {/* <Space size="middle" className='flex justify-center mb-3'>
        <Button className={`${displayCreateButton ? 'bg-blue' : 'bg-primary'} text-white`} onClick={onTestValid} disabled={loading}>{displayCreateButton ? "Valid" : "Check"}</Button>
      </Space> */}

      <Space size="middle" className='flex justify-center'>
        <Button onClick={() => router.back()}>Cancel</Button>
        <Button className='bg-primary text-white' htmlType="submit" disabled={loading}>{loading ? <Spin/> : valueEdit ? "Save" : "Create"}</Button>
      </Space>
    </Form>
  );
}

AddAccount.getLayout = (page: any) => {
  return (
    <RootLayout>
      <DashboardLayout>{page}</DashboardLayout>
    </RootLayout>
  )
};
