import { Box, Paper, Typography } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { theme } from '../../../app/layout/Theme';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { convertToString } from '../../../app/utils/ConvertToString';
import ChartPeriodButtonGroup from './ChartPeriodButtonGroup';
import { mockData, mockDates, mockLabels } from '../../../app/utils/MockData';

export default observer(function NetWorthOverTimeLineChart() {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {netWorthValueOverTime, loadedNetWorthValueOverTime}
    } = useStore();

    
    
    return (
    <Paper>
        <Box px={2} pt={2} mb={-2}
            display={'flex'} 
            justifyContent={'space-between'}
            alignItems={'center'}>
            <ChartPeriodButtonGroup />
            <Typography
                pr={1}
                variant='body1'
                display={{xs: 'none', sm: 'block'}}
                >
                {loadedNetWorthValueOverTime ? 
                <>{convertToString(netWorthValueOverTime!.startDate, "DD.MM.YYYY")} - {convertToString(netWorthValueOverTime!.endDate, "DD.MM.YYYY")}</> 
                : 
                <>{mockDates}</>
                }
            </Typography>
        </Box>
        <Box pl={2} mr={-1} height={300}>
            <LineChart
                margin={{ left: 65}}
                loading={!loadedNetWorthValueOverTime}
                grid={{ horizontal: true }}
                series={[
                    {   
                        //curve: "linear",
                        data: netWorthValueOverTime?.data || mockData, 
                        color: theme.palette.primary.main, 
                        valueFormatter: (value) => `${formatAmount(value!)} ${defaultCurrency?.symbol}`},
                ]}
                xAxis={[{ scaleType: 'point', data: netWorthValueOverTime?.labels || mockLabels}]}
                //leftAxis={null}
            />
        </Box>
    </Paper>
  )
})
