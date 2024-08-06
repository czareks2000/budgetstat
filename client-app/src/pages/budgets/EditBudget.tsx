import { Box, Divider, Paper, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import { BudgetFormValues, BudgetDto } from "../../app/models/Budget";
import BudgetForm from "../../components/forms/Budget/BudgetForm";
import { router } from "../../app/router/Routes";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import LoadingWithLabel from "../../components/common/loadings/LoadingWithLabel";

export default observer(function EditBudget() {
    const {
        budgetStore: {updateBudget, selectedBudget, selectBudget, deselectBudget}, 
        categoryStore: {convertToCategoryOptions}
    } = useStore();
  
    function handleUpdate(budget: BudgetDto): void {
        updateBudget(selectedBudget!.id, budget).then(() => {
            router.navigate('/budgets');
        });
    }

    const handleCancel = () => {
        deselectBudget();
        router.navigate('/budgets');
    }

    const {id} = useParams();
    useEffect(() => {
        if (id) 
            selectBudget(parseInt(id));
        else
            router.navigate('/not-found');
    }, [id, selectBudget])

    if (!selectedBudget) return <LoadingWithLabel/>

    const initialValues: BudgetFormValues = {
        name: selectedBudget.name,
        categories: convertToCategoryOptions(selectedBudget.categories),
        period: selectedBudget.period,
        amount: selectedBudget.amount,
    }
  
    return (
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Edit Budget</Divider>
                <Paper>
                    <Box p={2}>
                        <BudgetForm 
                            currencySymbol={selectedBudget.currency.symbol}
                            initialValues={initialValues} 
                            onSubmit={handleUpdate} 
                            onCancel={handleCancel}
                            submitText="Save"/>
                    </Box>
                </Paper>
            </Stack>
        }/>
    )
})