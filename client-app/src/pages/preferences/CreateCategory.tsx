import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Divider, Stack } from "@mui/material"
import { router } from "../../app/router/Routes"

export default observer(function CreateCategory() {

    const handleGoBack = () => {
        router.navigate('/preferences/categories')
    }

    return (
    <>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Create category</Divider>
                
            </Stack>
        } 
        />
    </>
    )
})
