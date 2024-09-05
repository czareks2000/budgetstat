import { observer } from 'mobx-react-lite'
import ResponsiveContainer from '../../components/common/ResponsiveContainer'
import { Box, Divider, Paper, Stack } from '@mui/material'
import CreateLoanForm from '../../components/forms/Loan/CreateLoanForm'
import CreateCounterpartyForm from '../../components/forms/Loan/CreateCounterpartyForm'
import { useSearchParams } from 'react-router-dom'
import { useStore } from '../../app/stores/store'
import { router } from '../../app/router/Routes'
import { useEffect } from 'react'
import FadeInLoadingWithLabel from '../../components/common/loadings/FadeInLoadingWithLabel'
import { LoanStatus } from '../../app/models/enums/LoanStatus'

export default observer(function CreateLoan() {  
    const {loanStore: {counterparties, 
        counterpartiesLoaded, loadCounterparties,
        loansInProgressLoaded, loadLoans}} = useStore();
    const [searchParams] = useSearchParams();
    const id = searchParams.get('counterpartyId');
    const fromLocation = searchParams.get('fromLocation');

    useEffect(() => {
        if (!counterpartiesLoaded)
            loadCounterparties();
        if (!loansInProgressLoaded)
            loadLoans(LoanStatus.InProgress);
    }, [counterpartiesLoaded, loansInProgressLoaded])

    const onCancel = () => {
        if (id)
            router.navigate(`/loans/counterparty/${id}`);
        else if (fromLocation === 'net-worth')
            router.navigate(`/net-worth`);
        else
            router.navigate(`/loans`);
    }
  
    return (
    <ResponsiveContainer content={
        <FadeInLoadingWithLabel loadingFlag={counterpartiesLoaded && loansInProgressLoaded} content={
            <Stack spacing={2}>
                {counterparties.length > 0 && <>
                <Divider>Create Loan</Divider>
                <Paper>
                    <Box p={2}>
                        <CreateLoanForm 
                            counterpartyId={id}
                            onCancel={onCancel}/>
                    </Box>
                </Paper></>}
                <Divider>Create Counterparty</Divider>
                <Paper>
                    <Box p={2}>
                        <CreateCounterpartyForm cancelButton={counterparties.length == 0} onCancel={onCancel} />
                    </Box>
                </Paper>
            </Stack>}
        />
    }/>
  )
})
