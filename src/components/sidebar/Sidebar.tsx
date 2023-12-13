import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { Layout, Menu, Spin } from 'antd';
import { MenuProps } from 'antd';
import { useAppSelector } from '@/store/hook';
import { getCollapseMenu } from '@/store/globals/globalsSlice';
import { BREADCRUMB_ACCOUNT, BREADCRUMB_CAMPAIGN_BUDGET, BREADCRUMB_TARGETING_BIDDING, BREADCRUMB_WEIGHT_TEMPLATE } from '../../Constant/index';
import { DesktopOutlined, PieChartOutlined, TeamOutlined, GoldOutlined } from '@ant-design/icons';
import { storeItem } from '@/utils/StorageUtils';
import { CURRENT_MENU } from '@/utils/StorageKeys';
import { useTranslation } from 'next-i18next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

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

export default function SideBar (props: ISideBarProps) {
  const { t } = useTranslation()
  const { Sider } = Layout;
  const { menu, setMenu } = props
  const isCollapseMenu = useAppSelector(getCollapseMenu)
  const [collapsed, setCollapsed] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  const items: MenuItem[] = [
    getItems(t("sidebar.campaign_budgets"), 'campaign-budgets', 'campaign-budgets', BREADCRUMB_CAMPAIGN_BUDGET.url , <PieChartOutlined />),
    getItems(t('sidebar.target_bidding'), 'targeting-bidding', 'targeting-bidding', BREADCRUMB_TARGETING_BIDDING.url, <DesktopOutlined />),
    getItems(t('sidebar.accounts'), 'accounts', 'accounts', BREADCRUMB_ACCOUNT.url, <TeamOutlined />),
    getItems(t('sidebar.weight_template'), 'weight-template', 'weight-template', BREADCRUMB_WEIGHT_TEMPLATE.url, <GoldOutlined />),
  ];

  useEffect(() => {
    setLoading(false)
  }, [])
  

  useEffect(() => {
    const handleResize = () => {
      const screenWidth = window.innerWidth;
      setCollapsed(screenWidth < 840);
    };

    window.addEventListener('resize', handleResize);

    handleResize();
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

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
      {loading ? <Spin/> : (
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
      )}
    </div>
  );
}
