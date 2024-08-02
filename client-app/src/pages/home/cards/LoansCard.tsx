import { Box, Divider, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { ArrowForward, PendingActions } from '@mui/icons-material';
import { LoanType } from '../../../app/models/enums/LoanType';
import { formatAmount } from '../../../app/utils/FormatAmount';
import NoDecorationLink from '../../../components/common/NoDecorationLink';
import { GroupedLoan } from '../../../app/models/Loan';

export default observer(function LoansCard() {
  const {
      loanStore: {groupedLoansByCounterpartyAndCurrency},
  } = useStore();

  const listItem = (loanType: LoanType, counterpartyName: string) => {
    if (loanType === LoanType.Credit)
        return (
            <>
                {counterpartyName} 
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
                {counterpartyName}
            </>
        );
    }

    const color = (loanType: LoanType) => {
        return loanType === LoanType.Credit ? 'success.main' : 'error.main';
    }

    const amount = (summary: GroupedLoan) => {
        summary = summary.loanType === LoanType.Credit 
        ? 
            {...summary} 
        : 
            {...summary, currentAmount: -summary.currentAmount, fullAmount: -summary.fullAmount}
    
        const remainingAmount = summary.fullAmount - summary.currentAmount;

        return (
            <Typography color={color(summary.loanType)}>
                {formatAmount(remainingAmount)} {summary.currency.symbol}
            </Typography>
        )
    }

  return (
    <Paper>
        <Stack>
            <NoDecorationLink to={"/loans"} 
            content={
                <Box display={'flex'} p={2}>
                <PendingActions/>
                <Typography ml={1}>
                    Loans summary
                </Typography>
            </Box>} />
            <Divider/>
            {groupedLoansByCounterpartyAndCurrency.filter(s => s.nearestRepaymentDate).length > 0 
            ?
            <List disablePadding sx={{p: 1}}>
                {groupedLoansByCounterpartyAndCurrency.filter(s => s.nearestRepaymentDate).map((summary) => 
                    <NoDecorationLink to={`/loans/counterparty/${summary.counterpartyId}?currencyId=${summary.currencyId}`}
                    key={`${summary.counterpartyId}-${summary.currencyId}`} 
                    content={<ListItem
                        secondaryAction={amount(summary)}
                        >
                        <ListItemText 
                            primary={listItem(summary.loanType, summary.counterparty.name)}/>
                    </ListItem>} />
                )}
            </List>
            :
            <Box p={2}>
                <Typography>There are no loans with in progress status</Typography>
            </Box>
            }       
        </Stack>
    </Paper>
  )
})