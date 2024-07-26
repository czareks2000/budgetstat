import { Button, ButtonGroup} from '@mui/material'
import { observer } from 'mobx-react-lite'
import { NetWorthChartPeriod } from '../../../app/models/enums/periods/NetWorthChartPeriod';
import { useStore } from '../../../app/stores/store';

export default observer(function ChartPeriodButtonGroup() {
    const {
        statsStore: {setChartPeriod, chartPeriod}
    } = useStore();
    
    const handleButtonClick = (period: NetWorthChartPeriod) => {
        setChartPeriod(period);
    };

    return (
        <ButtonGroup variant="outlined">
            <Button
                variant={chartPeriod === NetWorthChartPeriod.YTD ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(NetWorthChartPeriod.YTD)}
            >
                Ytd
            </Button>
            <Button
                variant={chartPeriod === NetWorthChartPeriod.Month ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(NetWorthChartPeriod.Month)}
            >
                1M
            </Button>
            <Button
                variant={chartPeriod === NetWorthChartPeriod.Year ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(NetWorthChartPeriod.Year)}
            >
                1Y
            </Button>
            <Button
                variant={chartPeriod === NetWorthChartPeriod.FiveYears ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(NetWorthChartPeriod.FiveYears)}
            >
                5Y
            </Button>
            <Button
                variant={chartPeriod === NetWorthChartPeriod.Max ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(NetWorthChartPeriod.Max)}
            >
                Max
            </Button>
        </ButtonGroup>
    )
})