import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../../components/common/ResponsiveContainer"
import { Divider, Stack } from "@mui/material"
import FloatingGoBackButton from "../../../components/common/FloatingGoBackButton"
import { router } from "../../../app/router/Routes"
import CounterpartySummaryItem from "./CounterpartySummaryItem"
import { useStore } from "../../../app/stores/store"
import { useParams } from "react-router-dom"
import { LoanType } from "../../../app/models/enums/LoanType"
import { LoanStatus } from "../../../app/models/enums/LoanStatus"
import LoanItem from "../LoanItem"

export default observer(function CounterpartyPaidoffLoans() {
    const {loanStore: {getCounterpartyLoans, getCounterpartyGroupedLoans}} = useStore()

    const {id} = useParams();

    const handleGoBack = () => {
        router.navigate(`/loans/counterparty/${id}`);
    }

    const summaries = getCounterpartyGroupedLoans(Number(id));

    const credits = getCounterpartyLoans(Number(id), LoanType.Credit, LoanStatus.PaidOff);
    const debts = getCounterpartyLoans(Number(id), LoanType.Debt, LoanStatus.PaidOff);
    
    return (
        <>
        <FloatingGoBackButton onClick={handleGoBack}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Counterparty loans details</Divider>
                {summaries.map((summary) =>
                    <CounterpartySummaryItem 
                        key={`${summary.counterpartyId}-${summary.currencyId}`}
                        summary={summary}/>
                )}
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
                    <LoanItem key={loan.id} loan={loan}/>
                )}
            </Stack>
        }/>
        </>
    )
})