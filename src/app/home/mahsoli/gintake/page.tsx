// ----------------------------------------------------------------------

import { MahsoliGIntakeDashboardView } from 'src/sections/mahsoli_dashboard/view';

export const metadata = {
  title: 'لوحة بيانات عمليات الإستلام',
};

export default function MahsoliGIntakeDashboardPage() {
  // const { user } = useAuthContext();
  // console.log(user);
  // const IsAdmin: boolean = user!.roles == 'admin' ? true : false;
  // if (IsAdmin) {
  //   return <AdminDashboardView />;
  // } else {
  //   return <FarmerdashboardView />;
  // }

  return <MahsoliGIntakeDashboardView />;
}
