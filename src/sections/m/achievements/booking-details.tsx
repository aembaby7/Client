import Box from '@mui/material/Box';
import Table from '@mui/material/Table';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import TableRow from '@mui/material/TableRow';
import { useTheme } from '@mui/material/styles';
import TableCell from '@mui/material/TableCell';
import TableBody from '@mui/material/TableBody';
import IconButton from '@mui/material/IconButton';
import CardHeader from '@mui/material/CardHeader';
import Card, { CardProps } from '@mui/material/Card';
import ListItemText from '@mui/material/ListItemText';
import TableContainer from '@mui/material/TableContainer';
import { fDate, fTime } from 'src/utils/format-time';
import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { fNumber, fPercent } from 'src/utils/format-number';
import { Paper, Stack, TableFooter, TableHead, Typography } from '@mui/material';
import { grey, green, orange } from '@mui/material/colors';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

// ----------------------------------------------------------------------

type RowProps = {
  id: number;
  eventDesc: string;
  txDate: Date;
  txNumber: number;
  totalQtyInTons: number;
  totalQtyInTonsBefore: number;
  totalQtyInTonsDiff: number;
  totalQtyInTonsDiffPer: number;
  cntCustomers: number;
  cntCustomersBefore: number;
  cntCustomersDiff: number;
  cntCustomersDiffPer: number;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableLabels: any;
  tableData: RowProps[];
}

export default function BookingDetails({
  title,
  subheader,
  tableLabels,
  tableData,
  ...other
}: Props) {
  let smTotalQtyInTonsDiff: number = 0;
  let smCntCustomersDiff: number = 0;
  tableData.forEach((row) => {
    if (row.totalQtyInTonsDiff) {
      smTotalQtyInTonsDiff += row.totalQtyInTonsDiff;
    }
    if (row.cntCustomersDiff) {
      smCntCustomersDiff += row.cntCustomersDiff;
    }
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{
          borderBottom: (theme) => `1px solid ${theme.palette.divider}`,
          marginBottom: '0',
          paddingBottom: '10px',
          textAlign: 'left',
        }}
      />

      <TableContainer component={Paper} sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 960 }}>
            <TableHead
              sx={{
                '& .MuiTableCell-root': {
                  bgcolor: green[50],
                  color: 'common.black', // << Black text color
                  fontWeight: 'bold',
                  textAlign: 'center',
                  border: `1px solid ${grey[300]}`, // << Lighter border
                },
              }}
            >
              {/* Main grouping row */}
              <TableRow>
                <TableCell rowSpan={2} sx={{ width: '5%' }}>
                  #
                </TableCell>
                <TableCell rowSpan={2}>تاريخ الإجراء</TableCell>
                <TableCell rowSpan={2}>الوصف</TableCell>
                <TableCell colSpan={4}>اجمالي الكميات المخصصة (بالطن)</TableCell>
                <TableCell colSpan={3}>عدد العملاء</TableCell>
              </TableRow>

              {/* Specific column labels row */}
              <TableRow>
                <TableCell>قبل</TableCell>
                <TableCell>بعد</TableCell>
                <TableCell>التغير الكمي</TableCell>
                <TableCell>التغير النسبي %</TableCell>
                <TableCell>قبل</TableCell>
                <TableCell>بعد</TableCell>
                <TableCell>التغير الكمي</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {tableData.map((row, index) => (
                <BookingDetailsRow key={row.id} row={row} index={index} />
              ))}
            </TableBody>
            <TableFooter>
              <TableRow
                sx={{
                  '& .MuiTableCell-root': {
                    bgcolor: green[50],
                    color: 'common.black',
                    fontWeight: 'bold',
                    borderTop: `2px solid ${grey[400]}`,
                  },
                }}
              >
                <TableCell colSpan={5} sx={{ textAlign: 'center', fontSize: '15px' }}>
                  الإجمالي
                </TableCell>
                <TableCell sx={{ textAlign: 'center', fontSize: '15px' }}>
                  {fNumber(smTotalQtyInTonsDiff)}
                </TableCell>
                <TableCell colSpan={3}></TableCell>
                <TableCell sx={{ textAlign: 'center', fontSize: '15px' }}>
                  {fNumber(smCntCustomersDiff)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

type BookingDetailsRowProps = {
  row: RowProps;
  index: number;
};

function BookingDetailsRow({ row, index }: BookingDetailsRowProps) {
  const theme = useTheme();

  // Helper function for conditional styling
  const renderChangeCell = (value: number, isPercentage = false) => {
    if (value === 0 || !value) {
      return <Typography variant="body2">{isPercentage ? fPercent(0) : fNumber(0)}</Typography>;
    }
    const color = value > 0 ? 'success.main' : 'error.main';
    const icon =
      value > 0 ? (
        <ArrowUpwardIcon sx={{ fontSize: 16 }} />
      ) : (
        <ArrowDownwardIcon sx={{ fontSize: 16 }} />
      );
    const formattedValue = isPercentage ? fPercent(value) : fNumber(value);

    return (
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="center"
        spacing={0.5}
        sx={{ color }}
      >
        {icon}
        <Typography variant="body2" component="span" sx={{ fontWeight: 'bold' }}>
          {formattedValue}
        </Typography>
      </Stack>
    );
  };

  return (
    <>
      <TableRow
        sx={{
          '&:hover': { bgcolor: (theme) => theme.palette.action.selected },
          '&:nth-of-type(odd)': {
            bgcolor: (theme) => theme.palette.action.hover,
          },
        }}
      >
        {row.txNumber == null ? (
          // This is a group header row
          <>
            <TableCell
              colSpan={11}
              sx={{
                lineHeight: '1.2rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'center',
                bgcolor: orange[100],
                color: 'common.black',
              }}
            >
              {row.eventDesc} ({row.txDate.toString()})
            </TableCell>
          </>
        ) : (
          // This is a standard data row
          <>
            <TableCell
              sx={{
                lineHeight: '1.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'center',
              }}
            >
              {row.txNumber}
            </TableCell>
            <TableCell
              sx={{
                lineHeight: '1.5rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'center',
                whiteSpace: 'nowrap',
              }}
            >
              {row.txDate.toString()}
            </TableCell>
            <TableCell
              sx={{
                lineHeight: '1.2rem',
                fontSize: '0.875rem',
                fontWeight: 500,
                textAlign: 'justify',
              }}
            >
              {row.eventDesc}
            </TableCell>
            <TableCell sx={{ lineHeight: '1.5rem', textAlign: 'center' }}>
              {fNumber(row.totalQtyInTonsBefore)}
            </TableCell>
            <TableCell sx={{ lineHeight: '1.5rem', textAlign: 'center' }}>
              {fNumber(row.totalQtyInTons)}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', lineHeight: '1.5rem' }}>
              {renderChangeCell(row.totalQtyInTonsDiff)}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', lineHeight: '1.5rem' }}>
              {renderChangeCell(row.totalQtyInTonsDiffPer, true)}
            </TableCell>
            <TableCell sx={{ lineHeight: '1.5rem', textAlign: 'center' }}>
              {fNumber(row.cntCustomersBefore)}
            </TableCell>
            <TableCell sx={{ lineHeight: '1.5rem', textAlign: 'center' }}>
              {fNumber(row.cntCustomers)}
            </TableCell>
            <TableCell sx={{ textAlign: 'center', lineHeight: '1.5rem' }}>
              {renderChangeCell(row.cntCustomersDiff)}
            </TableCell>
          </>
        )}
      </TableRow>
    </>
  );
}
