import { Box, Paper, Typography } from '@mui/material'
import { LineChart } from '@mui/x-charts'
import { theme } from '../../../app/layout/Theme';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { convertToString } from '../../../app/utils/ConvertToString';
import ChartPeriodButtonGroup from './ChartPeriodButtonGroup';
import { mockData, mockDates, mockLabels } from '../../../app/utils/MockData';
import { ValueOverTime } from '../../../app/models/Stats';
import { NetWorthChartPeriod } from '../../../app/models/enums/periods/NetWorthChartPeriod';

interface Props {
    valueOverTime: ValueOverTime | undefined;
    loaded: boolean;
    chartPeriod: NetWorthChartPeriod;
    setChartPeriod: (period: NetWorthChartPeriod) => void;
}

export default observer(function ValueOverTimeChart({valueOverTime, loaded, chartPeriod, setChartPeriod}: Props) {
    const {
        currencyStore: {defaultCurrency},
    } = useStore();

    return (
    <Paper>
        <Box px={2} pt={2} mb={-2}
            display={'flex'} 
            justifyContent={'space-between'}
            alignItems={'center'}>
            <ChartPeriodButtonGroup chartPeriod={chartPeriod} setChartPeriod={setChartPeriod}/>
            <Typography
                pr={1}
                variant='body1'
                display={{xs: 'none', sm: 'block'}}
                >
                {loaded ? 
                <>{convertToString(valueOverTime!.startDate, "DD.MM.YYYY")} - {convertToString(valueOverTime!.endDate, "DD.MM.YYYY")}</> 
                : 
                <>{mockDates}</>
                }
            </Typography>
        </Box>
        <Box pl={2} mr={-1} height={300}>
            <LineChart
                margin={{ left: 65}}
                loading={!loaded}
                grid={{ horizontal: true }}
                series={[
                    {   
                        //curve: "linear",
                        data: valueOverTime?.data || mockData, 
                        color: theme.palette.primary.main, 
                        valueFormatter: (value) => `${formatAmount(value!)} ${defaultCurrency?.symbol}`
                    },
                ]}
                xAxis={[{ scaleType: 'point', data: valueOverTime?.labels || mockLabels}]}
                //leftAxis={null}
            />
        </Box>
    </Paper>
  )
})
