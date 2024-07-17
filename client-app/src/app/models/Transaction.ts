import { Period } from "./enums/Period";
import { TransactionType } from "./enums/TransactionType";

export interface Transaction {
    id: number;
    amount: number;
    categoryId: number;
    accountId?: number | null;
    date: Date; 
    description: string;
    considered: boolean;
    planned: boolean;
    currencyId: number;
}

export interface TransactionRowItem {
    id: number;
    account: string | null;
    category: CategoryItem;
    amount: AmountItem;
    date: Date;
    description: string;
}

export interface CategoryItem {
    name: string;
    iconId: number;
}

export interface AmountItem {
    value: number;
    type: TransactionType;
    currencySymbol: string;
}

export interface TransactionCreateValues {
    amount: number;
    categoryId: number;
    date: Date; 
    description?: string;
    considered: boolean;
}

export interface TransactionUpdateValues {
    amount: number; 
    categoryId: number; 
    accountId: number; 
    date: Date;
    description?: string;
}

export interface PlannedTransactionCreateValues {
    amount: number;
    categoryId: number; 
    startDate: Date;
    description?: string;
    considered: boolean;
    repeatsEvery: number; 
    period: Period; 
    numberOfTimes: number; 
}