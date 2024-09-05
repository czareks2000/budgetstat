import { observer } from 'mobx-react-lite'
import ResponsiveContainer from '../../components/common/ResponsiveContainer'
import { Box, Divider, Paper, Stack } from '@mui/material'
import { router } from '../../app/router/Routes'
import { useParams } from 'react-router-dom'
import EditLoanForm from '../../components/forms/Loan/EditLoanForm'
import { useEffect } from 'react'
import { useStore } from '../../app/stores/store'
import LoanItem from './common/LoanItem'
import FloatingGoBackButton from '../../components/common/fabs/FloatingGoBackButton'
import LoadingWithLabel from '../../components/common/loadings/LoadingWithLabel'
import { LoanStatus } from '../../app/models/enums/LoanStatus'
import FadeInLoadingWithLabel from '../../components/common/loadings/FadeInLoadingWithLabel'

export default observer(function EditLoan() {  
    const {
        loanStore: {selectLoan, selectedLoan: loan, counterpartiesLoaded, 
            loadCounterparties, loansInProgressLoaded, loadLoans},
    } = useStore();

    useEffect(() => {
        if (!counterpartiesLoaded)
            loadCounterparties();
        if (!loansInProgressLoaded)
            loadLoans(LoanStatus.InProgress);
    }, [counterpartiesLoaded, loansInProgressLoaded])

    const {id} = useParams();
    useEffect(() => {
        if (id) selectLoan(parseInt(id));
    }, [id, selectLoan])
    
    if (!loan) return <LoadingWithLabel />

    const handleRedirect = () => {
        router.navigate(`/loans/${id}`);
    }
  
    return (<>
    <FloatingGoBackButton onClick={handleRedirect}/>
    <ResponsiveContainer content={
        <FadeInLoadingWithLabel loadingFlag={counterpartiesLoaded && loansInProgressLoaded} content={
            <Stack spacing={2}>
                <Divider>Loan details</Divider>
                <LoanItem key={loan.id} loan={loan} noButtons/>
                <Divider>Edit Loan</Divider>
                <Paper>
                    <Box p={2}>
                        {loan.loanStatus !== LoanStatus.PaidOff 
                        ? 
                            <EditLoanForm
                                key={loan.id}
                                loan={loan}
                                onSubmit={handleRedirect} 
                                onCancel={handleRedirect}/>
                        :
                            <>It is not possible to edit a paid-off loan</>
                        }
                    </Box>
                </Paper>
            </Stack>}
        />
        
    }/>
  </>)
})