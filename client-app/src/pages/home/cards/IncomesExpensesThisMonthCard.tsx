import { Card, CardContent, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { formatAmount } from '../../../app/utils/FormatAmount';

export default observer(function IncomesExpensesThisMonthCard() {
  const {
      currencyStore: {defaultCurrency},
      statsStore: {currentMonthIncomesAndExpenses},
  } = useStore();

  return (
    <Card>
        <CardContent>
            <Stack textAlign={{xs: 'center', lg: 'right'}}>
                <Typography variant="body1" noWrap component="div">
                    Income this month:
                </Typography>
                <Typography variant="h6" noWrap component="div">
                    {formatAmount(currentMonthIncomesAndExpenses.incomes)} {defaultCurrency?.symbol}
                </Typography>
                <Typography variant="body1" noWrap component="div">
                    Expenses this month:
                </Typography>
                <Typography variant="h6" noWrap component="div">
                    {formatAmount(currentMonthIncomesAndExpenses.expenses)} {defaultCurrency?.symbol}
                </Typography>
            </Stack>
        </CardContent>
    </Card>
  )
})