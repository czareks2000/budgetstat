import { Card, CardContent, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { formatAmount } from '../../../app/utils/FormatAmount';

export default observer(function CurrentBalanceCard() {
  const {
      currencyStore: {defaultCurrency},
      statsStore: {currentMonthIncome},
      accountStore: {totalBalance}
  } = useStore();

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

  return (
    <Card>
        <CardContent>
            <Stack spacing={1} textAlign={'center'} py={1}>
                <Typography variant="body1" noWrap component="div">
                    Your Balance:
                </Typography>
                <Typography variant="h4" noWrap component="div">
                    {formatAmount(totalBalance)} {defaultCurrency?.symbol}
                </Typography>
                <Typography variant="body2" noWrap component="div">
                    This month: {formatedCurrentMonthIncome}
                </Typography>
            </Stack>
        </CardContent>
    </Card>
  )
})