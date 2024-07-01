import { Budget } from "../../app/models/Budget"
import BudgetItem from "./BudgetItem";

interface Props {
    budgets: Budget[];
    openDeleteDialog: () => void;
}

const BudgetsList = ({budgets, openDeleteDialog}: Props) => {
    return (
    <>
        {budgets.map((budget) => 
            <BudgetItem 
                key={budget.id} 
                budget={budget}
                openDeleteDialog={openDeleteDialog}
            />
        )}
    </>
  )
}

export default BudgetsList