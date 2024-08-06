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

export interface CategoryCreateValues {
    name: string;
    iconId: number;
    type: TransactionType;
    isMain: boolean;
    mainCategoryId?: number;
}   

export interface CategoryUpdateValues {
    name: string;
    iconId: number;
}

export interface CategoryToDelete {
    id: number;
    isMain: boolean; 
    name: string;
}