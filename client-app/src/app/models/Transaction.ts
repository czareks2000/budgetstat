import dayjs from "dayjs";
import { Period } from "./enums/Period";
import { TransactionType, TransactionTypeFilter } from "./enums/TransactionType";
import { Option } from "./Option";
import { Category, CategoryOption } from "./Category";

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

export interface TransactionParams {
    startDate: Date | dayjs.Dayjs;
    endDate: Date | dayjs.Dayjs;
    types: TransactionType[];
    accountIds: number[];
    categoryIds: number[];
}

export interface TransactionParamsFormValues {
    startDate: Date | dayjs.Dayjs;
    endDate: Date | dayjs.Dayjs;
    type: TransactionTypeFilter;
    accountIds: Option[];
    incomeCategoryIds: CategoryOption[];
    expenseCategoryIds: CategoryOption[];
}

export interface TransactionRowItem {
    id: number;
    transactionId: number;
    accountName: string | null;
    accountId: number | null;
    category: CategoryItem;
    amount: AmountItem;
    date: Date;
    description: string;
}

export interface CategoryItem {
    id: number;
    name: string;
    iconId: number;
}

export interface AmountItem {
    value: number;
    type: TransactionType;
    currencySymbol: string;
}

export interface TransactionFormValues {
    type: TransactionType;
    accountId: number| string;
    fromAccountId: number| string;
    toAccountId: number| string;
    incomeCategoryId: CategoryOption | null;
    expenseCategoryId: CategoryOption | null;
    amount: number | null;
    fromAmount: number | null;
    toAmount: number | null;
    date: dayjs.Dayjs | Date;
    description: string;
    considered: boolean;
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
    considered: boolean;
}

export interface TransactionToDelete {
    index: number,
    transactionId: number,
    type: TransactionType,
    category: string,
    categoryId: number;
    amount: number;
    currencySymbol: string;
    toAccountId: number | null;
}

export interface PlannedTransaction {
    id: number;
    amount: number;
    category: Category;
    accountId: number;
    date: Date; 
    description: string;
    considered: boolean;
    planned: boolean;
    currencyId: number;
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