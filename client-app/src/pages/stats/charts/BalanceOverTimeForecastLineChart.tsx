import { Box, Paper } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { mockData, mockLabels } from '../../../app/utils/MockData';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { theme } from '../../../app/layout/Theme';

export default observer(function BalanceOverTimeForecastLineChart() {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {balanceOverTimeForecast, balanceOverTimeForecastLoaded}
    } = useStore();

  return (
    <Paper>
        <Box pl={2} height={300}>
            <LineChart
                margin={{ left: 65, top: 35}}
                loading={!balanceOverTimeForecastLoaded}
                grid={{ horizontal: true }}
                series={[
                    {   
                        //curve: "linear",
                        data: balanceOverTimeForecast?.data || mockData, 
                        color: theme.palette.primary.main, 
                        valueFormatter: (value) => `${formatAmount(value!)} ${defaultCurrency?.symbol}`},
                ]}
                xAxis={[{ scaleType: 'point', data: balanceOverTimeForecast?.labels || mockLabels}]}
                //leftAxis={null}
            />
        </Box>
    </Paper>
  )
})