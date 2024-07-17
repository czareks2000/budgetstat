export interface NetWorthStats {
    loansValue: number;
    assetsValues: {
        assetCategoryId: number;
        value: number;
    }[]
}

export interface PieChartDataItem {
    id: number;
    value: number;
    label: string;
}
