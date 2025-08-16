import MahsoliPaymentsDashboardView from 'src/sections/payments_dashboard/view/payments-dashboard-view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'لوحة بيانات عمليات صرف المستحقات المالية',
};

export default function MahsoliPaymentsDashboardPage() {
  // const { user } = useAuthContext();
  // console.log(user);
  // const IsAdmin: boolean = user!.roles == 'admin' ? true : false;
  // if (IsAdmin) {
  //   return <AdminDashboardView />;
  // } else {
  //   return <FarmerdashboardView />;
  // }

  return <MahsoliPaymentsDashboardView />;
}
