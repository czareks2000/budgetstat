import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, Paper, Stack } from "@mui/material"
import { router } from "../../app/router/Routes"
import CreateCategoryForm from "../../components/forms/Category/CreateCategoryForm"

export default observer(function CreateCategory() {

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
                        <CreateCategoryForm onCancel={handleGoBack}/>
                    </Box>
                </Paper>
            </Stack>
        } 
        />
    </>
    )
})
