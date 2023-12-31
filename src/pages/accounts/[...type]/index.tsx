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
import { useTranslation } from 'next-i18next';
import FSwitch from '@/components/form/FSwitch';
import { notificationSimple } from '@/utils/CommonUtils';
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
    }
  }
}
export interface IAddAccountProps {
  
}

export default function AddAccount (props: IAddAccountProps) {
  const [form]:any = Form.useForm();
  const { t } = useTranslation()
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
  const [isFormChanged, setIsFormChanged] = useState(false);
  const [status, setStatus] = useState<boolean>(false)
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isAmazonInfoChanged, setIsAmazonInfoChanged] = useState<boolean>(false);

  useEffect(() => {
    setIsEdit(valueEdit)
    if (valueEdit) {
      handleMapEditData()
    }
  },[router])

  useEffect(() => {
    let breadcrumb = [{label: t('breadcrumb.accounts') , url: '/accounts'}];
  
    if (valueEdit) breadcrumb.push({ label: id, url: '' })
    else breadcrumb.push({label: t('breadcrumb.add') , url: ''})
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
    setCanCreateAccount(true)
    try {
      const result = await getAccountInfo(id)
      if (result && result.data) {
        const { name, setting, description, supervisors, status } = result.data
        setStatus(status == 1)
        form.setFieldsValue({
          name: name,
          description: description,
          supervisors: supervisors,
          status: status,
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

  const onValuesChange = (fieldValues: any) => {
    if (fieldValues.setting && (fieldValues.setting.client_id || fieldValues.setting.client_secret || fieldValues.setting.refresh_token)) {
      setIsAmazonInfoChanged(true);
    }
  }

  const onSave = async (value: any) => {
    setFormSubmitted(true);
    setLoading({...loading, isCreate: true})
    const trimmedName = value && value.name ? value.name.trim() : "";
    try {
      if (trimmedName == '') {
        throw new Error(t('account_page.error_messages.name_not_be_empty'));
      }
      if (valueEdit) {
        await editPartnerAccount(id, value)
        dispatch(editAccount({id, value}))
        notificationSimple(renderTranslateToastifyText(t('commons.user')), NOTIFICATION_SUCCESS)
      } else {
        const result = await createPartnerAccount(value)
        dispatch(addAccount({data: result && result.data ? result.data : ""}))
        notificationSimple(renderTranslateToastifyText(t('commons.user')), NOTIFICATION_SUCCESS)
      }
      setLoading({...loading, isCreate: false})
      router.push(BREADCRUMB_ACCOUNT.url)
    } catch (error: any) {
      console.log(">>>> Create Account Error", error)
      setLoading({...loading, isCreate: false})
      notificationSimple(error.message ? error.message : t('toastify.error.default_error_message'), NOTIFICATION_ERROR)
    }
  }

  const handleCheckValidAccount = async () => {
    setFormSubmitted(false);
    setLoading({...loading, isValid: true})
    try {
      const values = await form.validateFields();
      const result = await checkValidAccount(values.setting)
      if (result && result.message == "OK") {
        setCanCreateAccount(true)
        setIsAmazonInfoChanged(false)
      }
      setLoading({...loading, isValid: false})
      notificationSimple(t('toastify.success.validation'), NOTIFICATION_SUCCESS)
    } catch (error: any) {
      setLoading({...loading, isValid: false})
      notificationSimple(error.message ? error.message : t('toastify.error.default_error_message'), NOTIFICATION_ERROR)
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

  const renderTranslateToastifyText = (text: any) => {
    let translate = valueEdit ? t("toastify.success.updated_text") : t("toastify.success.created_text");
    return translate.replace("{text}", text);
  }

  return (
    <Form
      form= {form}
      onFinish={onSave}
      onFinishFailed={onSaveFail}
      labelCol={{ span: 6 }}
      wrapperCol={{ span: 12 }}
      layout="horizontal"
      onValuesChange={onValuesChange}
    >
      <FText required={formSubmitted ? true : false} errorMessage={formSubmitted ? t('account_page.error_messages.name'): ''} name={'name'} label={t('commons.name')}/>
      <FTextArea name={'description'} label={t('commons.description')}/>
      <FText required errorMessage={t('account_page.error_messages.client_id')} name={['setting', 'client_id']} label={t('account_page.client_id')} onChange={handleChangeField}/>
      <FText required errorMessage={t('account_page.error_messages.secret_id')} name={['setting', 'client_secret']} label={t('account_page.secret_id')} onChange={handleChangeField}/>
      <FText required errorMessage={t('account_page.error_messages.refresh_token')} name={['setting', 'refresh_token']} label={t('account_page.refresh_token')} onChange={handleChangeField}/>
      <FMultipleCheckbox required={formSubmitted ? true : false} errorMessage={formSubmitted ? t('account_page.error_messages.who_can_see') : ''} name={'supervisors'} label={t('account_page.who_can_see')} data={mappingAccounts} onChange={onChangeCheck} loading={loading.isAccounts}/>
      <FSwitch name={'status'} label={t('commons.activated')} status={status} disable={true}/>
      <div className='flex justify-center'>
        <Space size="middle" className='w-full flex items-center justify-between'>
            {loading.isValid ? <Spin/> : <ActionButton disabled={loading.isValid} className={'finish-button'} label={t('account_page.test')} onClick={handleCheckValidAccount}/>}
          <Space className='flex justify-center'>
            <ActionButton className={'cancel-button'} label={t('commons.action_type.cancel')} onClick={() => router.push(`/accounts`)}/>
            {loading.isCreate ? <Spin/> : <ActionButton htmlType="submit" disabled={!canCreateAccount || isAmazonInfoChanged} className={'finish-button'} label={loading.isCreate ? <Spin /> : valueEdit ? t('commons.action_type.save') : t('commons.action_type.create')}/>}
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
