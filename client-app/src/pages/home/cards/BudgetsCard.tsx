import { Box, Divider, Grid, LinearProgress, List, ListItem, ListItemText, Paper, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { NoteAlt } from '@mui/icons-material';
import { BudgetPeriod } from '../../../app/models/enums/BudgetPeriod';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { BudgetSummary } from '../../../app/models/Budget';

export default observer(function BudgetsCard() {
    const {
        budgetStore: {
            weeklyBudgetsSummary: week, 
            monthlyBudgetsSummary: month, 
            annualBudgetsSummary: annual,
            progressColor,
            startDate,
            endDate,
        },
        currencyStore: {defaultCurrency}
    } = useStore();


    const summaryItem = (period: BudgetPeriod, summary: BudgetSummary, header: string) => {
        return (
            <Box py={2}>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography variant="body1" gutterBottom>
                            {header}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body1" gutterBottom>
                        {formatAmount(summary.currentAmount)} / {formatAmount(summary.fullAmount)} {defaultCurrency?.symbol}
                        </Typography>
                    </Grid>
                </Grid>
                <Box mb={1}>
                    <LinearProgress 
                        variant="determinate" 
                        value={summary.progressValue} 
                        sx={{height: 10}} 
                        color={progressColor(summary.progressValue)}/>
                </Box>
                <Grid container justifyContent="space-between">
                    <Grid item>
                        <Typography variant="body2">
                            {startDate(period)}
                        </Typography>
                    </Grid>
                    <Grid item>
                        <Typography variant="body2">
                            {endDate(period)}
                        </Typography>
                    </Grid>
                </Grid>
            </Box>  
        )
    }

  return (
    <Paper>
        <Stack>
            <Box display={'flex'} p={2}>
                <NoteAlt />
                <Typography ml={1}>
                    Budgets
                </Typography>
            </Box>
        <Divider/>
            <Box px={3}>
                {summaryItem(BudgetPeriod.Week, week, "Weekly")}
                <Divider/> 
                {summaryItem(BudgetPeriod.Month, month, "Monthly")}
                <Divider/>      
                {summaryItem(BudgetPeriod.Year, annual, "Annual")}                           
            </Box>
        </Stack>
    </Paper>
  )
})