import { observer } from "mobx-react-lite"
import { Box, Divider, Grid, Paper, Stack } from "@mui/material"
import CurrentBalanceCard from "./cards/CurrentBalanceCard"
import IncomesExpensesThisMonthCard from "./cards/IncomesExpensesThisMonthCard"
import AvgMonthlyIncomesAndExpensesCard from "./cards/AvgMonthlyIncomesAndExpensesCard"

export default observer(function Home() {
    return (
        <Grid container>
            <Grid item xs lg xl/>
            <Grid item xs={12} xl={8}>
                <Stack spacing={2}>
                    <Divider>Home Page</Divider>

                    <Grid container direction={"row"} gap={2} display={'flex'} alignItems={"center"}>

                        <Grid item xs={12} lg >

                            <IncomesExpensesThisMonthCard />

                        </Grid>
                        <Grid item xs={12} lg={5} >

                            <CurrentBalanceCard />

                        </Grid>
                        <Grid item xs={12} lg >

                            <AvgMonthlyIncomesAndExpensesCard />

                        </Grid>

                    </Grid>

                    <Grid container gap={2}>
                        <Grid item xs={12} lg>
                            <Stack spacing={2}>

                                <Paper><Box p={2} height={300}>Incomes expenses sum chart this month</Box></Paper>
                                <Paper><Box p={2} height={100}>Accounts list</Box></Paper>
                                <Paper><Box p={2} height={200}>Loans summary</Box></Paper>

                            </Stack>
                        </Grid>
                        <Grid item xs={12} lg>
                            <Stack spacing={2}>

                                <Paper><Box p={2} height={300}>Account balance last 30 days</Box></Paper>
                                <Paper><Box p={2} height={150}>Budgets</Box></Paper>
                                <Paper><Box p={2} height={100}>Transactions to confirm</Box></Paper>

                            </Stack>
                        </Grid>
                    </Grid>

                </Stack>
            </Grid>
            <Grid item xs lg xl/>
        </Grid>
    )
})