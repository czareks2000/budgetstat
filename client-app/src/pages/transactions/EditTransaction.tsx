import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Divider, Stack } from "@mui/material"

export default observer(function EditTransaction() {
    return ( 
        <>
            <ResponsiveContainer content={
                <Stack spacing={2}>
                    <Divider>EditTransaction</Divider>
                </Stack>
            } />
        </>
        )
})