import { Box, Divider, Grid2, LinearProgress, Paper, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { NoteAlt } from '@mui/icons-material';
import { BudgetPeriod } from '../../../app/models/enums/BudgetPeriod';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { BudgetSummary } from '../../../app/models/Budget';
import NoDecorationLink from '../../../components/common/NoDecorationLink';

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
                <Grid2 container justifyContent="space-between">
                    <Grid2>
                        <Typography variant="body1" gutterBottom>
                            {header}
                        </Typography>
                    </Grid2>
                    <Grid2>
                        <Typography variant="body1" gutterBottom>
                        {formatAmount(summary.currentAmount)} / {formatAmount(summary.fullAmount)} {defaultCurrency?.symbol}
                        </Typography>
                    </Grid2>
                </Grid2>
                <Box mb={1}>
                    <LinearProgress 
                        variant="determinate" 
                        value={summary.progressValue} 
                        sx={{height: 10}} 
                        color={progressColor(summary.progressValue)}/>
                </Box>
                <Grid2 container justifyContent="space-between">
                    <Grid2>
                        <Typography variant="body2">
                            {startDate(period)}
                        </Typography>
                    </Grid2>
                    <Grid2>
                        <Typography variant="body2">
                            {endDate(period)}
                        </Typography>
                    </Grid2>
                </Grid2>
            </Box>  
        )
    }

  return (
    <Paper>
        <Stack>
            <NoDecorationLink to={'/budgets'}
            content={
                <Box display={'flex'} p={2}>
                    <NoteAlt />
                    <Typography ml={1}>
                        Budgets summary
                    </Typography>
                </Box>}/>
            
        <Divider/>
            <Box px={3}>
                <NoDecorationLink to={`/budgets?period=${BudgetPeriod.Week}`} 
                    content={summaryItem(BudgetPeriod.Week, week, "Weekly")}/>
                <Divider/>
                <NoDecorationLink to={`/budgets?period=${BudgetPeriod.Month}`} 
                    content={summaryItem(BudgetPeriod.Month, month, "Monthly")}/>
                <Divider/>
                <NoDecorationLink to={`/budgets?period=${BudgetPeriod.Year}`} 
                    content={summaryItem(BudgetPeriod.Year, annual, "Annual")}/>                         
            </Box>
        </Stack>
    </Paper>
  )
})