export interface NetWorthStats {
    loansValue: number;
    assetsValues: {
        assetCategoryId: number;
        value: number;
    }[]
}

export interface ValueOverTime {
    data: number[],
    labels: string[],
    startDate: Date,
    endDate: Date,
}

export type IncomesAndExpensesDataSetItem = {
    income: number;
    expense: number;
    label: string;
}

export type LabelValueItem = {
    id: number;
    value: number;
    label: string;
}

export type IncomesExpensesValue = {
    incomes: number;
    expenses: number;
}