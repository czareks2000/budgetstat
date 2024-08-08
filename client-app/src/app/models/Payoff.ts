import dayjs from "dayjs";
import { LoanType } from "./enums/LoanType";

export interface Payoff {
    id: number;
    loanId: number;
    amount: number;
    accountId: number;
    date: Date;
    description?: string;
    currencyId: number;
}

export interface PayoffCreateValues {
    amount: number | null;
    accountId: number | string;
    date: dayjs.Dayjs | Date;
    description?: string;
}

export interface CollectivePayoffValues {
    amount: number | null;
    accountId: number | string;
    date: dayjs.Dayjs | Date;
    loanType: LoanType | string;
}