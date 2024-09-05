import { observer } from "mobx-react-lite"
import { Divider, Grid, Stack } from "@mui/material"
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
import BalanceLastMonthLineChart from "./charts/BalanceLastMonthLineChart"
import IncomesAndExpensesSumThisMonthChart from "./charts/IncomesAndExpensesSumThisMonthChart"
import { useEffect } from "react"
import { LoanStatus } from "../../app/models/enums/LoanStatus"

export default observer(function Home() {
    const {
        statsStore: {homePageChartsLoaded, loadHomePageCharts},
        transactionStore: {plannedTransactionsToConfirm, plannedTransactionsLoaded, loadPlannedTransactions},
        budgetStore: {budgetsLoaded, loadBudgets},
        loanStore: {counterpartiesLoaded, loadCounterparties, loansInProgressLoaded, loadLoans}
    } = useStore();

    useEffect(() => {
        if (!homePageChartsLoaded)
            loadHomePageCharts();
        if (!plannedTransactionsLoaded)
            loadPlannedTransactions();
        if (!budgetsLoaded)
            loadBudgets();
        if (!counterpartiesLoaded)
            loadCounterparties();
        if (!loansInProgressLoaded)
            loadLoans(LoanStatus.InProgress);
    }, [homePageChartsLoaded, plannedTransactionsLoaded, budgetsLoaded, 
        counterpartiesLoaded, loansInProgressLoaded])

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
                    
                            <IncomesAndExpensesSumThisMonthChart />

                        </Grid>
                        <Grid item xs={12} lg>
                          
                            <BalanceLastMonthLineChart />

                        </Grid>
                    </Grid>

                    <Grid container gap={2}>
                        <Grid item xs={12} lg>
                            <Stack spacing={2}>

                                {plannedTransactionsToConfirm.length > 0 &&
                                    <TransactionsToConfirmCard />
                                }

                                <LoansCard />

                                <BudgetsCard/>

                            </Stack>
                        </Grid>
                        <Grid item xs={12} lg>
                            <Stack spacing={2}>

                                <NoDecorationLink to={"/accounts"} 
                                    content={<AccountsCard />} />
                                
                                <TransactionsCard />

                                {plannedTransactionsToConfirm.length === 0 &&
                                    <TransactionsToConfirmCard />
                                }

                            </Stack>
                        </Grid>
                    </Grid>

                </Stack>
            </Grid>
            <Grid item xs lg xl/>
        </Grid>
    )
})