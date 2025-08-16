// ----------------------------------------------------------------------

import BarleyStocksDashboardView from 'src/sections/barley_dashboard/view/barley-dashboard-view';

export const metadata = {
  title: 'لوحة بيانات مخزونات الشعير',
};

export default function BarleyStocksDashboardPage() {
  // const { user } = useAuthContext();
  // console.log(user);
  // const IsAdmin: boolean = user!.roles == 'admin' ? true : false;
  // if (IsAdmin) {
  //   return <AdminDashboardView />;
  // } else {
  //   return <FarmerdashboardView />;
  // }

  return <BarleyStocksDashboardView />;
}
