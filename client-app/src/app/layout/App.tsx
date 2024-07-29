import './App.css'

import Toolbar from '@mui/material/Toolbar';
import { Box, CssBaseline, ThemeProvider } from '@mui/material';

import Menu from './menu/Menu';
import { Outlet, ScrollRestoration } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from '../stores/store';
import Loading from '../../components/common/LoadingCenter';
import { theme } from './Theme';

import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import Auth from '../../pages/auth/Auth';

const drawerWidth = 288;

export default observer(function App() {
  const {commonStore, userStore, currencyStore: {currenciesLoaded, loadCurrencies} } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser();
    } else {
      commonStore.setApploaded();
    }
    if (!currenciesLoaded)
      loadCurrencies();

  }, [commonStore, userStore, currenciesLoaded]);

  if (!commonStore.appLoaded) return <Loading />

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <ScrollRestoration/>
        {!userStore.isLoggedIn
        ? 
          <Auth /> 
        : (
          <Box sx={{ display: 'flex' }}>
            <Menu appName='BudgetStat' drawerWidth={drawerWidth}/>

            <Box
              component="main"
              sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
            >
              <Toolbar />
              <Outlet/>
              <Box height={150}/>
            </Box>

          </Box>
        )}
      </LocalizationProvider>
    </ThemeProvider>
  );
})
