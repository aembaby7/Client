'use client';
import useSWR from 'swr';
import { fetcher, endpoints } from 'src/utils/axios';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';

import { useSettingsContext } from 'src/components/settings';
import { useAuthContext } from 'src/auth/hooks';

import Box from '@mui/material/Box';
import { alpha } from '@mui/material/styles';
import { useTranslate } from 'src/locales';

import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import WarehouseTwoToneIcon from '@mui/icons-material/WarehouseTwoTone';
import ScaleTwoToneIcon from '@mui/icons-material/ScaleTwoTone';
import MonetizationOnTwoToneIcon from '@mui/icons-material/MonetizationOnTwoTone';
import LocalAtmTwoToneIcon from '@mui/icons-material/LocalAtmTwoTone';
import PriceCheckTwoToneIcon from '@mui/icons-material/PriceCheckTwoTone';
import { json } from 'stream/consumers';
import { AdminDashboardView } from '../admin_dashboard/view';

const SPACING = 3;

export default function DashboardView() {
  const { user } = useAuthContext();

  let isAdmin: boolean = false;
  try {
    if (user != null) {
      isAdmin = user!.roles == 'admin';
    }
  } catch {}

  return isAdmin ? <AdminDashboardView /> : <AdminDashboardView />;
}
