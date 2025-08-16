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
import { TableFooter } from '@mui/material';

// ----------------------------------------------------------------------

type RowProps = {
  branchId: number;
  branchLabel: string;
  cntAccepted?: number;
  acceptedSaudi1?: number;
  acceptedSaudi2?: number;
  cntRejected?: number;
  rejectReason5?: number;
  rejectReason8?: number;
  rejectReason10?: number;
  rejectReason13?: number;
  rejectReason14?: number;
  rejectReason0?: number;
};

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  tableLabels: any;
  tableData: RowProps[];
}

export default function RejectDetails({
  title,
  subheader,
  tableLabels,
  tableData,
  ...other
}: Props) {
  let cntAccepted: number = 0;
  let acceptedSaudi1: number = 0;
  let acceptedSaudi2: number = 0;
  let cntRejected: number = 0;
  let rejectReason5: number = 0;
  let rejectReason8: number = 0;
  let rejectReason10: number = 0;
  let rejectReason13: number = 0;
  let rejectReason14: number = 0;
  let rejectReason0: number = 0;

  tableData.forEach((row) => {
    cntAccepted = cntAccepted + row.cntAccepted!;
    acceptedSaudi1 = acceptedSaudi1 + row.acceptedSaudi1!;
    acceptedSaudi2 = acceptedSaudi2 + row.acceptedSaudi2!;
    cntRejected = cntRejected + row.cntRejected!;
    rejectReason5 = rejectReason5 + row.rejectReason5!;
    rejectReason8 = rejectReason8 + row.rejectReason8!;
    rejectReason10 = rejectReason10 + row.rejectReason10!;
    rejectReason13 = rejectReason13 + row.rejectReason13!;
    rejectReason14 = rejectReason14 + row.rejectReason14!;
    rejectReason0 = rejectReason0 + row.rejectReason0!;
  });
  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} sx={{ mb: 3 }} />

      <TableContainer sx={{ overflow: 'unset' }}>
        <Scrollbar>
          <Table sx={{ minWidth: 960 }}>
            <TableHeadCustom headLabel={tableLabels} />

            <TableBody>
              {tableData.map((row) => (
                <BookingDetailsRow key={row.branchId} row={row} />
              ))}
            </TableBody>
            <TableFooter>
              <TableCell
                sx={{ alignItems: 'center', lineHeight: '0.3rem', fontWeight: 'bold' }}
              ></TableCell>

              <TableCell sx={{ alignItems: 'center', fontWeight: 'bold' }}>
                {fShortenNumber__(cntAccepted)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', fontWeight: 'bold' }}>
                {fShortenNumber__(acceptedSaudi1)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', fontWeight: 'bold' }}>
                {fShortenNumber__(acceptedSaudi2)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', fontWeight: 'bold' }}>
                {fShortenNumber__(cntRejected)}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', fontWeight: 'bold' }}>
                {rejectReason5}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', fontWeight: 'bold' }}>
                {rejectReason8}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', fontWeight: 'bold' }}>
                {rejectReason10}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', fontWeight: 'bold' }}>
                {rejectReason13}
              </TableCell>
              <TableCell sx={{ alignItems: 'center', fontWeight: 'bold' }}>
                {rejectReason14}
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
};

function BookingDetailsRow({ row }: BookingDetailsRowProps) {
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

  return (
    <>
      <TableRow>
        <TableCell sx={{ display: 'flex', alignItems: 'center' }}>{row.branchLabel}</TableCell>
        <TableCell sx={{ alignItems: 'center' }}>{row.cntAccepted}</TableCell>
        <TableCell sx={{ alignItems: 'center' }}>{row.acceptedSaudi1}</TableCell>
        <TableCell sx={{ alignItems: 'center' }}>{row.acceptedSaudi2}</TableCell>
        <TableCell sx={{ alignItems: 'center' }}>{row.cntRejected}</TableCell>
        <TableCell sx={{ alignItems: 'center' }}>{row.rejectReason5}</TableCell>
        <TableCell sx={{ alignItems: 'center' }}>{row.rejectReason8}</TableCell>
        <TableCell sx={{ alignItems: 'center' }}>{row.rejectReason10}</TableCell>
        <TableCell sx={{ alignItems: 'center' }}>{row.rejectReason13}</TableCell>
        <TableCell sx={{ alignItems: 'center' }}>{row.rejectReason14}</TableCell>

        <TableCell align="right" sx={{ pr: 1 }}>
          <IconButton color={popover.open ? 'inherit' : 'default'} onClick={popover.onOpen}>
            <Iconify icon="eva:more-vertical-fill" />
          </IconButton>
        </TableCell>
      </TableRow>

      <CustomPopover
        open={popover.open}
        onClose={popover.onClose}
        arrow="right-top"
        sx={{ width: 160 }}
      ></CustomPopover>
    </>
  );
}
