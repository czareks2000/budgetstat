import { makeAutoObservable, reaction, runInAction } from "mobx";
import { NetWorthStats, ValueOverTime, PieChartDataItem } from "../models/Stats";
import agent from "../api/agent";
import { store } from "./store";
import { NetWorthChartPeriod } from "../models/enums/periods/NetWorthChartPeriod";
import dayjs from "dayjs";
import { BalanceValueOverTimeSettings, initialBalanceValueOverTimeSettings } from "../models/ChartsSettings";

export default class StatsStore {
    netWorthStats: NetWorthStats | undefined = undefined;

    netWorthValueOverTime: ValueOverTime | undefined = undefined;
    netWorthChartPeriod: NetWorthChartPeriod = NetWorthChartPeriod.Year;
    loadedNetWorthValueOverTime = false;

    balanceValueOverTime: ValueOverTime | undefined = undefined;
    balanceValueOverTimeSettings: BalanceValueOverTimeSettings = initialBalanceValueOverTimeSettings;
    balanceValueOverTimeLoaded = false;

    currentMonthIncome: number = 0;

    statsHasOldData = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.netWorthChartPeriod, 
            () => {
                this.loadNetWorthValueOverTime();
            }
        )
    }

    clearStore = () => {
        this.netWorthStats = undefined;

        this.netWorthValueOverTime = undefined;
        this.netWorthChartPeriod = NetWorthChartPeriod.Year;
        this.loadedNetWorthValueOverTime = false;

        this.balanceValueOverTime = undefined;
        this.balanceValueOverTimeLoaded = false;

        this.currentMonthIncome = 0;
    }

    get assetsValue() {
        var value = 0;

        if (this.netWorthStats)
            this.netWorthStats.assetsValues.forEach(item => {
                value += item.value;
            });

        return value;
    }

    get loansValue() {
        if (!this.netWorthStats)
            return 0;

        return this.netWorthStats.loansValue;
    }

    setHasOldData = (state: boolean) => {
        this.statsHasOldData = state;
    }

    setNetWorthChartPeriod = (period: NetWorthChartPeriod) => {
        this.netWorthChartPeriod = period;
    }

    setBalanceValueOverTimeSettings = async (settings: BalanceValueOverTimeSettings) => {
        this.balanceValueOverTimeSettings = settings;
        await this.loadBalanceValueOverTime();
    }

    resetBalanceValueOverTimeSettings = async () => {
        this.balanceValueOverTimeSettings = initialBalanceValueOverTimeSettings;
        await this.loadBalanceValueOverTime();
    }

    get balanceValueOverTimeSettingsHasInitialValues() {
        return JSON.stringify(this.balanceValueOverTimeSettings) === JSON.stringify(initialBalanceValueOverTimeSettings)
    }

    getAssetsValues = (categoryId: number) => {
        if (!this.netWorthStats)
            return 0

        var value = 0;

        this.netWorthStats.assetsValues
            .forEach(item => {
                if(item.assetCategoryId === categoryId)
                value += item.value;
            });

        return value;
    }

    get assetPieChartData() {
        let data: PieChartDataItem[] = [];

        let index = 1;

        data.push({
            id: index++,
            value: store.accountStore.totalBalance,
            label: "Accounts"
        })

        store.assetStore.assetCategories.forEach((category) => {
            data.push({
                id: index++,
                value: this.getAssetsValues(category.id),
                label: category.name
            })
        })

        return data;
    }

    loadCurrentMonthIncome = async () => {
        try {
            const value = await agent.Stats.currentMothIncome();
            runInAction(() => {
                this.currentMonthIncome = value;
            })
        } catch (error) {
            console.log(error);
        }
    }

    loadNetWorthStats = async () => {
        try {
            const response = await agent.Stats.netWorthStats();
            runInAction(() => this.netWorthStats = response)
        } catch (error) {
            console.log(error);
        }
    }

    loadBalanceValueOverTime = async () => {
        this.balanceValueOverTimeLoaded = false;
        try {
            const response = await agent.Stats.accountBalanceOverTime(
                    this.balanceValueOverTimeSettings.period, 
                    this.balanceValueOverTimeSettings.accountIds.map(a => Number(a.value)),
                    dayjs(this.balanceValueOverTimeSettings.startDate).toDate(), 
                    dayjs(this.balanceValueOverTimeSettings.endDate).toDate()
                );
            runInAction(() => {
                response.startDate = dayjs(response.startDate).toDate(); 
                response.endDate = dayjs(response.endDate).toDate(); 
                this.balanceValueOverTime = response;
                this.balanceValueOverTimeLoaded = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    loadNetWorthValueOverTime = async () => {
        this.loadedNetWorthValueOverTime = false;
        try {
            const response = await agent.Stats.netWorthValueOverTime(this.netWorthChartPeriod);
            runInAction(() => {
                response.startDate = dayjs(response.startDate).toDate(); 
                response.endDate = dayjs(response.endDate).toDate(); 
                this.netWorthValueOverTime = response;
                this.loadedNetWorthValueOverTime = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    updateNetWorthStats = async (loans: boolean = true, assets: boolean = true) => {
        try {
            var response = await agent.Stats.netWorthStats(loans, assets);

            runInAction(() => {
                if (loans)
                    this.setLoansValue(response.loansValue);
                if (assets)
                    this.setAssetsValues(response.assetsValues);
            })
        } catch (error) {
            console.log(error);
        }
    }

    private setLoansValue = (value: number) => {
        if (this.netWorthStats)
            this.netWorthStats.loansValue = value;
    }

    private setAssetsValues  = (value: { assetCategoryId: number; value: number; }[]) => {
        if (this.netWorthStats)
            this.netWorthStats.assetsValues = value;
    }

}