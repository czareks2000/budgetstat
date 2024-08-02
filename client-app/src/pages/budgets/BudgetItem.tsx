import { observer } from "mobx-react-lite"
import { Budget } from "../../app/models/Budget";
import { Box, Card, CardContent, Chip, Divider, Grid, IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useStore } from "../../app/stores/store";
import { router } from "../../app/router/Routes";
import { formatAmount } from "../../app/utils/FormatAmount";

interface Props {
    budget: Budget;
    openDeleteDialog: () => void;
}

export default observer(function BudgetItem({budget, openDeleteDialog}: Props) {
    const {
        currencyStore: {defaultCurrency}, 
        budgetStore: {selectBudget, startDate, endDate, progressColor, progressValue}} = useStore();

    const isInDefaultCurrency = budget.currency.id === defaultCurrency?.id;

    const budgetEndAmount = `${formatAmount(budget.convertedAmount)} ${defaultCurrency?.symbol} ${!isInDefaultCurrency ? `(${formatAmount(budget.amount)} ${budget.currency.symbol})` : ''}`;

    const calculateSpaces = (targetLength: number, currentLength: number) => {
        const spaceCount = targetLength - currentLength;
        return '\u00A0'.repeat(spaceCount); // '\u00A0' is a non-breaking space character
    };
    
    const budgetStartAmount = `0 ${defaultCurrency?.symbol}`;
    const spacesNeeded = calculateSpaces(budgetEndAmount.length, budgetStartAmount.length);
    
    const formatedBudgetStartAmount = `${budgetStartAmount}${spacesNeeded}`;

    const handleDeleteButtonClick = () => {
        selectBudget(budget.id);
        openDeleteDialog();
    }

    const handleEditButtonClick = () => {
        selectBudget(budget.id);
        router.navigate(`/budgets/${budget.id}/edit`);
    }
  
    return (
        <Card key={budget.id}>
                <CardContent>
                    <Grid container justifyContent="flex-end" mb={3}>
                        <Grid item xs>
                            <Stack direction={'row'}>
                                <Typography variant="h5" gutterBottom>
                                    {budget.name}
                                </Typography>
                            </Stack>
                            <Grid direction={'row'} container spacing={1}>
                                {budget.categories.map((category) => 
                                    <Grid item key={category.id}>
                                        <Chip key={category.id} label={category.name} />
                                    </Grid>
                                )}
                            </Grid>
                        </Grid>
                        <Grid item xs={'auto'} >
                            <Box mr={-1}>
                                <IconButton 
                                    size="medium"
                                    aria-label="edit"
                                    onClick={handleEditButtonClick}>
                                    <Edit />
                                </IconButton>
                                  
                                <IconButton 
                                    aria-label="delete"
                                    onClick={handleDeleteButtonClick}>
                                    <Delete />
                                </IconButton>  
                            </Box>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Box mt={3}>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Typography variant="body1" gutterBottom>
                                    {startDate(budget.period)}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" gutterBottom>
                                    {endDate(budget.period)}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Box mb={1}>
                            <LinearProgress 
                                variant="determinate" 
                                value={progressValue(budget)} 
                                sx={{height: 10}} 
                                color={progressColor(progressValue(budget))}/>
                        </Box>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Typography variant="body1">
                                    {formatedBudgetStartAmount}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">
                                    {formatAmount(budget.currentAmount)} / {formatAmount(budget.convertedAmount)} {defaultCurrency?.symbol}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">
                                    {budgetEndAmount}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
    )
})
