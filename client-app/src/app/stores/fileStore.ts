import { makeAutoObservable, runInAction } from "mobx";
import agent from "../api/agent";
import dayjs from "dayjs";
import { TransactionRowItem } from "../models/Transaction";
import { AxiosError } from "axios";
import { store } from "./store";
import { TransactionType } from "../models/enums/TransactionType";

export default class FileStore {
    importedTransactions: TransactionRowItem[] = [];
    importInProgress = false;
    undoInProgress = false;

    constructor() {
        makeAutoObservable(this);
    }
    
    clearImportedTransactions = () => {
        this.importedTransactions = [];
    }

    downloadData = async (fileType: "csv" | "json") => {
        try {
            const response = fileType === "csv" 
            ? await agent.Files.getAppDataCsvZip() 
            : await agent.Files.getAppDataJsonZip();
            const blob = new Blob([response.data], { type: 'application/zip' })
            const downloadUrl = URL.createObjectURL(blob)
            const a = document.createElement("a"); 
            const date = dayjs().format("DD.MM.YYYY");
            a.href = downloadUrl;
            a.download = `budgetstat_${date}.zip`;
            document.body.appendChild(a);
            a.click();
        } catch (error) {
            console.log(error);
            throw (error as AxiosError).response!.data;          
        }
    }

    importTransactions = async (file: Blob) => {
        this.importInProgress = true;
        try {
            const response = await agent.Files.importTransations(file);
            runInAction(() => {
                this.importedTransactions = response.data;

                const uniqueAccountIds = Array.from(new Set(
                    this.importedTransactions
                        .map(t=> t.accountId)
                        .filter(id => id !== null)
                )) as number[];

                this.updateDataInOtherStores(uniqueAccountIds);
            })
        } catch (error) {
            console.log(error);
            throw (error as AxiosError).response!.data;
        }
        finally {
            runInAction(() => {
                this.importInProgress = false;
            })
        }
    }

    removeTransaction = async (type: TransactionType, transactionId: number) => {
        this.importedTransactions = this.importedTransactions
            .filter(t => !(t.transactionId === transactionId && t.amount.type === type));
    }

    undoImport = async () => {
        this.undoInProgress = true;
        try {
            const uniqueAccountIds = Array.from(new Set(
                this.importedTransactions
                    .map(t=> t.accountId)
                    .filter(id => id !== null)
            )) as number[];
            for (const transaction of this.importedTransactions) {
                await agent.Transactions.deleteTransaction(transaction.transactionId);
            }
            runInAction(() => {
                this.clearImportedTransactions();
                this.updateDataInOtherStores(uniqueAccountIds);
            })
        } catch (error) {
            console.log(error);
        }
        finally {
            runInAction(() => {
                this.undoInProgress = false;
            })
        }
    }

    private updateDataInOtherStores = (accountIds: number[]) => {
        
        store.transactionStore.transactionsLoaded = false;
        //store.transactionStore.loadTransactions();
        store.transactionStore.latestTransactionsLoaded = false;

        accountIds.forEach(accountId => {
            store.accountStore.loadAccount(accountId);
        });

        store.statsStore.loadedNetWorthValueOverTime = false;
        //store.statsStore.loadNetWorthValueOverTime();

        store.budgetStore.budgetsLoaded = false;
        //store.budgetStore.loadBudgets();

        store.statsStore.loadCurrentMonthIncome();
        store.statsStore.loadAvgMonthlyIncomesAndExpensesLastYear();
        store.statsStore.homePageChartsLoaded = false;

        store.categoryStore.categoriesLoaded = false;

        store.statsStore.setHasOldData(true);
    }
}