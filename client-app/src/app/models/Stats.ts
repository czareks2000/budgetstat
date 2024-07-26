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

export interface PieChartDataItem {
    id: number;
    value: number;
    label: string;
}