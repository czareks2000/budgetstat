import { observer } from 'mobx-react-lite'
import ResponsiveContainer from '../../components/common/ResponsiveContainer'
import { Box, Divider, Paper, Stack } from '@mui/material'
import { router } from '../../app/router/Routes'
import { useParams } from 'react-router-dom'
import EditLoanForm from '../../components/forms/Loan/EditLoanForm'
import { useEffect } from 'react'
import { useStore } from '../../app/stores/store'
import LoanItem from './LoanItem'

export default observer(function EditLoan() {  
    const {
        loanStore: {selectLoan, selectedLoan: loan},
    } = useStore();

    const {id} = useParams();
    useEffect(() => {
        if (id) selectLoan(parseInt(id));
    }, [id, selectLoan])
    
    if (!loan) return <></>

    const handleRedirect = () => {
        router.navigate(`/loans/${id}`);
    }
  
    return (
    <ResponsiveContainer content={
        <Stack spacing={2}>
            <Divider>Loan details</Divider>
            <LoanItem loan={loan} noButtons/>
            <Divider>Edit Loan</Divider>
            <Paper>
                <Box p={2}>
                    <EditLoanForm
                        loan={loan}
                        onSubmit={handleRedirect} 
                        onCancel={handleRedirect}/>
                </Box>
            </Paper>
        </Stack>
    }/>
  )
})