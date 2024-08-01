import { Box, Divider, List, Paper, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { SwapHoriz } from '@mui/icons-material';
import NoDecorationLink from '../../../components/common/NoDecorationLink';

export default observer(function TransactionsToConfirmCard() {
  const {
      transactionStore: {},
  } = useStore();

  return (
    <Paper>
        <Stack>
        <NoDecorationLink to={"/transactions"} 
            content={
            <Box display={'flex'} p={2}>
                <SwapHoriz />
                <Typography ml={1}>
                    Transactions
                </Typography>
            </Box>} />
        <Divider/>
            {true &&
            <List disablePadding>
                {}
            </List>}
        </Stack>
        <Box p={2}>lista ostatnich kilku transakcji</Box> 
    </Paper>
  )
})