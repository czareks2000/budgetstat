import { Box, Divider, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { SwapHoriz } from '@mui/icons-material';
import NoDecorationLink from '../../../components/common/NoDecorationLink';
import { formatAmount } from '../../../app/utils/FormatAmount';
import CategoryIcon from '../../../components/common/CategoryIcon';
import dayjs from 'dayjs';
import { useEffect } from 'react';

export default observer(function TransactionsToConfirmCard() {
  const {
      transactionStore: {
        latestTransactions: transactions, amountColor, 
        latestTransactionsLoaded, loadLatestTransactions},
      accountStore: {getAccountName},
  } = useStore();

  useEffect(() => {
    if (!latestTransactionsLoaded)
        loadLatestTransactions();
    },[latestTransactionsLoaded, loadLatestTransactions])

  return (
    <Paper>
        <Stack>
        <NoDecorationLink to={"/transactions"} 
            content={
            <Box display={'flex'} p={2}>
                <SwapHoriz />
                <Typography ml={1}>
                    Latest transactions
                </Typography>
            </Box>} />
        <Divider/>
            {transactions.length > 0 ?
            <List disablePadding sx={{p: 1}}>
                {transactions.slice(0,5)
                    .map(transaction =>
                    <ListItem
                        key={transaction.id} 
                        secondaryAction={
                            <Box component={"span"} display={'flex'} justifyItems={'center'} textAlign={'right'}>
                                <Typography mr={1} color={amountColor(transaction.amount.type)}>
                                    {formatAmount(transaction.amount.value)} {transaction.amount.currencySymbol}
                                </Typography>
                            </Box>}
                        >
                        <ListItemText 
                            primary={
                            <Box component={"span"} display={'flex'} justifyItems={'center'}>
                                <CategoryIcon iconId={transaction.category.iconId} fontSize='small'/>
                                <Typography ml={1}>{transaction.category.name}</Typography>
                            </Box>}
                            secondary={<i>{transaction.accountId ? getAccountName(transaction.accountId): '(deleted)'} - {dayjs(transaction.date).format('DD.MM.YYYY')}</i>}/>
                    </ListItem>
                )}
            </List>
            :   
            <Box p={2}>
                <Typography>There are no transactions in the last 30 days</Typography>
            </Box> 
            }
        </Stack>
    </Paper>
  )
})