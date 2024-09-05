import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import FloatingAddButton from "../../components/common/fabs/FloatingAddButton"
import { router } from "../../app/router/Routes"
import { Divider, Stack } from "@mui/material"
import CounterpartySummaryItem from "./counterparty/CounterpartySummaryItem"
import { useStore } from "../../app/stores/store"
import { useEffect } from "react"
import { LoanStatus } from "../../app/models/enums/LoanStatus"
import FadeInLoadingWithLabel from "../../components/common/loadings/FadeInLoadingWithLabel"

export default observer(function Loans() {
    const {loanStore: {
        groupedLoansByCounterpartyAndCurrency, counterpartiesLoaded, 
        loadCounterparties, loansInProgressLoaded, loadLoans}
    } = useStore();

    useEffect(() => {
        if (!counterpartiesLoaded)
            loadCounterparties();
        if (!loansInProgressLoaded)
            loadLoans(LoanStatus.InProgress);
    }, [counterpartiesLoaded, loansInProgressLoaded])

    const handleAddButtonClick = () => {
        router.navigate('/loans/create');
    }
    
    return (
        <>
        <FloatingAddButton onClick={handleAddButtonClick}/>
        <ResponsiveContainer content={
            <FadeInLoadingWithLabel loadingFlag={counterpartiesLoaded && loansInProgressLoaded} content={
                <Stack spacing={2}>
                    {groupedLoansByCounterpartyAndCurrency.length > 0 ? 
                        <Divider>Loans summary</Divider>
                    :
                        <Divider>You have no loans</Divider>
                    }
                    {groupedLoansByCounterpartyAndCurrency.map((summary) => 
                        <CounterpartySummaryItem 
                        key={`${summary.counterpartyId}-${summary.currencyId}`} 
                        summary={summary} detailsAction/>
                    )}
                </Stack>
            }/>
            
        }/>
        </>
    )
})