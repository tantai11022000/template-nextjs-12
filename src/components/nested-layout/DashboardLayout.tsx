import React, { useLayoutEffect } from 'react';

import {
  DesktopOutlined,
  PieChartOutlined,
  TeamOutlined,
  GoldOutlined
} from '@ant-design/icons';
import { MenuProps, Select } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import styles from './index.module.scss';
import { useAppDispatch, useAppSelector } from '@/store/hook';
import { useRouter } from 'next/router';
import { getAccountList, getCurrentAccount, setCurrentAccount } from '@/store/account/accountSlice';
import { getItem, storeItem } from '@/utils/StorageUtils';
import { CURRENT_MENU } from '@/utils/StorageKeys';
const {  Content, Sider } = Layout;

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
    <Link href={href}>{children}</Link>
  )
};

const items: MenuItem[] = [
  getItems('Campaign Budgets', 'campaign_budgets', 'campaign_budgets', '/amazon/campaign-budgets', <PieChartOutlined />),
  getItems('Targeting Bidding', 'targeting_bidding', 'targeting_bidding', '/amazon/targeting-bidding', <DesktopOutlined />),
  getItems('Accounts', 'accounts', 'accounts', '/amazon/accounts', <TeamOutlined />),
  getItems('Weight Template', 'weight_template', 'weight_template', '/amazon/weight-template', <GoldOutlined />),
];

const DashboardLayout = (props: any) => {
  const { children, breadcrumb } = props
  const router = useRouter()

  const dispatch = useAppDispatch()
  const accountList = useAppSelector(getAccountList);
  const currentAccount = useAppSelector(getCurrentAccount);
  const [optionAccount, setOptionAccount] = useState<any[]>([])
  const [collapsed, setCollapsed] = useState(false);
  const [menu, setMenu] = useState<string>("campaign_budgets")
  const [showGlobalButton, setShowGlobalButton] = useState<any>({
    partnerAccount: false
  })
  useEffect(() => {
    if (router.pathname.includes("campaign-budgets")) {
      setShowGlobalButton({...showGlobalButton, partnerAccount: true})
    } else {
      setShowGlobalButton("")
    }
  }, [router.pathname])

  useEffect(() => {
    const option = accountList.map((account:any) => ({
      value: account.id,
      label: account.name
    }))
    setOptionAccount(option)
  }, [accountList])

  useEffect(() => {
    const currentMenu: any = getItem(CURRENT_MENU)
    if (currentMenu) setMenu(currentMenu);
  }, []);
  
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
    <Layout>
      <Sider width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} className='sidebar-container'>
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
        <div className='min-h-screen bg' style={{background: colorBgContainer }}>
          <Content className=''>
            <div className='flex justify-between p-4' style={{background: "#f5f5f5"}}>
              <Breadcrumb>
                <Breadcrumb.Item>
                  <Link href="/">Home</Link>
                </Breadcrumb.Item>
                  {breadcrumb ? breadcrumb.map((item:any, index: number) => (
                      <Breadcrumb.Item key={index}>
                        {item.url 
                          ?  <Link href={item.url}><span className={breadcrumb.length - 1 === index ? styles.active : ""}>{item.label}</span></Link> 
                          :  <span className={breadcrumb.length - 1 === index ? styles.active : ""}>{item.label}</span>
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
          <div className='p-6'>
            {React.Children.map(children, (child) => {
              return React.cloneElement(child, { accountList, onPartnerAccountsChange: onChangeAccount });
            })}
          </div>
        </div>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;