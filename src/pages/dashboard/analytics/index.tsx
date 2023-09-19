import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';

const Analytics = () => {
  return <div className='text-black'>Analytics here...</div>;
};

Analytics.getLayout = (page: any) => (
  <RootLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </RootLayout>
);

export default Analytics;
