import DashboardView from 'src/sections/dashboard/view';
import SalesYDashboardView from 'src/sections/sales_y_dashboard/view/sales-dashboard-view';
import BarleyStocksDashboardPage from './barley-stocks/yearly/page';
import { useAuthContext } from 'src/auth/hooks';

import SalesYDashboardPartialView from 'src/sections/sales_y_dashboard/view/sales-dashboard-partial-view';
import { Alert, Typography } from '@mui/material';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'لوحة البيانات الرئيسية',
};

export default function DashboardPage() {
  // const { user } = useAuthContext();
  // let isDashAdmin: boolean = user!.isDashAdmin;
  // if (!isDashAdmin) {
  //   return <SalesYDashboardView />;
  // } else {
  //   return <SalesYDashboardPartialView />;
  // }
  //<SalesYDashboardView />
  return <></>;
}
