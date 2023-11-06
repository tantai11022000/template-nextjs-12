import React, { useLayoutEffect } from 'react';

import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  GoldOutlined,
  HomeFilled
} from '@ant-design/icons';
import { MenuProps, Select } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useRouter } from 'next/router';
import { getAccountList, getCurrentAccount, setCurrentAccount } from '@/store/account/accountSlice';
import { getItem, storeItem } from '@/utils/StorageUtils';
import { CURRENT_MENU } from '@/utils/StorageKeys';
import { BREADCRUMB_ACCOUNT, BREADCRUMB_CAMPAIGN_BUDGET, BREADCRUMB_TARGETING_BIDDING, BREADCRUMB_WEIGHT_TEMPLATE } from '../breadcrumb-context/constant';
import { getBreadcrumb } from '@/store/breadcrumb/breadcrumbSlice';
import { getCollapseMenu } from '@/store/globals/globalsSlice';
const {  Content, Sider, Footer } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItems(
  label: React.ReactNode,
  value: any,
  key: React.Key,
  url: any,
  icon?: React.ReactNode,
  children?: MenuItem[],
): MenuItem {
  return {
    label,
    value,
    key,
    url,
    icon,
    children,
  } as MenuItem;
}

const ActiveMenuLink = (props: any) => {
  const { children, href } = props
  return (
    <Link href={href} className='text-lg'>{children}</Link>
  )
};

const items: MenuItem[] = [
  getItems('Campaign Budgets', 'campaign-budgets', 'campaign-budgets', BREADCRUMB_CAMPAIGN_BUDGET.url , <PieChartOutlined />),
  getItems('Targeting Bidding', 'targeting-bidding', 'targeting-bidding', BREADCRUMB_TARGETING_BIDDING.url, <DesktopOutlined />),
  getItems('Accounts', 'accounts', 'accounts', BREADCRUMB_ACCOUNT.url, <TeamOutlined />),
  getItems('Weight Template', 'weight-template', 'weight-template', BREADCRUMB_WEIGHT_TEMPLATE.url, <GoldOutlined />),
];

const DashboardLayout = (props: any) => {
  const { children } = props
  const router = useRouter()
  const dispatch = useAppDispatch()
  const accountList = useAppSelector(getAccountList);
  const currentAccount = useAppSelector(getCurrentAccount);
  const isCollapseMenu = useAppSelector(getCollapseMenu)
  const breadcrumb = useAppSelector(getBreadcrumb);
  const [optionAccount, setOptionAccount] = useState<any[]>([])
  const [collapsed, setCollapsed] = useState(false);
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
      label: account.name
    }))
    setOptionAccount(option)
  }, [accountList])

  // useEffect(() => {
  //   const currentMenu: any = getItem(CURRENT_MENU)
  //   if (currentMenu) setMenu(currentMenu);
  // }, []);
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onChangeAccount = (account: any) => {
    dispatch(setCurrentAccount({data: account.value}))
  }

  const handleClickMenu = (value: string) => {
    setMenu(value)
    storeItem(CURRENT_MENU, value)
  }

  return (
    <Layout className='layout-container'>
      <Sider width={250} collapsed={isCollapseMenu ? collapsed : !collapsed} onCollapse={(value) => setCollapsed(value)} className='sidebar-container'>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" selectedKeys={[menu]} mode="inline" style={{backgroundColor: "#444"}} className='title-xl'>
          {items && items.map((item: any) => (
            <Menu.Item key={item.key} icon={item.icon} onClick={() => handleClickMenu(item.value)}>
              <ActiveMenuLink href={item.url}>
                {item.label}
              </ActiveMenuLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
      <Layout>
        {/* <Header style={{ padding: 0, background: colorBgContainer }} /> */}
        <div className='min-h-screen bg-[#eeeeee]'>
          <Content className=''>
            <div className='flex items-center justify-between p-4 max-h-[36px]' style={{background: "#f5f5f5"}}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link href="/"><HomeFilled className='text-xs'/></Link>
                </Breadcrumb.Item>
                  {breadcrumb ? breadcrumb.map((item:any, index: number) => (
                      <Breadcrumb.Item key={index}>
                        {item.url 
                          ?  <Link href={item.url}><span className={breadcrumb.length - 1 === index ? "active" : ""}>{item.label}</span></Link> 
                          :  <span className={breadcrumb.length - 1 === index ? "active" : ""}>{item.label}</span>
                        }
                      </Breadcrumb.Item>
                  )) : null}
              </Breadcrumb>
              <div className='flex gap-3'>
                {showGlobalButton.partnerAccount ? (
                  <Select
                  labelInValue
                  style={{ width: 200 }}
                  showSearch
                  placeholder="Select Account"
                  optionFilterProp="children"
                  onChange={onChangeAccount}
                  value={currentAccount}
                  options={optionAccount}
                  />
                ) : null}
              </div>
            </div>
          </Content>
          
          <div className='m-6 bg-white'>
            <div className='p-4'>
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