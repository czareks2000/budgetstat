import dayjs from "dayjs";
import { ChartPeriod } from "./enums/periods/ChartPeriod";
import { Option } from "./Option";


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