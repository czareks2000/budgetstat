import { Divider, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store"
import BudgetsList from "./BudgetsList"
import DeleteBudgetDialog from "./DeleteBudgetDialog"
import { useState } from "react"
import { router } from "../../app/router/Routes"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import FloatingAddButton from "../../components/common/FloatingAddButton"

export default observer(function Budgets() {
    const {budgetStore: {weeklyBudgets, monthlyBudgets, annualBudgets, selectedBudget}} = useStore()

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    }

    const handleAddButtonClick = () => {
        router.navigate('/budgets/create');
    }

    return (
    <>  
        <DeleteBudgetDialog key={selectedBudget?.id} open={openDeleteDialog} setOpen={setOpenDeleteDialog} />
        <FloatingAddButton onClick={handleAddButtonClick}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                {weeklyBudgets.length === 0 && monthlyBudgets.length === 0 && annualBudgets.length === 0 &&
                    <Divider>You have no budgets</Divider>
                }
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