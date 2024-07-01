import { Divider, Fab, Grid, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store"
import BudgetsList from "./BudgetsList"
import DeleteBudgetDialog from "./DeleteBudgetDialog"
import { useState } from "react"
import { Add } from "@mui/icons-material"
import { router } from "../../app/router/Routes"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"

export default observer(function Budgets() {
    const {budgetStore: {weeklyBudgets, monthlyBudgets, annualBudgets, selectedBudget}} = useStore()

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    }

    const handleAddButtonClick = () => {
        router.navigate('/budget/create');
    }

    return (
    <>  
        <DeleteBudgetDialog key={selectedBudget?.id} open={openDeleteDialog} setOpen={setOpenDeleteDialog} />
        <Fab 
            color="primary" 
            aria-label="add"
            onClick={handleAddButtonClick} 
            sx={{
                position: "fixed",
                bottom: (theme) => theme.spacing(4),
                right: (theme) => theme.spacing(4)
            }}>
            <Add />
        </Fab>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                {weeklyBudgets.length > 0 && <>
                    <Divider>Weekly Budgets</Divider>
                    <BudgetsList 
                        budgets={weeklyBudgets}
                        openDeleteDialog={handleOpenDeleteDialog}/>
                </>}
                {monthlyBudgets.length > 0 && <>
                    <Divider>Monthly Budgets</Divider>
                    <BudgetsList 
                        budgets={monthlyBudgets} 
                        openDeleteDialog={handleOpenDeleteDialog}/>
                </>}
                {annualBudgets.length > 0 && <>
                    <Divider>Annual Budgets</Divider>
                    <BudgetsList 
                        budgets={annualBudgets} 
                        openDeleteDialog={handleOpenDeleteDialog}/>
                </>}
            </Stack>
        }/>
    </>
    )
})