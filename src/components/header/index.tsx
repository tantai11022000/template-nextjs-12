'use client'
import { Breadcrumb, Dropdown, Layout, Menu, theme } from 'antd';
import Link from 'next/link';

// import styles from './index.module.scss'
import { BREADCRUMB_CAMPAIGN_BUDGET } from '../../Constant/index';
import { MenuOutlined } from '@ant-design/icons';
import { useAppDispatch } from '@/store/hook';
import { setCollapseMenu } from '../../store/globals/globalsSlice';
import { useEffect, useState } from 'react';
import {
  PlusOutlined,
  BellFilled,
  UserOutlined,
  GlobalOutlined
} from '@ant-design/icons';
import { useRouter } from 'next/router';
import { useTranslation } from 'next-i18next';
import { removeAccessToken, storeItem } from '@/utils/StorageUtils';
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
  const [languages, setLanguages] = useState<any[]>([])
  const [create, setCreate] = useState<any[]>([])
  const [profiles, setProfiles] = useState<any[]>([])

  useEffect(() => {
    setLanguages([
      { key: 'en', label: t('header_bar.languages.english') },
      { key: 'jp', label: t('header_bar.languages.japanese') },
    ])
    setCreate([
      { key: 1, label: t('header_bar.create.new_campaign'), url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/campaigns/add` },
      { key: 2, label: t('header_bar.create.new_client'), url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/clients/add` },
      { key: 3, label: t('header_bar.create.new_user'), url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/users/login` },
    ])
    setProfiles([
      { key: 1, label: t('header_bar.profiles.administration'), url: `${process.env.NEXT_PUBLIC_MAIN_URL}/admin` },
      { key: 2, label: t('header_bar.profiles.account_settings'), url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/user/account` },
      { key: 3, label: t('header_bar.profiles.sign_out'), url: `${process.env.NEXT_PUBLIC_MAIN_URL}#/users/login` },
    ])
  }, [t])
  
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

  const languagesDropdown = (
    <Menu onClick={({ key }) => changeLanguage(key)}>
      {languages.map((language: any) => (
        <Menu.Item key={language.key}>{language.label}</Menu.Item>
      ))}
    </Menu>
  );

  const createDropdown = (
    <Menu>
      {create.map((item: any) => (
        <Menu.Item key={item.key} onClick={() => router.push(item.url)}>{item.label}</Menu.Item>
      ))}
    </Menu>
  );

  const profileDropdown = (
    <Menu>
      {profiles.map((item: any) => (
        <>
          {item.key == 3 ? <Menu.Item key={item.key} onClick={() => onSignOut(item.url)}>{item.label}</Menu.Item>
          : <Menu.Item key={item.key} onClick={() => router.push(item.url)}>{item.label}</Menu.Item>}
        </>
      ))}
    </Menu>
  );

  const onSignOut = (url: string) => {
    removeAccessToken()
    router.push(url)
  }

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
  };

  return (
    <Layout>
      <header className='header-container'>
        <div className="flex items-center h-12">
          <div className='flex items-center w-[250px] min-w-[250px]'>
            <MenuOutlined className='text-white font-semibold p-2 m-2 cursor-pointer bg-[#ffffff1a]' onClick={handleCollapse} />
            <Link href={`${process.env.NEXT_PUBLIC_MAIN_URL}#/campaigns`} className='flex justify-center'>
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
              <Dropdown overlay={createDropdown} placement="bottomRight" arrow>
                <PlusOutlined />
              </Dropdown>
              <BellFilled />
              <Dropdown overlay={profileDropdown} placement="bottomRight" arrow>
                <UserOutlined />
              </Dropdown>
              <Dropdown overlay={languagesDropdown} placement="bottomRight" arrow>
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
