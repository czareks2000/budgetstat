import { Box, Card, CardContent, Grid2, IconButton, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { GroupedLoan } from "../../../app/models/Loan";
import { convertToString } from "../../../app/utils/ConvertToString";
import { formatAmount } from "../../../app/utils/FormatAmount";
import { ArrowForward, Delete } from "@mui/icons-material";
import { LoanType } from "../../../app/models/enums/LoanType";
import { useState } from "react";
import DeleteCounterpartyDialog from "../dialogs/DeleteCounterpartyDialog";
import NoDecorationLink from "../../../components/common/NoDecorationLink";

interface Props {
    summary: GroupedLoan;
    detailsAction?: boolean;
}

export default observer(function CounterpartySummaryItem({detailsAction, summary}: Props) {
    const [open, setOpen] = useState(false);

    if (!summary || !summary.counterparty) return <></>

    summary = summary.loanType === LoanType.Credit 
    ? 
        {...summary} 
    : 
        {...summary, currentAmount: -summary.currentAmount, fullAmount: -summary.fullAmount}
   
    const remainingAmount = summary.fullAmount - summary.currentAmount;

    const header = () => {
        if (summary.loanType === LoanType.Credit)
            return (
                <>
                    {summary.counterparty.name} 
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
                    {summary.counterparty.name}
                </>
            );
    }

    const progressColor = () => {
        return summary.loanType === LoanType.Credit ? 'success' : 'error';
    }
    
    return (
        <>
        <DeleteCounterpartyDialog 
            open={open}
            setOpen={setOpen}
            counterparty={summary.counterparty} 
            redirectAfterSubmit={!detailsAction}/>
        <NoDecorationLink
            to={`/loans/counterparty/${summary.counterpartyId}?currencyId=${summary.currency.id}`}
            disabled={!detailsAction}
            content={
                <Card>
                <CardContent>
                    <Grid2 container justifyContent="flex-end">
                        <Grid2 size={"grow"}>
                            <Stack direction={'row'}>
                                <Typography variant="h5" gutterBottom>
                                    {summary.nearestRepaymentDate ? header() : summary.counterparty.name} 
                                </Typography>
                            </Stack>
                            <Stack>
                                {summary.nearestRepaymentDate ? <>
                                    <Typography variant="body1">
                                        Credits: {formatAmount(summary.creditsFullAmount - summary.creditsCurrentAmount)} {summary.currency.symbol}
                                    </Typography>
                                    <Typography variant="body1">
                                        Debts: {formatAmount(summary.debtsFullAmount - summary.debtsCurrentAmount)} {summary.currency.symbol}
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
                        </Grid2>
                        <Grid2 size={'auto'}>
                            {summary.nearestRepaymentDate ?
                            <>
                                <Typography variant="h5" color={`${progressColor()}.main`}>
                                    {formatAmount(remainingAmount)} {summary.currency.symbol}
                                </Typography>
                            </>
                            :
                            <>
                                <Box mr={-1}>           
                                    <IconButton 
                                        aria-label="delete"
                                        onClick={(e: any) => {
                                            e.preventDefault();
                                            e.stopPropagation();
                                            setOpen(true);
                                        }}>
                                        <Delete />
                                    </IconButton>                     
                                </Box>
                            </>}
                        </Grid2> 
                    </Grid2>
                </CardContent>
            </Card>
        }/>
    </>
    )
})