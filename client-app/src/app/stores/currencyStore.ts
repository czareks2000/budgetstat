import { makeAutoObservable, runInAction } from "mobx";
import { Currency } from "../models/Currency";
import agent from "../api/agent";
import { Option } from "../models/Option";

export default class CurrencyStore {
    currencies: Currency[] = [];
    currenciesLoaded = false;

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

    get currenciesAsOptions(): Option[] {
        return this.currencies.map(currency => ({
          value: currency.id,
          text: currency.code,
        }));
      }
}