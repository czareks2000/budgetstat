import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import ValueOverTimeChart from './ValueOverTimeChart';

export default observer(function AssetValueOverTimeLineChart() {
    const {
        assetStore: {assetValueOverTime, assetValueOverTimeLoaded, chartPeriod, setChartPeriod}
    } = useStore();

    return (
    <ValueOverTimeChart 
        chartPeriod={chartPeriod}
        setChartPeriod={setChartPeriod}
        valueOverTime={assetValueOverTime} 
        loaded={assetValueOverTimeLoaded} />
  )
})
