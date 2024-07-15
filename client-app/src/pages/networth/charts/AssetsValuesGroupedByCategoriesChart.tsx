
import { PieChart } from '@mui/x-charts'
import { formatAmount } from '../../../app/utils/FormatAmount'
import { observer } from 'mobx-react-lite';
import { useStore } from '../../../app/stores/store';
import { Box } from '@mui/material';

interface Props {
    showLegend?: boolean;
}

export default observer(function AssetsValuesGroupedByCategoriesChart({showLegend = false}: Props) {
    const {currencyStore: {defaultCurrency}} = useStore();
  
    const data = [
        { id: 0, value: 47010, label: "Accounts", },
        { id: 1, value: 22000, label: "Investments" },
        { id: 2, value: 500000, label: "Property" },
        { id: 3, value: 35000, label: "Movable property"},
        { id: 4, value: 0, label: "Other"},
      ];
    
    return (
    <Box p={showLegend ? 2 : 0}>
        <PieChart
            colors={[
                '#1976D2',
                '#ce93d8',
                '#4fc3f7',
                '#81c784',
                '#e0e0e0',
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
                    data: data,
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