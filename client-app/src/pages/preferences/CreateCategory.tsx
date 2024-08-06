import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, Paper, Stack } from "@mui/material"
import { router } from "../../app/router/Routes"
import CreateCategoryForm from "../../components/forms/Category/CreateCategoryForm"
import { useSearchParams } from "react-router-dom"

export default observer(function CreateCategory() {

    const [searchParams] = useSearchParams();

    const handleGoBack = () => {
        router.navigate('/preferences/categories')
    }

    return (
    <>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Create category</Divider>
                <Paper>
                    <Box p={2}>
                        <CreateCategoryForm 
                            categoryType={Number(searchParams.get('categoryType'))}
                            transactionType={Number(searchParams.get('transactionType'))}
                            mainCategoryId={Number(searchParams.get('mainCategoryId'))}
                            onCancel={handleGoBack}/>
                    </Box>
                </Paper>
            </Stack>
        } 
        />
    </>
    )
})
