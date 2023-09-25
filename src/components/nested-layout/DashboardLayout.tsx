import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
  GoldOutlined
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
import { useBreadcrumb } from '../breadcrumb-context';
import styles from './index.module.scss';
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
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
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
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            {children}
          </div>
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;