import { Box, Card, CardContent, Grid, IconButton, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { GroupedLoan } from "../../../app/models/Loan";
import { useStore } from "../../../app/stores/store";
import { convertToString } from "../../../app/utils/ConvertToString";
import { formatAmount } from "../../../app/utils/FormatAmount";
import { ArrowForward, Delete } from "@mui/icons-material";
import { Counterparty } from "../../../app/models/Counterparty";
import { Currency } from "../../../app/models/Currency";
import { LoanType } from "../../../app/models/enums/LoanType";
import { useState } from "react";
import DeleteCounterpartyDialog from "../dialogs/DeleteCounterpartyDialog";
import NoDecorationLink from "../../../components/common/NoDecorationLink";

interface Props {
    summary: GroupedLoan;
    detailsAction?: boolean;
}

export default observer(function CounterpartySummaryItem({detailsAction, summary}: Props) {
    const {
        loanStore: {counterparties},
        currencyStore: {currencies}
    } = useStore();

    const [open, setOpen] = useState(false);

    summary = summary.loanType === LoanType.Credit 
    ? 
        {...summary} 
    : 
        {...summary, currentAmount: -summary.currentAmount, fullAmount: -summary.fullAmount}

    const counterparty = counterparties.find(c => c.id === summary.counterpartyId) as Counterparty;
    
    const currency = currencies.find(c => c.id === summary.currencyId) as Currency;

    const remainingAmount = summary.fullAmount - summary.currentAmount;

    const header = () => {
        if (summary.loanType === LoanType.Credit)
            return (
                <>
                    {counterparty.name} 
                    <Box component="span" sx={{ verticalAlign: 'middle', display: 'inline-flex', alignItems: 'center' }}>
                        <ArrowForward fontSize="small" sx={{ mx: "6px", mt: "-3px" }} />
                    </Box>
                    You
                </>
            );
        else
            return (
                <>
                    You 
                    <Box component="span" sx={{ verticalAlign: 'middle', display: 'inline-flex', alignItems: 'center' }}>
                        <ArrowForward fontSize="small" sx={{ mx: "6px", mt: "-3px" }} />
                    </Box>
                    {counterparty.name}
                </>
            );
    }

    const progressColor = () => {
        return summary.loanType === LoanType.Credit ? 'success' : 'error';
    }
    
    return (
    <NoDecorationLink
        to={`/loans/counterparty/${summary.counterpartyId}?currencyId=${currency.id}`}
        disabled={!detailsAction}
        content={
            <Card>
            <CardContent>
                <Grid container justifyContent="flex-end">
                    <Grid item xs>
                        <Stack direction={'row'}>
                            <Typography variant="h5" gutterBottom>
                                {header()} 
                            </Typography>
                        </Stack>
                        <Stack>
                            {summary.nearestRepaymentDate ? <>
                                <Typography variant="body1">
                                    Credits: {formatAmount(summary.creditsFullAmount - summary.creditsCurrentAmount)} {currency.symbol}
                                </Typography>
                                <Typography variant="body1">
                                    Debts: {formatAmount(summary.debtsFullAmount - summary.debtsCurrentAmount)} {currency.symbol}
                                </Typography>
                                <Typography variant="body1">
                                    Nearest repayment: {convertToString(summary.nearestRepaymentDate!)}
                                </Typography></>
                            :<>
                                <Typography variant="body1">
                                    This counterparty has no current loans
                                </Typography>
                            </>}
                        </Stack>
                    </Grid>
                    <Grid item xs={'auto'} >
                        {summary.nearestRepaymentDate ?
                        <>
                            <Typography variant="h5" color={`${progressColor()}.main`}>
                                {formatAmount(remainingAmount)} {currency.symbol}
                            </Typography>
                        </>
                        :
                        <>
                            <DeleteCounterpartyDialog 
                                open={open}
                                setOpen={setOpen}
                                counterparty={counterparty} 
                                redirectAfterSubmit={!detailsAction}/>
                            <Box mr={-1}>           
                                <IconButton 
                                    aria-label="delete"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        e.stopPropagation();
                                        setOpen(true);
                                    }}>
                                    <Delete />
                                </IconButton>                     
                            </Box>
                        </>}
                    </Grid> 
                </Grid>
            </CardContent>
        </Card>
    }/>

    )
})