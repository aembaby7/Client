// src/app/home/mc-sales/page.tsx
import MCSalesGridView from 'src/sections/mc-sales/view/mc-sales-grid-view';

export const metadata = {
  title: 'بيانات المبيعات',
};

export default function MCSalesPage() {
  return <MCSalesGridView />;
}