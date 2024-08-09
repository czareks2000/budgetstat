import { Box, Divider, Paper, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { FormikHelpers } from "formik";
import { useStore } from "../../app/stores/store";
import { BudgetFormValues, BudgetDto } from "../../app/models/Budget";
import BudgetForm from "../../components/forms/Budget/BudgetForm";
import { router } from "../../app/router/Routes";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";
import { BudgetPeriod } from "../../app/models/enums/BudgetPeriod";
import ExpensesChart from "./ExpensesChart";

export default observer(function CreateBudget() {
    const {
        budgetStore: {createBudget, loadChart},
        currencyStore: {defaultCurrency}
    } = useStore();

    const handleGoBack = () => {
        router.navigate('/budgets');
        loadChart([]);
    }

    function handleCreate(budget: BudgetDto, formikHelpers: FormikHelpers<BudgetFormValues>): void {
        createBudget(budget).then(() => {
            formikHelpers.resetForm();
            handleGoBack();
        });
    }

    const initialValues: BudgetFormValues = {
        name: "",
        categories: [],
        period: BudgetPeriod.Month,
        amount: null,
    }

    return (
    <ResponsiveContainer content={
        <Stack spacing={2}>
            <Divider>Create Budget</Divider>
            <Paper>
                <Box p={2}>
                    <BudgetForm
                        currencySymbol={defaultCurrency!.symbol}
                        initialValues={initialValues} 
                        onSubmit={handleCreate} 
                        onCancel={handleGoBack}
                        submitText="Create"/>
                </Box>
            </Paper>
            <ExpensesChart />
        </Stack>
    }/>
  )
})