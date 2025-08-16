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
import { TableHeadCustom } from 'src/components/table';
import CustomPopover, { usePopover } from 'src/components/custom-popover';
import { fData, fShortenNumber_, fShortenNumber__ } from 'src/utils/format-number';
import { Paper, TableFooter } from '@mui/material';
import { blue, grey, orange, teal } from '@mui/material/colors';

// ----------------------------------------------------------------------

type RowProps = {
  branchId: number;
  branchLabel: string;
  smQty?: number;
  cntBranchSelected: number;
  smWeight?: number;
  smCleanWeight?: number;
  smDockage?: number;
  dockageAverage?: number;
  qtyBalance?: number;
  qtyCleanBalance?: number;
  cntTrucks?: number;
  cntTrucksAccepted?: number;
  cntTrucksRejected?: number;
  smTotalPay?: number;
  smPayToDate?: number;
  smAmountToPay?: number;
  smZakatPayToDate?: number;
  smVAT?: number;
  mnArrivalDate?: Date;
  mxArrivalDate?: Date;
  totalFullAllowedTrucks?: number;
  totalAllowedTrucks?: number;
  cntUsed?: number;
  cntWaiting?: number;
  cntDateOver?: number;
  cntProcessed?: number;
  cntProcessing?: number;
  cntAccepted?: number;
  cntRejected?: number;
  cntApps?: number;

  // destination: {
  //   name: string;
  //   coverUrl: string;
  // };
  // customer: {
  //   avatarUrl: string;
  //   name: string;
  //   phoneNumber: string;
  // };
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
  let cntBranchSelected: number = 0;
  let smQty: number = 0;
  let smWeight: number = 0;
  let smCleanWeight: number = 0;
  let smDockage: number = 0;
  let totalFullAllowedTrucks: number = 0;
  let totalAllowedTrucks: number = 0;
  let cntUsed: number = 0;
  let cntWaiting: number = 0;
  let cntDateOver: number = 0;
  let cntProcessing: number = 0;
  let cntAccepted: number = 0;
  let cntRejected: number = 0;

  tableData.forEach((row) => {
    cntBranchSelected = cntBranchSelected + row.cntBranchSelected!;
    smQty = smQty + row.smQty!;
    smWeight = smWeight + row.smWeight!;
    smCleanWeight = smCleanWeight + row.smCleanWeight!;
    smDockage = smDockage + row.smDockage!;
    totalFullAllowedTrucks = totalFullAllowedTrucks + row.totalFullAllowedTrucks!;
    totalAllowedTrucks = totalAllowedTrucks + row.totalAllowedTrucks!;
    cntUsed = cntUsed + row.cntUsed!;
    cntWaiting = cntWaiting + row.cntWaiting!;
    cntDateOver = cntDateOver + row.cntDateOver!;
    cntProcessing = cntProcessing + row.cntProcessing!;
    cntAccepted = cntAccepted + row.cntAccepted!;
    cntRejected = cntRejected + row.cntRejected!;
  });

  return (
    <Card {...other}>
      <CardHeader
        title={title}
        subheader={subheader}
        sx={{
          marginBottom: '0',
          paddingBottom: '10px',
          textAlign: 'left',
        }}
      />

      <TableContainer component={Paper} sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row, index) => (
                <BookingDetailsRow key={row.branchId} row={row} index={index} />
              ))}
            </TableBody>
            <TableFooter>
              <TableCell
                sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}
              ></TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(cntBranchSelected)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(smQty)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(smWeight)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(smCleanWeight)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(smDockage)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(totalFullAllowedTrucks)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(totalAllowedTrucks)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(cntUsed)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(cntWaiting)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(cntDateOver)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(cntProcessing)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(cntAccepted)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}>
                {fShortenNumber__(cntRejected)}
              </TableCell>
            </TableFooter>
          </Table>
        </Scrollbar>
      </TableContainer>
    </Card>
  );
}

// ----------------------------------------------------------------------

type BookingDetailsRowProps = {
  row: RowProps;
  index: number;
};

function BookingDetailsRow({ row, index }: BookingDetailsRowProps) {
  const theme = useTheme();

  const lightMode = theme.palette.mode === 'light';

  const popover = usePopover();

  const handleDownload = () => {
    popover.onClose();
  };

  const handlePrint = () => {
    popover.onClose();
  };

  const handleShare = () => {
    popover.onClose();
  };

  const handleDelete = () => {
    popover.onClose();
  };

  const rowBackgroundColor = index % 2 === 0 ? grey[50] : blue[50];

  return (
    <>
      <TableRow
        sx={{
          '&:hover': { bgcolor: orange[50], cursor: 'pointer' },
          backgroundColor: rowBackgroundColor,
        }}
      >
        <TableCell
          sx={{
            bgcolor: orange[200],
            width: '120px',
            lineHeight: '1.2rem',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {row.branchLabel}
        </TableCell>
        <TableCell
          sx={{
            alignItems: 'center',
            width: '120px',
            lineHeight: '0.3rem',
            fontSize: '0.875rem',
            fontWeight: 500,
          }}
        >
          {row.cntBranchSelected}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.smQty)}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.smWeight)}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.smCleanWeight)}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.smDockage)}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.totalFullAllowedTrucks)}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.totalAllowedTrucks)}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.cntUsed)}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.cntWaiting)}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.cntDateOver)}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.cntProcessing)}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.cntAccepted)}
        </TableCell>
        <TableCell sx={{ alignItems: 'center', lineHeight: '0.3rem' }}>
          {fShortenNumber__(row.cntRejected)}
        </TableCell>
      </TableRow>
    </>
  );
}
