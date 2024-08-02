import { observer } from "mobx-react-lite"
import { Box, Divider, Grid, Paper, Stack } from "@mui/material"
import CurrentBalanceCard from "./cards/CurrentBalanceCard"
import IncomesExpensesThisMonthCard from "./cards/IncomesExpensesThisMonthCard"
import AvgMonthlyIncomesAndExpensesCard from "./cards/AvgMonthlyIncomesAndExpensesCard"
import TransactionsToConfirmCard from "./cards/TransactionsToConfirmCard"
import { useStore } from "../../app/stores/store"
import BudgetsCard from "./cards/BudgetsCard"
import AccountsCard from "./cards/AccountsCard"
import NoDecorationLink from "../../components/common/NoDecorationLink"
import LoansCard from "./cards/LoansCard"
import TransactionsCard from "./cards/TransactionsCard"

export default observer(function Home() {
    const {
        transactionStore: {plannedTransactionsToConfirm},
    } = useStore();

    
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

                    <Grid container gap={2} direction={"row"}>
                        <Grid item xs={12} lg>
                    
                            <Paper><Box p={2} height={300}>Incomes expenses sum chart this month</Box></Paper>

                        </Grid>
                        <Grid item xs={12} lg>
                          
                            <Paper><Box p={2} height={300}>Account balance last 30 days</Box></Paper>

                        </Grid>
                    </Grid>

                    <Grid container gap={2}>
                        <Grid item xs={12} lg>
                            <Stack spacing={2}>

                                <NoDecorationLink to={"/accounts"} 
                                    content={<AccountsCard />} />

                                <NoDecorationLink to={"/budgets"} 
                                    content={<BudgetsCard/>} />

                            </Stack>
                        </Grid>
                        <Grid item xs={12} lg>
                            <Stack spacing={2}>

                                <LoansCard />
                                
                                <TransactionsCard />

                                {plannedTransactionsToConfirm.length > 0 &&
                                    <TransactionsToConfirmCard /> }

                            </Stack>
                        </Grid>
                    </Grid>

                </Stack>
            </Grid>
            <Grid item xs lg xl/>
        </Grid>
    )
})