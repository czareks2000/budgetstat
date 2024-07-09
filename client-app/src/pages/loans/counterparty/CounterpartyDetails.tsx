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
import CreatePayoffForm from "../../../components/forms/Loan/CreatePayoffForm";
import CounterpartySummaryWithPagination from "./CounterpartySummaryWithPagination";

export default observer(function CounterpartyDetails() {
    const {loanStore: {getCounterpartyGroupedLoans, getCounterpartyLoans}} = useStore();

    const {id} = useParams();

    const summaries = getCounterpartyGroupedLoans(Number(id));

    const credits = getCounterpartyLoans(Number(id), LoanType.Credit);
    const debts = getCounterpartyLoans(Number(id), LoanType.Debt);

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const handleAddButtonClick = () => {
        router.navigate(`/loans/create?counterpartyId=${id}`);
    }

    const handleGoBack = () => {
        router.navigate('/loans');
    }

    const handleShowHistory = () => {
        router.navigate(`/loans/counterparty/${id}/paidoff`);
    }
    
    return (
        <>
        <FloatingGoBackButton onClick={handleGoBack} position={1}/>
        <FloatingAddButton onClick={handleAddButtonClick} position={0}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Counterparty summary</Divider>
                <CounterpartySummaryWithPagination summaries={summaries} 
                    onClick={handleShowHistory}
                    buttonText="Show history"/>

                <Divider>Collective repayment</Divider>
                <Accordion expanded={isOpen} onChange={handleToggle}>
                    <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="create-payoff-form"
                    id="create-payoff-form"
                    >
                        {!isOpen ? 'Click to open' : 'Click to hide'}
                    </AccordionSummary>
                    <AccordionDetails>
                        <CreatePayoffForm loanId={1}/>      
                    </AccordionDetails>
                </Accordion> 
                
                {debts.length > 0 &&
                <Divider>Debts</Divider>}
                {debts.map((loan) => 
                    <LoanItem key={loan.id} loan={loan} detailsAction/>
                )}

                {credits.length > 0 &&
                <Divider>Credits</Divider>}
                {credits.map((loan) => 
                    <LoanItem key={loan.id} loan={loan} detailsAction/>
                )}
            </Stack>
        }/>
        </>
    )
})