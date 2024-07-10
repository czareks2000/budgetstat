import { Box, Card, CardContent, Divider, Grid, IconButton, LinearProgress, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { router } from "../../app/router/Routes";
import { Loan } from "../../app/models/Loan";
import { useStore } from "../../app/stores/store";
import { formatAmount } from "../../app/utils/FormatAmount";
import { convertToString } from "../../app/utils/ConvertToString";
import { LoanStatus } from "../../app/models/enums/LoanStatus";
import { LoanType } from "../../app/models/enums/LoanType";
import { ArrowForward, Delete, Edit } from "@mui/icons-material";
import { Counterparty } from "../../app/models/Counterparty";
import { Currency } from "../../app/models/Currency";
import NoDecorationLink from "../../components/common/NoDecorationLink";
import DeleteLoanDialog from "./DeleteLoanDialog";
import { useState } from "react";

interface Props {
    loan: Loan;
    detailsAction?: boolean;
    noButtons?: boolean;
}

export default observer(function LoanItem({loan, detailsAction = true, noButtons = false}: Props) {
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
                    <Grid container justifyContent="flex-end" mb={2}>
                            <Grid item xs>
                                <Stack direction={'row'}>
                                    <Typography variant="h5">
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
                            </Grid>
                            <Grid item xs={'auto'} >
                                {!noButtons && <>
                                    <Box mr={-1}>
                                        
                                        {inProgress &&
                                        <IconButton 
                                            size="medium"
                                            aria-label="edit"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                handleEditClick();
                                            }}>
                                            <Edit />
                                        </IconButton>}
                                        
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
                    <Divider />
                        <Box mt={3}>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="body1" gutterBottom>
                                        {convertToString(loan.loanDate)}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1" gutterBottom>
                                        {convertToString(loan.repaymentDate)}
                                    </Typography>
                                </Grid>
                            </Grid>
                            <Box mb={1}>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={percentagePaid} 
                                    sx={{height: 10}} 
                                    color={progressColor()}/>
                            </Box>
                            <Grid container justifyContent="space-between">
                                <Grid item>
                                    <Typography variant="body1">
                                        0 {currency.symbol}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1">
                                        {formatAmount(loan.currentAmount)} / {formatAmount(loan.fullAmount)} {currency.symbol}
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <Typography variant="body1">
                                        {formatAmount(loan.fullAmount)} {currency.symbol}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </Box>
                </CardContent>
            </Card>
        }/>
        </>
    )
})