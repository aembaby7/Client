import DashboardView from 'src/sections/dashboard/view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'لوحة البيانات الرئيسية',
};

export default function flourMonthlyMain() {
  // const { user } = useAuthContext();
  // console.log(user);
  // const IsAdmin: boolean = user!.roles == 'admin' ? true : false;
  // if (IsAdmin) {
  //   return <AdminDashboardView />;
  // } else {
  //   return <FarmerdashboardView />;
  // }

  return <DashboardView />;
}
