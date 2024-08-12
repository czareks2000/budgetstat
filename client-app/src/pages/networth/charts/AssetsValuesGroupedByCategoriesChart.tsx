
import { PieChart } from '@mui/x-charts'
import { formatAmount } from '../../../app/utils/FormatAmount'
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import { Box } from '@mui/material';

interface Props {
    showLegend?: boolean;
}

export default observer(function AssetsValuesGroupedByCategoriesChart({showLegend = false}: Props) {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {assetPieChartData}
    } = useStore();
      
    return (
    <Box p={showLegend ? 2 : 0}>
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
                    innerRadius: 30,
                    outerRadius: 100,
                    paddingAngle: 5,
                    cornerRadius: 5,
                    startAngle: 0,
                    endAngle: 360,
                    valueFormatter: (value) => `${formatAmount(value.value)} ${defaultCurrency?.symbol}`
                }
            ]}
            height={240}
            width={showLegend ? 410 : 240}
            margin={{left: showLegend ? 300 : 100}}
        />
    </Box>
  )
})