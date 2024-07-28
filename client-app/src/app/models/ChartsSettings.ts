import dayjs from "dayjs";
import { ChartPeriod } from "./enums/periods/ChartPeriod";
import { Option } from "./Option";
import { ExtendedChartPeriod } from "./enums/periods/ExtenedChartPeriod";
import { CategoryOption } from "./Category";


export interface BalanceValueOverTimeSettings {
    period: ChartPeriod;
    accountIds: Option[],
    startDate: Date | dayjs.Dayjs;
    endDate: Date | dayjs.Dayjs;
}

export const initialBalanceValueOverTimeSettings: 
    BalanceValueOverTimeSettings = {
    period: ChartPeriod.Last30Days,
    startDate: dayjs().add(-30, 'days'),
    endDate: dayjs(),
    accountIds: []
}

export interface IncomesAndExpensesOverTimeSettings {
    period: ExtendedChartPeriod;
    customDate: Date | dayjs.Dayjs;
    accountIds: Option[],
    incomeCategoryIds: CategoryOption[];
    expenseCategoryIds: CategoryOption[];
}

export const initialIncomesAndExpensesOverTimeSettings: 
    IncomesAndExpensesOverTimeSettings = {
        period: ExtendedChartPeriod.Last7Days,
        customDate: dayjs(),
        accountIds: [],
        incomeCategoryIds: [],
        expenseCategoryIds: []
    }