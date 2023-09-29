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
import { useState } from 'react';
import { useBreadcrumb } from '../breadcrumb-context';
import styles from './index.module.scss';
import { useAppSelector } from '@/store/hook';
import { getGlobalAction } from '@/store/GlobalActions/slice';
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
  getItem('Execution Log', 'execution_log', '3', '/amazon/execution-log', <UserOutlined />),
  getItem('Accounts', 'accounts', '4', '/amazon/accounts', <TeamOutlined />),
  getItem('Weight Template', 'weight_template', '5', '/amazon/weight-template', <GoldOutlined />),
];

const DashboardLayout = (props: any) => {
  const { children } = props
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("campaign_budgets")
  const { breadcrumb, setBreadcrumb } = useBreadcrumb();
  const globalActions = useAppSelector(getGlobalAction)

  const {
    token: { colorBgContainer },
  } = theme.useToken();

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
        <Content className='mx-4'>
          <div className='flex justify-between my-4'>
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
              {
                globalActions && globalActions.length > 0 && globalActions.map((item:any) => (
                  <Select
                  style={{ width: 120 }}
                  showSearch
                  placeholder={item.placeholder}
                  optionFilterProp="children"
                  // onChange={onChange}
                  // onSearch={onSearchInFilter}
                  // filterOption={filterOption}
                  options={item.options}
                  />
                ))
              }
            </div>
          </div>
          <div className='p-6 h-screen bg' style={{background: colorBgContainer }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;