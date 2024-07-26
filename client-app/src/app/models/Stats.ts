import dayjs from "dayjs";
import { NetWorthChartPeriod } from "./enums/periods/NetWorthChartPeriod";

export interface NetWorthStats {
    loansValue: number;
    assetsValues: {
        assetCategoryId: number;
        value: number;
    }[]
}

export interface BaseValueOverTime {
    data: number[],
    labels: string[],
    startDate: Date,
    endDate: Date,
}

export interface NetWorthValueOverTime extends BaseValueOverTime {
    period: NetWorthChartPeriod,
}

export interface PieChartDataItem {
    id: number;
    value: number;
    label: string;
}


export const mockData = [39000, 42100, 44000, 43000, 41200, 42000, 42137, 44000, 43700, 46500, 45000, 47000];
export const mockLabels = [
'08/2023',
'09/2023',
'10/2023',
'11/2023',
'12/2023',
'01/2024',
'02/2024',
'03/2024',
'04/2024',
'05/2024',
'06/2024',
'07/2024',
];

export const mockDates = `${dayjs().add(-365, 'days').format("DD.MM.YYYY")} - ${dayjs().format("DD.MM.YYYY")}`;