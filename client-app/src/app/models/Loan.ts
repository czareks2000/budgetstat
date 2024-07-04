import { Payoff } from "./Payoff";
import { LoanStatus } from "./enums/LoanStatus";
import { LoanType } from "./enums/LoanType";

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
    accountId: number;
    fullAmount: number;
    counterpartyId: number;
    repaymentDate: Date;
    description?: string;
}

export interface LoanUpdateValues {
    fullAmount: number;
    repaymentDate: Date;
}