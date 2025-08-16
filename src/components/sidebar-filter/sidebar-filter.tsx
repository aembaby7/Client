// import React, { useState } from 'react';
// import { Box, IconButton, Button } from '@mui/material';
// import SortIcon from '@mui/icons-material/Sort';
// import SearchIcon from '@mui/icons-material/Search';
// import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs';
// import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
// import Divider from '@mui/material/Divider';

// const filters = [
//   'الرياض',
//   'القصيم',
//   'الخرج',
//   'الجوف',
//   'تبوك',
//   'الرياض',
//   'القصيم',
//   'الخرج',
// ];

// function SidebarFilter() {
//   const [selectedDate, setSelectedDate] = useState(dayjs());

//   const handleFilterClick = (filterName: any) => {
//     console.log(`Filter clicked: ${filterName}`);
//     // i can add filter logic here based on my requirements
//   };

//   return (
//     <Box sx={{ padding: '10px', marginTop: '50px' }}>
//       <Divider sx={{ marginTop: '10px',marginBottom: '20px' }}>تصفية حسب التاريخ</Divider>
//       <LocalizationProvider dateAdapter={AdapterDayjs}>
//         <DatePicker label="تاريخ" value={selectedDate} onChange={(date) => setSelectedDate(date)} />
//       </LocalizationProvider>
//       <Button
//         variant="contained"
//         color="primary"
//         aria-label="search"
//         sx={{ marginTop: '10px', width: '100%' }}
//       >
//         <SearchIcon />
//       </Button>
//       <Divider sx={{ marginTop: '30px', marginBottom: '10px' }}>تصفية حسب الفروع</Divider>
//       {filters.map((filter, index) => (
//         <Button
//           key={index}
//           variant="outlined"
//           onClick={() => handleFilterClick(filter)}
//           sx={{ marginTop: '10px', marginLeft:'10px', marginRight:'10px',  width: '40%', textTransform: 'none' }}
//         >
//           {filter}
//         </Button>
//       ))}
//     </Box>
//   );
// }

// export default SidebarFilter;

// ============================================================
import React, { useState } from 'react';
import { Box, IconButton, Button, Typography } from '@mui/material';
import SortIcon from '@mui/icons-material/Sort';
import SearchIcon from '@mui/icons-material/Search';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
// import dayjs from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
// import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import Divider from '@mui/material/Divider';
import { date } from 'yup';

const filters = ['الرياض', 'القصيم', 'الخرج', 'الجوف', 'تبوك', 'حائل', ' الدواسر', 'الأحساء'];

function SidebarFilter() {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedFilter, setSelectedFilter] = useState();

  const handleFilterClick = (filterName: any) => {
    setSelectedFilter(filterName);
  };

  return (
    <Box sx={{ padding: '10px', marginTop: '50px' }}>
      <Divider sx={{ marginTop: '10px', marginBottom: '20px' }}>تصفية حسب التاريخ</Divider>
      <DatePicker label="تاريخ" value={selectedDate} onChange={(date) => setSelectedDate(date!)} />
      <Button
        variant="contained"
        color="primary"
        aria-label="search"
        sx={{ marginTop: '10px', width: '100%' }}
      >
        <SearchIcon />
      </Button>
      <Divider sx={{ marginTop: '30px', marginBottom: '10px' }}>تصفية حسب الفروع</Divider>
      {filters.map((filter, index) => (
        <Button
          key={index}
          variant={selectedFilter === filter ? 'contained' : 'outlined'}
          onClick={() => handleFilterClick(filter)}
          sx={{
            marginTop: '10px',
            marginLeft: '10px',
            marginRight: '10px',
            width: '40%',
            textTransform: 'none',
          }}
        >
          {filter}
        </Button>
      ))}
    </Box>
  );
}

export default SidebarFilter;
