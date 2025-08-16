'use client';

import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import Switch from '@mui/material/Switch';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import { useTheme } from '@mui/material/styles';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Unstable_Grid2';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import InputAdornment from '@mui/material/InputAdornment';

import { paths } from 'src/routes/paths';

import { MotivationIllustration } from 'src/assets/illustrations';
import {
  _mock,
  _ecommerceNewProducts,
  _ecommerceBestSalesman,
  _ecommerceSalesOverview,
  _ecommerceLatestProducts,
} from 'src/_mock';

import Iconify from 'src/components/iconify';
import Walktour, { useWalktour } from 'src/components/walktour';
import CustomBreadcrumbs from 'src/components/custom-breadcrumbs';

import ComponentHero from 'src/sections/_examples/component-hero';
// import EcommerceWelcome from 'src/sections/overview/e-commerce/ecommerce-welcome';
// import EcommerceNewProducts from 'src/sections/overview/e-commerce/ecommerce-new-products';
// import EcommerceYearlySales from 'src/sections/overview/e-commerce/ecommerce-yearly-sales';
// import EcommerceBestSalesman from 'src/sections/overview/e-commerce/ecommerce-best-salesman';
// import EcommerceSaleByGender from 'src/sections/overview/e-commerce/ecommerce-sale-by-gender';
// import EcommerceSalesOverview from 'src/sections/overview/e-commerce/ecommerce-sales-overview';
// import EcommerceWidgetSummary from 'src/sections/overview/e-commerce/ecommerce-widget-summary';
// import EcommerceLatestProducts from 'src/sections/overview/e-commerce/ecommerce-latest-products';
// import EcommerceCurrentBalance from 'src/sections/overview/e-commerce/ecommerce-current-balance';

// ----------------------------------------------------------------------

export default function WalktourView() {
  const theme = useTheme();

  const walktour = useWalktour({
    defaultRun: true,
    showProgress: true,
    steps: [
      {
        target: '#demo__1',
        title: 'Step 1',
        disableBeacon: true,
        content: (
          <Typography sx={{ color: 'text.secondary' }}>
            Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin urna
            dolor sagittis lacus.
          </Typography>
        ),
      },
      {
        target: '#demo__2',
        title: 'Step 2',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>
              Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin
              urna dolor sagittis lacus.
            </Typography>
            <Box component="img" alt="cover" src={_mock.image.cover(3)} sx={{ borderRadius: 2 }} />
          </Stack>
        ),
      },
      {
        target: '#demo__3',
        title: 'Step 3',
        placement: 'bottom',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>Weekly magic on your inbox</Typography>
            <TextField
              variant="filled"
              fullWidth
              label="Email"
              placeholder="example@gmail.com"
              InputLabelProps={{ shrink: true }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <Button color="inherit" sx={{ mr: -0.75 }}>
                      Send
                    </Button>
                  </InputAdornment>
                ),
              }}
            />
          </Stack>
        ),
      },
      {
        target: '#demo__4',
        title: 'Step 4',
        placement: 'left',
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.secondary' }}>
              Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin
              urna dolor sagittis lacus.
            </Typography>
            <Stack
              component={Paper}
              variant="outlined"
              divider={<Divider sx={{ borderStyle: 'dashed' }} />}
            >
              {[
                { label: 'Wi-Fi', icon: 'solar:home-wifi-bold-duotone', defaultChecked: true },
                {
                  label: 'Bluetooth',
                  icon: 'solar:bluetooth-square-bold-duotone',
                  defaultChecked: true,
                },
                { label: 'Airbuds', icon: 'solar:airbuds-bold-duotone', defaultChecked: false },
                { label: 'Alarm', icon: 'solar:alarm-bold-duotone', defaultChecked: false },
              ].map((option) => (
                <ListItem key={option.label}>
                  <Iconify width={26} icon={option.icon} sx={{ color: 'text.secondary', mr: 2 }} />
                  <Box
                    component="span"
                    id={`switch-list-label-${option.label}`}
                    sx={{ typography: 'subtitle2', flexGrow: 1 }}
                  >
                    {option.label}
                  </Box>
                  <Switch
                    color="default"
                    defaultChecked={option.defaultChecked}
                    edge="end"
                    inputProps={{
                      'aria-labelledby': `switch-list-label-${option.label}`,
                    }}
                  />
                </ListItem>
              ))}
            </Stack>
          </Stack>
        ),
      },
      {
        target: '#demo__5',
        title: 'Step 5',
        placement: 'left',
        showProgress: false,
        styles: {
          options: {
            arrowColor: theme.palette.grey[900],
          },
          tooltip: {
            width: 480,
            backgroundColor: theme.palette.grey[900],
          },
          tooltipTitle: {
            color: theme.palette.common.white,
          },
          buttonBack: {
            color: theme.palette.common.white,
          },
          buttonNext: {
            marginLeft: theme.spacing(1.25),
            color: theme.palette.primary.contrastText,
            backgroundColor: theme.palette.primary.main,
          },
        },
        content: (
          <Stack spacing={3}>
            <Typography sx={{ color: 'text.disabled' }}>
              Aenean posuere, tortor sed cursus feugiat, nunc augue blandit nunc, eu sollicitudin
              urna dolor sagittis lacus.
            </Typography>
            <Box
              sx={{
                gap: 1,
                display: 'grid',
                gridTemplateColumns: 'repeat(3, 1fr)',
              }}
            >
              {[...Array(6)].map((_, index) => (
                <Box
                  key={index}
                  component="img"
                  alt="cover"
                  src={_mock.image.cover(index)}
                  sx={{ borderRadius: 1 }}
                />
              ))}
            </Box>
          </Stack>
        ),
      },
    ],
  });

  return (
    <>
      <Walktour
        continuous
        showProgress
        showSkipButton
        disableOverlayClose
        steps={walktour.steps}
        run={walktour.run}
        callback={walktour.onCallback}
        getHelpers={walktour.setHelpers}
        scrollDuration={500}
      />

      <ComponentHero>
        <CustomBreadcrumbs
          heading="Walktour"
          links={[
            {
              name: 'Components',
              href: paths.home.account.basicInfo,
            },
            { name: 'Walktour' },
          ]}
          moreLink={['https://docs.react-joyride.com/']}
        />
      </ComponentHero>

      <Container sx={{ my: 10 }}>
        <Stack alignItems="flex-end" sx={{ mb: 5 }}>
          <Button
            size="large"
            variant="outlined"
            onClick={() => window.location.reload()}
            startIcon={<Iconify icon="solar:restart-bold" />}
          >
            Reload
          </Button>
        </Stack>

        <Grid container spacing={3}>
          <Grid xs={12} md={8}>
            1
          </Grid>

          <Grid xs={12} md={4}>
            2
          </Grid>

          <Grid xs={12} md={4}>
            3
          </Grid>

          <Grid xs={12} md={4}>
            4
          </Grid>

          <Grid xs={12} md={4}>
            5
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            6
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            6
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            7
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            8
          </Grid>

          <Grid xs={12} md={6} lg={8}>
            9
          </Grid>

          <Grid xs={12} md={6} lg={4}>
            10
          </Grid>
        </Grid>
      </Container>
    </>
  );
}
