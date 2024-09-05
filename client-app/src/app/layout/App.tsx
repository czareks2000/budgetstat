import './App.css'

import Toolbar from '@mui/material/Toolbar';
import { Backdrop, Box, CircularProgress } from '@mui/material';

import Menu from './menu/Menu';
import { Outlet } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { useEffect } from 'react';
import { useStore } from '../stores/store';
import Loading from '../../components/common/loadings/LoadingCenterScreen';

import Auth from '../../pages/auth/Auth';
import Wrapper from './Wrapper';

export const drawerWidth = 288;
export const marginBottom = 150;

export default observer(function App() {
  const {commonStore, userStore, currencyStore: {currenciesLoaded, loadCurrencies},
  fileStore: {importInProgress, undoInProgress} } = useStore();

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
  <Wrapper content={
    <>
      <Backdrop
          sx={(theme) => ({ color: '#fff', zIndex: theme.zIndex.tooltip + 1 })}
          open={importInProgress || undoInProgress}
      >
          <CircularProgress color="inherit" />
      </Backdrop>
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
              <Box height={marginBottom}/>
            </Box>

          </Box>
        )}
    </>
  }/>
  );
})
