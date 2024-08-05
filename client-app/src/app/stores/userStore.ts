import { makeAutoObservable, runInAction } from "mobx";
import { ChangePasswordFormValues, User, UserFormValues } from "../models/User";
import agent from "../api/agent";
import { store } from "./store";
import { router } from "../router/Routes";

export default class UserStore {
    user: User | null = null;

    constructor() {
        makeAutoObservable(this);
    }

    get currentUser() {
        return this.user;
    }

    get isLoggedIn() {
        return !!this.user;
    }

    register = async (creds: UserFormValues) => {
        try {
            const user = await agent.Auth.register(creds);
            store.commonStore.setToken(user.token);
            await store.commonStore.loadAppData(user.currencyId);
            runInAction(() => {
                this.user = user;
                router.navigate('home');
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    login = async (creds: UserFormValues) => {
        try {
            const user = await agent.Auth.login(creds);
            store.commonStore.setToken(user.token);
            await store.commonStore.loadAppData(user.currencyId);
            runInAction(() => {
                this.user = user;
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    }

    logout = () => {
        store.commonStore.setToken(null);
        store.commonStore.clearAppData();
        this.user = null;
        router.navigate('/');
    }

    changePassword = async (values: ChangePasswordFormValues) => {
        try {
            await agent.Auth.changePassword(values);
        } catch (error) {
            console.log(error);
            throw error;
        }
    }
    
    getUser = async () => {
        try {
            const user = await agent.Auth.current();
            runInAction(() => {
                this.user = user;
                store.commonStore.loadAppData(user.currencyId);
            });
        } catch (error) {
            console.log(error);
            store.commonStore.setApploaded();
        } 
    }
}