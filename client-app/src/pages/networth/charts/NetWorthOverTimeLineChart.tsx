import { Box, Button, ButtonGroup, Paper, Typography } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { theme } from '../../../app/layout/Theme';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { convertToString } from '../../../app/utils/ConvertToString';
import dayjs from 'dayjs';
import ChartPeriodButtonGroup from './ChartPeriodButtonGroup';

export default observer(function NetWorthOverTimeLineChart() {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {netWorthValueOverTime, loadedNetWorthValueOverTime}
    } = useStore();

    const mockData = [39000, 42100, 44000, 43000, 41200, 42000, 42137, 44000, 43700, 46500, 45000, 47000];
    const mockLabels = [
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

    const mockDates = `${dayjs().add(-365, 'days').format("DD.MM.YYYY")} - ${dayjs().format("DD.MM.YYYY")}`;
    
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
