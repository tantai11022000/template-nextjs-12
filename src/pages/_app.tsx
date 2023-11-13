import Layout from '@/components/layout'
import '@/styles/globals.scss'
import '@/styles/custom-antd.scss'
import '@/styles/common.scss'
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
import { useRouter } from 'next/router'

function App({ Component, pageProps }: any) {
  const { locale } = useRouter();
  const renderWithLayout =
    Component.getLayout ||
    function (page: any) {
      return <Layout>{page}</Layout>;
    };

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
        store.dispatch(setCurrentAccount({data: result.data[3].id}))
      }
    } catch (error) {
      console.log(">>> Get All Partner Accounts Error", error)
    }
  }

  return (
    <Provider store={store} >
      <StyleProvider hashPriority="high">
        {renderWithLayout(<Component {...pageProps} dir={locale === "en" ? "ltr" : "rtl"}/>)}
       </StyleProvider>
      <ToastContainer />
    </Provider>
  )
}

export default appWithTranslation(App)
