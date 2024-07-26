import { Box, Paper } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { mockData, mockLabels } from '../../../app/models/Stats';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { theme } from '../../../app/layout/Theme';

export default observer(function BalanceOverTimeLineChart() {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {balanceValueOverTime, balanceValueOverTimeLoaded}
    } = useStore();

  return (
    <Paper>
        <Box pl={2} height={300}>
            <LineChart
                margin={{ left: 65, top: 35}}
                loading={!balanceValueOverTimeLoaded}
                grid={{ horizontal: true }}
                series={[
                    {   
                        //curve: "linear",
                        data: balanceValueOverTime?.data || mockData, 
                        color: theme.palette.primary.main, 
                        valueFormatter: (value) => `${formatAmount(value!)} ${defaultCurrency?.symbol}`},
                ]}
                xAxis={[{ scaleType: 'point', data: balanceValueOverTime?.labels || mockLabels}]}
                //leftAxis={null}
            />
        </Box>
    </Paper>
  )
})
