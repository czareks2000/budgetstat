import { TransactionType } from "./enums/TransactionType";

export interface MainCategory {
    id: number;
    name: string;
    icon: string;
    type: TransactionType;
    subCategories: Category[]
}

export interface Category {
    id: number;
    name: string;
    icon: string;
    type: TransactionType;
}

export interface CategoryOption {
    id: number,
    name: string,
    icon: string,
    type: TransactionType,
    mainCategoryName: string,
    mainCategoryId: number
}