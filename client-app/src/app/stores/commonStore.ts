import { makeAutoObservable, reaction, runInAction } from "mobx";
import { ServerError } from "../models/ServerError"
import { store } from "./store";
import { LoanStatus } from "../models/enums/LoanStatus";

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
            await store.accountStore.loadAccounts();
            
            await store.budgetStore.loadBudgets();

            await store.currencyStore.loadCurrencies();
            store.currencyStore.setDefaultCurrency(currencyId);
            
            await store.categoryStore.loadCategories();

            await store.loanStore.loadLoans(LoanStatus.InProgress);
            await store.loanStore.loadCounterparties();

            await store.assetStore.loadAssetCategories();
            await store.assetStore.loadAssets();

            await store.transactionStore.loadTransactions();

            await store.statsStore.loadNetWorthStats();
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => this.setApploaded())
        }
    }

    clearAppData = async () => {
        try {
            store.accountStore.clearStore();
            store.currencyStore.clearStore();
            store.budgetStore.clearStore();
            store.categoryStore.clearStore();
            store.loanStore.clearStore();
            store.transactionStore.clearStore();
            store.statsStore.clearStore();
        } catch (error) {
            console.log(error);
        }
    }
}