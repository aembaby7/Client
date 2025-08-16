import { NotFoundView } from 'src/sections/error';

// ----------------------------------------------------------------------

export const metadata = {
  title: '404 الصفحة المطلوبة غير موجودة!',
};

export default function NotFoundPage() {
  return <NotFoundView />;
}
