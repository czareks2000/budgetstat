import { Box, Divider, Paper, Stack, Typography } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { mockLabels } from '../../../app/utils/MockData';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { theme } from '../../../app/layout/Theme';
import NoDecorationLink from '../../../components/common/NoDecorationLink';
import { ChartType } from '../../stats/Stats';

export default observer(function BalanceLastMonthLineChart() {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {balanceLast30Days, homePageChartsLoaded}
    } = useStore();

  return (
    <Paper>
        <Stack>
            <NoDecorationLink to={`/stats?chartId=${ChartType.BalanceOverTimeLineChart}`} content={
            <Box display={'flex'} p={2}>
                <Typography>
                    Accounts balance over time
                </Typography>
            </Box>}/>
            <Divider/>
            <Box pl={2} height={300}>
                <LineChart
                    margin={{ left: 65, top: 35}}
                    loading={!homePageChartsLoaded}
                    grid={{ horizontal: true }}
                    series={[
                        {   
                            //curve: "linear",
                            data: balanceLast30Days?.data || [], 
                            color: theme.palette.primary.main, 
                            valueFormatter: (value) => `${formatAmount(value!)} ${defaultCurrency?.symbol}`},
                    ]}
                    xAxis={[{ scaleType: 'point', data: balanceLast30Days?.labels || mockLabels}]}
                    //leftAxis={null}
                    />
            </Box>
            </Stack>
    </Paper>
  )
})