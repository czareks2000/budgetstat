import { useState } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import { AppBar, Box, Button, Drawer, Link as MuiLink, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';
import { Balance, BarChart, CalendarMonth, FileUpload, Home, NoteAlt, PendingActions, SwapHoriz, Tune, Wallet } from '@mui/icons-material';

import NavLinks from './NavLinks';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { formatNumber } from '../../utils/FormatNumber';

interface Props {
    appName: string;
    drawerWidth?: number;
}

export default observer(function Menu({ appName, drawerWidth = 288 }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const {userStore: {logout}, accountStore: {totalBalance}} = useStore();

    const handleDrawerClose = () => {
        setIsClosing(true);
        setMobileOpen(false);
    };

    const handleDrawerTransitionEnd = () => {
        setIsClosing(false);
    };

    const handleDrawerToggle = () => {
        if (!isClosing) {
        setMobileOpen(!mobileOpen);
        }
    };

    const drawer = (
        <div>
          <Toolbar />
          <Box m={3}>
            <Typography variant="h6" noWrap component="div">
              Balance:
            </Typography>
            <Typography variant="h4" noWrap component="div">
              {formatNumber(totalBalance)} zł
            </Typography>
            <Typography variant="subtitle1" noWrap component="div">
              This month: + {formatNumber(2350.52)} zł
            </Typography>
          </Box>
    
          <Divider sx={{ bgcolor: "#0099FF", borderBottomWidth: 2 }} />
    
          <Box m={1}>
            <NavLinks items={[
                    {text: 'Home', icon: <Home />, link: 'home'}, 
                    {text: 'Stats', icon: <BarChart />, link: 'stats'}, 
                    {text: 'Calendar', icon: <CalendarMonth />, link: 'calendar'}
                ]}/>
          </Box>
    
          <Divider sx={{ bgcolor: "#0099FF", borderBottomWidth: 2 }} />
    
          <Box m={1}>
            <NavLinks items={[
                    {text: 'Accounts', icon: <Wallet />, link: 'accounts'}, 
                    {text: 'Transactions', icon: <SwapHoriz />, link: 'transactions'}, 
                    {text: 'Budgets', icon: <NoteAlt />, link: 'budgets'},
                    {text: 'Loans', icon: <PendingActions/>, link: 'loans'},
                    {text: 'Net worth', icon: <Balance />, link: 'net-worth'}
                ]}/>
          </Box>
          
          <Divider sx={{ bgcolor: "#0099FF", borderBottomWidth: 2 }} />
    
          <Box m={1}>
            <NavLinks items={[
                      {text: 'Import/Export', icon: <FileUpload />, link: 'import-export'}, 
                      {text: 'Prferences', icon: <Tune />, link: 'preferences'}
                  ]}/>
          </Box>
        </div>
      );

    return (
      <>
        <AppBar
            position="fixed"
            sx={{
                zIndex: 1300
            }}
        >
            <Toolbar>
              <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2, display: { md: 'none' } }}
              >
                  <MenuIcon />
              </IconButton>
              <Typography variant="h6" noWrap component="div">
                  <MuiLink component={Link} to={'/'} underline='none' color='inherit'>
                    {appName}
                  </MuiLink>
              </Typography>
              <Button 
                variant='text' 
                color='inherit' 
                sx={{ marginLeft: "auto" }}
                onClick={logout}>
                Logout
                </Button>
            </Toolbar>
        </AppBar>

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="side menu"
        >
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onTransitionEnd={handleDrawerTransitionEnd}
            onClose={handleDrawerClose}
            ModalProps={{
                keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
                display: { xs: 'block', md: 'none' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      </>
    )
  })