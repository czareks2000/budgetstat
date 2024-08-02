import { Box, Divider, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { AccountStatus } from '../../../app/models/enums/AccountStatus';
import { Wallet } from '@mui/icons-material';

export default observer(function AccountsCard() {
  const {
      accountStore: {accounts},
  } = useStore();

  return (
    <Paper>
        <Stack>
            <Box display={'flex'} p={2}>
                <Wallet />
                <Typography ml={1}>
                    Accounts
                </Typography>
            </Box>
            <Divider/>
            {accounts.filter(a => a.status == AccountStatus.Visible).length > 0 ?
            <List disablePadding sx={{p: 1}}>
                {accounts.filter(a => a.status == AccountStatus.Visible)
                    .map(account =>
                    <ListItem
                        key={account.id} 
                        secondaryAction={<>{formatAmount(account.balance)} {account.currency.symbol}</>}
                        >
                        <ListItemText 
                            primary={account.name}/>
                    </ListItem>
                )}
            </List>
            :
            <Box p={2}>
                <Typography>There are no visible accounts</Typography>
            </Box>
            }
        </Stack>
    </Paper>
  )
})