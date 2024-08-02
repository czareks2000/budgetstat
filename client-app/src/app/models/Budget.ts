import { Category, CategoryOption } from "./Category";
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

export interface BudgetSummary {
    percentage: number;
    progressValue: number; 
    currentAmount: number; 
    fullAmount: number;
}

export interface BudgetFormValues {
    name: string;
    categories: CategoryOption[];
    period: BudgetPeriod;
    amount: number | null;
}

export interface BudgetDto {
    name: string;
    categoryIds: number[];
    period: BudgetPeriod;
    amount: number | null;
}