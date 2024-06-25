import { makeAutoObservable, reaction } from "mobx";
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

    loadAppData = async () => {
        try {
            await store.accountStore.loadAccounts();
            await store.currencyStore.loadCurrencies();
        } catch (error) {
            console.log(error);
        } 
    }

    clearAppData = async () => {
        try {
            store.accountStore.clearStore();
            store.currencyStore.clearStore();
        } catch (error) {
            console.log(error);
        }
    }
}