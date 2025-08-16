import React from 'react';

import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemButton from '@mui/material/ListItemButton'; // Make sure this line is included
import { styled } from '@mui/material/styles';
import HomeIcon from '@mui/icons-material/Home';
import DraftsIcon from '@mui/icons-material/Drafts';
import SecurityIcon from '@mui/icons-material/Security';
import ContactMailIcon from '@mui/icons-material/ContactMail';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import { Avatar, Grid, Link, Typography } from '@mui/material';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ChatIcon from '@mui/icons-material/Chat';
import DesktopWindowsIcon from '@mui/icons-material/DesktopWindows';
import PaidIcon from '@mui/icons-material/Paid';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';

// Centralized style for teal color
const tealColorStyle = { color: 'teal' };
const logoColor = { color: '#22C55E' };

// Styled component for ListItemIcon with teal color
const TealListItemIcon = styled(ListItemIcon)(() => tealColorStyle);

export default function SideLinks() {
  return (
    <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
      {/* <Box sx={{ bgcolor: '#fff', p: 4, boxShadow: 3 }}> */}
      {/* User Section */}
      <Grid container alignItems="center" spacing={2} mb={4}>
        <Grid item>
          <PeopleAltIcon sx={{ ...logoColor }} />
        </Grid>
        <Grid item xs>
          <Typography variant="body1">أفراد, قطاع خاص</Typography>
          <Typography variant="caption" color="text.secondary">
            الفئة المستهدفة
          </Typography>
        </Grid>
      </Grid>

      {/* Time Section */}
      <Grid container alignItems="center" spacing={2} mb={4}>
        <Grid item>
          <AccessTimeIcon sx={{ ...logoColor }} />
        </Grid>
        <Grid item xs>
          <Typography variant="body1">0.0 يوم</Typography>
          <Typography variant="caption" color="text.secondary">
            وقت تنفيذ الخدمة
          </Typography>
        </Grid>
      </Grid>

      {/* Language Section */}
      <Grid container alignItems="center" spacing={2} mb={4}>
        <Grid item>
          <ChatIcon sx={{ ...logoColor }} />
        </Grid>
        <Grid item xs>
          <Typography variant="body1">العربية والإنجليزية</Typography>
          <Typography variant="caption" color="text.secondary">
            الخدمة مقدمة باللغة
          </Typography>
        </Grid>
      </Grid>

      {/* Channels Section */}
      <Grid container alignItems="center" spacing={2} mb={4}>
        <Grid item>
          <DesktopWindowsIcon sx={{ ...logoColor }} />
        </Grid>
        <Grid item xs>
          <Typography variant="body1">بوابة إلكترونية - واتساب أعمال</Typography>
          <Typography variant="caption" color="text.secondary">
            قنوات تقديم الخدمة
          </Typography>
        </Grid>
      </Grid>

      {/* Cost Section */}
      <Grid container alignItems="center" spacing={2} mb={4}>
        <Grid item>
          <PaidIcon sx={{ ...logoColor }} />
        </Grid>
        <Grid item xs>
          <Typography variant="body1">مجاني</Typography>
          <Typography variant="caption" color="text.secondary">
            رسوم الخدمة
          </Typography>
        </Grid>
      </Grid>

      {/* FAQ Link */}
      <Box borderTop={1} borderColor="grey.300" pt={2} mt={4}>
        <Typography fontWeight="bold" mb={2}>
          الأسئلة الشائعة
        </Typography>
        <Link href="/FAQ">صفحة الأسئلة الشائعة</Link>
      </Box>

      {/* Customer Support */}
      <Typography fontWeight="bold" pt={4}>
        خدمة العملاء
      </Typography>
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={2}>
          <PhoneIcon sx={{ ...logoColor }} />
        </Grid>
        <Grid item xs={10}>
          <Typography fontWeight="bold">رقم الهاتف</Typography>
          <Link href="#" color="text.secondary">
            8002472220
          </Link>
        </Grid>
      </Grid>
      <Grid container spacing={2} mb={2} alignItems="center">
        <Grid item xs={2}>
          <EmailIcon sx={{ ...logoColor }} />
        </Grid>
        <Grid item xs={10}>
          <Typography fontWeight="bold">البريد الإلكتروني</Typography>
          <Link href="#" color="text.secondary">
            support@gfsa.gov.sa
          </Link>
        </Grid>
      </Grid>
      <Divider />

      <nav aria-label="main mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#">
              <TealListItemIcon>
                <HomeIcon />
              </TealListItemIcon>
              <ListItemText primary="الرئيسية" />
            </ListItemButton>
          </ListItem>
          {false && (
            <>
              <ListItem disablePadding>
                <ListItemButton component="a" href="#">
                  <TealListItemIcon>
                    <AccountCircleIcon />
                  </TealListItemIcon>
                  <ListItemText primary="الملف الشخصي" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="#">
                  <TealListItemIcon>
                    <ContactMailIcon />
                  </TealListItemIcon>
                  <ListItemText primary="جهات الاتصال" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="#">
                  <TealListItemIcon>
                    <DraftsIcon />
                  </TealListItemIcon>
                  <ListItemText primary="المسودات" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
        <Divider />
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#">
              <TealListItemIcon>
                <CalendarTodayIcon />
              </TealListItemIcon>
              <ListItemText primary="التقويم" />
            </ListItemButton>
          </ListItem>
          {false && (
            <>
              {' '}
              <ListItem disablePadding>
                <ListItemButton component="a" href="#">
                  <TealListItemIcon>
                    <SecurityIcon />
                  </TealListItemIcon>
                  <ListItemText primary="الأمان" />
                </ListItemButton>
              </ListItem>
              <ListItem disablePadding>
                <ListItemButton component="a" href="#">
                  <TealListItemIcon>
                    <DraftsIcon />
                  </TealListItemIcon>
                  <ListItemText primary="رسائل مؤرشفة" />
                </ListItemButton>
              </ListItem>
            </>
          )}
        </List>
      </nav>
      <Divider />
      <nav aria-label="secondary mailbox folders">
        <List>
          <ListItem disablePadding>
            <ListItemButton component="a" href="#">
              <ListItemText primary="طلب المساعدة" />
            </ListItemButton>
          </ListItem>
        </List>
      </nav>
    </Box>
  );
}
