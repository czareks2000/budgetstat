import { makeAutoObservable, runInAction } from "mobx";
import { Account } from "../models/Account";
import agent from "../api/agent";

export default class AccountStore {
    accountsRegistry = new Map<number, Account>();
    accountsLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    get accounts() {
        return Array.from(this.accountsRegistry.values());
    }

    private setAccount = (account: Account) => {
        account.createdAt = this.convertToDate(account.createdAt);
        this.accountsRegistry.set(account.id, account);
    }

    private getAccount = (id: number) => {
        return this.accountsRegistry.get(id);
    }

    loadAccounts = async () => {
        try {
            const accounts = await agent.Accounts.list();
            accounts.forEach(account => this.setAccount(account));
            runInAction(() => this.accountsLoaded = true)      
        } catch (error) {
            console.log(error);
        } 
    }

    private convertToDate(date: Date) {
        const result = new Date(date);
        return result;
    }
}