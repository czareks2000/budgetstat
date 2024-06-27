import { TransactionType } from "./enums/TransactionType";

export interface Category {
    id: number;
    name: string;
    icon: string;
    type: TransactionType;
}