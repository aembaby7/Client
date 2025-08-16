'use client';

import {
  Alert,
  Button,
  CardActions,
  Collapse,
  FormControl,
  IconButtonProps,
  InputLabel,
  ListItemIcon,
  OutlinedInput,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableRow,
} from '@mui/material';

export default function DownloadPage() {
  const onButton2024Click = () => {
    // using Java Script method to get PDF file
    fetch('/All_2024.pdf').then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);

        // Setting various property values
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = 'All_2024.pdf';
        alink.click();
      });
    });
  };

  const onButton2023Click = () => {
    // using Java Script method to get PDF file
    fetch('/All_2023.pdf').then((response) => {
      response.blob().then((blob) => {
        // Creating new object of PDF file
        const fileURL = window.URL.createObjectURL(blob);

        // Setting various property values
        let alink = document.createElement('a');
        alink.href = fileURL;
        alink.download = 'All_2023.pdf';
        alink.click();
      });
    });
  };

  return (
    <>
      <br />
      <br />

      <Button color="inherit" variant="outlined" size="large" onClick={onButton2024Click}>
        تحميل ملف لوحة بيانات جميع شركات المطاحن / النصف الأول من 2024
      </Button>
      <br />
      <br />
      <Button color="inherit" variant="outlined" size="large" onClick={onButton2023Click}>
        تحميل ملف لوحة بيانات جميع شركات المطاحن / 2023
      </Button>
    </>
  );
}
