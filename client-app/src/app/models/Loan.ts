import dayjs from "dayjs";
import { Payoff } from "./Payoff";
import { LoanStatus } from "./enums/LoanStatus";
import { LoanType } from "./enums/LoanType";
import { Counterparty } from "./Counterparty";
import { Currency } from "./Currency";

export interface Loan {
    id: number;
    loanType: LoanType;
    accountId: number;
    currentAmount: number;
    fullAmount: number;
    counterpartyId: number;
    loanDate: Date;
    repaymentDate: Date;
    description?: string;
    loanStatus: LoanStatus;
    currencyId: number;
    payoffs: Payoff[];
}

export interface LoanCreateValues {
    loanType: LoanType;
    accountId: number | string;
    fullAmount: number | null;
    counterpartyId: number| string;
    loanDate: dayjs.Dayjs | Date;
    repaymentDate: dayjs.Dayjs | Date;
    description?: string;
}

export interface LoanUpdateValues {
    fullAmount: number | null;
    repaymentDate: dayjs.Dayjs | Date;
    description: string;
}

export interface GroupedLoan {
    counterpartyId: number;
    currencyId: number;
    counterparty: Counterparty;
    currency: Currency;
    creditsCurrentAmount: number;
    debtsCurrentAmount: number;
    creditsFullAmount: number;
    debtsFullAmount: number;
    currentAmount: number;
    fullAmount: number;
    nearestRepaymentDate: Date | null;
    loanType: LoanType;
}