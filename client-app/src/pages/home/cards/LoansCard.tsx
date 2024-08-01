import { Box, Divider, List, Paper, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { PendingActions } from '@mui/icons-material';

export default observer(function LoansCard() {
  const {
      loanStore: {},
  } = useStore();

  return (
    <Paper>
        <Stack>
            <Box display={'flex'} p={2}>
                <PendingActions/>
                <Typography ml={1}>
                    Loans summary
                </Typography>
            </Box>
            <Divider/>
            <Box p={2}>lista loans summary tylko inprogress</Box> 
            {true &&
            <List disablePadding>
                {}
            </List>}
        </Stack>
    </Paper>
  )
})