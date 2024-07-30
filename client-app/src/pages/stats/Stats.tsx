import { Box, Divider, MenuItem, Paper, Stack, TextField } from "@mui/material"
import BalanceOverTimeLineChart from "./charts/BalanceOverTimeLineChart";
import IncomesAndExpensesOverTimeBarChart from "./charts/IncomesAndExpensesOverTimeBarChart";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";
import BalanceOverTimeLineChartSettings from "./settings/BalanceOverTimeLineChartSettings";
import { observer } from "mobx-react-lite";
import IncomesAndExpensesOverTimeBarChartSettings from "./settings/IncomesAndExpensesOverTimeBarChartSettings";
import AvgMonthlyExpensesByCategoriesBarChart from "./charts/AvgMonthlyExpensesByCategoriesBarChart";
import AvgMonthlyExpensesByCategoriesBarChartSettings from "./settings/AvgMonthlyExpensesByCategoriesBarChartSettings";
import AvgMonthlyIncomesByCategoriesBarChart from "./charts/AvgMonthlyIncomesByCategoriesBarChart";
import AvgMonthlyIncomesByCategoriesBarChartSettings from "./settings/AvgMonthlyIncomesByCategoriesBarChartSettings";
import { useStore } from "../../app/stores/store";
import BalanceOverTimeForecastLineChart from "./charts/BalanceOverTimeForecastLineChart";
import BalanceOverTimeForecastLineChartSettings from "./settings/BalanceOverTimeForecastLineChartSettings";

const charts = [
    { 
        id: 0, 
        title: "Average Monthly Expenses By Categories", 
        chart: <AvgMonthlyExpensesByCategoriesBarChart/>,
        settings: <AvgMonthlyExpensesByCategoriesBarChartSettings/>
    },
    { 
        id: 1, 
        title: "Average Monthly Incomes By Categories", 
        chart: <AvgMonthlyIncomesByCategoriesBarChart/>,
        settings: <AvgMonthlyIncomesByCategoriesBarChartSettings/>
    },
    { 
        id: 2, 
        title: "Incomes and Expenses Over Time",
        chart: <IncomesAndExpensesOverTimeBarChart />,
        settings: <IncomesAndExpensesOverTimeBarChartSettings />
    },
    { 
        id: 3, 
        title: "Balance Over Time", 
        chart: <BalanceOverTimeLineChart/>,
        settings: <BalanceOverTimeLineChartSettings/>
    },
    { 
        id: 4, 
        title: "Balance Over Time Forecast", 
        chart: <BalanceOverTimeForecastLineChart/>,
        settings: <BalanceOverTimeForecastLineChartSettings/>
    },
]

export default observer(function Stats() {
    const {statsStore: {selectedChart, setSelectedChart}} = useStore();

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const id = parseInt(event.target.value)
        setSelectedChart(charts.find(c => c.id === id)!.id);
    }

    return (
        <>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Statistics</Divider>
                    <Paper>
                        <Box p={0}>
                            <TextField
                                select
                                fullWidth
                                sx={{
                                    '& .MuiOutlinedInput-notchedOutline': {
                                        border: 'none',
                                    },
                                }}
                                value={charts[selectedChart].id}
                                onChange={handleChange}
                                autoComplete='off'
                            >   
                                {charts.map(chart => (
                                    <MenuItem key={chart.id} value={chart.id}>
                                        {chart.title}
                                    </MenuItem>
                                ))}
                            </TextField>
                        </Box>
                    </Paper>
                    {charts[selectedChart].chart}
                    <Divider>Chart settings</Divider>
                    <Paper>
                        <Box p={2}>
                            {charts[selectedChart].settings}
                        </Box>
                    </Paper>
            </Stack>
        } 
        />
    </>   
    )
})