
import { useParams, usePathname } from 'next/navigation';
import { useRouter } from 'next/router';
import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next'
 
type Repo = {
  name: string
  stargazers_count: number
}
 
export const getServerSideProps = (async (context) => {
  const res = await fetch('https://api.github.com/repos/vercel/next.js')
  const repo = await res.json()
  return { props: { repo } }
}) satisfies GetServerSideProps<{
  repo: Repo
}>

const page = (props: any) => {
  return <div>Page</div>;
};

page.getLayout = (page: any) => (
  <RootLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </RootLayout>
);

export default page;
