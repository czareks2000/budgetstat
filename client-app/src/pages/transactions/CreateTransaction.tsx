import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, Paper, Stack } from "@mui/material"
import CreateTransactionForm from "../../components/forms/Transaction/CreateTransactionForm"
import { useSearchParams } from "react-router-dom"
import { useStore } from "../../app/stores/store"

export default observer(function CreateTransaction() {
    const {accountStore: {validateParam}} = useStore();
    const [searchParams] = useSearchParams();
    
    return ( 
        <>
            <ResponsiveContainer content={
                <Stack spacing={2}>
                    <Divider>Create Transaction</Divider>
                    <Paper>
                        <Box p={2}>
                            <CreateTransactionForm 
                                accountId={validateParam(searchParams.get('accountId'))}/>
                        </Box>
                    </Paper>
                </Stack>
            } />
        </>
        )
})