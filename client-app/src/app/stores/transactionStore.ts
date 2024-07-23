import { makeAutoObservable, reaction, runInAction } from "mobx";
import { TransactionCreateValues, TransactionFormValues, TransactionParams, TransactionParamsFormValues, TransactionRowItem, TransactionToDelete, TransactionUpdateValues } from "../models/Transaction";
import agent from "../api/agent";
import { convertToDate } from "../utils/ConvertToDate";
import dayjs from "dayjs";
import { TransactionType, TransactionTypeFilter } from "../models/enums/TransactionType";
import { store } from "./store";
import { AxiosError } from "axios";
import { TransferCreateUpdateValues } from "../models/Transfer";


export default class TransactionStore {
    transactionRegistry = new Map<number, TransactionRowItem>();
    transactionsLoaded = false;

    transactionFormValues: TransactionFormValues | undefined = undefined;
    loadingFormValues = false;

    private initialParams: TransactionParams = {
        startDate: dayjs().add(-30, 'days').toDate(),
        endDate: dayjs().toDate(),
        types: [],
        accountIds: [],
        categoryIds: []
    };

    transactionParams: TransactionParams = this.initialParams;
    filterHasInitialValues = true;

    showDescriptionColumn: boolean = localStorage.getItem('showDecriptionColumn') === 'true';

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.transactionParams, 
            () => {
                this.loadTransactions();
            }
        )

        reaction(
            () => this.showDescriptionColumn,
            () => {
                localStorage.setItem('showDecriptionColumn', this.showDescriptionColumn ? 'true' : 'false')
            }
        )
    }

    setShowDescriptionColumn = (state: boolean) => {
        this.showDescriptionColumn = state;
    }

    clearStore = () => {
        this.transactionRegistry.clear();
        this.transactionsLoaded = false;
        this.transactionFormValues = undefined;
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
        this.transactionParams = this.initialParams;
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

        this.filterHasInitialValues = JSON.stringify(transactionPrams) === JSON.stringify(this.initialParams);
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

    loadTransactionFormValues = async (transactionId: number, type: TransactionType) => {
        this.transactionFormValues = undefined;
        this.loadingFormValues = true;
        try {
            const values = await agent.Transactions.getTransactionFormValues(transactionId, type);
            runInAction(() => {
                values.type = type;

                values.accountId = values.accountId ? values.accountId : "";
                values.fromAccountId = values.fromAccountId ? values.fromAccountId : "";
                values.toAccountId = values.toAccountId ? values.toAccountId : "";

                values.date = dayjs(values.date);
                
                this.transactionFormValues = values;
                this.loadingFormValues = false;
            })
        } catch (error) {
            console.log(error);
        }
    }

    createTransaction = async (transactionFormValues: TransactionFormValues) => {
        try {
            if (transactionFormValues.type === TransactionType.Transfer)
                await this.submitTransfer(transactionFormValues);
            else
                await this.submitTransaction(transactionFormValues);

            runInAction(() => {
                if (!this.filterHasInitialValues)
                    this.resetTransactionParams();
                else
                    this.loadTransactions();
            })
            
        } catch (error) {
            console.log(error);
            throw (error as AxiosError).response!.data;
        }
    }

    private submitTransfer = async (transactionFormValues: TransactionFormValues) => {
        const newTransfer: TransferCreateUpdateValues = {
            fromAmount: transactionFormValues.fromAmount!,
            toAmount: transactionFormValues.toAmount!,
            fromAccountId: Number(transactionFormValues.fromAccountId),
            toAccountId: Number(transactionFormValues.toAccountId),
            date: dayjs(transactionFormValues.date).toDate()
        }
        await agent.Transactions.createTransfer(newTransfer);

        runInAction(() => {
            this.updateDataInOtherStores(newTransfer.fromAccountId, null);
            this.updateDataInOtherStores(newTransfer.toAccountId, null);
        })
    }

    private submitTransaction = async (transactionFormValues: TransactionFormValues) => {
        const newTransaction: TransactionCreateValues = {
            amount: transactionFormValues.amount!,
            categoryId: transactionFormValues.type === TransactionType.Expense 
                ? 
                transactionFormValues.expenseCategoryId!.id 
                : 
                transactionFormValues.incomeCategoryId!.id,
            date: dayjs(transactionFormValues.date).toDate(),
            considered: transactionFormValues.considered
        }

        const accountId = Number(transactionFormValues.accountId);

        await agent.Transactions.createTransaction(accountId, newTransaction);

        runInAction(() => {
            this.updateDataInOtherStores(accountId, newTransaction.categoryId);
        })
    }

    updateTransaction = async (transactionId: number, transaction: TransactionFormValues) => {
        try {
            if (transaction.type === TransactionType.Transfer)
                await this.submitUpdatedTransfer(transactionId, transaction);
            else
                await this.submitUpdatedTransaction(transactionId, transaction);

            runInAction(() => {
                if (!this.filterHasInitialValues)
                    this.resetTransactionParams();
                else
                    this.loadTransactions();
            })
        } catch (error) {
            console.log(error);
            throw (error as AxiosError).response!.data;
        }
    }

    private submitUpdatedTransaction = async (transactionId: number, transaction: TransactionFormValues) => {
        const updatedTransaction: TransactionUpdateValues = {
            amount: transaction.amount!,
            categoryId: transaction.type === TransactionType.Expense 
                ? 
                transaction.expenseCategoryId!.id 
                : 
                transaction.incomeCategoryId!.id,
            accountId: Number(transaction.accountId),
            date: dayjs(transaction.date).toDate(),
            considered: transaction.considered
        }

        await agent.Transactions.updateTransaction(transactionId, updatedTransaction);

        const accountId = Number(transaction.accountId);

        runInAction(() => {
            this.updateDataInOtherStores(accountId, updatedTransaction.categoryId);
        })
    }

    private submitUpdatedTransfer = async (transactionId: number, transaction: TransactionFormValues) => {
        const updatedTransfer: TransferCreateUpdateValues = {
            fromAmount: transaction.fromAmount!,
            toAmount: transaction.toAmount!,
            fromAccountId: Number(transaction.fromAccountId),
            toAccountId: Number(transaction.toAccountId),
            date: dayjs(transaction.date).toDate()
        }
        await agent.Transactions.updateTransfer(transactionId, updatedTransfer);

        runInAction(() => {
            this.updateDataInOtherStores(updatedTransfer.fromAccountId, null);
            this.updateDataInOtherStores(updatedTransfer.toAccountId, null);
        })
    }

    deleteTransaction = async (transaction: TransactionToDelete) => {
        try {
            this.transactionRegistry.delete(transaction.index);

            let fromAccountId: number | null = null;

            if (transaction.type === TransactionType.Transfer)
                fromAccountId = await agent.Transactions.deleteTransfer(transaction.transactionId);
            else
                await agent.Transactions.deleteTransaction(transaction.transactionId);

            runInAction(() => {
                this.updateDataInOtherStores(transaction.toAccountId, transaction.categoryId);

                if(fromAccountId)
                    this.updateDataInOtherStores(fromAccountId, null);
            })

        } catch (error) {
            console.log(error);
        }
    }

    private updateDataInOtherStores = (accountId: number | null, categoryId: number | null) => {
        if (accountId)
            store.accountStore.loadAccount(accountId);
        if (categoryId)
            store.budgetStore.refreshBudgets(categoryId);
    }
}