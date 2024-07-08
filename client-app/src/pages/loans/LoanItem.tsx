import { Box, Button, Paper } from "@mui/material"
import { observer } from "mobx-react-lite"
import { router } from "../../app/router/Routes";
import { Loan } from "../../app/models/Loan";
import { useStore } from "../../app/stores/store";
import { formatAmount } from "../../app/utils/FormatAmount";
import { convertToString } from "../../app/utils/ConvertToString";
import { LoanStatus } from "../../app/models/enums/LoanStatus";

interface Props {
    loan: Loan;
    detailsAction?: boolean;
}

export default observer(function LoanItem({loan, detailsAction}: Props) {
    const {currencyStore: {currencies}} = useStore();

    const currency = currencies.find(c => c.id === loan.currencyId);

    const handleEditClick = () => {
        router.navigate(`/loans/${loan.id}/edit`);
    }

    const handleDetailsClick = () => {
        router.navigate(`/loans/${loan.id}`);
    }

    const percentagePaid = ((loan.currentAmount / loan.fullAmount) * 100).toFixed(0);

    const allowEdit = loan.loanStatus === LoanStatus.InProgress;
    
    return (
        <Paper>
            <Box p={2}>
                Current amount: {formatAmount(loan.currentAmount)} {currency?.symbol}<br/>
                FullAmount: {formatAmount(loan.fullAmount)} {currency?.symbol}<br/>
                Percentege paid: {percentagePaid} %<br/>
                Loan date: {convertToString(loan.loanDate)}<br/>
                Repayment date: {convertToString(loan.repaymentDate)}<br/>
                Description: {loan.description}<br/>
                {allowEdit &&
                <Button onClick={handleEditClick}>Edit</Button>}
                <Button>Delete</Button>
                {detailsAction &&
                <Button onClick={handleDetailsClick}>Details</Button>}
            </Box>
        </Paper>
    )
})