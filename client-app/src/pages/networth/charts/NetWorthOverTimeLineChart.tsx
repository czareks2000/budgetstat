import { Box, Paper } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { theme } from '../../../app/layout/Theme';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';

export default observer(function NetWorthOverTimeLineChart() {
    const {currencyStore: {defaultCurrency}} = useStore();
    
    const data = [39000, 42100, 44000, 43000, 41200, 42000, 42137, 44000, 43700, 46500, 45000, 47000];
    const xLabels = [
    '08/2023',
    '09/2023',
    '10/2023',
    '11/2023',
    '12/2023',
    '01/2024',
    '02/2024',
    '03/2024',
    '04/2024',
    '05/2024',
    '06/2024',
    '07/2024',
    ];
    
    return (
    <Paper>
        <Box pl={3} pb={2} height={400}>
        <LineChart
            series={[
                { 
                    data: data, 
                    color: theme.palette.primary.main, 
                    valueFormatter: (value) => `${formatAmount(value!)} ${defaultCurrency?.symbol}`},
            ]}
            xAxis={[{ scaleType: 'point', data: xLabels }]}
        />
        </Box>
    </Paper>
  )
})
