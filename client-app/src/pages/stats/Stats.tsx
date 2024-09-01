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
import { useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";

export enum ChartType {
    AvgMonthlyExpensesByCategoriesBarChart = 0,
    AvgMonthlyIncomesByCategoriesBarChart = 1,
    IncomesAndExpensesOverTimeBarChart = 2,
    BalanceOverTimeLineChart = 3,
    BalanceOverTimeForecastLineChart = 4,
}

const charts = [
    { 
        id: ChartType.AvgMonthlyExpensesByCategoriesBarChart, 
        title: "Average Monthly Expenses By Categories", 
        chart: <AvgMonthlyExpensesByCategoriesBarChart/>,
        settings: <AvgMonthlyExpensesByCategoriesBarChartSettings/>
    },
    { 
        id: ChartType.AvgMonthlyIncomesByCategoriesBarChart, 
        title: "Average Monthly Incomes By Categories", 
        chart: <AvgMonthlyIncomesByCategoriesBarChart/>,
        settings: <AvgMonthlyIncomesByCategoriesBarChartSettings/>
    },
    { 
        id: ChartType.IncomesAndExpensesOverTimeBarChart, 
        title: "Incomes and Expenses Over Time",
        chart: <IncomesAndExpensesOverTimeBarChart />,
        settings: <IncomesAndExpensesOverTimeBarChartSettings />
    },
    { 
        id: ChartType.BalanceOverTimeLineChart, 
        title: "Balance Over Time", 
        chart: <BalanceOverTimeLineChart/>,
        settings: <BalanceOverTimeLineChartSettings/>
    },
    { 
        id: ChartType.BalanceOverTimeForecastLineChart, 
        title: "Balance Over Time Forecast", 
        chart: <BalanceOverTimeForecastLineChart/>,
        settings: <BalanceOverTimeForecastLineChartSettings/>
    },
]

export default observer(function Stats() {
    const {statsStore: {selectedChart, setSelectedChart, statsHasOldData, loadStatsPageCharts}} = useStore();

    const [searchParams, setSearchParams] = useSearchParams();
    const [chartId, setChartId] = useState<string | null>(searchParams.get('chartId'));

    useEffect(() => {
        if(chartId)
            setSelectedChart(charts.find(c => c.id === Number(chartId)) ? Number(chartId) : 0);
    },[chartId])

    useEffect(() => {
        if(statsHasOldData)
            loadStatsPageCharts();
    },[statsHasOldData])

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const id = parseInt(event.target.value)
        const chart = charts.find(c => c.id === id);

        setSelectedChart(chart ? id : 0);
        setChartId(chart ? id.toString() : '0')
        setSearchParams({ chartId: chart ? id.toString() : '0'});
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