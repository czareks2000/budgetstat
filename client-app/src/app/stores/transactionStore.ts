import { makeAutoObservable, reaction, runInAction } from "mobx";
import { TransactionParams, TransactionParamsFormValues, TransactionRowItem } from "../models/Transaction";
import agent from "../api/agent";
import { convertToDate } from "../utils/ConvertToDate";
import dayjs from "dayjs";
import { TransactionType, TransactionTypeFilter } from "../models/enums/TransactionType";
import { store } from "./store";


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
    filterHasInitialValues = true;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.transactionParams, 
            () => {
                this.loadTransactions();
            }
        )
    }

    clearStore = () => {
        this.transactionRegistry.clear();
        this.transactionsLoaded = false;
    }

    get transactionParamsFormValues() {
        const formValue: TransactionParamsFormValues = {
            startDate: dayjs(this.transactionParams.startDate),
            endDate: dayjs(this.transactionParams.endDate),
            type: this.convertToTransactionTypeFilter(this.transactionParams.types),
            accountIds: store.accountStore
                .convertAccountIdsToOptions(this.transactionParams.accountIds),
            incomeCategoryIds: store.categoryStore
                .convertToCategoryOptions(store.categoryStore
                    .getCategoriesByIds(this.transactionParams.categoryIds))
                        .filter(option => option.type === TransactionType.Income),
            expenseCategoryIds: store.categoryStore
                .convertToCategoryOptions(store.categoryStore
                    .getCategoriesByIds(this.transactionParams.categoryIds))
                        .filter(option => option.type === TransactionType.Expense)
        }
        return formValue;
    }

    get transactions() {
        return Array.from(this.transactionRegistry.values());
    }

    private setTransaction = (transaction: TransactionRowItem) => {
        transaction.date = convertToDate(transaction.date);
        this.transactionRegistry.set(transaction.id, transaction);
    }

    resetTransactionParams = () => {
        this.transactionParams = {
            startDate: dayjs().add(-30, 'days'),
            endDate: dayjs(),
            types: [],
            accountIds: [],
            categoryIds: []
        }
        this.filterHasInitialValues = true;
    }

    setTransactionParams = async (params: TransactionParamsFormValues) =>
    {   
        const transactionPrams: TransactionParams = {
            startDate: dayjs(params.startDate).toDate(),
            endDate: dayjs(params.endDate).toDate(),
            types: this.convertToTransactionType(params.type),
            accountIds: params.accountIds.map(option => Number(option.value)),
            categoryIds: [],
        }

        let categoryIds: number[] = []; 
        
        if (params.type === TransactionTypeFilter.All ||
            params.type === TransactionTypeFilter.Income) {
            categoryIds = params.incomeCategoryIds.map(option => Number(option.id));
        }

        if (params.type === TransactionTypeFilter.All ||
            params.type === TransactionTypeFilter.Expense) {
            categoryIds = categoryIds
                .concat(params.expenseCategoryIds.map(option => Number(option.id)));
        }

        transactionPrams.categoryIds = categoryIds;

        this.transactionParams = transactionPrams;
        this.filterHasInitialValues = false;
    }

    private convertToTransactionType = (filter: TransactionTypeFilter): TransactionType[] => {
        switch (filter) {
            case TransactionTypeFilter.All:
                return [];
            case TransactionTypeFilter.Income:
                return [TransactionType.Income];
            case TransactionTypeFilter.Expense:
                return [TransactionType.Expense]; 
            case TransactionTypeFilter.Transfer:
                return [TransactionType.Transfer];       
            default:
                return [];
        }
    }

    private convertToTransactionTypeFilter = (filter: TransactionType[]): TransactionTypeFilter => {
        if (filter.length == 0)
            return TransactionTypeFilter.All;

        switch (filter[0]) {
            case TransactionType.Income:
                return TransactionTypeFilter.Income;
            case TransactionType.Expense:
                return TransactionTypeFilter.Expense; 
            case TransactionType.Transfer:
                return TransactionTypeFilter.Transfer;       
            default:
                return TransactionTypeFilter.All;
        }
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