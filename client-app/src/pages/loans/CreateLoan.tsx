import { observer } from 'mobx-react-lite'
import ResponsiveContainer from '../../components/common/ResponsiveContainer'
import { Box, Divider, Paper, Stack } from '@mui/material'
import CreateLoanForm from '../../components/forms/Loan/CreateLoanForm'
import { router } from '../../app/router/Routes'
import CreateCounterpartyForm from '../../components/forms/Loan/CreateCounterpartyForm'

export default observer(function CreateLoan() {  
    const handleCreateLoanFormSubmit = () => {
        router.navigate('/loans');
    }

    const handleCreateLoanFormCancel = () => {
        router.navigate('/loans');
    }
  
    return (
    <ResponsiveContainer content={
        <Stack spacing={2}>
            <Divider>Create Loan</Divider>
            <Paper>
                <Box p={2}>
                    <CreateLoanForm 
                        onSubmit={handleCreateLoanFormSubmit} 
                        onCancel={handleCreateLoanFormCancel}/>
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
