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
    amount: number;
    accountId: number;
    date: Date;
    description?: string;
}