import { Box, Checkbox, FormControlLabel, Paper } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { theme } from '../../../app/layout/Theme';
import { useState } from 'react';

export default observer(function IncomesAndExpensesOverTimeBarChart() {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {incomesAndExpensesOverTime, incomesAndExpensesOverTimeLoaded}
    } = useStore();

    const [showIncome, setShowIncome] = useState(true);
    const [showExpense, setShowExpense] = useState(true);

    const valueFormatter = (value: number | null) => `${value ? formatAmount(value) : value} ${defaultCurrency?.symbol}`;

    const chartSetting = {
      series: [
          ...(showIncome ? [{ dataKey: 'income', label: 'Incomes', valueFormatter, color: theme.palette.success.light }] : []),
          ...(showExpense ? [{ dataKey: 'expense', label: 'Expenses', valueFormatter, color: theme.palette.error.light }] : [])
      ]
  };

  return (
    <Paper>
        <Box pt={2} mb={-4} display={'flex'} justifyContent={'center'}>
            <FormControlLabel
                control={
                  <Checkbox 
                    sx={{
                      '&.Mui-checked': {
                          color: theme.palette.success.light,
                      },}} 
                    checked={showIncome} 
                    onChange={() => setShowIncome(prev => !prev)} />}
                label="Incomes"
            />
            <FormControlLabel
                control={
                  <Checkbox
                    sx={{
                      '&.Mui-checked': {
                          color: theme.palette.error.light,
                      },}} 
                    checked={showExpense} 
                    onChange={() => setShowExpense(prev => !prev)} />}
                label="Expenses"
            />
        </Box>
        <Box height={300}>
            <BarChart
                slotProps={{
                  noDataOverlay: { message: 'There is no data to display' },
                  legend: {
                    hidden: true
                  }
                }}
                tooltip={{trigger:
                    (incomesAndExpensesOverTime && incomesAndExpensesOverTime.length > 0 ? "axis" : "none" ) 
                }}
                loading={!incomesAndExpensesOverTimeLoaded}
                margin={{ left: 65}}
                dataset={incomesAndExpensesOverTime || []}
                xAxis={[
                { scaleType: 'band', dataKey: 'label' },
                ]}
                grid={{ horizontal: true }}
                {...chartSetting}
            />
        </Box>
    </Paper>
  )
})