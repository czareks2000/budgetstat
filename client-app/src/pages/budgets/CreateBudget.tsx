import { Box, Divider, Grid, Paper, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { FormikHelpers } from "formik";
import { useStore } from "../../app/stores/store";
import { BudgetCreateFormValues, BudgetCreateDto } from "../../app/models/Budget";
import CreateBudgetForm from "../../components/forms/CreateBudgetForm";
import { router } from "../../app/router/Routes";

export default observer(function CreateBudget() {
    const {budgetStore: {createBudget}} = useStore();
  
    function handleCreate(budget: BudgetCreateDto, formikHelpers: FormikHelpers<BudgetCreateFormValues>): void {
        createBudget(budget).then(() => {
            formikHelpers.resetForm();
            router.navigate('/budgets');
        });
    }

    const handleCancel = () => {
        router.navigate('/budgets');
    }
  
    return (
    <Grid container>
        <Grid item xs lg xl/>
        <Grid item xs={12} lg={8} xl={6}>
            <Stack spacing={2}>
                <Divider>Create Budget</Divider>
                <Paper>
                    <Box p={2}>
                        <CreateBudgetForm onSubmit={handleCreate} onCancel={handleCancel}/>
                    </Box>
                </Paper>
            </Stack>
        </Grid>
        <Grid item xs lg xl/>
    </Grid>
  )
})