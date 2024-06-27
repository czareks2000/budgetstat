import { Budget } from "../../app/models/Budget"
import BudgetItem from "./BudgetItem";

interface Props {
    budgets: Budget[];
}

const BudgetsList = ({budgets}: Props) => {
    return (
    <>
        {budgets.map((budget) => 
            <BudgetItem key={budget.id} budget={budget}/>
        )}
    </>
  )
}

export default BudgetsList