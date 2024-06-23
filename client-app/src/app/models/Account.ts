import { Currency } from "./Currency";
import { AccountStatus } from "./enums/AccountStatus";

export interface Account {
    id: number;
    name: string;
    balance: number;
    convertedBalance: number;
    createdAt: Date;
    description: string;
    status: AccountStatus;
    currency: Currency;
    currencyId?: number;
}