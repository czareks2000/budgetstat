import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Divider, Stack } from "@mui/material"
import FloatingGoBackButton from "../../components/common/FloatingGoBackButton"
import { router } from "../../app/router/Routes"
import FloatingAddButton from "../../components/common/FloatingAddButton"

export default observer(function ManageCategories() {

    const handleGoBack = () => {
        router.navigate('/preferences')
    }

    const handleAddButtonClick = () => {
        router.navigate('/preferences/categories/create')
    }

    return (
    <>
        <FloatingGoBackButton onClick={handleGoBack} position={1}/>
        <FloatingAddButton onClick={handleAddButtonClick} />
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Manage Categories</Divider>
                
            </Stack>
        } 
        />
    </>
    )
})