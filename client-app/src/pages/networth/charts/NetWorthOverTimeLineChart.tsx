import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ValueOverTimeChart from './ValueOverTimeChart';

export default observer(function NetWorthOverTimeLineChart() {
    const {
        statsStore: {netWorthValueOverTime, loadedNetWorthValueOverTime, netWorthChartPeriod, setNetWorthChartPeriod}
    } = useStore();

    return (
        <ValueOverTimeChart 
            chartPeriod={netWorthChartPeriod}
            setChartPeriod={setNetWorthChartPeriod}
            valueOverTime={netWorthValueOverTime} 
            loaded={loadedNetWorthValueOverTime} />
  )
})
