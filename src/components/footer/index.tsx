'use client';

import { LaptopOutlined, NotificationOutlined, UserOutlined } from '@ant-design/icons';
import type { MenuProps } from 'antd';
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import React from 'react';

const { Header, Content, Footer, Sider } = Layout;

const items1: MenuProps['items'] = ['1', '2', '3'].map((key) => ({
  key,
  label: `nav ${key}`,
}));

const items2: MenuProps['items'] = [UserOutlined, LaptopOutlined, NotificationOutlined].map(
  (icon, index) => {
    const key = String(index + 1);

    return {
      key: `sub${key}`,
      icon: React.createElement(icon),
      label: `subnav ${key}`,

      children: new Array(4).fill(null).map((_, j) => {
        const subKey = index * 4 + j + 1;
        return {
          key: subKey,
          label: `option${subKey}`,
        };
      }),
    };
  },
);

const App: React.FC = () => {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer>
    </Layout>
  );
};

export default App;
