import { makeAutoObservable, reaction, runInAction } from "mobx";
import { NetWorthStats, NetWorthValueOverTime, PieChartDataItem } from "../models/Stats";
import agent from "../api/agent";
import { store } from "./store";
import { NetWorthChartPeriod } from "../models/enums/periods/NetWorthChartPeriod";
import dayjs from "dayjs";

export default class StatsStore {
    netWorthStats: NetWorthStats | undefined = undefined;

    netWorthValueOverTime: NetWorthValueOverTime | undefined = undefined;
    chartPeriod: NetWorthChartPeriod = NetWorthChartPeriod.Year;
    loadedNetWorthValueOverTime = false;

    balanceValueOverTime: NetWorthValueOverTime | undefined = undefined;
    balanceValueOverTimeLoaded = false;

    currentMonthIncome: number = 0;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.chartPeriod, 
            () => {
                this.loadNetWorthValueOverTime();
            }
        )
    }

    clearStore = () => {
        this.netWorthStats = undefined;
        this.netWorthValueOverTime = undefined;
        this.chartPeriod = NetWorthChartPeriod.Year;
        this.loadedNetWorthValueOverTime = false;
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

    setChartPeriod = (period: NetWorthChartPeriod) => {
        this.chartPeriod = period;
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
            const response = await agent.Stats.accountBalanceOverTime(NetWorthChartPeriod.Month);
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
            const response = await agent.Stats.netWorthValueOverTime(this.chartPeriod);
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