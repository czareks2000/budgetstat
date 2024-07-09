import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../../components/common/ResponsiveContainer"
import { Box, CircularProgress, Divider, Stack } from "@mui/material"
import FloatingGoBackButton from "../../../components/common/FloatingGoBackButton"
import { router } from "../../../app/router/Routes"
import { useStore } from "../../../app/stores/store"
import { useParams } from "react-router-dom"
import { LoanType } from "../../../app/models/enums/LoanType"
import { LoanStatus } from "../../../app/models/enums/LoanStatus"
import LoanItem from "../LoanItem"
import CounterpartySummaryWithPagination from "./CounterpartySummaryWithPagination"
import FloatingAddButton from "../../../components/common/FloatingAddButton"
import { useEffect } from "react"

export default observer(function CounterpartyPaidoffLoans() {
    const {loanStore: {getCounterpartyLoans, getCounterpartyGroupedLoans, loadLoans, loansPaidOffLoaded}} = useStore()

    const {id} = useParams();

    useEffect(() => {
        if (!loansPaidOffLoaded)
            loadLoans(LoanStatus.PaidOff);
    }, [loansPaidOffLoaded, loadLoans])

    const handleGoBack = () => {
        router.navigate(`/loans`);
    }

    const handleCurrentLoansClick = () => {
        router.navigate(`/loans/counterparty/${id}`);
    }

    const handleAddButtonClick = () => {
        router.navigate(`/loans/create?counterpartyId=${id}`);
    }

    const summaries = getCounterpartyGroupedLoans(Number(id));

    const credits = getCounterpartyLoans(Number(id), LoanType.Credit, LoanStatus.PaidOff);
    const debts = getCounterpartyLoans(Number(id), LoanType.Debt, LoanStatus.PaidOff);
    
    return (
        <>
        <FloatingGoBackButton onClick={handleGoBack} position={1}/>
        <FloatingAddButton onClick={handleAddButtonClick} position={0}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Counterparty summary</Divider>
                <CounterpartySummaryWithPagination summaries={summaries} 
                    onClick={handleCurrentLoansClick}
                    buttonText="Current loans"
                />
                {loansPaidOffLoaded ? 
                <>
                    {credits.length == 0 && debts.length == 0 &&
                    <Divider>There is no history</Divider>
                    }
                    {credits.length > 0 &&
                    <Divider>Credits history</Divider>}
                    {credits.map((loan) => 
                        <LoanItem key={loan.id} loan={loan}/>
                    )}
                    {debts.length > 0 &&
                    <Divider>Debts history</Divider>}
                    {debts.map((loan) => 
                        <LoanItem key={loan.id} loan={loan} detailsAction/>
                    )}
                </>
                :
                <>
                    <Divider>Loading...</Divider>
                    <Box display={'flex'} justifyContent={'center'}>
                        <CircularProgress />
                    </Box>
                </>
                }
            </Stack>
        }/>
        </>
    )
})