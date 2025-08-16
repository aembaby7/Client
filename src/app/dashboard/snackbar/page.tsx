"use client"
import { SnackbarProvider, enqueueSnackbar } from 'notistack';
import SnackbarView from 'src/sections/ex/snackbar-view';

export default function SnackbarPage() {
  return ( <SnackbarView/>
    // <div>
    //   <SnackbarProvider />
    //   <button onClick={() => enqueueSnackbar('That was easy!')}>Show snackbar</button>
    // </div>
  );
}
