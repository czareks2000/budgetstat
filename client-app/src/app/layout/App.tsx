import './App.css'

import Toolbar from '@mui/material/Toolbar';
import { Box, CssBaseline } from '@mui/material';

import Menu from './menu/Menu';
import { Outlet } from 'react-router-dom';

const drawerWidth = 288;

function App() {

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Menu appName='BudgetStat' drawerWidth={drawerWidth}/>

      <Box
        component="main"
        sx={{ flexGrow: 1, p: 3, width: { sm: `calc(100% - ${drawerWidth}px)` } }}
      >
        <Toolbar />
        <Outlet/>
      </Box>

    </Box>
  );
}

export default App
