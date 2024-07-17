import { makeAutoObservable, runInAction } from "mobx";
import { NetWorthStats } from "../models/Stats";
import agent from "../api/agent";

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

        console.log(this.netWorthStats);

        if (this.netWorthStats)
            this.netWorthStats.assetsValues.forEach(item => {
                value += item.value;
            });

        return value;
    }

    loadNetWorthStats = async () => {
        try {
            var response = await agent.Stats.netWorthStats();
            runInAction(() => this.netWorthStats = response)
        } catch (error) {
            console.log(error);
        }
    }

}