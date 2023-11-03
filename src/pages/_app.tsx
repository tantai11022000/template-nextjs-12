import Layout from '@/components/layout'
import '@/styles/globals.scss'
import '@/styles/custom-antd.scss'
import '@/styles/common.scss'
import type { AppProps } from 'next/app'
import { BreadcrumbProvider } from '@/components/breadcrumb-context';
import { Provider } from 'react-redux';
import store from '@/store'
import { useEffect } from 'react'
import { getAllPartnerAccounts } from '@/services/accounts-service'
import { setAccountList, setCurrentAccount } from '@/store/account/accountSlice'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App({ Component, pageProps }: any) {
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
       {renderWithLayout(<Component {...pageProps} />)}
      <ToastContainer />
    </Provider>
  )
}

export default App
