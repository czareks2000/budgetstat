import { makeAutoObservable, reaction, runInAction } from "mobx";
import { ServerError } from "../models/ServerError"
import { store } from "./store";

export default class CommonStore {
    serverError: ServerError | null = null;
    token: string | null = localStorage.getItem('jwt');
    appLoaded = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.token, 
            token => {
                if (token) {
                    localStorage.setItem('jwt', token);
                } else {
                    localStorage.removeItem('jwt');
                }
            }
        )
    }

    roundValue = (value: number) => {
        return Math.round(value * Math.pow(10,2)) / Math.pow(10,2);
      }

    setServerError(error: ServerError) {
        this.serverError = error;
    }

    setToken = (token: string | null) => {
        this.token = token;
    }

    setApploaded = () => { 
        this.appLoaded = true;
    }

    loadAppData = async (currencyId: number) => {
        try {

            await Promise.all([
                // można wyświetlić intefejs bez tych danch załadowanych
                store.currencyStore.setDefaultCurrency(currencyId),
                store.statsStore.loadHomePageCharts(), 

                store.transactionStore.loadPlannedTransactions(),

                //store.budgetStore.loadBudgets();
                //store.statsStore.loadNetWorthValueOverTime();
                //store.statsStore.loadStatsPageCharts();
                //store.loanStore.loadCounterparties(),
                //store.loanStore.loadLoans(LoanStatus.InProgress),
                //store.assetStore.loadAssets(),

                // nie można wyświetlić intefejsu bez tych danch załadowanych

                store.assetStore.loadAssetCategories(),

                store.statsStore.loadNetWorthStats(),

                store.accountStore.loadAccounts(),

                store.statsStore.loadCurrentMonthIncome(),

                store.categoryStore.loadCategories(),

                store.transactionStore.loadLatestTransactions(),

                store.statsStore.loadAvgMonthlyIncomesAndExpensesLastYear()
            ]);

        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.setApploaded())
        }
    }

    clearAppData = async () => {
        try {
            store.accountStore.clearStore();
            store.assetStore.clearStore();
            store.categoryStore.clearStore();
            store.currencyStore.clearStore();
            store.loanStore.clearStore();
            store.budgetStore.clearStore();
            store.statsStore.clearStore();
            store.transactionStore.clearStore();
            store.fileStore.clearImportedTransactions();
        } catch (error) {
            console.log(error);
        }
    }
}