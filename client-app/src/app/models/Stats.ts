import { ChartPeriod } from "./enums/ChartPeriod";

export interface NetWorthStats {
    loansValue: number;
    assetsValues: {
        assetCategoryId: number;
        value: number;
    }[]
}

export interface NetWorthValueOverTime {
    data: number[],
    labels: string[],
    period: ChartPeriod,
    startDate: Date,
    endDate: Date,
}

export interface PieChartDataItem {
    id: number;
    value: number;
    label: string;
}
