import Layout from '@/components/layout'
import '@/styles/globals.scss'
import '@/styles/custom-antd.scss'
import type { AppProps } from 'next/app'

export default function App({ Component, pageProps }: any) {
  const renderWithLayout =
    Component.getLayout ||
    function (page: any) {
      return <Layout>{page}</Layout>;
    };

  return renderWithLayout(<Component {...pageProps} />);
}
