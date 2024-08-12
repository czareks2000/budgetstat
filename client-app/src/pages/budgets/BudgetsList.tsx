import { Stack } from "@mui/material";
import { Budget } from "../../app/models/Budget"
import BudgetItem from "./BudgetItem";

interface Props {
    budgets: Budget[];
    openDeleteDialog: () => void;
}

const BudgetsList = ({budgets, openDeleteDialog}: Props) => {
    return (
    <Stack spacing={2}>
        {budgets.map((budget) => 
            <BudgetItem 
                key={budget.id} 
                budget={budget}
                openDeleteDialog={openDeleteDialog}
            />
        )}
    </Stack>
  )
}

export default BudgetsList