import { useMemo } from 'react';

import { paths } from 'src/routes/paths';

import { useTranslate } from 'src/locales';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import SvgColor from 'src/components/svg-color';
import { useAuthContext } from 'src/auth/hooks';

// ----------------------------------------------------------------------

const icon = (name: string) => (
  <SvgColor src={`/assets/icons/navbar/${name}.svg`} sx={{ width: 1, height: 1 }} />
  // OR
  // <Iconify icon="fluent:mail-24-filled" />
  // https://icon-sets.iconify.design/solar/
  // https://www.streamlinehq.com/icons
);

const ICONS = {
  job: icon('ic_job'),
  blog: icon('ic_blog'),
  chat: icon('ic_chat'),
  mail: icon('ic_mail'),
  user: icon('ic_user'),
  file: icon('ic_file'),
  lock: icon('ic_lock'),
  tour: icon('ic_tour'),
  order: icon('ic_order'),
  label: icon('ic_label'),
  blank: icon('ic_blank'),
  kanban: icon('ic_kanban'),
  folder: icon('ic_folder'),
  banking: icon('ic_banking'),
  booking: icon('ic_booking'),
  invoice: icon('ic_invoice'),
  product: icon('ic_product'),
  calendar: icon('ic_calendar'),
  disabled: icon('ic_disabled'),
  external: icon('ic_external'),
  menuItem: icon('ic_menu_item'),
  ecommerce: icon('ic_ecommerce'),
  analytics: icon('ic_analytics'),
  dashboard: icon('ic_dashboard'),
};

// ----------------------------------------------------------------------

export function useNavData() {
  const { user } = useAuthContext();
  const { t } = useTranslate();

  let isMahsoli: boolean = false;
  let isFlour: boolean = false;
  let isBarley: boolean = false;
  let isTest: boolean = false;
  let isDGSupportDupity: boolean = false;

  try {
    if (user != null) {
      console.log('amr', user);
      if (user!.isDashSAdmin || user!.isDashAdmin || user!.isDashMahsoli) {
        isMahsoli = true;
      }
      if (user!.isDashSAdmin || user!.isDashAdmin || user!.isDashFSales || user!.isDashPFSales) {
        isFlour = true;
      }
      if (user!.isDashSAdmin || user!.isDashBarley) {
        isBarley = true;
      }
      if (user!.userName == '2247225465' || user!.userName == '1018625283') {
        isTest = true;
      }
      //1033914688
      if (user!.userName == '1033914688') {
        isDGSupportDupity = true;
      }
    }
  } catch {}
  let data: any;

  data = useMemo(
    () => [
      // {
      //   subheader: t('Home'),
      //   items: [{ title: t('Dashboard'), path: paths.home.root, icon: ICONS.dashboard }],
      // },
      isMahsoli && {
        subheader: t('محصولي'),
        items: [
          {
            title: t('عمليات الإستلام'),
            path: paths.home.mahsoli.gintake,
            icon: ICONS.analytics,
          },
          {
            title: t('صرف المستحقات'),
            path: paths.home.mahsoli.payments,
            icon: ICONS.dashboard,
          },
          {
            title: t('احداثيات الرخص'),
            path: paths.home.mahsoli.locations,
            icon: ICONS.dashboard,
          },
        ],
      },
      isDGSupportDupity && {
        subheader: t('محصولي'),
        items: [
          {
            title: t('صرف المستحقات'),
            path: paths.home.mahsoli.payments,
            icon: ICONS.dashboard,
          },
        ],
      },
      isFlour && {
        subheader: t('مطاحن'),
        items: [
          {
            title: t('مبيعات الدقيق'),
            path: paths.home.flourSales.yearly,
            icon: ICONS.analytics,
          },
          {
            title: t('مقارنة سنوية'),
            path: paths.home.flourSales.allyears,
            icon: ICONS.analytics,
          },
          {
            title: t('الأعمال المنجزة'),
            path: paths.home.m.achievements,
            icon: ICONS.analytics,
          },
          {
            title: t('مواقع عملاء الدقيق'),
            path: paths.home.m.locations,
            icon: ICONS.analytics,
          },
        ],
      },
      isFlour && {
        subheader: t('تقارير شركات المطاحن'),
        items: [
          {
            title: t('الشامل شهرياً'),
            path: paths.home.millsReports.monthly,
            icon: ICONS.analytics,
          },
          {
            title: t('مخزونات الدقيق اليومية'),
            path: paths.home.millsReports.daily,
            icon: ICONS.analytics,
          },
        ],
      },
      isFlour && {
        subheader: t('عمليات القمح'),
        items: [
          {
            title: t('المبيعات الشهرية'),
            path: paths.home.wheatSales.monthly,
            icon: ICONS.analytics,
          },
          {
            title: t('طلبات شراء القمح'),
            path: paths.home.others.comingsoon,
            icon: ICONS.analytics,
          },
        ],
      },

      isBarley && {
        subheader: t('الشعير'),
        items: [
          {
            title: t('مخزونات الشعير'),
            path: paths.home.barleyStocks.currentYear,
            icon: ICONS.analytics,
          },
        ],
      },
    ],
    [t]
  );

  return data;
}
