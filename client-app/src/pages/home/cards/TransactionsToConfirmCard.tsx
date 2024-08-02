import { Box, Divider, List, Paper, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import PlannedTransactionListItem from '../../transactions/planned/PlannedTransactionListItem';
import { EditCalendar } from '@mui/icons-material';
import NoDecorationLink from '../../../components/common/NoDecorationLink';

export default observer(function TransactionsToConfirmCard() {
  const {
      transactionStore: {plannedTransactionsToConfirm},
  } = useStore();

  return (
    <Paper>
        <Stack>
        <NoDecorationLink to={"/transactions/planned"} 
            content={
            <Box display={'flex'} p={2}>
                <EditCalendar />
                <Typography ml={1}>
                    Planned transactions
                </Typography>
            </Box>} />
        <Divider/>
            {plannedTransactionsToConfirm.length > 0 ?
            <List disablePadding>
                {plannedTransactionsToConfirm.map(transaction => 
                    <PlannedTransactionListItem 
                        key={transaction.id}
                        showConfirmAction 
                        transaction={transaction}
                    />  
                )}
            </List>
            :
            <Box p={2}>
                <Typography>There are no transactions to confirm</Typography>
            </Box>
            }
        </Stack>
    </Paper>
  )
})