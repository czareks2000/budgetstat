import './App.css'

import Toolbar from '@mui/material/Toolbar';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';

import Menu from './menu/Menu';
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Login from '../../pages/login/Login';
import { useEffect } from 'react';
import { useStore } from '../stores/store';
import Loading from '../../components/Loading';
import { theme } from './Theme';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'

const drawerWidth = 288;

export default observer(function App() {
  const location = useLocation();
  const {commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser();
    } else {
      commonStore.setApploaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded) return <Loading />

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <ScrollRestoration/>
        {location.pathname === '/' 
        ? 
          <Login /> 
        : (
          <Box sx={{ display: 'flex' }}>
            <Menu appName='BudgetStat' drawerWidth={drawerWidth}/>

            <Box
              component="main"
              sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
              <Toolbar />
              <Outlet/>
            </Box>

          </Box>
        )}
      </LocalizationProvider>
    </ThemeProvider>
  );
})
