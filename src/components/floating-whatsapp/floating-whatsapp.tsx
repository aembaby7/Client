'use client';

import { useState, useEffect } from 'react';
import { useAuthContext } from 'src/auth/hooks';
import { useTheme } from '@mui/material/styles';
import { Fab, Tooltip, IconButton } from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import ContactPhoneOutlinedIcon from '@mui/icons-material/ContactPhoneOutlined';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import ContactUs from './contact';

const FloatingWhatsApp = () => {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);

  useEffect(() => {
    const startTimer = setTimeout(() => {
      setShowHelpTooltip(true);
      const endTimer = setTimeout(() => {
        setShowHelpTooltip(false);
      }, 5000);
      return () => clearTimeout(endTimer);
    }, 5000);
    return () => clearTimeout(startTimer);
  }, []);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const phoneNumber = '966556085234';
  const message = encodeURIComponent('واتساب محصولي، لخدمة مزارعي القمح المحلي');
  const xUrl = 'https://twitter.com/GFSA_KSA';

  return (
    <Tooltip open={showHelpTooltip} title="مساعدة" placement="top" arrow>
      <div
        style={{
          position: 'fixed',
          bottom: 10,
          left: 10,
          padding: '15px',
          backgroundColor: '#f5f5f5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '10px',
          borderRadius: '10px',
        }}
      >
        <Tooltip title="تابعونا على X" placement="right">
          <Fab
            aria-label="follow-x"
            sx={{
              backgroundColor: '#fff',
              zIndex: 1000,
              height: 42,
              width: 42,
            }}
            href={xUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/logo/x-icon.png" alt="X Icon" style={{ width: '20px', height: '20px' }} />
          </Fab>
        </Tooltip>

        <Tooltip title="راسلنا" placement="right">
          <Fab
            onClick={handleClickOpen}
            aria-label="contact-phone"
            sx={{
              backgroundColor: 'orange',
              zIndex: 1000,
              height: 42,
              width: 42,
            }}
          >
            <ContactPhoneOutlinedIcon />
          </Fab>
        </Tooltip>
        <Tooltip title="واتساب محصولي" placement="right">
          <Fab
            color="primary"
            aria-label="contact-whatsapp"
            sx={{
              backgroundColor: 'teal',
              zIndex: 1000,
              height: 42,
              width: 42,
            }}
            href={`https://api.whatsapp.com/send?phone=${phoneNumber}&text=${message}`}
            target="_blank"
            rel="noopener noreferrer"
          >
            <WhatsAppIcon />
          </Fab>
        </Tooltip>
        <Dialog
          fullWidth
          maxWidth="xs"
          open={open}
          onClose={handleClose}
          transitionDuration={{
            enter: theme.transitions.duration.shortest,
            exit: theme.transitions.duration.shortest - 80,
          }}
        >
          <DialogTitle sx={{ minHeight: 76 }}>راسلنا</DialogTitle>
          <ContactUs />
        </Dialog>
      </div>
    </Tooltip>
  );
};

export default FloatingWhatsApp;
