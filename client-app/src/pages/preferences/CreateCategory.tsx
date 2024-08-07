import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, Paper, Stack } from "@mui/material"
import { router } from "../../app/router/Routes"
import CategoryForm from "../../components/forms/Category/CategoryForm"
import { useSearchParams } from "react-router-dom"
import { CategoryType } from "../../app/models/enums/CategoryType"
import { useState } from "react"
import { TransactionType } from "../../app/models/enums/TransactionType"
import { CategoryFormValues } from "../../app/models/Category"
import { useStore } from "../../app/stores/store"

export default observer(function CreateCategory() {
    const {categoryStore: {createCategory, validateMainCategoryId}} = useStore();

    const [searchParams] = useSearchParams();

    const handleGoBack = () => {
        router.navigate('/preferences/categories')
    }

    const [categoryType] = useState(Number(searchParams.get('categoryType')) === CategoryType.Sub 
        ? CategoryType.Sub : CategoryType.Main);
    const [transactionType] = useState(Number(searchParams.get('transactionType')) === TransactionType.Income 
        ? TransactionType.Income : TransactionType.Expense);
    const [mainCategoryId] = useState(validateMainCategoryId(Number(searchParams.get('mainCategoryId')), transactionType));

    const initialValues: CategoryFormValues = {
        categoryType: categoryType,
        transactionType: transactionType,
        name: "",
        iconId: "",
        mainExpenseCategoryId: (categoryType === CategoryType.Sub && transactionType === TransactionType.Expense ) 
            ? mainCategoryId : "",
        mainIncomeCategoryId: (categoryType === CategoryType.Sub && transactionType === TransactionType.Income ) 
            ? mainCategoryId : "",
    }

    const handleSubmit = (values: CategoryFormValues) => {
        const type = values.transactionType === TransactionType.Expense ? 'expense' : 'income';

        createCategory(values).then(() => {
            router.navigate(`/preferences/categories?type=${type}`);
        });
    }

    return (
    <>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Create category</Divider>
                <Paper>
                    <Box p={2}>
                        <CategoryForm 
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            onCancel={handleGoBack}/>
                    </Box>
                </Paper>
            </Stack>
        } 
        />
    </>
    )
})
