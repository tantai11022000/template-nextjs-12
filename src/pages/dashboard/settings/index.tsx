import RootLayout from '../../../components/layout';
import DashboardLayout from '../../../components/nested-layout/DashboardLayout';

const Settings = () => {
  return <div>My settings screen</div>;
};
export default Settings;

Settings.getLayout = (page: any) => (
  <RootLayout>
    <DashboardLayout>{page}</DashboardLayout>
  </RootLayout>
);

