import { Box, Button, Paper, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { router } from "../../../app/router/Routes";
import { GroupedLoan } from "../../../app/models/Loan";
import { useStore } from "../../../app/stores/store";
import { convertToString } from "../../../app/utils/ConvertToString";
import { formatAmount } from "../../../app/utils/FormatAmount";

interface Props {
    summary: GroupedLoan;
    archiveLink?: boolean;
}

export default observer(function CounterpartySummaryItem({summary, archiveLink}: Props) {
    const {
        loanStore: {counterparties},
        currencyStore: {currencies}
    } = useStore();

    const counterparty = counterparties.find(c => c.id === summary.counterpartyId);
    
    const currency = currencies.find(c => c.id === summary.currencyId);

    const missingAmount = summary.fullAmount - summary.currentAmount;

    const handleShowArchive = () => {
        router.navigate(`/loans/counterparty/${counterparty?.id}/paidoff`);
    }
    
    return (
        <Paper>
            <Box p={2}>
                <Typography>Counterparty: {counterparty?.name}</Typography>
                <Typography>Current amount: {formatAmount(summary.currentAmount)} {currency?.symbol}</Typography>
                <Typography>Missing amount: {formatAmount(missingAmount)} {currency?.symbol}</Typography>
                <Typography>Full amount: {formatAmount(summary.fullAmount)} {currency?.symbol}</Typography>
                <Typography>Nearest repayment date: {convertToString(summary.nearestRepaymentDate)}</Typography>
                {archiveLink && <Button onClick={handleShowArchive}>Archive</Button>}
            </Box>
        </Paper>
    )
})