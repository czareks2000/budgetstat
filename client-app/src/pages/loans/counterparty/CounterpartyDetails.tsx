import { observer } from "mobx-react-lite"
import FloatingAddButton from "../../../components/common/FloatingAddButton"
import { router } from "../../../app/router/Routes";
import ResponsiveContainer from "../../../components/common/ResponsiveContainer";
import { Accordion, AccordionDetails, AccordionSummary, Divider, Stack } from "@mui/material";
import FloatingGoBackButton from "../../../components/common/FloatingGoBackButton";
import { useStore } from "../../../app/stores/store";
import { useParams } from "react-router-dom";
import { LoanType } from "../../../app/models/enums/LoanType";
import LoanItem from "../LoanItem";
import { useState } from "react";
import { ExpandMore } from "@mui/icons-material";
import CounterpartySummaryWithPagination from "./CounterpartySummaryWithPagination";
import CounterpartyPaidoffLoans from "./CounterpartyPaidoffLoans";
import CollectivePayoffForm from "../../../components/forms/Loan/CollectivePayoffForm";

export default observer(function CounterpartyDetails() {
    const {loanStore: {getCounterpartyGroupedLoans, getCounterpartyLoans}} = useStore();

    const {id} = useParams();

    const summaries = getCounterpartyGroupedLoans(Number(id));

    if (summaries.length == 0)
        router.navigate('/loans');

    const credits = getCounterpartyLoans(Number(id), LoanType.Credit)
        .sort((a,b) => a.repaymentDate.getTime() - b.repaymentDate.getTime());
    const debts = getCounterpartyLoans(Number(id), LoanType.Debt)
        .sort((a,b) => a.repaymentDate.getTime() - b.repaymentDate.getTime());

    const loansCount = credits.length + debts.length;
    const showPayoffForm = loansCount > 0;

    const [isAcordionOpen, setIsAcordionOpen] = useState(false);

    const handleAcordionToggle = () => {
        setIsAcordionOpen(!isAcordionOpen);
    };

    const [showHistory, setShowHistory] = useState(false);

    const handleShowHistoryToggle = () => {
        setShowHistory(!showHistory);
    };

    const handleAddButtonClick = () => {
        router.navigate(`/loans/create?counterpartyId=${id}`);
    }

    const handleGoBack = () => {
        router.navigate('/loans');
    }
    
    return (
        <>
        <FloatingGoBackButton onClick={handleGoBack} position={1}/>
        <FloatingAddButton onClick={handleAddButtonClick} position={0}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Counterparty summary</Divider>
                <CounterpartySummaryWithPagination summaries={summaries} 
                    onClick={handleShowHistoryToggle}
                    buttonText={showHistory ? "Current loans" : "Show history"}/>

                {!showHistory && showPayoffForm &&
                <>
                    <Divider>Collective repayment</Divider>
                    <Accordion expanded={isAcordionOpen} onChange={handleAcordionToggle}>
                        <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="collective-payoff-form"
                        id="collective-payoff-form"
                        >
                            {!isAcordionOpen ? 'Click to open' : 'Click to hide'}
                        </AccordionSummary>
                        <AccordionDetails>
                            <CollectivePayoffForm counterpartyId={Number(id)} />      
                        </AccordionDetails>
                    </Accordion>
                </>}

                {showHistory && 
                    <CounterpartyPaidoffLoans />
                }
                
                {!showHistory && <>
                {debts.length > 0 &&
                <Divider>Debts</Divider>}
                {debts.map((loan) => 
                    <LoanItem key={loan.id} loan={loan} detailsAction/>
                )}

                {credits.length > 0 &&
                <Divider>Credits</Divider>}
                {credits.map((loan) => 
                    <LoanItem key={loan.id} loan={loan} detailsAction/>
                )}</>}
            </Stack>
        }/>
        </>
    )
})