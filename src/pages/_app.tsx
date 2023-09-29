import Layout from '@/components/layout'
import '@/styles/globals.scss'
import '@/styles/custom-antd.scss'
import '@/styles/common.scss'
import type { AppProps } from 'next/app'
import { BreadcrumbProvider } from '@/components/breadcrumb-context';
import { Provider } from 'react-redux';
import store from '@/store'


export default function App({ Component, pageProps }: any) {
  const renderWithLayout =
    Component.getLayout ||
    function (page: any) {
      return <Layout>{page}</Layout>;
    };

  return (
    <Provider store={store} >
      <BreadcrumbProvider>
          {renderWithLayout(<Component {...pageProps} />)}
      </BreadcrumbProvider>
    </Provider>
  )
  
}
