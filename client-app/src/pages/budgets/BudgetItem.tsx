import { observer } from "mobx-react-lite"
import { Budget } from "../../app/models/Budget";
import { Box, Card, CardContent, Chip, Divider, Grid, IconButton, LinearProgress, Stack, Tooltip, Typography } from "@mui/material";
import { Delete, Edit } from "@mui/icons-material";
import { useStore } from "../../app/stores/store";
import { BudgetPeriod } from "../../app/models/enums/BudgetPeriod";

interface Props {
    budget: Budget;
}

export default observer(function BudgetItem({budget}: Props) {
    const {currencyStore: {defaultCurrency}} = useStore();
    
    const progressColor = () => {
        const percentage = (budget.currentAmount / budget.convertedAmount) * 100;
    
        if (percentage < 90) {
            return "success";
        } else if (percentage >= 90 && percentage < 100) {
            return "warning";
        } else {
            return "error";
        }
    };

    const progressValue = () => {
        return budget.currentAmount / budget.convertedAmount * 100;
    }

    const startDate = () => {
        const now = new Date();
        let start;

        switch (budget.period) {
            case BudgetPeriod.Week:
                start = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday as the first day of the week
                break;
            case BudgetPeriod.Month:
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case BudgetPeriod.Year:
                start = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                return null;
        }

        const dd = String(start.getDate()).padStart(2, '0');
        const mm = String(start.getMonth() + 1).padStart(2, '0'); // January is 0
        const yyyy = start.getFullYear();

        return `${dd}.${mm}.${yyyy}`;
    }

    const endDate = () => {
        const now = new Date();
        let end;

        switch (budget.period) {
            case BudgetPeriod.Week:
                end = new Date(now.setDate(now.getDate() - now.getDay() + 7)); // Sunday as the last day of the week
                break;
            case BudgetPeriod.Month:
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
                break;
            case BudgetPeriod.Year:
                end = new Date(now.getFullYear(), 11, 31); // December 31st of the current year
                break;
            default:
                return null;
        }

        const dd = String(end.getDate()).padStart(2, '0');
        const mm = String(end.getMonth() + 1).padStart(2, '0'); // January is 0
        const yyyy = end.getFullYear();

        return `${dd}.${mm}.${yyyy}`;
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
                            <Stack direction={'row'} spacing={1}>
                                {budget.categories.map((category) =>
                                    <Chip key={category.id} label={category.name} />
                                )}
                            </Stack>
                        </Grid>
                        <Grid item xs={'auto'} >
                            <Box mr={-1}>
                                    <Tooltip 
                                        title='Edit'
                                        placement="top"
                                        arrow
                                        enterDelay={500}
                                        leaveDelay={200}>
                                        <IconButton 
                                            size="medium"
                                            aria-label="edit"
                                            onClick={() => {}}>
                                            <Edit />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip 
                                        title='Delete'
                                        placement="top"
                                        arrow
                                        enterDelay={500}
                                        leaveDelay={200}>
                                        <IconButton 
                                            aria-label="delete"
                                            onClick={() => {}}>
                                            <Delete />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                        </Grid>
                    </Grid>
                    <Divider />
                    <Box mt={3}>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Typography variant="body1" gutterBottom>
                                    {startDate()}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1" gutterBottom>
                                    {endDate()}
                                </Typography>
                            </Grid>
                        </Grid>
                        <Box mb={1}>
                            <LinearProgress 
                                variant="determinate" 
                                value={progressValue()} 
                                sx={{height: 10}} 
                                color={progressColor()}/>
                        </Box>
                        <Grid container justifyContent="space-between">
                            <Grid item>
                                <Typography variant="body1">
                                    0 {defaultCurrency?.symbol}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">
                                    {budget.currentAmount} / {budget.convertedAmount} {defaultCurrency?.symbol}
                                </Typography>
                            </Grid>
                            <Grid item>
                                <Typography variant="body1">
                                    {budget.convertedAmount} {defaultCurrency?.symbol}
                                </Typography>
                            </Grid>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
    )
})
