import { makeAutoObservable, runInAction } from "mobx";
import { Account, AccountFormValues } from "../models/Account";
import agent from "../api/agent";
import { AccountStatus } from "../models/enums/AccountStatus";

export default class AccountStore {
    accountsRegistry = new Map<number, Account>();
    selectedAccount: Account | undefined = undefined; 
    accountsLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    clearStore = () => {
        this.accountsRegistry.clear();
        this.accountsLoaded = false;
    }

    get accounts() {
        return Array.from(this.accountsRegistry.values());
    }

    get totalBalance() {
        const accounts = Array.from(this.accountsRegistry.values());

        let balance = 0;

        accounts.forEach(account => {
            if (account.status === AccountStatus.Visible)
                balance += account.convertedBalance;
        });
        
        return balance;
    }

    private setAccount = (account: Account) => {
        account.createdAt = this.convertToDate(account.createdAt);
        this.accountsRegistry.set(account.id, account);
    }

    private getAccount = (id: number) => {
        return this.accountsRegistry.get(id);
    }

    selectAccount = (accountId: number) => {
        this.selectedAccount = this.getAccount(accountId);
    }
    
    deselectAccount = () => {
        this.selectedAccount = undefined;
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

    createAccount = async (account: AccountFormValues) => {
        try {
            const createdAccount = await agent.Accounts.create(account);
        
            runInAction(() => {
                this.setAccount(createdAccount);
            });    
        } catch (error) {
            console.log(error);
        }
    }

    deleteAccount = async (accountId: number, deleteRelatedTransactions: boolean) => {
        try {
            await agent.Accounts.delete(accountId, deleteRelatedTransactions);
        
            runInAction(() => {
                this.accountsRegistry.delete(accountId);
                this.deselectAccount();
            });    
        } catch (error) {
            console.log(error);
        }
    }

    updateAccount = async (accountId: number, account: AccountFormValues) => {
        try {
            const updatedAccount = await agent.Accounts.update(accountId, account);
        
            runInAction(() => {
                this.setAccount(updatedAccount);
            });    
        } catch (error) {
            console.log(error);
        }
    }

    changeStatus = async (accountId: number, currentStatus: AccountStatus) => {
        try {
            const newStatus = this.newStatus(currentStatus);
            const account = this.getAccount(accountId);

            if (account)
                account.status = newStatus;

            await agent.Accounts.changeStatus(accountId, newStatus);  
        } catch (error) {
            console.log(error);
        } 
    }

    private convertToDate(date: Date) {
        const result = new Date(date);
        return result;
    }

    private newStatus(currentStatus: AccountStatus)
    {
        return currentStatus === AccountStatus.Visible ? AccountStatus.Hidden : AccountStatus.Visible;
    }

}