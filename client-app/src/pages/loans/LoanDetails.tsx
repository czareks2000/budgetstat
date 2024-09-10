import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Accordion, AccordionDetails, AccordionSummary, Divider, Stack } from "@mui/material"
import { useStore } from "../../app/stores/store";
import { useParams } from "react-router-dom";
import FloatingGoBackButton from "../../components/common/fabs/FloatingGoBackButton";
import { router } from "../../app/router/Routes";
import LoanItem from "./common/LoanItem";
import CreatePayoffForm from "../../components/forms/Loan/CreatePayoffForm";
import PayoffList from "./details/PayoffList";
import { useEffect, useState } from "react";
import { ExpandMore } from "@mui/icons-material";
import { LoanStatus } from "../../app/models/enums/LoanStatus";
import FloatingAddButton from "../../components/common/fabs/FloatingAddButton";
import LoadingWithLabel from "../../components/common/loadings/LoadingWithLabel";

export default observer(function LoanDetails() {
    const {
        loanStore: {deletePayoff, selectLoan, selectedLoan: loan, 
            dataLoaded, loadCounterpartiesAndLoans},
        currencyStore: {currencies}
    } = useStore();

    useEffect(() => {
        if (!dataLoaded)
            loadCounterpartiesAndLoans();
    }, [dataLoaded])

    const [isOpen, setIsOpen] = useState(false);

    const handleToggle = () => {
        setIsOpen(!isOpen);
    };

    const {id} = useParams();
    useEffect(() => {
        if (id) selectLoan(parseInt(id));
    }, [id, selectLoan])

    if (!loan) return <LoadingWithLabel />

    const currency = currencies.find(c => c.id === loan.currencyId);

    const inProgress = loan.loanStatus === LoanStatus.InProgress;

    const handleGoBack = () => {
        router.navigate(`/loans/counterparty/${loan.counterpartyId}?currencyId=${currency!.id}&showHistory=${!inProgress}`);
    }

    const handleDeletePayoff = (payoffId: number) => {
        deletePayoff(payoffId);
    }

    const handleAddButtonClick = () => {
        router.navigate(`/loans/create?counterpartyId=${loan.counterpartyId}`);
    }
    
    return (
        <>
        <FloatingGoBackButton onClick={handleGoBack} position={1}/>
        <FloatingAddButton onClick={handleAddButtonClick} position={0}/>
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
                        <Divider sx={{mb: 1}}/>
                        <AccordionDetails>
                            <CreatePayoffForm />      
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