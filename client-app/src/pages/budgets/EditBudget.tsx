import { Box, Divider, Paper, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { FormikHelpers } from "formik";
import { useStore } from "../../app/stores/store";
import { BudgetFormValues, BudgetDto } from "../../app/models/Budget";
import BudgetForm from "../../components/forms/Budget/BudgetForm";
import { router } from "../../app/router/Routes";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";
import { useParams } from "react-router-dom";
import { useEffect } from "react";

export default observer(function EditBudget() {
    const {
        budgetStore: {updateBudget, selectedBudget, selectBudget}, 
        categoryStore: {convertToCategoryOptions}
    } = useStore();
  
    function handleUpdate(budget: BudgetDto, formikHelpers: FormikHelpers<BudgetFormValues>): void {
        updateBudget(selectedBudget!.id, budget).then(() => {
            formikHelpers.resetForm();
            router.navigate('/budgets');
        });
    }

    const handleCancel = () => {
        router.navigate('/budgets');
    }

    const {id} = useParams();
    useEffect(() => {
        if (id) selectBudget(parseInt(id));
    }, [id, selectBudget])

    if (!selectedBudget) return <></>

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