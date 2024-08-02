import { makeAutoObservable, runInAction } from "mobx";
import { Currency } from "../models/Currency";
import agent from "../api/agent";
import { Option } from "../models/Option";
import { store } from "./store";

export default class CurrencyStore {
    currencies: Currency[] = [];
    defaultCurrency: Currency | undefined = undefined;
    currenciesLoaded = false;

    currentExchangeRate: number = 0; // used in transfer create/update forms

    constructor() {
        makeAutoObservable(this);
    }
    
    clearStore = () => {
        this.currencies = [];
        this.currenciesLoaded = false;
    }

    loadCurrencies = async () => {
        try {
            const currencies = await agent.Currencies.list();
            runInAction(() => {
                this.currencies = currencies;
                this.currenciesLoaded = true;
            })      
        } catch (error) {
            console.log(error);
        } 
    }

    getCurrencySymbol = (currencyId: number) => {
        return this.currencies.find(c => c.id === currencyId)?.symbol as string;
    }

    setDefaultCurrency = (currencyId: number) => {
        if (this.currenciesLoaded)
            this.defaultCurrency = this.currencies.find(c => c.id === currencyId);
    }

    get currenciesAsOptions(): Option[] {
        return this.currencies.map(currency => ({
          value: currency.id,
          text: currency.code,
        }));
    }

    changeDefaultCurrency = async (currencyId: number) => {
        try {
            await agent.Settings.setDefaultCurrency(currencyId);
            runInAction(() => {
                this.setDefaultCurrency(currencyId);
                // budgets
                store.budgetStore.clearStore();
                store.budgetStore.loadBudgets();
                // accounts
                store.accountStore.clearStore();
                store.accountStore.loadAccounts();
                // networth
                store.statsStore.clearStore();
                store.statsStore.loadNetWorthStats();
                store.statsStore.loadNetWorthValueOverTime();
                // stats
                store.statsStore.loadCurrentMonthIncome();
                store.statsStore.loadAvgMonthlyIncomesAndExpensesLastYear();
            });
        } catch (error) {
            console.log(error);
        }
    }

    getCurrentExchangeRate = async (inputCurrencyCode: string, outputCurrencyCode: string) => {
        try {
            const currentExchangeRate = await agent.Currencies.currentExchangeRate(inputCurrencyCode, outputCurrencyCode);
            runInAction(() => {
                this.currentExchangeRate = currentExchangeRate;
            })
        } catch (error) {
            console.log(error);
        }
    }
}