'use client'
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './index.module.scss'
import { BREADCRUMB_CAMPAIGN_BUDGET } from '../breadcrumb-context/constant';

const { Header, Content, Footer } = Layout;

const menuItems = [
    { label: `Campaigns`, url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/campaigns` },
    { label: `Users`, url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/users` },
    { label: `Biz Management`, url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/masterboard/clients` },
    { label: `3rd Tracking Tools`, url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/3rd-tracking-tools` },
    { label: `Amazon`, url: BREADCRUMB_CAMPAIGN_BUDGET.url },
];

const ActiveMenuLink = ({ children, href }: any) => {
    return (
      <Link
        href={href}
        className={`${children === "Amazon" ? styles.active : ''}`}
      >
        {children}
      </Link>
    );
  };

function HeaderApp() {
  const {
    token: { colorBgContainer },
  } = theme.useToken();

  return (
    <Layout>
      <header className="flex flex-col gap-5 bg-[#444]">
      <div className="flex items-center h-12">
        <Link href="/" className='w-64 flex justify-center'>
          <img
            width={130}
            height={40}
            src="https://adtran-oricom-demo.s3.amazonaws.com/company_logo/logo-w.png"
            alt="logo"
          />
        </Link>
        <nav className={styles['header-nav']}>
          <ul>
            {menuItems.map(({ url, label }, index) => (
              <li key={index}>
                <ActiveMenuLink href={url}>{label}</ActiveMenuLink>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {/* <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="block w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-gray-500"
        placeholder="Search..."
      /> */}
    </header>
      {/* <Content className="site-layout" style={{ padding: '0 50px' }}>
        <Breadcrumb style={{ margin: '16px 0' }}>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>List</Breadcrumb.Item>
          <Breadcrumb.Item>App</Breadcrumb.Item>
        </Breadcrumb>
        <div style={{ padding: 24, minHeight: 380, background: colorBgContainer }}>Content</div>
      </Content>
      <Footer style={{ textAlign: 'center' }}>Ant Design ©2023 Created by Ant UED</Footer> */}
    </Layout>
  )
}

export default HeaderApp
