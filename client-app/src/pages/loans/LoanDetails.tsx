import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, IconButton, List, ListItem, ListItemText, Paper, Stack } from "@mui/material"
import { useStore } from "../../app/stores/store";
import { useParams } from "react-router-dom";
import { Delete } from "@mui/icons-material";
import { formatAmount } from "../../app/utils/FormatAmount";
import { convertToString } from "../../app/utils/ConvertToString";
import FloatingGoBackButton from "../../components/common/FloatingGoBackButton";
import { router } from "../../app/router/Routes";
import LoanItem from "./LoanItem";
import CreatePayoffForm from "../../components/forms/Loan/CreatePayoffForm";

export default observer(function LoanDetails() {
    const {
        loanStore: {getLoanById},
        currencyStore: {currencies}
    } = useStore();

    const {id} = useParams();

    const loan = getLoanById(Number(id));
    const currency = currencies.find(c => c.id === loan?.currencyId);

    const payoffs = loan?.payoffs.slice().sort((a, b) => b.date.getTime() - a.date.getTime()) || [];

    const handleGoBack = () => {
        router.navigate(`/loans/counterparty/${loan?.counterpartyId}`);
    }

    if (!loan) return <></>
    
    return (
        <>
        <FloatingGoBackButton onClick={handleGoBack}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Loan details</Divider>
                <LoanItem loan={loan}/>
                <Divider>Create payoff</Divider>    
                <Paper>
                    <Box p={2}>
                        <CreatePayoffForm loanId={loan.id} onSubmit={function (): void {
                                throw new Error("Function not implemented.");
                            } } onCancel={function (): void {
                                throw new Error("Function not implemented.");
                            } }/>
                    </Box>
                </Paper>
                {payoffs.length > 0 && 
                <Divider>Payoffs</Divider>}
                <Paper>
                    <List disablePadding>
                    {payoffs?.map((payoff, index) => 
                    
                        <ListItem 
                            key={payoff.id}
                            divider={loan.payoffs.length > index+1}
                            secondaryAction={
                            <IconButton edge={"end"} aria-label="delete">
                                <Delete/>
                            </IconButton>}>
                            <ListItemText primary={
                                `${formatAmount(payoff.amount)} ${currency?.symbol} - ${convertToString(payoff.date)} `}
                                secondary={payoff.description || <i>(no description)</i>}/>
                        </ListItem>                    
                    )}
                    </List>
                </Paper>
            </Stack>
        }/>
        </>
    )
})