import React from 'react';
import {  Select } from 'antd';
import { Layout } from 'antd';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useRouter } from 'next/router';
import { getAccountList, getCurrentAccount, setCurrentAccount } from '@/store/account/accountSlice';
import SideBar from '../sidebar/Sidebar';
import Breadcrumbs from '../breadcrumbs/Breadcrumbs';

const DashboardLayout = (props: any) => {
  const { Footer } = Layout;
  const { children } = props
  const router = useRouter()
  const dispatch = useAppDispatch()
  const accountList = useAppSelector(getAccountList);
  const currentAccount = useAppSelector(getCurrentAccount);
  const [optionAccount, setOptionAccount] = useState<any[]>([])
  const [menu, setMenu] = useState<string>("campaign-budgets")
  const [showGlobalButton, setShowGlobalButton] = useState<any>({
    partnerAccount: false
  })

  const handleMenuName = (pathName: string) : string => {
    if (pathName.includes("campaign-budgets")) {
      return "campaign-budgets"
    }
    if (pathName.includes("accounts")) {
      return "accounts"
    }
    if (pathName.includes("targeting-bidding")) {
      return "targeting-bidding"
    }
    if (pathName.includes("weight-template")) {
      return "weight-template"
    }
    return ""
  }
  useEffect(() => {
    if (router.pathname.includes("campaign-budgets")) {
      setShowGlobalButton({...showGlobalButton, partnerAccount: true})
    } else {
      setShowGlobalButton("")
    }
    setMenu(handleMenuName(router.pathname))
  }, [router.pathname])

  useEffect(() => {
    const option = accountList.map((account:any) => ({
      value: account.id,
      key: account.id,
      label: account.name
    }))
    setOptionAccount(option)
  }, [accountList])

  const onChangeAccount = (account: any) => {
    dispatch(setCurrentAccount({data: account.value}))
  }

  return (
    <Layout className='layout-container'>
      <SideBar menu={menu} setMenu={setMenu}/>
      <Layout>
        <div className='min-h-screen bg-[#eeeeee]'>
          <Layout>
            <div className='flex items-center justify-between px-6 py-4 max-h-[36px] bg-[#f5f5f5]'>
              <Breadcrumbs/>
              <div className='flex'>
                {showGlobalButton.partnerAccount &&
                  <div className='select-filter-container'>
                    <Select
                      labelInValue
                      style={{ width: 250 }}
                      showSearch
                      placeholder="Select Account"
                      optionFilterProp="label"
                      onChange={onChangeAccount}
                      value={currentAccount}
                      options={optionAccount}
                      />
                  </div>
                }
              </div>
            </div>
          </Layout>
          
          <div className='m-6 bg-white'>
            <div className='p-4 panel-container'>
              {React.Children.map(children, (child) => {
                return React.cloneElement(child, { accountList, onPartnerAccountsChange: onChangeAccount });
              })}
            </div>
          </div>
        </div>
        <Footer style={{ textAlign: 'left' }}>© 2023 ADTRAN</Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;