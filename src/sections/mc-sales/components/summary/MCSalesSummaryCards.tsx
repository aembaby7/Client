import React from 'react';
import Grid from '@mui/material/Unstable_Grid2';
import { Box } from '@mui/material';
import ScaleTwoToneIcon from '@mui/icons-material/ScaleTwoTone';
import LocalShippingTwoToneIcon from '@mui/icons-material/LocalShippingTwoTone';
import ReceiptLongIcon from '@mui/icons-material/ReceiptLong';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import { SalesSummary } from 'src/types/mcSales';
import { MCSalesSummaryCard } from './MCSalesSummaryCard';
import { fTon, fCurrency, fNumber } from 'src/utils/format-number';

interface MCSalesSummaryCardsProps {
  summary: SalesSummary | null;
}

export const MCSalesSummaryCards: React.FC<MCSalesSummaryCardsProps> = ({ summary }) => {
  if (!summary) return null;

  return (
    <Grid container spacing={3} sx={{ mb: 4 }}>
      <Grid xs={12} md={4}>
        <MCSalesSummaryCard
          title="إجمالي المبيعات"
          value={fTon(summary.totalWeight || 0)}
          icon={<ScaleTwoToneIcon sx={{ color: '#6B7280', fontSize: 24 }} />}
          bottomIcon={
            <Box sx={{ width: 16, height: 16 }}>
              <LocalShippingTwoToneIcon sx={{ fontSize: 16, color: '#3B82F6' }} />
            </Box>
          }
          bottomText="اجمالي الكميات المباعة لكافة الأصناف"
        />
      </Grid>

      <Grid xs={12} md={4}>
        <MCSalesSummaryCard
          title="إجمالي السعر"
          value={fCurrency(summary.totalPrice)}
          icon={<AttachMoneyIcon sx={{ color: '#10B981', fontSize: 24 }} />}
          iconBgColor="#F0FDF4"
          bottomText="وفق شركات المطاحن"
          topBorder
          topBorderColor="linear-gradient(90deg, #10B981 0%, #34D399 100%)"
        />
      </Grid>

      <Grid xs={12} md={4}>
        <MCSalesSummaryCard
          title="إجمالي السجلات"
          value={fNumber(summary.totalRecords || 0)}
          icon={<ReceiptLongIcon sx={{ color: '#6B7280', fontSize: 24 }} />}
          bottomIcon={
            <Box
              sx={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                bgcolor: '#10B981',
                animation: 'pulse 2s infinite',
                '@keyframes pulse': {
                  '0%, 100%': { opacity: 1 },
                  '50%': { opacity: 0.5 },
                },
              }}
            />
          }
          bottomText="نشط"
        />
      </Grid>
    </Grid>
  );
};
