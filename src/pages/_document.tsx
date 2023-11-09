import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <link href="https://fonts.googleapis.com/css?family=M+PLUS+Rounded+1c:400,800&display=optional" rel="stylesheet"/>
        <link rel="icon" type="image/png" sizes="32x32" href="https://adtran-maplus-dev-storage.s3.amazonaws.com/company_logo/favicon-32x32.png"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
