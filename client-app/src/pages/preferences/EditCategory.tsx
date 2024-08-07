import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, Paper, Stack } from "@mui/material"
import { router } from "../../app/router/Routes"
import CategoryForm from "../../components/forms/Category/CategoryForm"
import { CategoryFormValues } from "../../app/models/Category"
import { useStore } from "../../app/stores/store"
import { TransactionType } from "../../app/models/enums/TransactionType"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import LoadingWithLabel from "../../components/common/loadings/LoadingWithLabel"
import { CategoryType } from "../../app/models/enums/CategoryType"

export default observer(function EditCategory() {
    const {categoryStore: {updateCategory, selectedCategory, selectCategory, unsetSelectedCategory}} = useStore();

    const handleGoBack = () => {
        router.navigate('/preferences/categories')
    }

    const {id} = useParams();
    useEffect(() => {
        if (id) 
            selectCategory(parseInt(id));
        else
            router.navigate('/not-found');
    }, [id, selectCategory])

    if (!selectedCategory) return <LoadingWithLabel/>

    const initialValues: CategoryFormValues = {
        categoryType: selectedCategory.isMain ? CategoryType.Main : CategoryType.Sub,
        transactionType: selectedCategory.transactionType!,
        name: selectedCategory.name,
        iconId: selectedCategory.iconId!,
        mainExpenseCategoryId: (!selectedCategory.isMain && selectedCategory.transactionType! === TransactionType.Expense ) 
            ? selectedCategory.mainCategoryId! : "",
        mainIncomeCategoryId: (!selectedCategory.isMain && selectedCategory.transactionType! === TransactionType.Income ) 
            ? selectedCategory.mainCategoryId! : "",
    }

    const handleSubmit = (values: CategoryFormValues) => {
        const type = values.transactionType === TransactionType.Expense ? 'expense' : 'income';

        updateCategory(selectedCategory!.id, values).then(() => {
            unsetSelectedCategory();
            router.navigate(`/preferences/categories?type=${type}`);
        });
    }

    return (
    <>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Edit category</Divider>
                <Paper>
                    <Box p={2}>
                        <CategoryForm
                            key={selectedCategory.id} 
                            initialValues={initialValues}
                            onSubmit={handleSubmit}
                            onCancel={handleGoBack}
                            editMode/>
                    </Box>
                </Paper>
            </Stack>
        } 
        />
    </>
    )
})
