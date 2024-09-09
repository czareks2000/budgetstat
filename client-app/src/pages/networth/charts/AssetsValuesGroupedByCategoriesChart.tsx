
import { PieChart } from '@mui/x-charts'
import { formatAmount } from '../../../app/utils/FormatAmount'
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';

interface Props {
    showLegend?: boolean;
}

export default observer(function AssetsValuesGroupedByCategoriesChart({showLegend = false}: Props) {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {assetPieChartData}
    } = useStore();
      
    return (
        <PieChart
            colors={[
                '#005288',
                '#0076c4',
                '#0099ff',
                '#60bffe',
                '#bfe4fe',
                ]}
            slotProps={{ 
                legend: 
                {
                    hidden: !showLegend,
                    position: { horizontal: "left", vertical: "middle"},
                    itemGap: 15,
                    markGap: 15,
                }
            }}
            series={[
                {
                    data: assetPieChartData,
                    innerRadius: showLegend ? 15 : 30,
                    outerRadius: showLegend ? 60 : 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    startAngle: 0,
                    endAngle: 360,
                    valueFormatter: (value) => `${formatAmount(value.value)} ${defaultCurrency?.symbol}`
                }
            ]}
            height={showLegend ? 200 : 240}
            margin={{left: showLegend ? 250 : 100}}
        />
  )
})