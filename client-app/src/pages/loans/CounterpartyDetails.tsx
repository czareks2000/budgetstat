import { observer } from "mobx-react-lite"
import FloatingAddButton from "../../components/common/FloatingAddButton"
import { router } from "../../app/router/Routes";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";
import { Box, Divider, Paper, Stack } from "@mui/material";
import CounterpartySummaryItem from "./CounterpartySummaryItem";
import FloatingGoBackButton from "../../components/common/FloatingGoBackButton";
import { useStore } from "../../app/stores/store";
import { useParams } from "react-router-dom";
import { LoanType } from "../../app/models/enums/LoanType";
import LoanItem from "./LoanItem";

export default observer(function CounterpartyDetails() {
    const {loanStore: {getCounterpartyGroupedLoans, getCounterpartyLoans}} = useStore();

    const {id} = useParams();

    const handleAddButtonClick = () => {
        router.navigate(`/loans/create?counterpartyId=${id}`);
    }

    const handleGoBack = () => {
        router.navigate('/loans');
    }

    const summaries = getCounterpartyGroupedLoans(Number(id));

    const credits = getCounterpartyLoans(Number(id), LoanType.Credit);
    const debts = getCounterpartyLoans(Number(id), LoanType.Debt);
    
    return (
        <>
        <FloatingGoBackButton onClick={handleGoBack} position={1}/>
        <FloatingAddButton onClick={handleAddButtonClick} position={0}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Counterparty loans summary</Divider>
                {summaries.map((summary) => 
                    <CounterpartySummaryItem 
                        key={`${summary.counterpartyId}-${summary.currencyId}`}
                        archiveLink 
                        summary={summary}/>
                )}
                <Divider>Payoff</Divider>
                <Paper>
                    <Box p={2}>
                        formularz do spłaty zbiorowej
                    </Box>
                </Paper>
                {credits.length > 0 &&
                <Divider>Credits</Divider>}
                {credits.map((loan) => 
                    <LoanItem key={loan.id} loan={loan} detailsAction/>
                )}
                {debts.length > 0 &&
                <Divider>Debts</Divider>}
                {debts.map((loan) => 
                    <LoanItem key={loan.id} loan={loan} detailsAction/>
                )}
            </Stack>
        }/>
        </>
    )
})