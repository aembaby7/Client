import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { styled } from '@mui/material/styles';

// --- STYLES ---
const StyledTableCell = styled(TableCell)(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  textAlign: 'center',
  padding: '8px',
  fontSize: '0.8rem',
  whiteSpace: 'nowrap',
}));

const BandedTableCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: theme.palette.grey[100],
}));

const HeaderTableCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: '#e6f2e6',
  fontWeight: 'bold',
  color: theme.palette.text.primary,
  verticalAlign: 'middle',
}));

const BandedHeaderTableCell = styled(HeaderTableCell)({
  backgroundColor: '#d9ead3',
});

const TotalTableCell = styled(StyledTableCell)(({ theme }) => ({
  backgroundColor: '#f0f2e6',
  fontWeight: 'bold',
}));

const BandedTotalTableCell = styled(TotalTableCell)({
  backgroundColor: '#e0e2d6',
});

// --- HELPER FUNCTIONS ---
const formatNumber = (num: number) =>
  new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(num);

// --- TYPE DEFINITIONS & PROPS ---
type ReportRow = {
  branch: string;
  openingBalance: {
    wheat: number;
    flour: { kg45Bags: number; bulk: number; householdBags: number };
  };
  flourSales: { kg45Bags: number; bulk: number; householdBags: number; total: number };
  wheatAndProd: { received: number; consumed: number; flour: number };
  closingBalance: {
    wheat: number;
    flour: { kg45Bags: number; bulk: number; householdBags: number };
  };
  wheatSufficiency: { avgConsumption: number; sufficiencyPerMonth: number };
  flourSufficiency: { avgConsumption: number; sufficiencyPerMonth: number };
};

interface MillsCompanyReportTableProps {
  data: {
    reportTitle: string;
    rows: ReportRow[];
  };
}

// --- COMPONENT ---
export default function MillsCompanyReportTable({ data }: MillsCompanyReportTableProps) {
  const { reportTitle, rows } = data;

  const calculateNestedTotal = (path: string) => {
    return rows.reduce((sum, row) => {
      const keys = path.split('.');
      let val: any = row;
      for (const key of keys) {
        if (val === undefined) return sum;
        val = val[key];
      }
      return sum + (typeof val === 'number' ? val : 0);
    }, 0);
  };

  const calculateSimpleTotal = (field: keyof ReportRow, subField: string) => {
    return rows.reduce((sum, row) => {
      const val = (row[field] as any)[subField];
      return sum + (typeof val === 'number' ? val : 0);
    }, 0);
  };

  const openingTotalWheat = calculateNestedTotal('openingBalance.wheat');
  const openingTotalFlour45kg = calculateNestedTotal('openingBalance.flour.kg45Bags');
  const openingTotalFlourBulk = calculateNestedTotal('openingBalance.flour.bulk');
  const openingTotalFlourHousehold = calculateNestedTotal('openingBalance.flour.householdBags');
  const openingTotalFlourGrand =
    openingTotalFlour45kg + openingTotalFlourBulk + openingTotalFlourHousehold;

  const salesTotal45kg = calculateSimpleTotal('flourSales', 'kg45Bags');
  const salesTotalBulk = calculateSimpleTotal('flourSales', 'bulk');
  const salesTotalHousehold = calculateSimpleTotal('flourSales', 'householdBags');
  const salesTotal = calculateSimpleTotal('flourSales', 'total');
  const salesGrandTotal_ = salesTotal45kg + salesTotalBulk + salesTotalHousehold;
  const salesGrandTotal = salesTotal;

  const wheatAndProdTotalReceived = calculateSimpleTotal('wheatAndProd', 'received');
  const wheatAndProdTotalConsumed = calculateSimpleTotal('wheatAndProd', 'consumed');
  const wheatAndProdTotalFlour = calculateSimpleTotal('wheatAndProd', 'flour');

  const closingTotalWheat = calculateNestedTotal('closingBalance.wheat');
  const closingTotalFlour45kg = calculateNestedTotal('closingBalance.flour.kg45Bags');
  const closingTotalFlourBulk = calculateNestedTotal('closingBalance.flour.bulk');
  const closingTotalFlourHousehold = calculateNestedTotal('closingBalance.flour.householdBags');
  const closingTotalFlourGrand =
    closingTotalFlour45kg + closingTotalFlourBulk + closingTotalFlourHousehold;

  const sufficiencyWheatAvg = calculateSimpleTotal('wheatSufficiency', 'avgConsumption');
  const sufficiencyFlourAvg = calculateSimpleTotal('flourSufficiency', 'avgConsumption');

  return (
    <Box sx={{ my: 3 }}>
      <Typography variant="h6" gutterBottom align="center" sx={{ mb: 2 }}>
        {reportTitle}
      </Typography>
      <TableContainer component={Paper} sx={{ border: '1px solid rgba(224, 224, 224, 1)' }}>
        <Table sx={{ minWidth: 650, borderCollapse: 'initial' }} size="small">
          <TableHead>
            {/* ROW 1 */}
            <TableRow>
              <HeaderTableCell
                rowSpan={3}
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: (theme) => theme.zIndex.appBar,
                  backgroundColor: '#e6f2e6',
                  borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                الفرع
              </HeaderTableCell>
              <HeaderTableCell colSpan={5}>الأرصدة بداية الشهر</HeaderTableCell>
              <BandedHeaderTableCell colSpan={4}>مبيعات الدقيق</BandedHeaderTableCell>
              <HeaderTableCell colSpan={3}>القمح المستلم والإنتاج خلال الشهر</HeaderTableCell>
              <BandedHeaderTableCell colSpan={5}>الأرصدة نهاية الشهر</BandedHeaderTableCell>
            </TableRow>
            {/* ROW 2 */}
            <TableRow>
              <HeaderTableCell rowSpan={2}>القمح</HeaderTableCell>
              <HeaderTableCell colSpan={4}>الدقيق</HeaderTableCell>
              <BandedHeaderTableCell rowSpan={2}>كـ 45 كجم</BandedHeaderTableCell>
              <BandedHeaderTableCell rowSpan={2}>السائب</BandedHeaderTableCell>
              <BandedHeaderTableCell rowSpan={2}>العبوات المنزلية</BandedHeaderTableCell>
              <BandedHeaderTableCell rowSpan={2}>الإجمالي</BandedHeaderTableCell>
              <HeaderTableCell colSpan={2}>القمح</HeaderTableCell>
              <HeaderTableCell rowSpan={2}>الدقيق المنتج</HeaderTableCell>
              <BandedHeaderTableCell rowSpan={2}>القمح</BandedHeaderTableCell>
              <BandedHeaderTableCell colSpan={4}>الدقيق</BandedHeaderTableCell>
            </TableRow>
            {/* ROW 3 */}
            <TableRow>
              <HeaderTableCell>45 كجم</HeaderTableCell>
              <HeaderTableCell>سائب</HeaderTableCell>
              <HeaderTableCell>عبوات منزلية</HeaderTableCell>
              <HeaderTableCell>الإجمالي</HeaderTableCell>
              <HeaderTableCell>المستلم</HeaderTableCell>
              <HeaderTableCell>المستهلك</HeaderTableCell>
              <BandedHeaderTableCell>45 كجم</BandedHeaderTableCell>
              <BandedHeaderTableCell>سائب</BandedHeaderTableCell>
              <BandedHeaderTableCell>عبوات منزلية</BandedHeaderTableCell>
              <BandedHeaderTableCell>الإجمالي</BandedHeaderTableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const openingFlourTotal =
                row.openingBalance.flour.kg45Bags +
                row.openingBalance.flour.bulk +
                row.openingBalance.flour.householdBags;
              const salesTotal = row.flourSales.total;
              const closingFlourTotal =
                row.closingBalance.flour.kg45Bags +
                row.closingBalance.flour.bulk +
                row.closingBalance.flour.householdBags;

              return (
                <TableRow key={row.branch}>
                  <StyledTableCell
                    component="th"
                    scope="row"
                    sx={{
                      position: 'sticky',
                      left: 0,
                      zIndex: 1,
                      backgroundColor: 'background.paper',
                      borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {row.branch}
                  </StyledTableCell>
                  <StyledTableCell>{formatNumber(row.openingBalance.wheat)}</StyledTableCell>
                  <StyledTableCell>
                    {formatNumber(row.openingBalance.flour.kg45Bags)}
                  </StyledTableCell>
                  <StyledTableCell>{formatNumber(row.openingBalance.flour.bulk)}</StyledTableCell>
                  <StyledTableCell>
                    {formatNumber(row.openingBalance.flour.householdBags)}
                  </StyledTableCell>
                  <StyledTableCell>{formatNumber(openingFlourTotal)}</StyledTableCell>
                  <BandedTableCell>{formatNumber(row.flourSales.kg45Bags)}</BandedTableCell>
                  <BandedTableCell>{formatNumber(row.flourSales.bulk)}</BandedTableCell>
                  <BandedTableCell>{formatNumber(row.flourSales.householdBags)}</BandedTableCell>
                  <BandedTableCell>{formatNumber(salesTotal)}</BandedTableCell>
                  <StyledTableCell>{formatNumber(row.wheatAndProd.received)}</StyledTableCell>
                  <StyledTableCell>{formatNumber(row.wheatAndProd.consumed)}</StyledTableCell>
                  <StyledTableCell>{formatNumber(row.wheatAndProd.flour)}</StyledTableCell>
                  <BandedTableCell>{formatNumber(row.closingBalance.wheat)}</BandedTableCell>
                  <BandedTableCell>
                    {formatNumber(row.closingBalance.flour.kg45Bags)}
                  </BandedTableCell>
                  <BandedTableCell>{formatNumber(row.closingBalance.flour.bulk)}</BandedTableCell>
                  <BandedTableCell>
                    {formatNumber(row.closingBalance.flour.householdBags)}
                  </BandedTableCell>
                  <BandedTableCell>{formatNumber(closingFlourTotal)}</BandedTableCell>
                </TableRow>
              );
            })}
            {/* Total Row */}
            <TableRow>
              <TotalTableCell
                sx={{
                  position: 'sticky',
                  left: 0,
                  zIndex: 1,
                  backgroundColor: '#f0f2e6',
                  borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                الإجمالي
              </TotalTableCell>
              <TotalTableCell>{formatNumber(openingTotalWheat)}</TotalTableCell>
              <TotalTableCell>{formatNumber(openingTotalFlour45kg)}</TotalTableCell>
              <TotalTableCell>{formatNumber(openingTotalFlourBulk)}</TotalTableCell>
              <TotalTableCell>{formatNumber(openingTotalFlourHousehold)}</TotalTableCell>
              <TotalTableCell>{formatNumber(openingTotalFlourGrand)}</TotalTableCell>
              <BandedTotalTableCell>{formatNumber(salesTotal45kg)}</BandedTotalTableCell>
              <BandedTotalTableCell>{formatNumber(salesTotalBulk)}</BandedTotalTableCell>
              <BandedTotalTableCell>{formatNumber(salesTotalHousehold)}</BandedTotalTableCell>
              <BandedTotalTableCell>{formatNumber(salesGrandTotal)}</BandedTotalTableCell>
              <TotalTableCell>{formatNumber(wheatAndProdTotalReceived)}</TotalTableCell>
              <TotalTableCell>{formatNumber(wheatAndProdTotalConsumed)}</TotalTableCell>
              <TotalTableCell>{formatNumber(wheatAndProdTotalFlour)}</TotalTableCell>
              <BandedTotalTableCell>{formatNumber(closingTotalWheat)}</BandedTotalTableCell>
              <BandedTotalTableCell>{formatNumber(closingTotalFlour45kg)}</BandedTotalTableCell>
              <BandedTotalTableCell>{formatNumber(closingTotalFlourBulk)}</BandedTotalTableCell>
              <BandedTotalTableCell>
                {formatNumber(closingTotalFlourHousehold)}
              </BandedTotalTableCell>
              <BandedTotalTableCell>{formatNumber(closingTotalFlourGrand)}</BandedTotalTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
