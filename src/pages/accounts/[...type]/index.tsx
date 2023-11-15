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
import { BREADCRUMB_ACCOUNT, BREADCRUMB_ADD } from '@/Constant/index';
import { setBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import ActionButton from '@/components/commons/buttons/ActionButton';
import FTextArea from '@/components/form/FTextArea';
import { getUsersSystem } from '@/services/users-service';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

export const getStaticPaths = async () => {
  const accountIds: any[] = [];
  const paths = accountIds.map((id: any) => ({
    params: { type: ['edit', id.toString()] },
  }));
  return { paths, fallback: true };
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
export interface IAddAccountProps {
  
}

export default function AddAccount (props: IAddAccountProps) {
  const [form]:any = Form.useForm();
  const router = useRouter()
  const id = router && router.query && router.query.type && router.query.type.length ? router.query.type[1] : ""
  const valueEdit = router.query && router.query.type && router.query.type[0] === 'edit' ? true : false
  const dispatch = useAppDispatch()
  const [loading, setLoading] = useState<any>({
    isAccounts: false,
    isCreate: false,
    isValid: false
  })
  const [isEdit, setIsEdit] = useState<boolean>(false)
  const [partnerAccount, setPartnerAccount] = useState<any[]>([])
  const [mappingAccounts, setMappingAccounts] = useState<any[]>([])
  const [canCreateAccount, setCanCreateAccount] = useState<boolean>(false)
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
    let breadcrumb = [BREADCRUMB_ACCOUNT];
  
    if (valueEdit) breadcrumb.push({ label: id, url: '' })
    else breadcrumb.push(BREADCRUMB_ADD)
    dispatch(setBreadcrumb({data: breadcrumb}))
  },[valueEdit, id])

  useEffect(() => {
    const isFormDirty = form.isFieldsTouched(true);
    setIsFormChanged(isFormDirty);
  }, [form]);

  useEffect(() => {
    init()
  }, [])

  const init = () => {
    getUsers()
  }

  useEffect(() => {
    const newData = partnerAccount.map((account: any) => ({
      value: account.id,
      name: account.firstName + ' ' + account.lastName
    }))
    setMappingAccounts(newData)
  }, [partnerAccount])
  
  const getUsers = async () => {
    setLoading({...loading, isAccounts: true})
    try {
      const result = await getUsersSystem()
      if (result && result.data) {
        setPartnerAccount(result.data)
      }
      setLoading({...loading, isAccounts: false})
    } catch (error) {
      console.log(">>> Get Users Error", error)
      setLoading({...loading, isAccounts: false})
    }
  }

  const handleMapEditData = async () => {
    try {
      const result = await getAccountInfo(id)
      if (result && result.data) {
        const { name, setting, description, supervisors } = result.data
        form.setFieldsValue({
          name: name,
          description: description,
          supervisors: supervisors,
          setting: {
            client_id: setting.client_id,
            client_secret: setting.client_secret,
            refresh_token: setting.refresh_token,
          }
        })
      }
    } catch (error) {
     console.log(">>> Get Account Info Error", error) 
    }
  }

  const onSave = async (value: any) => {
    setLoading({...loading, isCreate: true})
    try {
      if (valueEdit) {
        await editPartnerAccount(id, value)
        dispatch(editAccount({id, value}))
        toast.success("UPDATE ACCOUNT SUCCESS")
      } else {
        const result = await createPartnerAccount(value)
        dispatch(addAccount({data: result && result.data ? result.data : ""}))
        toast.success("CREATED ACCOUNT SUCCESS")
      }
      setLoading({...loading, isCreate: false})
      router.push(BREADCRUMB_ACCOUNT.url)
    } catch (error: any) {
      console.log(">>>> Create Account Error", error)
      setLoading({...loading, isCreate: false})
      toast.error(error && error.message ? error.message : "")
    }
  }

  const handleCheckValidAccount = async () => {
    setLoading({...loading, isValid: true})
    try {
      const values = await form.validateFields();
      const result = await checkValidAccount(values)
      if (result && result.data == true) {
        setCanCreateAccount(true)
      }
      setLoading({...loading, isValid: false})
    } catch (error: any) {
      setLoading({...loading, isValid: false})
      console.log(">>> Test Valid Error", error)
      toast.error(error && error.message ? error.message : "")
      setCanCreateAccount(true)
    }
  }

  const onChangeCheck = (value: any) => {
    console.log(">>> value", value)
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
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      layout="horizontal"
    >
      <FText name={'name'} label={'Name'}/>
      <FTextArea name={'description'} label={'Description'}/>
      <FText name={['setting', 'client_id']} label='Client ID' onChange={handleChangeField}/>
      <FText name={['setting', 'client_secret']} label='Secret ID' onChange={handleChangeField}/>
      <FText name={['setting', 'refresh_token']} label='Refresh Token' onChange={handleChangeField}/>
      <FMultipleCheckbox name={'supervisors'} label='Who can see' data={mappingAccounts} onChange={onChangeCheck} loading={loading.isAccounts}/>

      <div className='flex justify-center'>
        <Space size="middle" className='w-full flex items-center justify-between'>
            {loading.isValid ? <Spin/> : <ActionButton disabled={loading.isValid} className={'finish-button'} label={"Test"} onClick={handleCheckValidAccount}/>}
          <Space className='flex justify-center'>
            <ActionButton className={'cancel-button'} label={'Cancel'} onClick={() => router.push(`/accounts`)}/>
            {loading.isCreate ? <Spin/> : <ActionButton htmlType="submit" disabled={!canCreateAccount} className={'finish-button'} label={loading.isCreate ? <Spin /> : valueEdit ? "Save" : "Create"}/>}
          </Space>
        </Space>
      </div>
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
