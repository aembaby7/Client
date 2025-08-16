import React, { useState } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import Card, { CardProps } from '@mui/material/Card';
import { Grid, Tabs, Tab, ListItemText } from '@mui/material';
import BarleyAppWidget from './app-widget';
import {
  NotificationAdd,
  Verified,
  DirectionsCar,
  Home,
  Business,
  Houseboat,
  Place,
  Store,
  EventBusy,
} from '@mui/icons-material';
import Label from 'src/components/label';
import { fNumber } from 'src/utils/format-number';

// ----------------------------------------------------------------------

interface Props extends CardProps {
  title?: string;
  subheader?: string;
  selectedLastDateDesc: string;
  stationsLastDateSales: {
    stationId: number;
    stationCode: number;
    stationTitle: string;
    totalSalesQty: number;
  }[];
  missingDates: {
    stationId: number;
    stationCode: number;
    processDate: Date;
    processDateDesc: string;
    stationTitle: string;
  }[];
}

export default function StationStockTxInfo({
  title,
  subheader,
  selectedLastDateDesc,
  stationsLastDateSales,
  missingDates,
  ...other
}: Props) {
  // Tab state
  const [tabIndex, setTabIndex] = useState(0);

  // Separate items based on background color logic
  const [dangerLimit, setDangerLimit] = useState(0);
  const [warningLimit, setWarningLimit] = useState(50);
  const [fairLimit, setFairLimit] = useState(9000);
  const [moreLimit, setMoreLimit] = useState(90);

  // Tab change handler
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabIndex(newValue);
  };

  function GetColorName(NumberInDays: number) {
    if (NumberInDays >= moreLimit) return '#007867';
    else if (NumberInDays >= fairLimit) return '#006C9C';
    else if (NumberInDays >= warningLimit) return '#B76E00';
    else return '#a02500';
    // else return 'linear-gradient(to right, #a02500, #cc2e04)';
  }

  return (
    <Card {...other}>
      <CardHeader title={title} subheader={subheader} />
      {/*start of  Tabs */}
      <Tabs
        value={tabIndex}
        onChange={handleTabChange}
        aria-label="tabs 4"
        sx={{ padding: '0 20px', marginTop: '15px' }}
      >
        <Tab
          label={'مبيعات: ' + selectedLastDateDesc}
          // icon={<EventBusy />}
          icon={
            <Label
              variant="filled"
              color={stationsLastDateSales?.length == 0 ? 'error' : 'primary'}
            >
              {stationsLastDateSales?.length}
            </Label>
          }
        />
        <Tab
          label="عمليات مفقودة"
          // icon={<EventBusy />}
          icon={
            <Label variant="filled" color={missingDates?.length == 0 ? 'info' : 'error'}>
              {missingDates?.length}
            </Label>
          }
        />
      </Tabs>
      {/*End of  Tabs */}
      <Box sx={{ p: 3 }}>
        {tabIndex === 0 && (
          <>
            {/* Red items in one row '#007867' '#B76E00' */}
            {stationsLastDateSales.length > 0 && (
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {stationsLastDateSales.map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item.stationId}>
                    <ListItemText
                      primary={item.stationCode + ': ' + item.stationTitle}
                      secondary={fNumber(item.totalSalesQty) + ' طن '}
                      secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'subtitle2',
                        color: 'text.disabled',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
        {tabIndex === 1 && (
          <>
            {/* Red items in one row '#007867' '#B76E00' */}
            {missingDates.length > 0 && (
              <Grid container spacing={3} sx={{ mb: 3 }}>
                {missingDates.map((item) => (
                  <Grid item xs={12} sm={6} md={3} key={item.stationId}>
                    <ListItemText
                      primary={item.stationCode + ': ' + item.stationTitle}
                      secondary={item.processDateDesc}
                      secondaryTypographyProps={{
                        mt: 0.5,
                        component: 'span',
                        typography: 'caption',
                        color: 'text.disabled',
                      }}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          </>
        )}
      </Box>
    </Card>
  );
}

// ===============================================================================================
// import React, { useState } from 'react';
// import Box from '@mui/material/Box';
// import Paper from '@mui/material/Paper';
// import CardHeader from '@mui/material/CardHeader';
// import Typography from '@mui/material/Typography';
// import Card, { CardProps } from '@mui/material/Card';
// import { Grid, Tabs, Tab } from '@mui/material';
// import BarleyAppWidget from './app-widget';
// import { NotificationAdd, Verified, DirectionsCar, Home } from '@mui/icons-material';
// import { CSSTransition } from 'react-transition-group';

// // ----------------------------------------------------------------------

// interface Props extends CardProps {
//   title?: string;
//   subheader?: string;
//   list: {
//     name: string;
//     stockQty: number;
//     salesQty: number;
//     uniqueSalesDays: number;
//     salesAverage: number;
//     sufficiencyInDays: number;
//     sufficiencyInDaysPercent: number;
//   }[];
// }

// export default function LocationStockSufficiencyView({ title, subheader, list, ...other }: Props) {
//   // Tab state
//   const [tabIndex, setTabIndex] = useState(0);

//   // Separate items based on background color logic
//   const redItems = list.filter((item) => item.sufficiencyInDaysPercent < 50); // Red items
//   const brownItems = list.filter(
//     (item) => item.sufficiencyInDaysPercent >= 50 && item.sufficiencyInDaysPercent < 100
//   ); // Brown items (orange)
//   const greenItems = list.filter((item) => item.sufficiencyInDaysPercent >= 100); // Green items

//   // Tab change handler
//   const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
//     setTabIndex(newValue);
//   };

//   return (
//     <Card {...other}>
//       <CardHeader title={title} subheader={subheader} />

//       {/* Tabs */}
//       <Tabs
//         value={tabIndex}
//         onChange={handleTabChange}
//         aria-label="tabs example"
//         sx={{
//           padding: '0 20px',
//           marginTop: '20px',
//           '& .MuiTabs-indicator': {
//             display: 'none',
//           },
//         }}
//       >
//         <Tab
//           label="1كفاية المخزون "
//           icon={<Home />}
//           sx={{
//             backgroundColor: '#D1C4E9',
//             boxShadow:
//               'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
//             padding: '20px',
//             textAlign: 'center',
//             position: 'relative',
//             '&.Mui-selected': {
//               backgroundColor: '#D1C4E9',
//             },
//             '&:before': {
//               content: '""',
//               position: 'absolute',
//               bottom: 0,
//               left: 0,
//               width: '100%',
//               height: '4px',
//               backgroundColor: '#512D6D',
//               transform: 'scaleX(0)',
//               transformOrigin: 'bottom left',
//               transition: 'transform 0.3s ease',
//             },
//             '&.Mui-selected:before': {
//               transform: 'scaleX(1)',
//             },
//           }}
//         />
//         <Tab
//           label="2كفاية المخزون"
//           icon={<DirectionsCar />}
//           sx={{
//             backgroundColor: '#FFF3E0',
//             boxShadow:
//               'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
//             padding: '20px',
//             textAlign: 'center',
//             position: 'relative',
//             '&.Mui-selected': {
//               backgroundColor: '#FFF3E0',
//             },
//             '&:before': {
//               content: '""',
//               position: 'absolute',
//               bottom: 0,
//               left: 0,
//               width: '100%',
//               height: '4px',
//               backgroundColor: '#FF9800',
//               transform: 'scaleX(0)',
//               transformOrigin: 'bottom left',
//               transition: 'transform 0.3s ease', // Smooth animation
//             },
//             '&.Mui-selected:before': {
//               transform: 'scaleX(1)', // Animate the bottom border to full width when selected
//             },
//           }}
//         />
//         <Tab
//           label="3كفاية المخزون"
//           icon={<Verified />}
//           sx={{
//             backgroundColor: '#C8E6C9',
//             boxShadow:
//               'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
//             padding: '20px',
//             textAlign: 'center',
//             position: 'relative',
//             '&.Mui-selected': {
//               backgroundColor: '#C8E6C9',
//             },
//             '&:before': {
//               content: '""',
//               position: 'absolute',
//               bottom: 0,
//               left: 0,
//               width: '100%',
//               height: '4px',
//               backgroundColor: '#388E3C', // Green bottom border color for selected tab
//               transform: 'scaleX(0)',
//               transformOrigin: 'bottom left',
//               transition: 'transform 0.3s ease', // Smooth animation
//             },
//             '&.Mui-selected:before': {
//               transform: 'scaleX(1)', // Animate the bottom border to full width when selected
//             },
//           }}
//         />
//         <Tab
//           label="4كفاية المخزون"
//           icon={<NotificationAdd />}
//           sx={{
//             backgroundColor: '#FFCDD2',
//             boxShadow:
//               'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
//             padding: '20px',
//             textAlign: 'center',
//             position: 'relative',
//             '&.Mui-selected': {
//               backgroundColor: '#FFCDD2',
//             },
//             '&:before': {
//               content: '""',
//               position: 'absolute',
//               bottom: 0,
//               left: 0,
//               width: '100%',
//               height: '4px',
//               backgroundColor: '#D32F2F', // Red bottom border color for selected tab
//               transform: 'scaleX(0)',
//               transformOrigin: 'bottom left',
//               transition: 'transform 0.3s ease', // Smooth animation
//             },
//             '&.Mui-selected:before': {
//               transform: 'scaleX(1)', // Animate the bottom border to full width when selected
//             },
//           }}
//         />
//       </Tabs>

//       <Box sx={{ p: 3 }}>

//         {/* Tab 1 Content */}
//         <CSSTransition in={tabIndex === 0} timeout={500} classNames="fade" unmountOnExit>
//           <>
//             {/* Red items in one row */}
//             {redItems.length > 0 && (
//               <Grid container spacing={3} sx={{ mb: 3 }}>
//                 {redItems.map((item) => (
//                   <Grid item xs={12} sm={6} md={3} key={item.name}>
//                     <Paper
//                       variant="outlined"
//                       sx={{
//                         textAlign: 'center',
//                         background: 'linear-gradient(to right, #a02500, #cc2e04)',
//                         boxShadow:
//                           'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
//                       }}
//                     >
//                       <Typography
//                         variant="h5"
//                         style={{
//                           marginRight: '20px',
//                           marginTop: '10px',
//                           marginBottom: '20px',
//                           textAlign: 'right',
//                           color: '#ffffff',
//                         }}
//                       >
//                         <NotificationAdd
//                           sx={{
//                             color: '#fff',
//                             fontSize: 20,
//                             marginRight: 0.5,
//                           }}
//                         />
//                         {item.name}
//                       </Typography>
//                       <BarleyAppWidget
//                         mainTitle="المخزون"
//                         mainTotal={item.stockQty}
//                         salesTitle="المبيعات"
//                         salesTotal={item.salesQty}
//                         salesDaysTitle="عدد أيام البيع"
//                         salesDaysTotal={item.uniqueSalesDays}
//                         subTitle="متوسط البيع اليومي"
//                         subTotal={item.salesAverage}
//                         minorTitle="كفاية المخزون باليوم"
//                         minorTotal={item.sufficiencyInDays}
//                         icon="solar:user-rounded-bold"
//                         color="error" // red color for red items
//                         // colorName="#B71D18"
//                         chart={{
//                           series: item.sufficiencyInDaysPercent,
//                         }}
//                       />
//                     </Paper>
//                   </Grid>
//                 ))}
//               </Grid>
//             )}

//             {/* Brown (orange) items in one row */}
//             {brownItems.length > 0 && (
//               <Grid container spacing={3} sx={{ mb: 3 }}>
//                 {brownItems.map((item) => (
//                   <Grid item xs={12} sm={6} md={3} key={item.name}>
//                     <Paper
//                       variant="outlined"
//                       sx={{
//                         textAlign: 'center',
//                         backgroundColor: '#B76E00',
//                         boxShadow:
//                           'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
//                       }}
//                     >
//                       <Typography
//                         variant="h5"
//                         style={{
//                           marginRight: '20px',
//                           marginTop: '10px',
//                           marginBottom: '20px',
//                           textAlign: 'right',
//                           color: '#ffffff',
//                         }}
//                       >
//                         <NotificationAdd
//                           sx={{
//                             color: '#fff',
//                             fontSize: 20,
//                             marginRight: 0.5,
//                           }}
//                         />
//                         {item.name}
//                       </Typography>
//                       <BarleyAppWidget
//                         mainTitle="المخزون"
//                         mainTotal={item.stockQty}
//                         salesTitle="المبيعات"
//                         salesTotal={item.salesQty}
//                         salesDaysTitle="عدد أيام البيع"
//                         salesDaysTotal={item.uniqueSalesDays}
//                         subTitle="متوسط البيع اليومي"
//                         subTotal={item.salesAverage}
//                         minorTitle="كفاية المخزون باليوم"
//                         minorTotal={item.sufficiencyInDays}
//                         icon="solar:user-rounded-bold"
//                         color="warning" // orange color for brown items
//                         // colorName="#B76E00"
//                         chart={{
//                           series: item.sufficiencyInDaysPercent,
//                         }}
//                       />
//                     </Paper>
//                   </Grid>
//                 ))}
//               </Grid>
//             )}

//             {/* Green items in one row */}
//             {greenItems.length > 0 && (
//               <Grid container spacing={3} sx={{ mb: 3 }}>
//                 {greenItems.map((item) => (
//                   <Grid item xs={12} sm={6} md={3} key={item.name}>
//                     <Paper
//                       variant="outlined"
//                       sx={{
//                         textAlign: 'center',
//                         background: 'linear-gradient(to right, #2e7d32, #1b5e20)',
//                         boxShadow:
//                           'rgba(0, 0, 0, 0.4) 0px 2px 4px, rgba(0, 0, 0, 0.3) 0px 7px 13px -3px, rgba(0, 0, 0, 0.2) 0px -3px 0px inset',
//                       }}
//                     >
//                       <Typography
//                         variant="h5"
//                         style={{
//                           marginRight: '20px',
//                           marginTop: '10px',
//                           marginBottom: '20px',
//                           textAlign: 'right',
//                           color: '#ffffff',
//                         }}
//                       >
//                         <Verified
//                           sx={{
//                             color: '#fff',
//                             fontSize: 20,
//                             marginRight: 0.5,
//                           }}
//                         />
//                         {item.name}
//                       </Typography>
//                       <BarleyAppWidget
//                         mainTitle="المخزون"
//                         mainTotal={item.stockQty}
//                         salesTitle="المبيعات"
//                         salesTotal={item.salesQty}
//                         salesDaysTitle="عدد أيام البيع"
//                         salesDaysTotal={item.uniqueSalesDays}
//                         subTitle="متوسط البيع اليومي"
//                         subTotal={item.salesAverage}
//                         minorTitle="كفاية المخزون باليوم"
//                         minorTotal={item.sufficiencyInDays}
//                         icon="solar:user-rounded-bold"
//                         color="success" // green color for green items
//                         // colorName="#388E3C"
//                         chart={{
//                           series: item.sufficiencyInDaysPercent,
//                         }}
//                       />
//                     </Paper>
//                   </Grid>
//                 ))}
//               </Grid>
//             )}
//           </>
//         </CSSTransition>
//       </Box>
//     </Card>
//   );
// }
