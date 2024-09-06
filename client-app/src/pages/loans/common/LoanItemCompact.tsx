import { Box, Card, CardContent, Divider, Grid2, IconButton, LinearProgress, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import { router } from "../../../app/router/Routes";
import { Loan } from "../../../app/models/Loan";
import { useStore } from "../../../app/stores/store";
import { formatAmount } from "../../../app/utils/FormatAmount";
import { LoanStatus } from "../../../app/models/enums/LoanStatus";
import { LoanType } from "../../../app/models/enums/LoanType";
import { ArrowForward, Delete, Edit } from "@mui/icons-material";
import { Counterparty } from "../../../app/models/Counterparty";
import { Currency } from "../../../app/models/Currency";
import NoDecorationLink from "../../../components/common/NoDecorationLink";
import DeleteLoanDialog from "../dialogs/DeleteLoanDialog";
import { useState } from "react";
import { convertToString } from "../../../app/utils/ConvertToString";

interface Props {
    loan: Loan;
    detailsAction?: boolean;
    noButtons?: boolean;
}

export default observer(function LoanItemCompact({loan, detailsAction, noButtons = false}: Props) {
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
                    <> : {formatAmount(loan.fullAmount)} {currency.symbol}</>
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
                    <> : {formatAmount(loan.fullAmount)} {currency.symbol}</>
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
                    <Grid2 container justifyContent="flex-end">
                            <Grid2 size={"grow"}>
                                <Stack direction={'row'}>
                                    <Typography variant="h6">
                                        {header()}
                                    </Typography>
                                </Stack>
                                <Stack>
                                    <Typography variant="subtitle2">
                                        {/* <i>{!inProgress && <>{convertToString(loan.loanDate)} - </>}{loan.description || "(no description)"}</i> */}
                                        <i>{<>{convertToString(loan.loanDate)} - </>}{loan.description || "(no description)"}</i>
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
                        {inProgress &&
                        <Box mt={1}> 
                            <Divider /> 
                            <Box>
                                <LinearProgress 
                                    variant="determinate" 
                                    value={percentagePaid} 
                                    sx={{height: 10}} 
                                    color={progressColor()}/>
                            </Box>
                        </Box>}                       
                </CardContent>
            </Card>
        }/>
        </>
    )
})