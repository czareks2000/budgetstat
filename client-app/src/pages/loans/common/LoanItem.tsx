import { Box, Card, CardContent, Divider, Grid2, IconButton, LinearProgress, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { router } from "../../../app/router/Routes";
import { Loan } from "../../../app/models/Loan";
import { useStore } from "../../../app/stores/store";
import { formatAmount } from "../../../app/utils/FormatAmount";
import { convertToString } from "../../../app/utils/ConvertToString";
import { LoanStatus } from "../../../app/models/enums/LoanStatus";
import { LoanType } from "../../../app/models/enums/LoanType";
import { ArrowForward, Delete, Edit } from "@mui/icons-material";
import { Counterparty } from "../../../app/models/Counterparty";
import { Currency } from "../../../app/models/Currency";
import NoDecorationLink from "../../../components/common/NoDecorationLink";
import DeleteLoanDialog from "../dialogs/DeleteLoanDialog";
import { useState } from "react";
import { calculateSpaces } from "../../../app/utils/CalculateSpaces";

interface Props {
    loan: Loan;
    detailsAction?: boolean;
    noButtons?: boolean;
}

export default observer(function LoanItem({loan, detailsAction, noButtons = false}: Props) {
    const {
        currencyStore: {currencies},
        loanStore: {counterparties},
    } = useStore();

    const [open, setOpen] = useState(false);

    const currency = currencies.find(c => c.id === loan.currencyId) as Currency;

    const counterparty = counterparties.find(c => c.id === loan.counterpartyId) as Counterparty;

    const handleEditClick = () => {
        router.navigate(`/loans/${loan.id}/edit`);
    }

    const header = () => {
        if (loan.loanType === LoanType.Credit)
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

    const percentagePaid = Number(((loan.currentAmount / loan.fullAmount) * 100).toFixed(0));

    const remainingAmount = loan.fullAmount - loan.currentAmount;

    const inProgress = loan.loanStatus === LoanStatus.InProgress;

    const loanEndAmount = `${formatAmount(loan.fullAmount)} ${currency.symbol}`

    const loanStartAmount = `0 ${currency.symbol}`;
    const spacesNeeded = calculateSpaces(loanEndAmount.length, loanStartAmount.length);
    
    const formatedLoanStartAmount = `${loanStartAmount}${spacesNeeded}`;

    const progressColor = () => {
        return loan.loanType === LoanType.Credit ? 'success' : 'error';
    }
    
    return (
        <>
        <DeleteLoanDialog 
            loan={loan} 
            redirectAfterSubmit={!detailsAction}
            open={open}
            setOpen={setOpen} />
        <NoDecorationLink 
            to={`/loans/${loan.id}`} 
            disabled={!detailsAction}
            content={
            <Card>
                <CardContent>
                    <Grid2 container justifyContent="flex-end" mb={2}>
                            <Grid2 size={"grow"}>
                                <Stack direction={'row'}>
                                    <Typography variant="h6">
                                        {header()}
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Typography variant="subtitle2" gutterBottom>
                                        <i>{loan.description || "(no description)"}</i>
                                    </Typography>
                                    {inProgress &&
                                    <Typography variant="subtitle1">
                                        Remaining: {formatAmount(remainingAmount)} {currency.symbol}
                                    </Typography>}
                                </Stack>
                            </Grid2>
                            <Grid2 size={'auto'}>
                                {!noButtons && <>
                                    <Box mr={-1}>
                                        
                                        {inProgress &&
                                        <IconButton 
                                            size="medium"
                                            aria-label="edit"
                                            onClick={(e: any) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleEditClick();
                                            }}>
                                            <Edit />
                                        </IconButton>}
                                        
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
                    <Divider />
                        <Box mt={3}>
                            <Grid2 container justifyContent="space-between">
                                <Grid2>
                                    <Typography variant="body1" gutterBottom>
                                        {convertToString(loan.loanDate)}
                                    </Typography>
                                </Grid2>
                                <Grid2>
                                    <Typography variant="body1" gutterBottom>
                                        {convertToString(loan.repaymentDate)}
                                    </Typography>
                                </Grid2>
                            </Grid2>
                            <Box mb={1}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={percentagePaid} 
                                    sx={{height: 10}} 
                                    color={progressColor()}/>
                            </Box>
                            <Grid2 container justifyContent="space-between">
                                <Grid2>
                                    <Typography variant="body1">
                                        {formatedLoanStartAmount}
                                    </Typography>
                                </Grid2>
                                <Grid2>
                                    <Typography variant="body1">
                                        {formatAmount(loan.currentAmount)} / {formatAmount(loan.fullAmount)} {currency.symbol}
                                    </Typography>
                                </Grid2>
                                <Grid2>
                                    <Typography variant="body1">
                                        {loanEndAmount}
                                    </Typography>
                                </Grid2>
                            </Grid2>
                        </Box>
                </CardContent>
            </Card>
        }/>
        </>
    )
})