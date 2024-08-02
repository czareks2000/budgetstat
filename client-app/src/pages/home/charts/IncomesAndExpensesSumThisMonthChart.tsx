import { Box, Checkbox, Divider, FormControlLabel, Paper, Stack, Typography } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { theme } from '../../../app/layout/Theme';
import NoDecorationLink from '../../../components/common/NoDecorationLink';
import { useState } from 'react';
import { ChartType } from '../../stats/Stats';

export default observer(function BalanceLastMonthLineChart() {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {
            incomesThisMonth, expensesThisMonth, homePageChartsLoaded}
    } = useStore();

    const [showIncome, setShowIncome] = useState(false);
    const [showExpense, setShowExpense] = useState(true);

    const toggleSeries = () => {
        setShowIncome(prev => !prev);
        setShowExpense(prev => !prev);
    }

    const valueFormatter = (value: number | null) => `${value ? formatAmount(value) : value} ${defaultCurrency?.symbol}`;

    const chartSetting = {
      series: [
          ...(showIncome ? [{ dataKey: 'value', label: 'Incomes', valueFormatter, color: theme.palette.success.light }] : []),
          ...(showExpense ? [{ dataKey: 'value', label: 'Expenses', valueFormatter, color: theme.palette.error.light }] : [])
      ]
  };

  return (
    <Paper>
        <Stack>
            <NoDecorationLink to={`/stats?chartId=${showIncome 
                ? ChartType.AvgMonthlyIncomesByCategoriesBarChart 
                : ChartType.AvgMonthlyExpensesByCategoriesBarChart}`} 
                content={
                <Box display={'flex'} p={2}>
                    <Typography>
                        Incomes and expenses this month
                    </Typography>
                </Box>}/>
            <Divider/>
            <Box pt={2} mb={-4} display={'flex'} justifyContent={'center'}>
                <FormControlLabel
                    control={
                    <Checkbox 
                        sx={{
                        '&.Mui-checked': {
                            color: theme.palette.success.light,
                        },}} 
                        checked={showIncome} 
                        onChange={toggleSeries} />}
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
                        onChange={toggleSeries} />}
                    label="Expenses"
                />
            </Box>
            <Box height={274}>
                <BarChart
                    slotProps={{
                    noDataOverlay: { message: 'There is no data to display' },
                    legend: {
                        hidden: true
                    }
                    }}
                    loading={!homePageChartsLoaded}
                    margin={{ left: 65}}
                    dataset={showExpense ? expensesThisMonth : incomesThisMonth}
                    xAxis={[
                    { scaleType: 'band', dataKey: 'label' },
                    ]}
                    grid={{ horizontal: true }}
                    {...chartSetting}
                />
            </Box>
        </Stack>
    </Paper>
  )
})