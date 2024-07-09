import { Box, Card, CardContent, Grid, LinearProgress, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { GroupedLoan } from "../../../app/models/Loan";
import { useStore } from "../../../app/stores/store";
import { convertToString } from "../../../app/utils/ConvertToString";
import { formatAmount } from "../../../app/utils/FormatAmount";
import { ArrowForward } from "@mui/icons-material";
import { Counterparty } from "../../../app/models/Counterparty";
import { Currency } from "../../../app/models/Currency";
import { LoanType } from "../../../app/models/enums/LoanType";

interface Props {
    summary: GroupedLoan;
}

export default observer(function CounterpartySummaryItem({summary}: Props) {
    const {
        loanStore: {counterparties},
        currencyStore: {currencies}
    } = useStore();

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

    const percentagePaid = Number(((summary.currentAmount / summary.fullAmount) * 100).toFixed(0));

    const progressColor = () => {
        return summary.loanType === LoanType.Credit ? 'success' : 'error';
    }
    
    return (
    <Card>
        <CardContent>
            <Grid container justifyContent="flex-end" mb={2}>
                <Grid item xs>
                    <Stack direction={'row'}>
                        <Typography variant="h5" gutterBottom>
                            {header()} 
                        </Typography>
                    </Stack>
                    <Stack>
                        <Typography variant="body1">
                            Paid: {formatAmount(summary.currentAmount)} / {formatAmount(summary.fullAmount)} {currency.symbol}
                        </Typography>
                        <Typography variant="body1">
                            Remaining: {formatAmount(remainingAmount)} {currency.symbol}
                        </Typography>
                        <Typography variant="body1">
                            Nearest repayment: {convertToString(summary.nearestRepaymentDate)}
                        </Typography>
                    </Stack>
                </Grid>
                <Grid item xs={'auto'} >
                    <Typography variant="h4" color={`${progressColor()}.main`} fontWeight={500}>
                        {formatAmount(remainingAmount)} {currency.symbol}
                    </Typography>
                </Grid>
                
            </Grid>
            <LinearProgress 
                variant="determinate" 
                value={percentagePaid} 
                sx={{height: 10}} 
                color={progressColor()}/>
        </CardContent>
    </Card>
    )
})