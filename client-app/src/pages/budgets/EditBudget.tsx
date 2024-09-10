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
import ExpensesChart from "./ExpensesChart";
import FadeInLoadingWithLabel from "../../components/common/loadings/FadeInLoadingWithLabel";

export default observer(function EditBudget() {
    const {
        budgetStore: {updateBudget, selectedBudget, selectBudget, deselectBudget, loadChart, budgetsLoaded, loadBudgets}, 
        categoryStore: {convertToCategoryOptions}
    } = useStore();

    useEffect(() => {
        if (!budgetsLoaded)
            loadBudgets();
    }, [budgetsLoaded])
  
    function handleUpdate(budget: BudgetDto): void {
        updateBudget(selectedBudget!.id, budget).then(() => {
            handleCancel();
        });
    }

    const handleCancel = () => {
        deselectBudget();
        loadChart([]);
        router.navigate(`/budgets?period=${selectedBudget?.period}`);
    }

    const {id} = useParams();
    useEffect(() => {
        if (budgetsLoaded)
        {
            if (id) 
                selectBudget(parseInt(id));
            else
                router.navigate('/not-found');
        }
    }, [id, selectBudget, budgetsLoaded])

    if (!selectedBudget) return <LoadingWithLabel/>

    const initialValues: BudgetFormValues = {
        name: selectedBudget.name,
        categories: convertToCategoryOptions(selectedBudget.categories),
        period: selectedBudget.period,
        amount: selectedBudget.amount,
    }
  
    return (
        <ResponsiveContainer content={
            <FadeInLoadingWithLabel loadingFlag={budgetsLoaded} content={
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
            
                
                    <Divider>Expenses on selected categories (last year)</Divider>
                    <Paper>
                        <Box pt={2} mt={-4} height={300}>
                            <ExpensesChart />
                        </Box>
                    </Paper>
                 
                </Stack>
            }/>
            
        }/>
    )
})