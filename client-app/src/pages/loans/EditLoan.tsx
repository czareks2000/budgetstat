import { observer } from 'mobx-react-lite'
import ResponsiveContainer from '../../components/common/ResponsiveContainer'
import { Box, Divider, Paper, Stack } from '@mui/material'
import CreateLoanForm from '../../components/forms/Loan/CreateLoanForm'
import { router } from '../../app/router/Routes'
import { useParams } from 'react-router-dom'

export default observer(function EditLoan() {  
    const {id} = useParams();
    
    const handleCreateLoanFormSubmit = () => {
        router.navigate('/loans');
    }

    const handleCreateLoanFormCancel = () => {
        router.navigate(`/loans/${id}`);
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
        </Stack>
    }/>
  )
})