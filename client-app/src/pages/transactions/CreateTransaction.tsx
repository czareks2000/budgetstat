import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, Paper, Stack } from "@mui/material"
import CreateTransactionForm from "../../components/forms/Transaction/CreateTransactionForm"

export default observer(function CreateTransaction() {
    return ( 
        <>
            <ResponsiveContainer content={
                <Stack spacing={2}>
                    <Divider>Create Transaction</Divider>
                    <Paper>
                        <Box p={2}>
                            <CreateTransactionForm />
                        </Box>
                    </Paper>
                </Stack>
            } />
        </>
        )
})