import { Divider, Grid, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store"
import BudgetsList from "./BudgetsList"

export default observer(function Budgets() {
    const {budgetStore: {weeklyBudgets, monthlyBudgets, annualBudgets}} = useStore()

    return (
    <>  
        <Grid container>
            <Grid item xs xl/>
            <Grid item xs={12} xl={8}>
                <Stack spacing={2}>
                    {weeklyBudgets.length > 0 && <>
                        <Divider>Weekly Budgets</Divider>
                        <BudgetsList budgets={weeklyBudgets}/>
                    </>}
                    {monthlyBudgets.length > 0 && <>
                        <Divider>Monthly Budgets</Divider>
                        <BudgetsList budgets={monthlyBudgets}/>
                    </>}
                    {annualBudgets.length > 0 && <>
                        <Divider>Annual Budgets</Divider>
                        <BudgetsList budgets={annualBudgets}/>
                    </>}
                </Stack>
            </Grid>
            <Grid item xs xl/>
        </Grid>
        
    </>
    )
})