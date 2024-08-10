import { Box, Paper } from '@mui/material'
import { BarChart } from '@mui/x-charts'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { theme } from '../../../app/layout/Theme';

export default observer(function AvgMonthlyIncomesByCategoriesBarChart() {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {avgMonthlyIncomesByCategories, avgMonthlyIncomesByCategoriesLoaded}
    } = useStore();

    const valueFormatter = (value: number | null) => `${value ? formatAmount(value) : value} ${defaultCurrency?.symbol}`;

    const chartSetting = {
      series: [
          { dataKey: 'value', label: 'Incomes', valueFormatter, color: theme.palette.success.light },
      ]
  };

  return (
    <Paper>
        <Box pl={2} height={300}>
            <BarChart
                slotProps={{
                  noDataOverlay: { message: 'There is no data to display' },
                  legend: {
                    hidden: true
                  }
                }}
                loading={!avgMonthlyIncomesByCategoriesLoaded}
                margin={{ left: 65}}
                dataset={avgMonthlyIncomesByCategories || []}
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