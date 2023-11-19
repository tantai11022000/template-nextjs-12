'use client'
import { Breadcrumb, Dropdown, Layout, Menu, theme } from 'antd';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import Image from 'next/image';
// import styles from './index.module.scss'
import { BREADCRUMB_CAMPAIGN_BUDGET } from '../../Constant/index';
import { MenuOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/store/hook';
import { setCollapseMenu } from '../../store/globals/globalsSlice';
import { useState } from 'react';
import {
  PlusOutlined,
  BellFilled,
  UserOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { storeItem } from '@/utils/StorageUtils';
import { LANGUAGE_CODE, LANGUAGE_KEY } from '@/utils/StorageKeys';

const ActiveMenuLink = ({ children, href }: any) => {
    return (
      <Link
        href={href}
        className={`${children === "Amazon" ? 'active' : ''}`}
      >
        {children}
      </Link>
    );
  };

function HeaderApp() {
  const { t } = useTranslation()
  const dispatch = useAppDispatch()
  const router = useRouter()
  const [isCollapseMenu, setIsCollapseMenu] = useState<boolean>(true)

  const LANGUAGE = [
    { key: 'en', label: 'English' },
    { key: 'jp', label: 'Japanese' },
  ];
  const [languages, setLanguages] = useState<any[]>(LANGUAGE)

  const menuItems = [
    { label: t('header_bar.campaigns'), url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/campaigns` },
    { label: t('header_bar.users'), url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/users` },
    { label: t('header_bar.biz_management'), url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/masterboard/clients` },
    { label: t('header_bar.3rd_tracking_tools'), url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/3rd-tracking-tools` },
    { label: t('header_bar.amazon'), url: BREADCRUMB_CAMPAIGN_BUDGET.url },
  ];

  const handleCollapse = () => {
    if (isCollapseMenu) {
      setIsCollapseMenu(false)
      dispatch(setCollapseMenu({data: false}))
    } else {
      setIsCollapseMenu(true)
      dispatch(setCollapseMenu({data: true}))
    }
  }

  const menu = (
    <Menu onClick={({ key }) => changeLanguage(key)}>
      {languages.map((language: any) => (
        <Menu.Item key={language.key}>{language.label}</Menu.Item>
      ))}
    </Menu>
  );

  const changeLanguage = (newLanguage: any) => {
    const { pathname, query, asPath } = router;
    router.push({ pathname, query }, asPath, { locale: newLanguage });
    if (newLanguage == 'jp') {
      storeItem(LANGUAGE_CODE, 'ja_JP')
      storeItem(LANGUAGE_KEY, 'ja-JP')
    } else if (newLanguage == 'en') {
      storeItem(LANGUAGE_CODE, 'en')
      storeItem(LANGUAGE_KEY, 'en-US')
    }
    router.events.on('routeChangeComplete', () => {
        router.reload()
    });
  };

  return (
    <Layout>
      <header className='header-container'>
        <div className="flex items-center h-12">
          <div className='flex items-center w-[250px] min-w-[250px]'>
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
          <div className='nav-wrapper'>
            <nav className='header-nav'>
              <ul>
                {menuItems.map(({ url, label }, index) => (
                  <li key={index}>
                    <ActiveMenuLink href={url}>{label}</ActiveMenuLink>
                  </li>
                ))}
              </ul>
            </nav>
            <div className='header-icon'>
              <PlusOutlined />
              <BellFilled />
              <UserOutlined />
              <Dropdown overlay={menu}>
                <GlobalOutlined />
              </Dropdown>
            </div>
          </div>
        </div>
      </header>
    </Layout>
  )
}

export default HeaderApp
