import { Button, ButtonGroup} from '@mui/material'
import { observer } from 'mobx-react-lite'
import { ChartPeriod } from '../../../app/models/enums/ChartPeriod';
import { useStore } from '../../../app/stores/store';

export default observer(function ChartPeriodButtonGroup() {
    const {
        statsStore: {setChartPeriod, chartPeriod}
    } = useStore();
    
    const handleButtonClick = (period: ChartPeriod) => {
        setChartPeriod(period);
    };

    return (
        <ButtonGroup variant="outlined">
            <Button
                variant={chartPeriod === ChartPeriod.YTD ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(ChartPeriod.YTD)}
            >
                Ytd
            </Button>
            <Button
                variant={chartPeriod === ChartPeriod.Month ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(ChartPeriod.Month)}
            >
                1M
            </Button>
            <Button
                variant={chartPeriod === ChartPeriod.Year ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(ChartPeriod.Year)}
            >
                1Y
            </Button>
            <Button
                variant={chartPeriod === ChartPeriod.FiveYears ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(ChartPeriod.FiveYears)}
            >
                5Y
            </Button>
            <Button
                variant={chartPeriod === ChartPeriod.Max ? 'contained' : 'outlined'}
                onClick={() => handleButtonClick(ChartPeriod.Max)}
            >
                Max
            </Button>
        </ButtonGroup>
    )
})