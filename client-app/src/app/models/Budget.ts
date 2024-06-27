import { Category } from "./Category";
import { Currency } from "./Currency";
import { BudgetPeriod } from "./enums/BudgetPeriod";

export interface Budget {
    id: number;
    name: string;
    period: BudgetPeriod;
    amount: number;
    currentAmount: number;
    convertedAmount: number;
    currency: Currency;
    categories: Category[];
}