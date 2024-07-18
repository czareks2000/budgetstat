import { makeAutoObservable, runInAction } from "mobx";
import { NetWorthStats, PieChartDataItem } from "../models/Stats";
import agent from "../api/agent";
import { store } from "./store";

export default class StatsStore {
    netWorthStats: NetWorthStats | undefined = undefined;

    constructor() {
        makeAutoObservable(this);
    }

    clearStore = () => {
        this.netWorthStats = undefined;
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

    loadNetWorthStats = async () => {
        try {
            var response = await agent.Stats.netWorthStats();
            runInAction(() => this.netWorthStats = response)
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