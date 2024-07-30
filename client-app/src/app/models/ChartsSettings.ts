import dayjs from "dayjs";
import { ChartPeriod } from "./enums/periods/ChartPeriod";
import { Option } from "./Option";
import { ExtendedChartPeriod } from "./enums/periods/ExtenedChartPeriod";
import { CategoryOption } from "./Category";
import { AvgChartPeriod } from "./enums/periods/AvgChartPeriod";
import { CategoryType } from "./enums/CategoryType";
import { ForecastPeriod } from "./enums/periods/ForecastPeriod";


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

export interface AvgMonthlyTransactionsValuesSettings {
    period: AvgChartPeriod,
    categoryType: CategoryType,
    mainCategoryId: number | string;
    startDate: Date | dayjs.Dayjs;
    endDate: Date | dayjs.Dayjs;
    accountIds: Option[];
}

export const initialAvgMonthlyExpensesSettings:
    AvgMonthlyTransactionsValuesSettings = {
        period: AvgChartPeriod.LastYear,
        categoryType: CategoryType.Main,
        mainCategoryId: "",
        startDate: dayjs().add(-6, 'month'),
        endDate: dayjs(),
        accountIds: []
    }

export const initialAvgMonthlyIncomesSettings:
    AvgMonthlyTransactionsValuesSettings = {
        period: AvgChartPeriod.LastYear,
        categoryType: CategoryType.Main,
        mainCategoryId: "",
        startDate: dayjs().add(-6, 'month'),
        endDate: dayjs(),
        accountIds: []
    }

export interface BalanceOverTimeForecastSettings {
    period: ForecastPeriod;
    accountIds: Option[];
}

export const initialBalanceOverTimeForecastSettings:
    BalanceOverTimeForecastSettings = {
        period: ForecastPeriod.NextYear,
        accountIds: []
    }