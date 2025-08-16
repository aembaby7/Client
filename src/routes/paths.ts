import { paramCase } from 'src/utils/change-case';

const ROOTS = {
  AUTH: '/auth',
  Home: '/home',
  // LANDINGPAGE: '/landingpage', // Added a root path for the landing page
  // SERVICEDESCRIPTIONPAGE: '/servicedescription',
};

// ----------------------------------------------------------------------

export const paths = {
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  home: {
    root: ROOTS.Home,
    account: {
      basicInfo: `${ROOTS.Home}/account/basicinfo`,
    },
     mahsoli: {
      root: `${ROOTS.Home}/mahsoli`,
      gintake: `${ROOTS.Home}/mahsoli/gintake`,
      payments: `${ROOTS.Home}/mahsoli/payments`,
      locations: `${ROOTS.Home}/mahsoli/locations`,
    },
    m: {
      root: `${ROOTS.Home}/m`,
      achievements: `${ROOTS.Home}/m/achievements`,
      locations: `${ROOTS.Home}/m/locations`,
    },
    flourSales: {
      root: `${ROOTS.Home}/flour-sales`,
      year2024: `${ROOTS.Home}/flour-sales/year2024`,
      yearly: `${ROOTS.Home}/flour-sales/yearly`,
      allyears: `${ROOTS.Home}/flour-sales/allyears`,
      company: `${ROOTS.Home}/flour-sales/company`,
    },
    millsReports: {
      root: `${ROOTS.Home}/mills-reports`,
      monthly: `${ROOTS.Home}/mills-reports/monthly`,
      daily: `${ROOTS.Home}/mills-reports/daily`,
    },
    wheatSales: {
      root: `${ROOTS.Home}/wheat-sales`,
      monthly: `${ROOTS.Home}/wheat-sales/`,
    },
    barleyStocks: {
      root: `${ROOTS.Home}/barley-stocks`,
      currentYear: `${ROOTS.Home}/barley-stocks/yearly`,
    },
     others: {
      root: `${ROOTS.Home}/others`,
      download: `${ROOTS.Home}/down`,
      comingsoon: `${ROOTS.Home}/coming-soon`,
    },

    
    codeverfication: {
      root: `${ROOTS.Home}/codeverfication`,
    },
  },
};


