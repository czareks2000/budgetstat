import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import { theme } from "../../app/layout/Theme";
import { formatAmount } from "../../app/utils/FormatAmount";
import { BarChart } from "@mui/x-charts";

export default observer(function ExpensesChart() {
    const {
        budgetStore: {chartLoaded, chart},
        currencyStore: {defaultCurrency}
    } = useStore();

    const valueFormatter = (value: number | null) => `${value ? formatAmount(value) : value} ${defaultCurrency?.symbol}`;

    const chartSetting = {
      series: [
          { dataKey: 'expense', 
            label: 'Expenses', valueFormatter, 
            color: theme.palette.primary.main 
        },
      ]
    }

    return (
        <BarChart
            slotProps={{
                noDataOverlay: { message: chart ? 'There is no expenses' : 'Select categories to see data' },
                legend: {
                    hidden: true
                }
            }}
            loading={!chartLoaded}
            margin={{ left: 65}}
            dataset={chart || []}
            xAxis={[
                { scaleType: 'band', dataKey: 'label' },
            ]}
            grid={{ horizontal: true }}
            {...chartSetting}
        />
  )
})