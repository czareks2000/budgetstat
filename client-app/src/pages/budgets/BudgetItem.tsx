import { observer } from "mobx-react-lite"
import { Budget } from "../../app/models/Budget";
import { Box, Card, CardContent, Chip, Divider, Grid2, IconButton, LinearProgress, Stack, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useStore } from "../../app/stores/store";
import { router } from "../../app/router/Routes";
import { formatAmount } from "../../app/utils/FormatAmount";
import { calculateSpaces } from "../../app/utils/CalculateSpaces";

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
                    <Grid2 container justifyContent="flex-end" mb={3}>
                        <Grid2 size={"grow"}>
                            <Stack direction={'row'}>
                                <Typography variant="h5" gutterBottom>
                                    {budget.name}
                                </Typography>
                            </Stack>
                            <Grid2 direction={'row'} container spacing={1}>
                                {budget.categories.map((category) => 
                                    <Grid2 key={category.id}>
                                        <Chip key={category.id} label={category.name} />
                                    </Grid2>
                                )}
                            </Grid2>
                        </Grid2>
                        <Grid2 size={'auto'}>
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
                        </Grid2>
                    </Grid2>
                    <Divider />
                    <Box mt={3}>
                        <Grid2 container justifyContent="space-between">
                            <Grid2>
                                <Typography variant="body1" gutterBottom>
                                    {startDate(budget.period)}
                                </Typography>
                            </Grid2>
                            <Grid2>
                                <Typography variant="body1" gutterBottom>
                                    {endDate(budget.period)}
                                </Typography>
                            </Grid2>
                        </Grid2>
                        <Box mb={1}>
                            <LinearProgress 
                                variant="determinate" 
                                value={progressValue(budget)} 
                                sx={{height: 10}} 
                                color={progressColor(progressValue(budget))}/>
                        </Box>
                        <Grid2 container justifyContent="space-between">
                            <Grid2>
                                <Typography variant="body1">
                                    {formatedBudgetStartAmount}
                                </Typography>
                            </Grid2>
                            <Grid2>
                                <Typography variant="body1">
                                    {formatAmount(budget.currentAmount)} / {formatAmount(budget.convertedAmount)} {defaultCurrency?.symbol}
                                </Typography>
                            </Grid2>
                            <Grid2>
                                <Typography variant="body1">
                                    {budgetEndAmount}
                                </Typography>
                            </Grid2>
                        </Grid2>
                    </Box>
                </CardContent>
            </Card>
    )
})
