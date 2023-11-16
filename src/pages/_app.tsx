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
import { useEffect } from 'react'
import { getAllPartnerAccounts } from '@/services/accounts-service'
import { setAccountList, setCurrentAccount } from '@/store/account/accountSlice'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { StyleProvider } from '@ant-design/cssinjs';
import { appWithTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { ConfigProvider } from 'antd';
import { getItem, storeItem } from '@/utils/StorageUtils'
import { LANGUAGE_CODE, LANGUAGE_KEY } from '@/utils/StorageKeys'
import { i18n } from '../../next-i18next.config'; // Adjust the path accordingly

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
  const renderWithLayout =
    Component.getLayout ||
    function (page: any) {
      return <Layout>{page}</Layout>;
    };

  // useEffect(() => {
  //   let storedLanguage = getItem(LANGUAGE_CODE);
  //   if (!storedLanguage || storedLanguage.trim() === '') {
  //     storedLanguage = 'en';
  //     storeItem(LANGUAGE_CODE, storedLanguage);
  //   }
    
  //   let storedAcceptLanguage = getItem(LANGUAGE_KEY);
  //   if (!storedAcceptLanguage || storedAcceptLanguage.trim() === '') {
  //     storedAcceptLanguage = 'en-US';
  //     storeItem(LANGUAGE_KEY, storedAcceptLanguage);
  //   }
  // }, []);
  const setDefaultLocale = () => {
    const userLanguage = window.localStorage.getItem('language') == 'ja_JP' ? 'jp' : 'en';
    console.log(">>> userLanguage", userLanguage)
    if (userLanguage && i18n.locales.includes(userLanguage)) {
      console.log(">>> i18n.locales.includes(userLanguage)", i18n.locales.includes(userLanguage))
      i18n.defaultLocale = userLanguage;
      console.log(">>>> i18n.defaultLocale", i18n.defaultLocale)
    }
  };
  
  // Call setDefaultLocale when the component mounts
  useEffect(() => {
    setDefaultLocale();
  }, []);

  useEffect(() => {
    getAllAccountList()
  }, [])
  
  const getAllAccountList = async () => {
    try {
      var params = {
        pageSize: 99999,
      }
      const result = await getAllPartnerAccounts(params)
      if (result && result.data) {
        store.dispatch(setAccountList({data: result.data}))
        store.dispatch(setCurrentAccount({data: result.data[0].id}))
      }
    } catch (error) {
      console.log(">>> Get All Partner Accounts Error", error)
    }
  }

  return (
    <Provider store={store} >
      <StyleProvider hashPriority="high">
        <ConfigProvider
          theme={{
            token: {
              fontFamily: '"M PLUS Rounded 1c", "Droid Sans", Tahoma, Arial, sans-serif',
            },
          }}>
            {renderWithLayout(<Component {...pageProps}/>)}
        </ConfigProvider>
       </StyleProvider>
      <ToastContainer />
    </Provider>
  )
}

export default appWithTranslation(App)
