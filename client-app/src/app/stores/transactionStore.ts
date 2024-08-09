import { makeAutoObservable, reaction, runInAction } from "mobx";
import { DataGridSettings, PlannedTransaction, PlannedTransactionCreateValues, PlannedTransactionFormValues, TransactionCreateValues, TransactionFormValues, TransactionParams, TransactionParamsFormValues, TransactionRowItem, TransactionToDelete, TransactionUpdateValues, defaultDataGridSetttings } from "../models/Transaction";
import agent from "../api/agent";
import { convertToDate } from "../utils/ConvertToDate";
import dayjs from "dayjs";
import { TransactionType, TransactionTypeFilter } from "../models/enums/TransactionType";
import { store } from "./store";
import { AxiosError } from "axios";
import { TransferCreateUpdateValues } from "../models/Transfer";
import { router } from "../router/Routes";
import { ChartPeriod } from "../models/enums/periods/ChartPeriod";

export default class TransactionStore {
    transactionRegistry = new Map<number, TransactionRowItem>();
    transactionsLoaded = false;

    latestTransactionsRegistry = new Map<number, TransactionRowItem>();
    latestTransactionsLoaded = false;

    plannedTransactionRegistry = new Map<number, PlannedTransaction>();
    plannedTransactionsLoaded = true;

    transactionFormValues: TransactionFormValues | undefined = undefined;
    loadingFormValues = false;

    private initialParams: TransactionParams = {
        period: ChartPeriod.Last30Days,
        startDate: dayjs().startOf('day').add(12,'hours').add(-30, 'days').toDate(),
        endDate: dayjs().startOf('day').add(12,'hours').toDate(),
        types: [],
        accountIds: [],
        categoryIds: []
    };

    transactionParams: TransactionParams = this.initialParams;
    filterHasInitialValues = true;

    dataGridSettings: DataGridSettings = localStorage.getItem('dataGridSettings') 
        ? JSON.parse(localStorage.getItem('dataGridSettings')!)
        : defaultDataGridSetttings;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.transactionParams, 
            () => {
                this.loadTransactions();
            }
        )

        reaction(
            () => this.dataGridSettings,
            () => {
                localStorage.setItem('dataGridSettings', JSON.stringify(this.dataGridSettings))
            }
        )
    }

    setDataGridSettings = (settings: DataGridSettings) => {
        this.dataGridSettings = settings;
    }

    clearStore = () => {
        this.transactionRegistry.clear();
        this.transactionsLoaded = false;
        this.transactionFormValues = undefined;
        this.plannedTransactionRegistry.clear();
        this.plannedTransactionsLoaded = false;
    }

    get transactionParamsFormValues() {
        const formValue: TransactionParamsFormValues = {
            period: this.transactionParams.period,
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

    get latestTransactions() {
        return Array.from(this.latestTransactionsRegistry.values());
    }

    get plannedTransactions() {
        const today = dayjs().startOf('day');
        return Array.from(this.plannedTransactionRegistry.values())
            .filter(t => dayjs(t.date).startOf('day').isAfter(today))
            .sort((a,b) => a.date.getTime() - b.date.getTime());
    }

    get plannedTransactionsToConfirm() {
        const today = dayjs().startOf('day');
        return Array.from(this.plannedTransactionRegistry.values())
            .filter(t => !dayjs(t.date).startOf('day').isAfter(today))
            .sort((a,b) => a.date.getTime() - b.date.getTime());
    }

    private setTransaction = (transaction: TransactionRowItem) => {
        transaction.date = convertToDate(transaction.date);
        this.transactionRegistry.set(transaction.id, transaction);
    }

    private setPlannedTransaction = (transaction: PlannedTransaction) => {
        transaction.date = convertToDate(transaction.date);
        this.plannedTransactionRegistry.set(transaction.id, transaction);
    }

    amountColor = (type: TransactionType) => {
        if (type === TransactionType.Expense)
            return 'error'
        else if (type === TransactionType.Income)
            return 'success.main'
    }

    resetTransactionParams = () => {
        this.transactionParams = this.initialParams;
        this.filterHasInitialValues = true;
    }

    setTransactionParams = async (params: TransactionParamsFormValues) =>
    {   
        const transactionPrams: TransactionParams = {
            period: params.period,
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
        try {
            const transactions = await agent.Transactions.list(this.transactionParams);
            runInAction(() => {
                this.transactionRegistry.clear();
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

    loadLatestTransactions = async (initial: boolean = false) => {
        this.latestTransactionsLoaded = false;
        this.latestTransactionsRegistry.clear();
        if (initial)
        {
            this.transactionsLoaded = false;
            this.transactionRegistry.clear();
        }
        try {
            const latestTransactions = await agent.Transactions.list(this.initialParams);
            runInAction(() => {
                latestTransactions.forEach(transaction => {
                    this.latestTransactionsRegistry.set(transaction.id, transaction);
                    if (initial)  
                        this.setTransaction(transaction);
                })
            })
        } catch (error) {
            console.log(error);
        } finally {
            runInAction(() => {
                this.latestTransactionsLoaded = true;
                if (initial)
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
            })
        } catch (error) {
            console.log(error);
            router.navigate('/not-found');
        } finally {
            runInAction(()=> {
                this.loadingFormValues = false;
            })
        }
    }

    clearTransactionFormValues = () => {
        this.transactionFormValues = undefined;
    }

    loadPlannedTransactions = async () => {
        this.plannedTransactionsLoaded = false;
        try {
            const transactions = await agent.Transactions.getPlannedTransactions();
            runInAction(() => {
                transactions.forEach(transaction => {
                    this.setPlannedTransaction(transaction);
                });
                this.plannedTransactionsLoaded = true;
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

                this.latestTransactionsLoaded = false;
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
            this.updateDataInOtherStores([newTransfer.fromAccountId, newTransfer.toAccountId], null);
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
            considered: transactionFormValues.considered,
            description: transactionFormValues.description
        }

        const accountId = Number(transactionFormValues.accountId);

        await agent.Transactions.createTransaction(accountId, newTransaction);

        runInAction(() => {
            this.updateDataInOtherStores([accountId], newTransaction.categoryId);
        })
    }

    updateTransaction = async (transactionId: number, transaction: TransactionFormValues, initialValues: TransactionFormValues) => {
        try {
            if (transaction.type === TransactionType.Transfer)
                await this.submitUpdatedTransfer(transactionId, transaction);
            else
                await this.submitUpdatedTransaction(transactionId, transaction, initialValues);

            runInAction(() => {
                if (!this.filterHasInitialValues)
                    this.resetTransactionParams();
                else
                    this.loadTransactions();

                this.latestTransactionsLoaded = false;
            })
        } catch (error) {
            console.log(error);
            throw (error as AxiosError).response!.data;
        }
    }

    private submitUpdatedTransaction = async (transactionId: number, transaction: TransactionFormValues, initialValues: TransactionFormValues) => {
        const updatedTransaction: TransactionUpdateValues = {
            amount: transaction.amount!,
            categoryId: transaction.type === TransactionType.Expense 
                ? 
                transaction.expenseCategoryId!.id 
                : 
                transaction.incomeCategoryId!.id,
            accountId: Number(transaction.accountId),
            date: dayjs(transaction.date).toDate(),
            considered: transaction.considered,
            description: transaction.description
        }

        await agent.Transactions.updateTransaction(transactionId, updatedTransaction);

        const accountId = Number(transaction.accountId);

        runInAction(() => {
            let categoryId = null;
            if (initialValues.type === TransactionType.Income)
            {
                if (initialValues.incomeCategoryId!.id !== transaction.incomeCategoryId!.id)
                    categoryId = initialValues.incomeCategoryId!.id;
            }
            else if (initialValues.type === TransactionType.Expense)
            {
                if (initialValues.expenseCategoryId!.id !== transaction.expenseCategoryId!.id)
                    categoryId = initialValues.expenseCategoryId!.id;         
            }  

            this.updateDataInOtherStores([accountId], updatedTransaction.categoryId, categoryId);
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
            this.updateDataInOtherStores([updatedTransfer.fromAccountId, updatedTransfer.toAccountId], null);
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
                const accountIds: number[] = [];

                if (transaction.toAccountId)
                    accountIds.push(transaction.toAccountId);

                if(fromAccountId)
                    accountIds.push(fromAccountId);

                this.updateDataInOtherStores([transaction.toAccountId, fromAccountId], transaction.categoryId);

                this.latestTransactionsLoaded = false;
            })

        } catch (error) {
            console.log(error);
        }
    }

    deletePlannedTransaction = async (transactionId: number) => {
        try {
            this.plannedTransactionRegistry.delete(transactionId);
            await agent.Transactions.deleteTransaction(transactionId);
        } catch (error) {
            console.log(error);
        }
    }

    removePlannedTransaction = (accountId: number) => {
        const transactionId = Array.from(this.plannedTransactionRegistry.values())
            .find(t => t.accountId === accountId)?.id;
        if (transactionId)
            this.plannedTransactionRegistry.delete(transactionId);
    }

    createPlannedTransactions = async (formValues: PlannedTransactionFormValues) => {
        try {
            const values: PlannedTransactionCreateValues = {
                amount: formValues.amount!,
                categoryId: formValues.type === TransactionType.Expense 
                    ? 
                    formValues.expenseCategoryId!.id 
                    : 
                    formValues.incomeCategoryId!.id,
                startDate: dayjs(formValues.startDate).toDate(),
                considered: formValues.considered,
                repeatsEvery: formValues.repeatsEvery!,
                period: formValues.period,
                numberOfTimes: formValues.numberOfTimes!,
                description: formValues.description
            }
            const transactions = await agent.Transactions.createPlanned(Number(formValues.accountId), values);

            runInAction(() => {
                transactions.forEach(transaction => {
                    this.setPlannedTransaction(transaction);
                });
            });
        } catch (error) {
            console.log(error);
        }
    }

    confirmTransaction = async (transactionId: number) => {
        try {
            await agent.Transactions.confirmTransaction(transactionId);
            runInAction(() => {
                const transaction = this.plannedTransactionRegistry.get(transactionId);
                if (transaction)
                {
                    this.updateDataInOtherStores([transaction.accountId], transaction.category.id);
                    this.resetTransactionParams();
                    this.plannedTransactionRegistry.delete(transactionId);
                    this.latestTransactionsLoaded = false;
                }
            })
        } catch (error) {
            console.log(error);
            throw (error as AxiosError).response!.data;
        }
    }

    private updateDataInOtherStores = (accountIds: (number | null)[], categoryId: number | null, oldCategoryId?: number | null) => {
        
        if (accountIds)
        {
            let nulls = true;

            accountIds.forEach(accountId => {
                if (accountId)
                {
                    store.accountStore.loadAccount(accountId);
                    nulls = false;
                }  
            });

            if (!nulls)
            store.statsStore.loadNetWorthValueOverTime();
        }   
            
        if (categoryId)
            store.budgetStore.refreshBudgets(categoryId);
        if (oldCategoryId)
            store.budgetStore.refreshBudgets(oldCategoryId); 

        store.statsStore.loadCurrentMonthIncome();
        store.statsStore.loadAvgMonthlyIncomesAndExpensesLastYear();
        store.statsStore.homePageChartsLoaded = false;

        store.categoryStore.categoriesLoaded = false;

        store.statsStore.setHasOldData(true);
    }
}