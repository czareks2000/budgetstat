import { makeAutoObservable, reaction, runInAction } from "mobx";
import { NetWorthStats, ValueOverTime, PieChartDataItem } from "../models/Stats";
import agent from "../api/agent";
import { store } from "./store";
import { NetWorthChartPeriod } from "../models/enums/periods/NetWorthChartPeriod";
import dayjs from "dayjs";
import { ChartPeriod } from "../models/enums/periods/ChartPeriod";

export default class StatsStore {
    netWorthStats: NetWorthStats | undefined = undefined;

    netWorthValueOverTime: ValueOverTime | undefined = undefined;
    netWorthChartPeriod: NetWorthChartPeriod = NetWorthChartPeriod.Year;
    loadedNetWorthValueOverTime = false;

    balanceValueOverTime: ValueOverTime | undefined = undefined;
    balanceValueOverTimeLoaded = false;

    currentMonthIncome: number = 0;

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

    setNetWorthChartPeriod = (period: NetWorthChartPeriod) => {
        this.netWorthChartPeriod = period;
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
                ChartPeriod.Custom, [], dayjs().add(-60, 'day').toDate(), dayjs().toDate());
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