import { useState } from 'react';

import Toolbar from '@mui/material/Toolbar';
import Divider from '@mui/material/Divider';
import { AppBar, Box, Button, Drawer, Link as MuiLink, Stack, Typography } from '@mui/material';
import IconButton from '@mui/material/IconButton';

import MenuIcon from '@mui/icons-material/Menu';
import { Balance, BarChart, FileUpload, Home, Logout, NoteAlt, PendingActions, SwapHoriz, Tune, Wallet } from '@mui/icons-material';

import NavLinks from './NavLinks';
import { useStore } from '../../stores/store';
import { observer } from 'mobx-react-lite';
import { Link } from 'react-router-dom';
import { formatAmount } from '../../utils/FormatAmount';


interface Props {
    appName: string;
    drawerWidth?: number;
}

export default observer(function Menu({ appName, drawerWidth = 288 }: Props) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);
    const {
      userStore: {logout}, accountStore: {totalBalance}, currencyStore: {defaultCurrency},
      statsStore: {currentMonthIncome}} = useStore();

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

    const color = (value: number) => {
      if (value > 0)
        return 'success.light'
      else if (value < 0)
        return 'error.light'

      return 'inherit'
    }

    const formatValue = (value: number) => {
      if (value > 0)
        return `+${formatAmount(value)}`;

      return formatAmount(value);
    }

    const formatedCurrentMonthIncome = (
      <Typography color={color(currentMonthIncome)} component={'span'}>
        {formatValue(currentMonthIncome)} {defaultCurrency?.symbol}
      </Typography>
    )

    const drawer = (
        <Box>
          <Toolbar />
          <Box m={3}>
            <Typography variant="h6" noWrap component="div">
              Balance:
            </Typography>
            <Typography variant="h4" noWrap component="div">
              {formatAmount(totalBalance)} {defaultCurrency?.symbol}
            </Typography>
            <Typography variant="subtitle1" noWrap component="div">
              This month: {formatedCurrentMonthIncome}
            </Typography>
          </Box>
    
          <Divider sx={{ bgcolor: "#0099FF", borderBottomWidth: 2 }} />
    
          <Box m={1}>
            <NavLinks items={[
                    {text: 'Home', icon: <Home />, link: 'home'}, 
                    {text: 'Stats', icon: <BarChart />, link: 'stats'}, 
                    //{text: 'Calendar', icon: <CalendarMonth />, link: 'calendar'}
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
        </Box>
      );

    return (
      <>
        <AppBar
            position="fixed"
        >
            <Toolbar sx={{backgroundColor: 'white', color: '#636363'}}>
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
                    <Stack direction={'row'} alignItems={'center'} spacing={1}>
                      {/* <Avatar src='/logo.png' sx={{width: 32, height: 32, display: {xs: 'none', md: 'block'}}}/> */}
                      <Box>{appName}</Box>
                    </Stack>
                  </MuiLink>
              </Typography>
              <Button 
                variant='text' 
                color='inherit' 
                sx={{ marginLeft: "auto" }}
                onClick={logout}
                startIcon={<Logout/>}>
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
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth,
                  backgroundColor: "backgroundColor.dark",
                  color: 'white',
                },
            }}
          >
            {drawer}
          </Drawer>
          <Drawer
            variant="permanent"
            sx={{
                display: { xs: 'none', md: 'block' },
                '& .MuiDrawer-paper': { 
                  boxSizing: 'border-box', 
                  width: drawerWidth, 
                  backgroundColor: "backgroundColor.dark",
                  color: 'white',
                },    
            }}
            open
          >
            {drawer}
          </Drawer>
        </Box>
      </>
    )
  })