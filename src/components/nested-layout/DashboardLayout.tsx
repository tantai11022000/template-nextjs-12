import {
  DesktopOutlined,
  FileOutlined,
  PieChartOutlined,
  TeamOutlined,
  UserOutlined,
} from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { useState } from 'react';
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
];

const DashboardLayout = (props: any) => {
  const { children } = props
  const [collapsed, setCollapsed] = useState(false);
  const [currentTab, setCurrentTab] = useState<string>("campaign_budgets")
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)} style={{backgroundColor: "#444"}}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" style={{backgroundColor: "#444"}}>
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
        <Content style={{ margin: '0 16px' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>
              <Link href="/">Home</Link>
            </Breadcrumb.Item>
            <Breadcrumb.Item>
              {items ? items.map((item: any) => {
                const isMatched = item.value == currentTab
                return isMatched && <Link href={item.url}>{item.label}</Link>
              }) : null}
            </Breadcrumb.Item>
          </Breadcrumb>
          <div style={{ padding: 24, minHeight: 360, background: colorBgContainer }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout;