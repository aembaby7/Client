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
import { fNumber } from 'src/utils/format-number';

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
                  // FINAL FIX: Explicitly define both vertical borders
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
              <HeaderTableCell colSpan={2}>كفاية المخزونات من القمح</HeaderTableCell>
              <BandedHeaderTableCell colSpan={2}>كفاية المخزونات من الدقيق</BandedHeaderTableCell>
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

              <HeaderTableCell rowSpan={2}>م الإستهلاك الشهرى</HeaderTableCell>
              <HeaderTableCell rowSpan={2}>كفاية المخزون / الشهر</HeaderTableCell>

              <BandedHeaderTableCell rowSpan={2}>م الإستهلاك الشهرى</BandedHeaderTableCell>
              <BandedHeaderTableCell rowSpan={2}>كفاية المخزون / الشهر</BandedHeaderTableCell>
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
              // const salesTotal =
              //   row.flourSales.kg45Bags + row.flourSales.bulk + row.flourSales.householdBags;

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
                      // FINAL FIX: Explicitly define both vertical borders
                      borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                      borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    {row.branch}
                  </StyledTableCell>

                  {/* الأرصدة بداية الشهر */}
                  <StyledTableCell>{fNumber(row.openingBalance.wheat)}</StyledTableCell>
                  <StyledTableCell>{fNumber(row.openingBalance.flour.kg45Bags)}</StyledTableCell>
                  <StyledTableCell>{fNumber(row.openingBalance.flour.bulk)}</StyledTableCell>
                  <StyledTableCell>
                    {fNumber(row.openingBalance.flour.householdBags)}
                  </StyledTableCell>
                  <StyledTableCell>{fNumber(openingFlourTotal)}</StyledTableCell>

                  {/* مبيعات الدقيق */}
                  <BandedTableCell>{fNumber(row.flourSales.kg45Bags)}</BandedTableCell>
                  <BandedTableCell>{fNumber(row.flourSales.bulk)}</BandedTableCell>
                  <BandedTableCell>{fNumber(row.flourSales.householdBags)}</BandedTableCell>
                  <BandedTableCell>{fNumber(salesTotal)}</BandedTableCell>

                  {/* القمح المستلم والإنتاج */}
                  <StyledTableCell>{fNumber(row.wheatAndProd.received)}</StyledTableCell>
                  <StyledTableCell>{fNumber(row.wheatAndProd.consumed)}</StyledTableCell>
                  <StyledTableCell>{fNumber(row.wheatAndProd.flour)}</StyledTableCell>

                  {/* الأرصدة نهاية الشهر */}
                  <BandedTableCell>{fNumber(row.closingBalance.wheat)}</BandedTableCell>
                  <BandedTableCell>{fNumber(row.closingBalance.flour.kg45Bags)}</BandedTableCell>
                  <BandedTableCell>{fNumber(row.closingBalance.flour.bulk)}</BandedTableCell>
                  <BandedTableCell>
                    {fNumber(row.closingBalance.flour.householdBags)}
                  </BandedTableCell>
                  <BandedTableCell>{fNumber(closingFlourTotal)}</BandedTableCell>

                  {/* كفاية المخزونات من القمح */}
                  <StyledTableCell>{fNumber(row.wheatSufficiency.avgConsumption)}</StyledTableCell>
                  <StyledTableCell>
                    {row.wheatSufficiency.sufficiencyPerMonth.toFixed(1)}
                  </StyledTableCell>

                  {/* كفاية المخزونات من الدقيق */}
                  <BandedTableCell>{fNumber(row.flourSufficiency.avgConsumption)}</BandedTableCell>
                  <BandedTableCell>
                    {row.flourSufficiency.sufficiencyPerMonth.toFixed(1)}
                  </BandedTableCell>
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
                  // FINAL FIX: Explicitly define both vertical borders
                  borderLeft: (theme) => `1px solid ${theme.palette.divider}`,
                  borderRight: (theme) => `1px solid ${theme.palette.divider}`,
                }}
              >
                الإجمالي
              </TotalTableCell>
              {/* الأرصدة بداية الشهر */}
              <TotalTableCell>{fNumber(openingTotalWheat)}</TotalTableCell>
              <TotalTableCell>{fNumber(openingTotalFlour45kg)}</TotalTableCell>
              <TotalTableCell>{fNumber(openingTotalFlourBulk)}</TotalTableCell>
              <TotalTableCell>{fNumber(openingTotalFlourHousehold)}</TotalTableCell>
              <TotalTableCell>{fNumber(openingTotalFlourGrand)}</TotalTableCell>

              {/* مبيعات الدقيق */}
              <BandedTotalTableCell>{fNumber(salesTotal45kg)}</BandedTotalTableCell>
              <BandedTotalTableCell>{fNumber(salesTotalBulk)}</BandedTotalTableCell>
              <BandedTotalTableCell>{fNumber(salesTotalHousehold)}</BandedTotalTableCell>
              <BandedTotalTableCell>{fNumber(salesGrandTotal)}</BandedTotalTableCell>

              {/* القمح المستلم والإنتاج */}
              <TotalTableCell>{fNumber(wheatAndProdTotalReceived)}</TotalTableCell>
              <TotalTableCell>{fNumber(wheatAndProdTotalConsumed)}</TotalTableCell>
              <TotalTableCell>{fNumber(wheatAndProdTotalFlour)}</TotalTableCell>

              {/* الأرصدة نهاية الشهر */}
              <BandedTotalTableCell>{fNumber(closingTotalWheat)}</BandedTotalTableCell>
              <BandedTotalTableCell>{fNumber(closingTotalFlour45kg)}</BandedTotalTableCell>
              <BandedTotalTableCell>{fNumber(closingTotalFlourBulk)}</BandedTotalTableCell>
              <BandedTotalTableCell>{fNumber(closingTotalFlourHousehold)}</BandedTotalTableCell>
              <BandedTotalTableCell>{fNumber(closingTotalFlourGrand)}</BandedTotalTableCell>

              {/* كفاية المخزونات من القمح */}
              <TotalTableCell>{fNumber(sufficiencyWheatAvg)}</TotalTableCell>
              <TotalTableCell>-</TotalTableCell>

              {/* كفاية المخزونات من الدقيق */}
              <BandedTotalTableCell>{fNumber(sufficiencyFlourAvg)}</BandedTotalTableCell>
              <BandedTotalTableCell>-</BandedTotalTableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}
