import { makeAutoObservable, reaction } from "mobx";
import { ServerError } from "../models/ServerError"
import { Info } from "../models/Info";
import { store } from "./store";

export default class CommonStore {
    serverError: ServerError | null = null;
    info: Info | undefined = undefined;
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

    clearInfo = async () => {
        this.info = undefined;
    }

    setSuccess = async (message: string) => {
        this.info = {type: "success", message: message}
    }

    setError = async (message: string) => {
        this.info = {type: "error", message: message}
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
        } catch (error) {
            console.log(error);
        } 
    }
}