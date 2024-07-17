import { Balance } from '@mui/icons-material'
import { Box, Card, CardContent, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { formatAmount } from '../../../app/utils/FormatAmount';

export default observer(function NetWorthCard() {
  const {
      currencyStore: {defaultCurrency},
      statsStore: {loansValue, assetsValue},
      accountStore: {totalBalance}
  } = useStore();

  const netWorth = assetsValue + totalBalance + loansValue;

  return (
    <Card>
        <CardContent>
            <Box display={'flex'}>
                <Balance sx={{mt: '3px', mr: 1}}/>
                <Typography variant="h6" gutterBottom>
                    Net worth
                </Typography>
            </Box>
            <Typography variant="h5" color={'primary'}>
              {formatAmount(netWorth)} {defaultCurrency?.symbol}
            </Typography>
        </CardContent>
    </Card>
  )
})
