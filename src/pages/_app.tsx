import Layout from '@/components/layout'
import '@/styles/globals.scss'
import '@/styles/custom-antd.scss'
import '@/styles/common.scss'
import '../components/header/index.scss'
import '../components/table/index.scss'
import '../components/nested-layout/index.scss'
import '../components/sidebar/index.scss'
import '../components/breadcrumbs/index.scss'
import '../components/commons/index.scss'
import type { AppProps } from 'next/app'
import { Provider } from 'react-redux';
import store from '@/store'
import { useEffect, useState } from 'react'
import { getAllPartnerAccounts } from '@/services/accounts-service'
import { setAccountList, setCurrentAccount } from '@/store/account/accountSlice'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StyleProvider } from '@ant-design/cssinjs';
import { appWithTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ConfigProvider, Spin } from 'antd';
import { getItem, storeItem } from '@/utils/StorageUtils'
import { CURRENT_ACCOUNT, LANGUAGE_CODE, LANGUAGE_KEY } from '@/utils/StorageKeys'
import { i18n } from '../../next-i18next.config'; // Adjust the path accordingly
import { useRouter } from 'next/router'
import jaJP from 'antd/locale/ja_JP';
import enUS from 'antd/locale/en_US';

export async function getStaticProps(context: any) {
  const { locale } = context
  return {
    props: {
      ...(await serverSideTranslations(locale, ['common'])),
      locale: 'en'
    },
  }
}

function App({ Component, pageProps }: any) {
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(true)
  const currentAccount = getItem(CURRENT_ACCOUNT)
  const language = typeof window !== 'undefined' && window.localStorage.getItem('language') == 'ja_JP' ? jaJP : enUS;
  const renderWithLayout =
    Component.getLayout ||
    function (page: any) {
      return <Layout>{page}</Layout>;
    };
  
  const setDefaultLocale = () => {
    const userLanguage = window.localStorage.getItem('language') == 'ja_JP' ? 'jp' : 'en';
    const { pathname, query, asPath } = router;
    if (userLanguage && i18n.locales.includes(userLanguage)) {
      i18n.defaultLocale = userLanguage;
    router.push({ pathname, query }, asPath, { locale: userLanguage });
    }
  };

  useEffect(() => {
    getAllAccountList()
    setDefaultLocale();
  }, [])

  useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 1000);
  }, [])
  
  
  const getAllAccountList = async () => {
    try {
      var params = {
        pageSize: 99999,
      }
      const result = await getAllPartnerAccounts(params)
      if (result && result.data) {
        const activeAccounts = result.data.filter((account: any) => account.status == 1)
        store.dispatch(setAccountList({data: activeAccounts}))
        store.dispatch(setCurrentAccount({data: currentAccount ? currentAccount : activeAccounts[0].id}))
        storeItem(CURRENT_ACCOUNT, currentAccount ? currentAccount : activeAccounts[0].id)
      }
    } catch (error) {
      console.log(">>> Get All Partner Accounts Error", error)
    }
  }

  return (
    <Provider store={store} >
      <StyleProvider hashPriority="high">
        <ConfigProvider locale={language}
          theme={{
            token: {
              fontFamily: '"M PLUS Rounded 1c", "Droid Sans", Tahoma, Arial, sans-serif',
            },
          }}>
            {loading ? <Spin/> : <>{renderWithLayout(<Component {...pageProps} key={router.asPath}/>)}</>}
        </ConfigProvider>
       </StyleProvider>
      <ToastContainer />
    </Provider>
  )
}

export default appWithTranslation(App)
