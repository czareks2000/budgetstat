import { Box, Divider, MenuItem, Paper, Stack, TextField } from "@mui/material"
import BalanceOverTimeLineChart from "./charts/BalanceOverTimeLineChart";
import IncomesAndExpensesOverTimeBarChart from "./charts/IncomesAndExpensesOverTimeBarChart";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";
import BalanceOverTimeLineChartSettings from "./settings/BalanceOverTimeLineChartSettings";
import { observer } from "mobx-react-lite";
import { useState } from "react";

const charts = [
    { 
        id: 1, 
        title: "Incomes and Expenses Over Time",
        chart: <IncomesAndExpensesOverTimeBarChart />,
        settings: <TextField label={"year"} value={"2024"}></TextField>
    },
    { 
        id: 2, 
        title: "Balance Over Time", 
        chart: <BalanceOverTimeLineChart/>,
        settings: <BalanceOverTimeLineChartSettings/>
    },
]

export default observer(function Stats() {
    const [selectedChart, setSelectedChart] = useState(charts[1]);

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const id = parseInt(event.target.value)
        setSelectedChart(charts.find(c => c.id === id)!);
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
                                value={selectedChart.id}
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
                    {selectedChart.chart}
                    <Divider>Chart settings</Divider>
                    <Paper>
                        <Box p={2}>
                            {selectedChart.settings}
                        </Box>
                    </Paper>
            </Stack>
        } 
        />
    </>   
    )
})