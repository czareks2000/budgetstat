import { observer } from "mobx-react-lite"
import { Divider, Grid2, Stack } from "@mui/material"
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

export default observer(function Home() {
    const {
        statsStore: {homePageChartsLoaded, loadHomePageCharts},
        transactionStore: {plannedTransactionsToConfirm},
        budgetStore: {budgetsLoaded, loadBudgets},
        loanStore: {loadCounterpartiesAndLoans, dataLoaded}
    } = useStore();

    useEffect(() => {
        if (!homePageChartsLoaded)
            loadHomePageCharts();
        if (!budgetsLoaded)
            loadBudgets();
        if (!dataLoaded)
            loadCounterpartiesAndLoans();
    }, [homePageChartsLoaded, budgetsLoaded, dataLoaded])

    return (
        <Grid2 container>
            <Grid2 size={"grow"}/>
            <Grid2 size={{xs: 12, xl: 8}}>
                <Stack spacing={2}>
                    <Divider>Home Page</Divider>

                    <Grid2 container direction={"row"} gap={2} display={'flex'} alignItems={"center"}>

                        <Grid2 size={{xs: 12, lg: 'grow'}}>

                            <IncomesExpensesThisMonthCard />

                        </Grid2>
                        <Grid2 size={{xs: 12, lg: 5}}>

                            <CurrentBalanceCard />

                        </Grid2>
                        <Grid2 size={{xs: 12, lg: 'grow'}} >

                            <AvgMonthlyIncomesAndExpensesCard />

                        </Grid2>

                    </Grid2>

                    <Grid2 container gap={2} direction={"row"}>
                        <Grid2 size={{xs: 12, lg: 'grow'}}>
                    
                            <IncomesAndExpensesSumThisMonthChart />

                        </Grid2>
                        <Grid2 size={{xs: 12, lg: 'grow'}}>
                          
                            <BalanceLastMonthLineChart />

                        </Grid2>
                    </Grid2>

                    <Grid2 container gap={2}>
                        <Grid2 size={{xs: 12, lg: 'grow'}}>
                            <Stack spacing={2}>

                                {plannedTransactionsToConfirm.length > 0 &&
                                    <TransactionsToConfirmCard />
                                }

                                <LoansCard />

                                <BudgetsCard/>

                            </Stack>
                        </Grid2>
                        <Grid2 size={{xs: 12, lg: 'grow'}}>
                            <Stack spacing={2}>

                                <NoDecorationLink to={"/accounts"} 
                                    content={<AccountsCard />} />
                                
                                <TransactionsCard />

                                {plannedTransactionsToConfirm.length === 0 &&
                                    <TransactionsToConfirmCard />
                                }

                            </Stack>
                        </Grid2>
                    </Grid2>

                </Stack>
            </Grid2>
            <Grid2 size={"grow"}/>
        </Grid2>
    )
})