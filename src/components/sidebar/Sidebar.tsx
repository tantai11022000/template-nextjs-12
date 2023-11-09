import React, { useState } from 'react';
import Link from 'next/link';
import { Layout, Menu } from 'antd';
import { MenuProps } from 'antd';
import { useAppSelector } from '@/store/hook';
import { getCollapseMenu } from '@/store/globals/globalsSlice';
import { BREADCRUMB_ACCOUNT, BREADCRUMB_CAMPAIGN_BUDGET, BREADCRUMB_TARGETING_BIDDING, BREADCRUMB_WEIGHT_TEMPLATE } from '../../Constant/index';
import { DesktopOutlined, PieChartOutlined, TeamOutlined, GoldOutlined } from '@ant-design/icons';
import { storeItem } from '@/utils/StorageUtils';
import { CURRENT_MENU } from '@/utils/StorageKeys';

export interface ISideBarProps {
  menu: string,
  setMenu: any
}

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

const items: MenuItem[] = [
  getItems('Campaign Budgets', 'campaign-budgets', 'campaign-budgets', BREADCRUMB_CAMPAIGN_BUDGET.url , <PieChartOutlined />),
  getItems('Targeting Bidding', 'targeting-bidding', 'targeting-bidding', BREADCRUMB_TARGETING_BIDDING.url, <DesktopOutlined />),
  getItems('Accounts', 'accounts', 'accounts', BREADCRUMB_ACCOUNT.url, <TeamOutlined />),
  getItems('Weight Template', 'weight-template', 'weight-template', BREADCRUMB_WEIGHT_TEMPLATE.url, <GoldOutlined />),
];

export default function SideBar (props: ISideBarProps) {
  const {  Content, Sider, Footer } = Layout;
  const { menu, setMenu } = props
  const isCollapseMenu = useAppSelector(getCollapseMenu)

  const [collapsed, setCollapsed] = useState<boolean>(false);

  const handleClickMenu = (value: string) => {
    setMenu(value)
    storeItem(CURRENT_MENU, value)
  }

  const ActiveMenuLink = (props: any) => {
    const { children, href } = props
    return <Link href={href}>{children}</Link>
  };

  return (
    <div className='sidebar-container'>
      <Sider width={250} collapsed={isCollapseMenu ? collapsed : !collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" selectedKeys={[menu]} mode="inline">
          {items && items.map((item: any) => (
            <Menu.Item key={item.key} icon={item.icon} onClick={() => handleClickMenu(item.value)}>
              <ActiveMenuLink href={item.url}>
                {item.label}
              </ActiveMenuLink>
            </Menu.Item>
          ))}
        </Menu>
      </Sider>
    </div>
  );
}
