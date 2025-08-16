import axios, { AxiosRequestConfig } from 'axios';

import { HOST_API } from 'src/config-global';

// ----------------------------------------------------------------------

const axiosInstance = axios.create({ baseURL: HOST_API });

axiosInstance.interceptors.response.use(
  (res) => res,
  (error) => Promise.reject((error.response && error.response.data) || 'خطأ يتعلق بعملية الإتصال')
);

export default axiosInstance;

// ----------------------------------------------------------------------

export const fetcher = async (args: string | [string, AxiosRequestConfig]) => {
  const [url, config] = Array.isArray(args) ? args : [args];

  const res = await axiosInstance.get(url, { ...config });

  return res.data;
};

// ----------------------------------------------------------------------

export const endpoints = {
  chat: '/api/chat',
  kanban: '/api/kanban',
  calendar: '/api/Appointment/getApps',
  appointment: {
    getApps: '/api/Appointment/getApps',
    getFarmDeliveryDateList: '/api/Appointment/getFarmDeliveryDateList',
    bookAppointment: '/api/Appointment/bookNewAppointment',
    Cancel: '/api/Appointment/cancelAppointment',
  },
  dashboard: {
    getFarmDashboard: '/api/dashboard/getFarmDashboard',
    getFarmsDashboard: '/api/dashboard/getFarmsDashboard',
    getDashLanding: '/api/dashboard/getDashLanding',
    getAdminDashboard: '/api/dashboard/getAdminDashboard',
    getSalesDashboard: '/api/dashboard/getSalesDashboard',
    getFarmLocations: '/api/dashboard/getFarmLocations',
  },
  dashPayments: {
    getPaymentsDashboard: '/api/dashPayments/getPaymentsDashboard',
  },
  dashSales: {
    getMainDashboard: '/api/dashSales/getMainDashboard',
    getYearlyDashboard: '/api/dashSales/getYearlyDashboard',
  },
  dashStock: {
    getBarleyDashboard: '/api/dashStock/getBarleyDashboard',
  },
  dashMR: {
    getMRDashboard: '/api/dashMR/getMRDashboard',
    getMRDailyDashboard: '/api/dashMR/GetMRDailyDashboard',
  },
  dashWheatSales: {
    getDashboard: '/api/dashWheatSales/getDashboard',
  },
  dashM: {
    getMDashboard: '/api/dashM/getMDashboard',
    getCustomerLocations: '/api/dashM/getCustomerLocations',
  },
  auth: {
    me: '/api/authdash/me',
    login: '/api/authdash/login',
    loginAuth: '/api/authdash/loginAuth',
    NafathSendRequest: '/api/nafathDash/SendRequest',
    NafathCheckRequestStatus: '/api/nafathDash/CheckRequestStatus',
    setSelectedFarmCode: '/api/authdash/setSelectedFarmCode',
    //me: '/auth/me',
    //login: '/auth/login',
    register: '/api/auth/register',
  },
  document: {
    getFiles: '/api/Document/GetFiles',
    updateBasicInfo: '/api/Document/UpdateBasicInfo',
    updateClosureInfo: '/api/Document/UpdateClosureInfo',
  },
  transaction: {
    getFarmAccountClosure: '/api/transaction/getFarmAccountClosure',
  },
  contact: {
    getNotificationList: '/api/contact/getNotificationList',
    getContactUsList: '/api/contact/getContactUsList',
    updateIsUnRead: '/api/contact/updateIsUnRead',
  },
  farm: {
    find: '/api/Farm/find',
    findForm: '/api/Farm/FindForm',
    getFarms: '/api/Farm/GetFarms',
    getBranchList: '/api/Farm/GetBranchList',
    setDeliveryBranch: '/api/Farm/setDeliveryBranch',
    cancelDeliveryBranch: '/api/Farm/cancelDeliveryBranch',
    list: '/api/Farm/list',
    setFarmAccountClosure: '/api/Farm/setFarmAccountClosure',
  },
  farmer: {
    getFarmInfo: '/api/Farmer/GetFarmInfo',
    getClientInfo: '/api/Farmer/GetClientInfo',
    getBasicInfo: '/api/Farmer/GetBasicInfo',
    contact: '/api/Farmer/Contact',
    contactOut: '/api/Farmer/contactOut',
  },
  mail: {
    list: '/api/mail/list',
    details: '/api/mail/details',
    labels: '/api/mail/labels',
  },
  post: {
    list: '/api/post/list',
    details: '/api/post/details',
    latest: '/api/post/latest',
    search: '/api/post/search',
  },
  product: {
    list: '/api/product/list',
    details: '/api/product/details',
    search: '/api/product/search',
  },
};
