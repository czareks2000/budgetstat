import { CategoryType } from "./enums/CategoryType";
import { TransactionType } from "./enums/TransactionType";

export interface MainCategory {
    id: number;
    name: string;
    iconId: number;
    type: TransactionType;
    subCategories: Category[];
    canBeDeleted: boolean;
}

export interface Category {
    id: number;
    name: string;
    iconId: number;
    type: TransactionType;
    canBeDeleted: boolean;
}

export interface CategoryOption {
    id: number,
    name: string,
    iconId: number,
    type: TransactionType,
    mainCategoryName: string,
    mainCategoryId: number
}

export interface CategoryFormValues {
    categoryType: CategoryType;
    transactionType: TransactionType;
    name: string;
    iconId: number | string;
    mainExpenseCategoryId: number | string;
    mainIncomeCategoryId: number | string;
}

export interface CategoryCreateValues {
    name: string;
    iconId: number;
    type: TransactionType;
    isMain: boolean;
    mainCategoryId: number;
}   

export interface CategoryUpdateValues {
    name: string;
    iconId: number;
}

export interface SelectedCategory {
    id: number;
    isMain: boolean; 
    name: string;
    transactionType?: TransactionType;
    iconId?: number;
    mainCategoryId?: number;
}