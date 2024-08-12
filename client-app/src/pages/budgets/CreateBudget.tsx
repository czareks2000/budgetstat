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
import { useSearchParams } from "react-router-dom";

export default observer(function CreateBudget() {
    const {
        budgetStore: {createBudget, loadChart},
        currencyStore: {defaultCurrency}
    } = useStore();

    const [searchParams] = useSearchParams();

    const handleGoBack = () => {
        router.navigate(`/budgets?period=${getPeriod()}`);
        loadChart([]);
    }

    function handleCreate(budget: BudgetDto, formikHelpers: FormikHelpers<BudgetFormValues>): void {
        createBudget(budget).then(() => {
            formikHelpers.resetForm();
            handleGoBack();
        });
    }

    const getPeriod = () => {
        const period = parseInt(searchParams.get('period') || "2");
        
        switch (period) {
            case BudgetPeriod.Week:
                return BudgetPeriod.Week;
            case BudgetPeriod.Month:
                return BudgetPeriod.Month;
            case BudgetPeriod.Year:
                return BudgetPeriod.Year;
            default:
                return BudgetPeriod.Month; 
        }
    }

    const initialValues: BudgetFormValues = {
        name: "",
        categories: [],
        period: getPeriod(),
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