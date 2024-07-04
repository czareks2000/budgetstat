export interface Transfer {
    id: number;
    fromAmount: number;
    toAmount: number;
    fromAccountId: number;
    toAccountId: number;
    date: Date;
}

export interface TransferCreateUpdateValues {
    fromAmount: number;
    toAmount: number;
    fromAccountId: number;
    toAccountId: number;
    date: Date;
}