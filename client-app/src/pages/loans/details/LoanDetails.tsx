import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../../components/common/ResponsiveContainer"
import { Accordion, AccordionDetails, AccordionSummary, Divider, Stack } from "@mui/material"
import { useStore } from "../../../app/stores/store";
import { useParams } from "react-router-dom";
import FloatingGoBackButton from "../../../components/common/FloatingGoBackButton";
import { router } from "../../../app/router/Routes";
import LoanItem from "../LoanItem";
import CreatePayoffForm from "../../../components/forms/Loan/CreatePayoffForm";
import PayoffList from "./PayoffList";
import { useEffect, useState } from "react";
import { ExpandMore } from "@mui/icons-material";
import { LoanStatus } from "../../../app/models/enums/LoanStatus";

export default observer(function LoanDetails() {
    const {
        loanStore: {deletePayoff, selectLoan, selectedLoan: loan},
        currencyStore: {currencies}
    } = useStore();

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const {id} = useParams();
    useEffect(() => {
        if (id) selectLoan(parseInt(id));
    }, [id, selectLoan])

    if (!loan) return <></>

    const currency = currencies.find(c => c.id === loan.currencyId);

    const inProgress = loan.loanStatus === LoanStatus.InProgress;

    const handleGoBack = () => {
        if (inProgress)
            router.navigate(`/loans/counterparty/${loan.counterpartyId}`);
        else
            router.navigate(`/loans/counterparty/${loan.counterpartyId}/paidoff`);
    }

    const handleDeletePayoff = (payoffId: number) => {
        deletePayoff(payoffId);
    }    
    
    return (
        <>
        <FloatingGoBackButton onClick={handleGoBack}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>

                <Divider>Loan details</Divider>
                <LoanItem key={loan.id} loan={loan}/>
                
                {inProgress &&
                <>
                    <Divider>Repayment</Divider>
                    <Accordion expanded={isOpen} onChange={handleToggle}>
                        <AccordionSummary
                        expandIcon={<ExpandMore />}
                        aria-controls="create-payoff-form"
                        id="create-payoff-form"
                        >
                            {!isOpen ? 'Click to open' : 'Click to hide'}
                        </AccordionSummary>
                        <AccordionDetails>
                            <CreatePayoffForm loanId={loan.id}/>      
                        </AccordionDetails>
                    </Accordion>
                </>}

                {loan.payoffs.length > 0 && <>
                    <Divider>Payoffs</Divider>
                    <PayoffList 
                        payoffs={loan.payoffs} 
                        currencySymbol={currency!.symbol} 
                        onDelete={handleDeletePayoff}
                    />
                </>}
            </Stack>
        }/>
        </>
    )
})