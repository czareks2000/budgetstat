import { observer } from 'mobx-react-lite'
import ResponsiveContainer from '../../components/common/ResponsiveContainer'
import { Box, Divider, Paper, Stack } from '@mui/material'
import CreateLoanForm from '../../components/forms/Loan/CreateLoanForm'
import CreateCounterpartyForm from '../../components/forms/Loan/CreateCounterpartyForm'
import { useSearchParams } from 'react-router-dom'

export default observer(function CreateLoan() {  
    const [searchParams] = useSearchParams();
    const id = searchParams.get('counterpartyId');
    const fromLocation = searchParams.get('fromLocation');
  
    return (
    <ResponsiveContainer content={
        <Stack spacing={2}>
            <Divider>Create Loan</Divider>
            <Paper>
                <Box p={2}>
                    <CreateLoanForm 
                        counterpartyId={id}
                        redirectToNetWorthOnCancel={fromLocation === 'net-worth'}/>
                </Box>
            </Paper>
            <Divider>Create Counterparty</Divider>
            <Paper>
                <Box p={2}>
                    <CreateCounterpartyForm />
                </Box>
            </Paper>
        </Stack>
    }/>
  )
})
