import dayjs from "dayjs";
import { Period } from "./enums/periods/Period";
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

export interface DataGridSettings {
    id: boolean;
    date: boolean;
    account: boolean
    category: boolean;
    description: boolean;
    amount: boolean;
    actions: boolean;
    itemsPerPage: number;
}

export const defaultDataGridSetttings: DataGridSettings = {
    id: true,
    date: true,
    account: true,
    category: true,
    description: false,
    amount: true,
    actions: true,
    itemsPerPage: 10
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
    description: string;
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

export interface PlannedTransactionFormValues {
    type: TransactionType;
    accountId: number | string;
    amount: number | null;
    expenseCategoryId: CategoryOption | null;
    incomeCategoryId: CategoryOption | null;
    startDate: dayjs.Dayjs | Date;
    description: string;
    considered: boolean;
    repeatsEvery: number | null; 
    period: Period; 
    numberOfTimes: number | null;
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