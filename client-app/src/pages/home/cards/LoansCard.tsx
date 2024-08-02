import { Box, Divider, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { ArrowForward, PendingActions } from '@mui/icons-material';
import { LoanType } from '../../../app/models/enums/LoanType';
import { formatAmount } from '../../../app/utils/FormatAmount';
import NoDecorationLink from '../../../components/common/NoDecorationLink';

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
            {true &&
            <List disablePadding sx={{p: 1}}>
                {groupedLoansByCounterpartyAndCurrency.filter(s => s.nearestRepaymentDate).map((summary) => 
                    <NoDecorationLink to={`/loans/counterparty/${summary.counterpartyId}?currencyId=${summary.currencyId}`}
                    key={`${summary.counterpartyId}-${summary.currencyId}`} 
                    content={<ListItem
                        secondaryAction={
                            <Typography color={color(summary.loanType)}>
                                {formatAmount(summary.fullAmount-summary.currentAmount)} {summary.currency.symbol}
                            </Typography>}
                        >
                        <ListItemText 
                            primary={listItem(summary.loanType, summary.counterparty.name)}/>
                    </ListItem>} />
                )}
            </List>}            
        </Stack>
    </Paper>
  )
})