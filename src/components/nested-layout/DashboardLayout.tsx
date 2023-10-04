import React from 'react';

import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  GoldOutlined
} from '@ant-design/icons';
import { MenuProps, Select } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { useEffect, useState } from 'react';
// import { useBreadcrumb } from '../breadcrumb-context';
import styles from './index.module.scss';
import { useAppSelector } from '@/store/hook';
import { getGlobalAction } from '@/store/GlobalActions/slice';
import { useRouter } from 'next/router';
const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
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
  getItem('Campaign Budgets', 'campaign_budgets', '1', '/amazon/campaign-budgets', <PieChartOutlined />),
  getItem('Targeting Bidding', 'targeting_bidding', '2', '/amazon/targeting-bidding', <DesktopOutlined />),
  getItem('Accounts', 'accounts', '3', '/amazon/accounts', <TeamOutlined />),
  getItem('Weight Template', 'weight_template', '4', '/amazon/weight-template', <GoldOutlined />),
];

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

const DashboardLayout = (props: any) => {
  const { children, breadcrumb } = props
  const router = useRouter()
  const [partnerAccounts, setPartnerAccounts] = useState<any[]>(PARTNER_ACCOUNT)
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("campaign_budgets")
  const globalActions = useAppSelector(getGlobalAction)
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
  
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const onChangeAccount = (account: any) => {
    console.log(">>> account", account)
  }

  return (
    <Layout>
      <Sider width={250} collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} className='sidebar-container'>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" style={{backgroundColor: "#444"}} className='title-xl'>
          {items && items.map((item: any) => (
            <Menu.Item key={item.key} icon={item.icon} onClick={() => setCurrentTab(item.value)}>
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
                  style={{ width: 150 }}
                  showSearch
                  placeholder="Select Account"
                  optionFilterProp="children"
                  onChange={onChangeAccount}
                  // onSearch={onSearchInFilter}
                  // filterOption={filterOption}
                  options={partnerAccounts}
                  />
                ) : null}
                
              </div>
            </div>
          </Content>
          <div className='p-6'>
            {React.Children.map(children, (child) => {
              return React.cloneElement(child, { partnerAccounts, onPartnerAccountsChange: onChangeAccount });
            })}
          </div>
        </div>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;