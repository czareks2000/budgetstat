import { makeAutoObservable, runInAction } from "mobx";
import { TransactionParams, TransactionRowItem } from "../models/Transaction";
import agent from "../api/agent";
import { convertToDate } from "../utils/ConvertToDate";
import dayjs from "dayjs";


export default class TransactionStore {
    transactionRegistry = new Map<number, TransactionRowItem>();
    transactionsLoaded = false;

    transactionParams: TransactionParams = {
        startDate: dayjs().add(-30, 'days'),
        endDate: dayjs(),
        types: [],
        accountIds: [],
        categoryIds: []
    }

    constructor() {
        makeAutoObservable(this);
    }

    clearStore = () => {
        this.transactionRegistry.clear();
        this.transactionsLoaded = false;
    }

    get transactions() {
        return Array.from(this.transactionRegistry.values());
    }

    private setTransaction = (transaction: TransactionRowItem) => {
        transaction.date = convertToDate(transaction.date);
        this.transactionRegistry.set(transaction.id, transaction);
    }

    setTransactionParams = (params: TransactionParams) =>
    {
        this.transactionParams = params;
    }

    loadTransactions = async () => {
        this.transactionsLoaded = false;
        this.transactionRegistry.clear();
        try {
            const transactions = await agent.Transactions.list(this.transactionParams);
            runInAction(() => {
                
                transactions.forEach(transaction => {
                    this.setTransaction(transaction);
                })
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.transactionsLoaded = true;
            })
        }
    }
}