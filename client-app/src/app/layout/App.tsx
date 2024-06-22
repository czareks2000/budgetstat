import './App.css'

import Toolbar from '@mui/material/Toolbar';
import { Box, CircularProgress, CssBaseline } from '@mui/material';

import Menu from './menu/Menu';
import { Outlet, useLocation } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import Login from '../../pages/login/Login';
import { useEffect } from 'react';
import { useStore } from '../stores/store';
import Loading from '../../components/Loading';

const drawerWidth = 288;

export default observer(function App() {
  const location = useLocation();
  const {commonStore, userStore } = useStore();

  useEffect(() => {
    if (commonStore.token) {
      userStore.getUser().finally(() => commonStore.setApploaded());
    } else {
      commonStore.setApploaded();
    }
  }, [commonStore, userStore]);

  if (!commonStore.appLoaded) return <Loading />

  return (
    <>
      <CssBaseline />
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
    </>
    
  );
})
