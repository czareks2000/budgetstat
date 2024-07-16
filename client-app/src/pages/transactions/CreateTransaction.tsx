import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Divider, Stack } from "@mui/material"

export default observer(function CreateTransaction() {
    return ( 
        <>
            <ResponsiveContainer content={
                <Stack spacing={2}>
                    <Divider>Create Transaction</Divider>
                </Stack>
            } />
        </>
        )
})