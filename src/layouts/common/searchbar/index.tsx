import * as React from 'react';
import Button from '@mui/material/Button';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import { grey, teal } from '@mui/material/colors';
import Box from '@mui/material/Box';
import Slide from '@mui/material/Slide';
import GridViewIcon from '@mui/icons-material/GridView';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { Theme } from '@mui/material/styles';
import axios, { endpoints } from 'src/utils/axios';
import { useEffect, useState } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import PersonIcon from '@mui/icons-material/Person';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { PATH_AFTER_LOGIN } from 'src/config-global';
import { useRouter } from 'src/routes/hooks';
import { enqueueSnackbar } from 'notistack';
import BadgeIcon from '@mui/icons-material/Badge';
import PhoneIphoneIcon from '@mui/icons-material/PhoneIphone';
import ScaleIcon from '@mui/icons-material/Scale';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import CardMembershipIcon from '@mui/icons-material/CardMembership';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridToolbarContainer,
  GridToolbarQuickFilter,
} from '@mui/x-data-grid';
import { IFarm } from 'src/types/farm';
import { useGetFarms } from 'src/api/farms';
import Loading from 'src/app/dashboard/loading';
import { useResponsive } from 'src/hooks/use-responsive';
import EmptyContent from 'src/components/empty-content';
import { Tooltip } from '@mui/material';

export interface IFarmDialog {
  open: boolean;
  selectedValue: string;
  onClose: (value: string) => void;
}

const Transition = React.forwardRef(function Transition(
  props: React.ComponentProps<typeof Slide>,
  ref: React.Ref<unknown>
) {
  return <Slide ref={ref} {...props} />;
});

function FarmsDialog(props: IFarmDialog) {
  const smUp = useResponsive('up', 'sm');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [dataFarms, setDataFarms] = useState<any>();
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [farms, setFarms] = useState<IFarm[]>([]);
  const { updateFarmCode, user } = useAuthContext();
  const router = useRouter();

  //const { farms, farmsLoading } = useGetFarms();
  useEffect(() => {
    async function fetchMyAPI() {
      let res: any = await axios
        .post(endpoints.farm.getFarms, {
          idNumber: user?.idNumber,
        })
        .then((res) => {
          setIsLoading(false);
          setDataFarms(res.data);
          setFarms(res.data.result);
        });
    }

    fetchMyAPI();
  }, []);

  const mobileColumns: GridColDef[] = [
    // {
    //   field: 'farmCode',
    //   headerName: 'كود الرخصة',
    //   minWidth: 100,
    // },
    {
      field: 'idNumber',
      headerName: 'الهوية',
      minWidth: 135,
      filterable: false,
    },
    {
      field: 'name',
      headerName: 'الإسم',
      flex: 1,
      hideable: false,
      filterable: false,
    },
  ];
  const columns: GridColDef[] = !smUp
    ? mobileColumns
    : [
        {
          field: 'farmCode',
          headerName: 'كود الرخصة',
          minWidth: 100,
          filterable: true,
        },
        {
          field: 'idNumber',
          headerName: 'الهوية',
          minWidth: 150,
          filterable: true,
        },
        {
          field: 'name',
          headerName: 'الإسم',
          flex: 1,
          hideable: false,
        },
        {
          field: 'phone',
          headerName: 'الجوال',
          minWidth: 150,
        },

        {
          field: 'regionName',
          headerName: 'المنطقة',
        },
        {
          field: 'branchName',
          headerName: 'الفرع',
        },
        {
          field: 'qty',
          headerName: 'الكمية',
        },
      ];
  const { onClose, selectedValue, open } = props;

  const handleClose = () => {
    onClose(selectedValue);
  };

  const handleItemClick = async (value: number) => {
    onClose(value.toString());
    localStorage.setItem('selectedFarm', value.toString());
    try {
      const res = await updateFarmCode?.(user, value);
      enqueueSnackbar('تم تغيير الرخصة بنجاح', {
        variant: 'success',
        anchorOrigin: { vertical: 'bottom', horizontal: 'right' },
      });
      router.push(PATH_AFTER_LOGIN);
    } catch (error) {
      setErrorMsg(typeof error === 'string' ? error : error.message);
    }
  };

  return (
    <Dialog
      onClose={handleClose}
      open={open}
      TransitionComponent={Transition}
      maxWidth="lg"
      fullWidth={true}
    >
      <DialogTitle>بيانات الحساب</DialogTitle>
      <Divider />
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundImage: "url('/assets/background/pbg6.jpg')",
          backgroundSize: 'cover',
          backgroundRepeat: 'no-repeat',
          opacity: 0.1,
        }}
      />
      {isLoading && (
        <>
          <Loading />
          <br />
          <br />
        </>
      )}
      {!isLoading && user && user!.roles === 'admin' && (
        <>
          <DataGrid
            slotProps={{
              pagination: {
                labelRowsPerPage: 'عدد السجلات بالصفحة',
              },
            }}
            style={{ paddingRight: 10, paddingLeft: 10 }}
            localeText={{
              columnHeaderFiltersLabel: 'عرض التنقية',
              columnHeaderSortIconLabel: 'ترتيب',

              noRowsLabel: 'لا توجد نتائج',
              noResultsOverlayLabel: 'لا توجد نتائج.',

              // Density selector toolbar button text
              toolbarDensity: 'Size',
              toolbarDensityLabel: 'Size',
              toolbarDensityCompact: 'Small',
              toolbarDensityStandard: 'Medium',
              toolbarDensityComfortable: 'Large',

              // Columns selector toolbar button text
              toolbarColumns: 'الحقول',
              toolbarColumnsLabel: 'اختر الحقول',

              // Filters toolbar button text
              toolbarFilters: 'Filters',
              toolbarFiltersLabel: 'Show filters',
              toolbarFiltersTooltipHide: 'Hide filters',
              toolbarFiltersTooltipShow: 'Show filters',
              toolbarFiltersTooltipActive: (count) =>
                count !== 1 ? `${count} active filters` : `${count} active filter`,

              // Quick filter toolbar field
              toolbarQuickFilterPlaceholder: 'بحث…',
              toolbarQuickFilterLabel: 'بحث',
              toolbarQuickFilterDeleteIconLabel: 'مسح',

              // Export selector toolbar button text
              toolbarExport: 'Export',
              toolbarExportLabel: 'Export',
              toolbarExportCSV: 'Download as CSV',
              toolbarExportPrint: 'Print',
              toolbarExportExcel: 'Download as Excel',

              // Columns management text
              // columnsManagementSearchTitle: 'بحث',
              // columnsManagementNoColumns: 'لا توجد حقول',
              // columnsManagementShowHideAllText: 'عرض/اخفاء الكل',

              // Filter panel text
              filterPanelAddFilter: 'اضافة تنقية',
              filterPanelRemoveAll: 'ازالة',
              filterPanelDeleteIconLabel: 'حذف',
              filterPanelLogicOperator: 'Logic operator',
              filterPanelOperator: 'المعامل',
              filterPanelOperatorAnd: 'و',
              filterPanelOperatorOr: 'أو',
              filterPanelColumns: 'الحقول',
              filterPanelInputLabel: 'القيمة',
              filterPanelInputPlaceholder: 'فلترة',

              // Filter operators text
              filterOperatorContains: 'يتضمن',
              filterOperatorEquals: 'يساوي',
              filterOperatorStartsWith: 'يبدأ بـ',
              filterOperatorEndsWith: 'ينتهي بـ',
              filterOperatorIs: 'هو',
              filterOperatorNot: 'هو ليس',
              filterOperatorAfter: 'بعد',
              filterOperatorOnOrAfter: 'هو أو بعد',
              filterOperatorBefore: 'قبل',
              filterOperatorOnOrBefore: 'هو أو قبل',
              filterOperatorIsEmpty: 'فارغ',
              filterOperatorIsNotEmpty: 'ليس أي من',
              filterOperatorIsAnyOf: 'أي من',
              'filterOperator=': '=',
              'filterOperator!=': '!=',
              'filterOperator>': '>',
              'filterOperator>=': '>=',
              'filterOperator<': '<',
              'filterOperator<=': '<=',

              // Header filter operators text
              headerFilterOperatorContains: 'Contains',
              headerFilterOperatorEquals: 'Equals',
              headerFilterOperatorStartsWith: 'Starts with',
              headerFilterOperatorEndsWith: 'Ends with',
              headerFilterOperatorIs: 'Is',
              headerFilterOperatorNot: 'Is not',
              headerFilterOperatorAfter: 'Is after',
              headerFilterOperatorOnOrAfter: 'Is on or after',
              headerFilterOperatorBefore: 'Is before',
              headerFilterOperatorOnOrBefore: 'Is on or before',
              headerFilterOperatorIsEmpty: 'Is empty',
              headerFilterOperatorIsNotEmpty: 'Is not empty',
              headerFilterOperatorIsAnyOf: 'Is any of',
              'headerFilterOperator=': 'Equals',
              'headerFilterOperator!=': 'Not equals',
              'headerFilterOperator>': 'Greater than',
              'headerFilterOperator>=': 'Greater than or equal to',
              'headerFilterOperator<': 'Less than',
              'headerFilterOperator<=': 'Less than or equal to',

              // Filter values text
              filterValueAny: 'any',
              filterValueTrue: 'true',
              filterValueFalse: 'false',

              // Column menu text
              columnMenuLabel: 'القائمة',
              columnMenuShowColumns: 'عرض الحقول',
              columnMenuManageColumns: 'التحكم في الحقول',
              columnMenuFilter: 'تنقية',
              columnMenuHideColumn: 'اخفاء حقل',
              columnMenuUnsort: 'غير مُرتب',
              columnMenuSortAsc: 'ترتيب تصاعدي',
              columnMenuSortDesc: 'ترتيب تنازلي',
            }}
            rowSelection={true}
            onRowSelectionModelChange={(row) => {
              handleItemClick(parseInt(row.toString()));
            }}
            rows={farms}
            columns={columns}
            loading={isLoading}
            // getRowHeight={() => 'auto'}
            pageSizeOptions={[5, 10, 25, 100, 250]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 10 },
              },
            }}
            slots={{
              toolbar: () => (
                <>
                  <GridToolbarContainer>
                    <GridToolbarQuickFilter />
                  </GridToolbarContainer>
                </>
              ),
              noRowsOverlay: () => <EmptyContent title="لا توجد سجلات" />,
              noResultsOverlay: () => <EmptyContent title="لا توجد نتائج للبحث" />,
            }}
          />
        </>
      )}

      {!isLoading && user && user!.roles != 'admin' && farms && farms.length < 100 && (
        <>
          <Grid container spacing={2} sx={{ p: 2 }}>
            {farms.map((farm) => (
              <Grid item key={farm.farmCode} xs={12} sm={6} md={3} lg={3}>
                <List
                  onClick={() => handleItemClick(farm.farmCode)}
                  sx={{
                    width: '100%',
                    bgcolor: 'background.paper',
                    borderRadius: '20px',
                    boxShadow:
                      'rgba(0, 0, 0, 0.02) 0px 1px 3px 0px, rgba(27, 31, 35, 0.15) 0px 0px 0px 1px',
                    height: '100%',
                    backgroundColor: selectedValue === farm.name ? grey[50] : '#fff',
                    transition: 'background-color 0.3s',
                    '&:hover': {
                      cursor: 'pointer',
                      backgroundColor: teal[50],
                      boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
                    },
                  }}
                >
                  <ListItem key={farm.farmCode}>
                    <ListItemAvatar>
                      <Avatar>
                        <QrCodeScannerIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="كود الرخصة" secondary={farm.farmCode} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <CardMembershipIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="رقم الشهادة" secondary={farm.certificateNumber} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <BadgeIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="الإسم" secondary={farm.name} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <PhoneIphoneIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="رقم الجوال" secondary={farm.phone} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <LocationOnIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="المنطقة" secondary={farm.region} />
                  </ListItem>
                  <ListItem>
                    <ListItemAvatar>
                      <Avatar>
                        <ScaleIcon />
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText primary="الكمية المخصصة" secondary={farm.qty} />
                  </ListItem>
                </List>
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </Dialog>
  );
}

export default function FarmBar() {
  const { user } = useAuthContext();
  const [open, setOpen] = React.useState(false);

  const [selectedValue, setSelectedValue] = React.useState(user?.farmCode);
  const isSmallScreen = useMediaQuery<Theme>((theme: Theme) => theme.breakpoints.down('sm'));

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = (value: string) => {
    setOpen(false);
    setSelectedValue(value);
  };

  React.useEffect(() => {
    const storedSelectedFarm = localStorage.getItem('selectedFarm');
    if (storedSelectedFarm) {
      setSelectedValue(storedSelectedFarm);
    }
  }, []); // Load selected farm from local storage on component mount

  return (
    <>
      {isSmallScreen ? (
        <div></div>
      ) : (
        // <Box sx={{ display: 'flex', justifyContent: 'center', color: 'teal' }}>
        //   <Tooltip title="">
        //     <Button variant="text" onClick={handleClickOpen} sx={{ mx: 3 }}>
        //       <GridViewIcon />

        //       {user?.displayName}
        //     </Button>
        //   </Tooltip>
        // </Box>
        <div></div>
        // <Box sx={{ display: 'flex', justifyContent: 'center', color: 'teal' }}>
        //   <Tooltip title="">
        //     <Button
        //       variant="text"
        //       onClick={handleClickOpen}
        //       startIcon={<GridViewIcon />}
        //       sx={{ mx: 3 }}
        //     >
        //       {user?.displayName}
        //     </Button>
        //   </Tooltip>
        // </Box>
      )}
      <FarmsDialog selectedValue={selectedValue} open={open} onClose={handleClose} />
    </>
  );
}
