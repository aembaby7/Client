'use client';

import React from 'react';
import Link from 'next/link';

import Tab from '@mui/material/Tab';
import List from '@mui/material/List';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import TabContext from '@mui/lab/TabContext';
import ListItem from '@mui/material/ListItem';
import HomeIcon from '@mui/icons-material/Home';
import SendIcon from '@mui/icons-material/Send';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { Twitter, Facebook, LinkedIn, Instagram } from '@mui/icons-material';
import {
  Alert,
  Grid,
  MenuItem,
  Rating,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { Box, Paper, AppBar, Button, Toolbar, Container, Typography } from '@mui/material';

import SideLinks from './sidelinks';
import SocialMediaLinks from '../../components/social-media';
import { useResponsive } from 'src/hooks/use-responsive';

export default function ServicesPage() {
  const smUp = useResponsive('up', 'sm');
  const [value, setValue] = React.useState('1');

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', direction: 'ltr' }}>
      <AppBar
        position="fixed"
        color="default"
        elevation={0}
        sx={{
          backgroundColor: '#fff',
          boxShadow:
            'rgba(50, 50, 93, 0.25) 0px 13px 27px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px',
        }}
      >
        <Container maxWidth="lg">
          <Toolbar>
            <Box
              component="img"
              src="/logo/gfsaLogoB.png"
              alt="Logo"
              sx={{
                height: '70px',
                marginRight: 'auto',
                animation: 'slideInTop 0.5s ease-out forwards',
                '@keyframes slideInTop': {
                  '0%': {
                    transform: 'translateY(-100%)', // Starts above the screen
                    opacity: 0,
                  },
                  '100%': {
                    transform: 'translateY(0)', // Ends at its natural position
                    opacity: 1,
                  },
                },
              }}
            />
            <Box
              sx={{
                display: { xs: 'none', md: 'flex' },
              }}
            >
              <Link href="/" passHref>
                <Button sx={{ color: 'teal', margin: '2px' }}>
                  <Stack direction="column" alignItems="center">
                    <HomeIcon />
                    الرئيسية
                  </Stack>
                </Button>
              </Link>
              <Link href="/dashboard" passHref>
                <Button sx={{ color: 'teal', margin: '2px' }}>
                  <Stack direction="column" alignItems="center">
                    <AccountCircleIcon />
                    تسجيل الدخول
                  </Stack>
                </Button>
              </Link>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Box
        sx={{
          width: '100%',
          height: 500, // Adjust the height as necessary
          // backgroundImage: 'url("/assets/background/mahsoli-banner.png")',
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.2), rgba(0, 0, 0, 0.2)), url("/assets/background/wheatbanner.jpg")',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          // To center align the heading and subheading on top of image
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#fff',
        }}
      >
        {/* Content on top of the background image if needed */}
        <Typography
          variant="h3"
          component="h2"
          gutterBottom
          align="center"
          sx={{
            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.9)', // Grey text shadow
          }}
        ></Typography>
        <Typography variant="subtitle1" gutterBottom align="center"></Typography>
        <Link href="/dashboard" passHref>
          <Button
            variant="contained"
            size="large"
            color="success"
            sx={{
              mt: 3,
              px: 5,
              boxShadow: 'rgba(0, 0, 0, 0.2) 0px 1px 3px, rgba(0, 0, 0, 0.2) 0px 1px 2px',
            }}
            endIcon={<SendIcon sx={{ transform: 'scaleX(-1)' }} />}
          >
            بدء الخدمة
          </Button>
        </Link>
      </Box>

      {/* Main content area for service description */}
      <Box sx={{ backgroundColor: '#f5f5f5', py: 8, color: '#58585a' }}>
        <Container maxWidth="xl" sx={{ my: 4, marginTop: -20 }}>
          <Box
            sx={{
              backgroundColor: '#fff',
              height: '100%',
              // borderRadius: '20px 20px 0 0',
              borderRadius: '20px',
              boxShadow: 'rgba(0, 0, 0, 0.12) 0px 1px 3px, rgba(0, 0, 0, 0.24) 0px 1px 2px',
              padding: 5, // Adding some padding inside the box
            }}
          >
            <Grid container>
              {/* Left Column */}
              <Grid item xs>
                {/* Content of the right column */}
                <Box sx={{ width: '100%', typography: 'body1' }}>
                  <TabContext value={value}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                      <TabList onChange={handleChange} aria-label="service description">
                        <Tab label="شروط الخدمة" value="1" />
                      </TabList>
                    </Box>
                    <TabPanel value="1">
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <ArrowBackIosNewIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="وجود رخصة زراعة القمح المحلي للموسم 2024 الصادرة من قبل وزارة الزراعة." />
                        </ListItem>

                        <ListItem>
                          <ListItemIcon>
                            <ArrowBackIosNewIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="اختيار مقر التوريد يتم وفق الموقع الجغرافي المحدد بالرخصة." />
                        </ListItem>
                      </List>
                    </TabPanel>
                    <TabPanel value="2">
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <ArrowBackIosNewIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="الإلتزام بتوريد شاحنات القمح وفق المواصفات الفنية الموضحة أدناه:." />
                        </ListItem>
                        <ListItem>
                          <TableContainer component={Paper}>
                            <Table size="small" aria-label="a dense table">
                              <TableHead>
                                <TableRow>
                                  {smUp && <TableCell style={{ textAlign: 'center' }}>م</TableCell>}

                                  <TableCell style={{ textAlign: 'center' }}>البيان</TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>المواصفات</TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                <TableRow
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  {smUp && <TableCell style={{ textAlign: 'center' }}>1</TableCell>}

                                  <TableCell>نسبة الرطوبة (الحد الأقصى) %</TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>
                                    <b>12</b>
                                  </TableCell>
                                </TableRow>
                                <TableRow
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  {smUp && <TableCell style={{ textAlign: 'center' }}>2</TableCell>}
                                  <TableCell>نسبة البروتين (الحد الأدنى) %</TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>
                                    <b>10</b>
                                  </TableCell>
                                </TableRow>
                                <TableRow
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  {smUp && <TableCell style={{ textAlign: 'center' }}>3</TableCell>}
                                  <TableCell>الوزن النوعي (الحد الأدنى) كجم/ هيكتولتر</TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>
                                    <b>67</b>
                                  </TableCell>
                                </TableRow>
                                <TableRow
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  {smUp && <TableCell style={{ textAlign: 'center' }}>4</TableCell>}
                                  <TableCell>الجلوتين (الحد الأدنى) %</TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>
                                    <b>24</b>
                                  </TableCell>
                                </TableRow>

                                <TableRow
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  {smUp && <TableCell style={{ textAlign: 'center' }}>5</TableCell>}
                                  <TableCell>
                                    الشوائب (الحد الأقصى) % وتشمل:
                                    <ul>
                                      <li>الحبوب الضامرة و المكسورة</li>
                                      <li>المواد الغريبة</li>
                                      <li>الحبوب المصابة</li>
                                      <li>الحبوب التالفة بالحشرات</li>
                                      <li>الحبوب التالفة بالحرارة</li>
                                      <li>الحبوب غير تامة النضح</li>
                                      <li>الحبوب المنبتة</li>
                                      <li>حبوب الشعير</li>
                                    </ul>
                                  </TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>
                                    <b>12</b>
                                  </TableCell>
                                </TableRow>

                                <TableRow
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  {smUp && <TableCell style={{ textAlign: 'center' }}>6</TableCell>}
                                  <TableCell>نسبة الأرجوت (الحد الأقصى) %</TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>
                                    <b>0.05</b>
                                  </TableCell>
                                </TableRow>
                                <TableRow
                                  sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                                >
                                  {smUp && <TableCell style={{ textAlign: 'center' }}>7</TableCell>}
                                  <TableCell>
                                    الحبوب المصابة بالحشرات الحية،المتعفنة،الملونة بالمطهرات الفطرية
                                    (تقاوي القمح).
                                  </TableCell>
                                  <TableCell style={{ textAlign: 'center' }}>
                                    <b>لا يوجد</b>
                                  </TableCell>
                                </TableRow>
                              </TableBody>
                            </Table>
                          </TableContainer>
                          {/* <ListItemText
                            primary="توريد القمح حسب المواصفات الفنية المعتمدة."
                            secondary={
                              <Link
                                target="_blank"
                                href="https://cp.gfsa.gov.sa/Files/common/DomesticWheatSpecificationAsMinimum.pdf"
                                color="text.secondary"
                              >
                                رابط المواصفات الفنية
                              </Link>
                            }
                          /> */}
                        </ListItem>
                      </List>
                    </TabPanel>
                    <TabPanel value="3">
                      <List>
                        <ListItem>
                          <ListItemIcon>
                            <ArrowBackIosNewIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="التسجيل ببوابة سجل (وزارة الزراعة) و الحصول على الشهادة الزراعية" />
                        </ListItem>
                        <ListItem>
                          <ListItemIcon>
                            <ArrowBackIosNewIcon fontSize="small" />
                          </ListItemIcon>
                          <ListItemText primary="صورة من الهوية سارية الصلاحية" />
                        </ListItem>
                      </List>
                    </TabPanel>
                  </TabContext>
                </Box>
              </Grid>
              {/* Right Column */}
              <Grid
                item
                sx={{
                  width: 300,
                  padding: '20px',
                  height: '100%',
                  boxSizing: 'border-box',
                  '@media screen and (min-width: 960px)': {
                    // Applies only for screens wider than 960px
                    borderLeft: '2px solid #f5f5f5',
                    // m: 1,
                  },
                }}
              >
                {/* side links  */}
                <SideLinks />
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
      {/* </Box> */}

      {/* Footer */}
      <Paper
        sx={{ p: 3, mt: 'auto', backgroundColor: 'teal', borderRadius: '0', marginTop: 0 }}
        component="footer"
      >
        <Container maxWidth="lg">
          <Grid container spacing={5}>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                الأقسام
              </Typography>
              <Link href="#" className="tealFooterLink">
                الرئيسية
              </Link>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom></Typography>
            </Grid>
            <Grid item xs={12} sm={4}>
              <Typography variant="h6" color="text.primary" gutterBottom>
                تابعونا
              </Typography>
              <Box>
                <SocialMediaLinks />
              </Box>
            </Grid>
          </Grid>
          <Typography
            variant="subtitle1"
            align="center"
            color="text.secondary"
            component="p"
            sx={{ mt: 3, color: 'lightgrey' }}
          >
            © الهيئة العامة للأمن الغذائي 2024 | تصميم وتطوير الإدارة العامة لتقنية المعلومات
          </Typography>
        </Container>
      </Paper>
    </Box>
  );
}
