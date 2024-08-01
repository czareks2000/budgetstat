import { Card, CardContent, Stack, Tooltip, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { formatAmount } from '../../../app/utils/FormatAmount';

export default observer(function AvgMonthlyIncomesAndExpensesCard() {
  const {
      currencyStore: {defaultCurrency},
      statsStore: {avgMonthlyIncomesAndExpensesLastYear},
  } = useStore();

  return (
    <Card>
        <CardContent>
            <Tooltip 
                title={"The average is calculated over the last 12 months"}
                placement='top'
                arrow
                >
                <span>
                <Stack textAlign={{xs: 'center', lg: 'left'}}>
                    <Typography variant="body1" noWrap component="div">
                        Avg monthly income:
                    </Typography>
                    <Typography variant="h6" noWrap component="div">
                        {formatAmount(avgMonthlyIncomesAndExpensesLastYear.incomes)} {defaultCurrency?.symbol}
                    </Typography>
                    <Typography variant="body1" noWrap component="div">
                        Avg monthly expenses:
                    </Typography>
                    <Typography variant="h6" noWrap component="div">
                        {formatAmount(avgMonthlyIncomesAndExpensesLastYear.expenses)} {defaultCurrency?.symbol}
                    </Typography>
                </Stack>
                </span>
            </Tooltip>
        </CardContent>
    </Card>
  )
})