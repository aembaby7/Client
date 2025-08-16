import { m } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';

import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Tabs from '@mui/material/Tabs';
import List from '@mui/material/List';
import Stack from '@mui/material/Stack';
import Badge from '@mui/material/Badge';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';

import { useBoolean } from 'src/hooks/use-boolean';
import { useResponsive } from 'src/hooks/use-responsive';

import { _mock, _notifications } from 'src/_mock';

import Label from 'src/components/label';
import Iconify from 'src/components/iconify';
import Scrollbar from 'src/components/scrollbar';
import { varHover } from 'src/components/animate';

import NotificationItem from './notification-item';
import axios, { endpoints } from 'src/utils/axios';
import { useAuthContext } from 'src/auth/hooks';
// import { _mock } from './_mock';

// ----------------------------------------------------------------------
type TabItem = {
  value: string;
  label: string;
  count: number;
};
type Nofification = {
  id: number;
  tagId: number;
  isUnRead: boolean;
  isArchived: boolean;
  title: string;
  addDate: Date;
};

export default function NotificationsPopover() {
  const drawer = useBoolean();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const smUp = useResponsive('up', 'sm');
  const { user } = useAuthContext();

  const [tabs, setTabs] = useState<TabItem[]>([
    {
      value: 'all',
      label: 'الكل',
      count: 0,
    },
    {
      value: 'unread',
      label: 'غير مقروء',
      count: 0,
    },
    {
      value: 'archived',
      label: 'أرشيف',
      count: 0,
    },
  ]);
  const [notifications, setNotifications] = useState<Nofification[]>([]);
  const [selectedNotifications, setSelectedNotifications] = useState<Nofification[]>([]);

  useEffect(() => {
    async function fetchMyAPI() {
      let res: any = await axios
        .post(endpoints.contact.getNotificationList, {
          idNumber: user?.idNumber,
        })
        .then((res) => {
          // tabList[2].count = res.data.result.tabs[2].count; // Problem: mutates list[0]
          setIsLoading(false);
          setNotifications(res.data.result.notificationList);
          setSelectedNotifications(res.data.result.notificationList);
          setTabs(res.data.result.tabs);
        });
    }
    fetchMyAPI();
  }, []);

  const [currentTab, setCurrentTab] = useState('all');

  const handleChangeTab = useCallback((event: React.SyntheticEvent, newValue: string) => {
    setCurrentTab(newValue);
  }, []);

  const totalUnRead = notifications.filter((item) => item.isUnRead === true).length;

  const handleMarkAllAsRead = async () => {
    setNotifications(
      notifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );

    setSelectedNotifications(
      selectedNotifications.map((notification) => ({
        ...notification,
        isUnRead: false,
      }))
    );
    const tabs_ = tabs;
    tabs_[1].count = 0;
    setTabs(tabs_);

    let res = await axios.post(endpoints.contact.updateIsUnRead, {
      idNumber: user?.idNumber,
    });
    const { isSuccess, result, errorMessages, httpStatusCode } = res.data;
    if (isSuccess) {
      setNotifications(
        notifications.map((notification) => ({
          ...notification,
          isUnRead: false,
        }))
      );
    }
  };

  const renderHead = (
    <Stack direction="row" alignItems="center" sx={{ py: 2, pl: 2.5, pr: 1, minHeight: 68 }}>
      <Typography variant="h6" sx={{ flexGrow: 1 }}>
        تنويهات
      </Typography>

      {!!totalUnRead && (
        <Tooltip title="تغيير حالة الكل الى مقروء">
          <IconButton color="primary" onClick={handleMarkAllAsRead}>
            <Iconify icon="eva:done-all-fill" />
          </IconButton>
        </Tooltip>
      )}

      {!smUp && (
        <IconButton onClick={drawer.onFalse}>
          <Iconify icon="mingcute:close-line" />
        </IconButton>
      )}
    </Stack>
  );

  const renderTabs = (
    <Tabs value={currentTab} onChange={handleChangeTab}>
      {tabs.map((tab) => (
        <Tab
          key={tab.value}
          iconPosition="end"
          value={tab.value}
          label={tab.label}
          icon={
            <Label
              variant={((tab.value === 'all' || tab.value === currentTab) && 'filled') || 'soft'}
              color={
                (tab.value === 'unread' && 'info') ||
                (tab.value === 'archived' && 'success') ||
                'default'
              }
            >
              {tab.count}
            </Label>
          }
          onClick={() => {
            switch (tab.value) {
              case 'all':
                setSelectedNotifications(notifications);
                break;
              case 'unread':
                setSelectedNotifications(notifications.filter((item) => item.isUnRead == true));
                break;
              case 'archived':
                setSelectedNotifications(notifications.filter((item) => item.isArchived == true));
                break;
            }
          }}
          sx={{
            '&:not(:last-of-type)': {
              mr: 3,
            },
          }}
        />
      ))}
    </Tabs>
  );

  const renderList = (
    <Scrollbar>
      <List disablePadding>
        {selectedNotifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={{
              id: notification.id.toString(),
              isUnRead: notification.isUnRead,
              createdAt: notification.addDate,
              title: notification.title,
              category: '',
              type: '',
              avatarUrl: _mock.image.avatar(1),
            }}
          />
        ))}
      </List>
    </Scrollbar>
  );

  return (
    <>
      <IconButton
        component={m.button}
        whileTap="tap"
        whileHover="hover"
        variants={varHover(1.05)}
        color={drawer.value ? 'primary' : 'default'}
        onClick={drawer.onTrue}
      >
        <Badge badgeContent={totalUnRead} color="error">
          <Iconify icon="solar:bell-bing-bold-duotone" width={24} />
        </Badge>
      </IconButton>

      <Drawer
        open={drawer.value}
        onClose={drawer.onFalse}
        anchor="right"
        slotProps={{
          backdrop: { invisible: true },
        }}
        PaperProps={{
          sx: { width: 1, maxWidth: 420 },
        }}
      >
        {renderHead}

        <Divider />

        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ pl: 2.5, pr: 1 }}
        >
          {renderTabs}
          <IconButton onClick={handleMarkAllAsRead}>
            <Iconify icon="solar:settings-bold-duotone" />
          </IconButton>
        </Stack>

        <Divider />

        {renderList}

        <Box sx={{ p: 1 }}>
          <Button fullWidth size="large">
            عرض الكل
          </Button>
        </Box>
      </Drawer>
    </>
  );
}
