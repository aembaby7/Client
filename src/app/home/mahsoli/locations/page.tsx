import MahsoliLocationsMainView from 'src/sections/mahsoli/locations/view/main-view';
import MahsoliPaymentsDashboardView from 'src/sections/payments_dashboard/view/payments-dashboard-view';
// ----------------------------------------------------------------------

export const metadata = {
  title: 'احداثيات الرخص الزراعية وفق خرائط قوقل',
};

export default function MahsoliLocationsPage() {
  return <MahsoliLocationsMainView />;
}
