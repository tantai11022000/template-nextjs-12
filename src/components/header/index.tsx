'use client'
import { Breadcrumb, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
import styles from './index.module.scss'
import { BREADCRUMB_CAMPAIGN_BUDGET } from '../breadcrumb-context/constant';
import { MenuOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/store/hook';
import { setCollapseMenu } from '../../store/globals/globalsSlice';
import { useState } from 'react';


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
  const dispatch = useAppDispatch()
  const [isCollapseMenu, setIsCollapseMenu] = useState<boolean>(true)

  const {
    token: { colorBgContainer },
  } = theme.useToken();

  const handleCollapse = () => {
    if (isCollapseMenu) {
      setIsCollapseMenu(false)
      dispatch(setCollapseMenu({data: false}))
    } else {
      setIsCollapseMenu(true)
      dispatch(setCollapseMenu({data: true}))
    }
  }

  return (
    <Layout>
      <header className={styles['header-container']}>
        <div className="flex items-center h-12">
          <div className='flex items-center w-[250px]'>
            <MenuOutlined className='text-white font-semibold p-2 m-2 cursor-pointer bg-[#ffffff1a]' onClick={handleCollapse} />
            <Link href="/campaign-budgets" className='flex justify-center'>
              <img
                width={130}
                height={40}
                src="https://adtran-oricom-demo.s3.amazonaws.com/company_logo/logo-w.png"
                alt="logo"
              />
            </Link>
          </div>
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
      </header>
    </Layout>
  )
}

export default HeaderApp
