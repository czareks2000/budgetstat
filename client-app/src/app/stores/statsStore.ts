import { makeAutoObservable, reaction, runInAction } from "mobx";
import { NetWorthStats, ValueOverTime, LabelValueItem, IncomesAndExpensesDataSetItem, IncomesExpensesValue } from "../models/Stats";
import agent from "../api/agent";
import { store } from "./store";
import { NetWorthChartPeriod } from "../models/enums/periods/NetWorthChartPeriod";
import dayjs from "dayjs";
import { AvgMonthlyTransactionsValuesSettings, BalanceOverTimeForecastSettings, BalanceValueOverTimeSettings, 
    IncomesAndExpensesOverTimeSettings, initialAvgMonthlyExpensesSettings, 
    initialAvgMonthlyIncomesSettings, initialBalanceOverTimeForecastSettings, initialBalanceValueOverTimeSettings, 
    initialIncomesAndExpensesOverTimeSettings } from "../models/ChartsSettings";
import { TransactionType } from "../models/enums/TransactionType";
import { ChartPeriod } from "../models/enums/periods/ChartPeriod";
import { AvgChartPeriod } from "../models/enums/periods/AvgChartPeriod";
import { CategoryType } from "../models/enums/CategoryType";

export default class StatsStore {
    // Current Month Income
    currentMonthIncomesAndExpenses: IncomesExpensesValue = { incomes: 0, expenses: 0 };
    // Avg Monthly Incomes And Expenses Last Year
    avgMonthlyIncomesAndExpensesLastYear: IncomesExpensesValue = { incomes: 0, expenses: 0 };
    // Home page charts
    incomesThisMonth: LabelValueItem[] | undefined = undefined;
    expensesThisMonth: LabelValueItem[] | undefined = undefined;
    balanceLast30Days: ValueOverTime | undefined = undefined;
    homePageChartsLoaded = false;
    
    // Net Worth Stats
    netWorthStats: NetWorthStats | undefined = undefined;

    // Net Worth Value Over Time chart
    netWorthValueOverTime: ValueOverTime | undefined = undefined;
    netWorthChartPeriod: NetWorthChartPeriod = NetWorthChartPeriod.Year;
    loadedNetWorthValueOverTime = false;

    // selected chart 
    selectedChart: number = 0;

    // Balance Value Over Time chart
    balanceValueOverTime: ValueOverTime | undefined = undefined;
    balanceValueOverTimeSettings: BalanceValueOverTimeSettings = initialBalanceValueOverTimeSettings;
    balanceValueOverTimeLoaded = false;

    // Incomes And Expenses Over Time
    incomesAndExpensesOverTime: IncomesAndExpensesDataSetItem[] | undefined = undefined;
    incomesAndExpensesOverTimeSettings: IncomesAndExpensesOverTimeSettings = initialIncomesAndExpensesOverTimeSettings;
    incomesAndExpensesOverTimeLoaded = false;

    // Avg Monthly Expenses By Categories
    avgMonthlyExpensesByCategories: LabelValueItem[] | undefined = undefined;
    avgMonthlyExpensesByCategoriesSettings: AvgMonthlyTransactionsValuesSettings = initialAvgMonthlyExpensesSettings;
    avgMonthlyExpensesByCategoriesLoaded = false;

    // Avg Monthly Incomes By Categories
    avgMonthlyIncomesByCategories: LabelValueItem[] | undefined = undefined;
    avgMonthlyIncomesByCategoriesSettings: AvgMonthlyTransactionsValuesSettings = initialAvgMonthlyIncomesSettings;
    avgMonthlyIncomesByCategoriesLoaded = false;

    // Balance Over Time Forecast
    balanceOverTimeForecast: ValueOverTime | undefined = undefined;
    balanceOverTimeForecastSettings: BalanceOverTimeForecastSettings = initialBalanceOverTimeForecastSettings;
    balanceOverTimeForecastLoaded = false;

    statsHasOldData = false;

    constructor() {
        makeAutoObservable(this);

        reaction(
            () => this.netWorthChartPeriod, 
            () => {
                this.loadNetWorthValueOverTime();
            }
        )
    }

    clearStore = () => {
        this.currentMonthIncomesAndExpenses = { incomes: 0, expenses: 0 };
        this.netWorthStats = undefined;

        this.netWorthValueOverTime = undefined;
        this.netWorthChartPeriod = NetWorthChartPeriod.Year;
        this.loadedNetWorthValueOverTime = false;

        this.balanceValueOverTime = undefined;
        this.balanceValueOverTimeSettings = initialBalanceValueOverTimeSettings;
        this.balanceValueOverTimeLoaded = false;

        this.incomesAndExpensesOverTime = undefined;
        this.incomesAndExpensesOverTimeSettings = initialIncomesAndExpensesOverTimeSettings;
        this.incomesAndExpensesOverTimeLoaded = false;

        this.avgMonthlyExpensesByCategories = undefined;
        this.avgMonthlyExpensesByCategoriesSettings = initialAvgMonthlyExpensesSettings;
        this.avgMonthlyExpensesByCategoriesLoaded = false;

        this.avgMonthlyIncomesByCategories = undefined;
        this.avgMonthlyIncomesByCategoriesSettings= initialAvgMonthlyIncomesSettings;
        this.avgMonthlyIncomesByCategoriesLoaded = false;

        this.balanceOverTimeForecast = undefined;
        this.balanceOverTimeForecastSettings = initialBalanceOverTimeForecastSettings;
        this.balanceOverTimeForecastLoaded = false;

        this.statsHasOldData = false;
    }

    setHasOldData = (state: boolean) => {
        this.statsHasOldData = state;
    }

    setSelectedChart = (id: number) => {
        this.selectedChart = id;
    }

    //#region Home Page Charts

    loadHomePageCharts = async () => {
        this.homePageChartsLoaded = false;
        try {
            const balanceLast30Days = await agent.Stats.accountBalanceOverTime(ChartPeriod.Last30Days);
            const incomesThisMonth = await agent.Stats.avgTransactionsValuesByCategories(
                TransactionType.Income, AvgChartPeriod.Custom, CategoryType.Main, Number(""),
                dayjs().toDate(), dayjs().toDate(),[],
            );
            const expensesThisMonth = await agent.Stats.avgTransactionsValuesByCategories(
                TransactionType.Expense, AvgChartPeriod.Custom, CategoryType.Main, Number(""),
                dayjs().toDate(), dayjs().toDate(),[],
            );
            runInAction(() => {
                balanceLast30Days.startDate = dayjs(balanceLast30Days.startDate).toDate(); 
                balanceLast30Days.endDate = dayjs(balanceLast30Days.endDate).toDate(); 
                this.balanceLast30Days = balanceLast30Days;

                this.incomesThisMonth = incomesThisMonth;
                this.expensesThisMonth = expensesThisMonth;

                this.homePageChartsLoaded = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    //#endregion

    //#region Balance Over Time Forecast

    get balanceOverTimeForecastSettingsHasInitialValues() {
        return JSON.stringify(this.balanceOverTimeForecastSettings) 
            === JSON.stringify(initialBalanceOverTimeForecastSettings)
    }


    loadBalanceOverTimeForecast = async () => {
        this.balanceOverTimeForecastLoaded = false;
        try {
            const response = await agent.Stats.balanceOverTimeForecast(
                    this.balanceOverTimeForecastSettings.period, 
                    this.balanceOverTimeForecastSettings.accountIds.map(a => Number(a.value))
                );
            runInAction(() => {
                response.startDate = dayjs(response.startDate).toDate(); 
                response.endDate = dayjs(response.endDate).toDate(); 
                this.balanceOverTimeForecast = response;
                this.balanceOverTimeForecastLoaded = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    setBalanceOverTimeForecastSettings = async (settings: BalanceOverTimeForecastSettings) => {
        this.balanceOverTimeForecastSettings = settings;
        await this.loadBalanceOverTimeForecast();
    }

    resetBalanceOverTimeForecastSettings = async () => {
        this.balanceOverTimeForecastSettings = initialBalanceOverTimeForecastSettings;
        await this.loadBalanceOverTimeForecast();
    }

    //#endregion

    //#region Avg Monthly Expenses By Categories

    get avgMonthlyExpensesByCategoriesSettingsHasInitialValues() {
        return JSON.stringify(this.avgMonthlyExpensesByCategoriesSettings) 
            === JSON.stringify(initialAvgMonthlyExpensesSettings)
    }

    loadAvgMonthlyExpensesByCategories = async () => {
        this.avgMonthlyExpensesByCategoriesLoaded = false;
        try {
            const response = await agent.Stats.avgTransactionsValuesByCategories(
                TransactionType.Expense,
                this.avgMonthlyExpensesByCategoriesSettings.period,
                this.avgMonthlyExpensesByCategoriesSettings.categoryType,
                Number(this.avgMonthlyExpensesByCategoriesSettings.mainCategoryId),
                dayjs(this.avgMonthlyExpensesByCategoriesSettings.startDate).toDate(),
                dayjs(this.avgMonthlyExpensesByCategoriesSettings.endDate).toDate(),
                this.avgMonthlyExpensesByCategoriesSettings.accountIds.map(a => Number(a.value)),
            );
            runInAction(() => {
                this.avgMonthlyExpensesByCategories = response;
                this.avgMonthlyExpensesByCategoriesLoaded = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    setAvgMonthlyExpensesByCategoriesSettings = async (settings: AvgMonthlyTransactionsValuesSettings) => {
        this.avgMonthlyExpensesByCategoriesSettings = settings;
        await this.loadAvgMonthlyExpensesByCategories();
    }

    resetAvgMonthlyExpensesByCategoriesSettings = async () => {
        this.avgMonthlyExpensesByCategoriesSettings = initialAvgMonthlyExpensesSettings;
        await this.loadAvgMonthlyExpensesByCategories();
    }

    //#endregion

    //#region Avg Monthly Incomes By Categories

    get avgMonthlyIncomesByCategoriesSettingsHasInitialValues() {
        return JSON.stringify(this.avgMonthlyIncomesByCategoriesSettings) 
            === JSON.stringify(initialAvgMonthlyIncomesSettings)
    }

    loadAvgMonthlyIncomesByCategories = async () => {
        this.avgMonthlyIncomesByCategoriesLoaded = false;
        try {
            const response = await agent.Stats.avgTransactionsValuesByCategories(
                TransactionType.Income,
                this.avgMonthlyIncomesByCategoriesSettings.period,
                this.avgMonthlyIncomesByCategoriesSettings.categoryType,
                Number(this.avgMonthlyIncomesByCategoriesSettings.mainCategoryId),
                dayjs(this.avgMonthlyIncomesByCategoriesSettings.startDate).toDate(),
                dayjs(this.avgMonthlyIncomesByCategoriesSettings.endDate).toDate(),
                this.avgMonthlyIncomesByCategoriesSettings.accountIds.map(a => Number(a.value)),
            );
            runInAction(() => {
                this.avgMonthlyIncomesByCategories = response;
                this.avgMonthlyIncomesByCategoriesLoaded = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    setAvgMonthlyIncomesByCategoriesSettings = async (settings: AvgMonthlyTransactionsValuesSettings) => {
        this.avgMonthlyIncomesByCategoriesSettings = settings;
        await this.loadAvgMonthlyIncomesByCategories();
    }

    resetAvgMonthlyIncomesByCategoriesSettings = async () => {
        this.avgMonthlyIncomesByCategoriesSettings = initialAvgMonthlyIncomesSettings;
        await this.loadAvgMonthlyIncomesByCategories();
    }

    //#endregion

    //#region Incomes And Expenses Over Time

    get incomesAndExpensesOverTimeSettingsHasInitialValues() {
        return JSON.stringify(this.incomesAndExpensesOverTimeSettings) 
            === JSON.stringify(initialIncomesAndExpensesOverTimeSettings)
    }

    loadIncomesAndExpensesOverTime = async () => {
        this.incomesAndExpensesOverTimeLoaded = false;
        try {
            const response = await agent.Stats.incomesAndExpensesOverTime(
                this.incomesAndExpensesOverTimeSettings.period,
                this.incomesAndExpensesOverTimeSettings.accountIds.map(a => Number(a.value)),
                dayjs(this.incomesAndExpensesOverTimeSettings.customDate).toDate(),
                this.incomesAndExpensesOverTimeSettings.incomeCategoryIds.map(ic => ic.id),
                this.incomesAndExpensesOverTimeSettings.expenseCategoryIds.map(ec => ec.id),
            );
            runInAction(() => {
                this.incomesAndExpensesOverTime = response;
                this.incomesAndExpensesOverTimeLoaded = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    setIncomesAndExpensesOverTimeSettings = async (settings: IncomesAndExpensesOverTimeSettings) => {
        this.incomesAndExpensesOverTimeSettings = settings;
        await this.loadIncomesAndExpensesOverTime();
    }

    resetIncomesAndExpensesOverTimeSettings = async () => {
        this.incomesAndExpensesOverTimeSettings = initialIncomesAndExpensesOverTimeSettings;
        await this.loadIncomesAndExpensesOverTime();
    }

    //#endregion

    //#region Current Month Income

    get currentMonthIncome() {
        return this.currentMonthIncomesAndExpenses.incomes - this.currentMonthIncomesAndExpenses.expenses;
    }

    loadCurrentMonthIncome = async () => {
        try {
            const value = await agent.Stats.currentMothIncome();
            runInAction(() => {
                this.currentMonthIncomesAndExpenses = value;
            })
        } catch (error) {
            console.log(error);
        }
    }

    //#endregion

    //#region Avg Monthly Incomes And Expenses Last Year

    loadAvgMonthlyIncomesAndExpensesLastYear = async () => {
        try {
            const value = await agent.Stats.avgMonthlyIncomesAndExpensesLastYear();
            runInAction(() => {
                this.avgMonthlyIncomesAndExpensesLastYear = value;
            })
        } catch (error) {
            console.log(error);
        }
    }

    //#endregion

    //#region Net Worth Stats

    get assetPieChartData() {
        let data: LabelValueItem[] = [];

        let index = 1;

        data.push({
            id: index++,
            value: store.accountStore.totalBalance,
            label: "Accounts"
        })

        store.assetStore.assetCategories.forEach((category) => {
            const assetsValue = this.getAssetsValues(category.id);
            
            if (assetsValue > 0)
                data.push({
                    id: index++,
                    value: assetsValue,
                    label: category.name
                })
        })

        return data;
    }

    get assetsValue() {
        var value = 0;

        if (this.netWorthStats)
            this.netWorthStats.assetsValues.forEach(item => {
                value += item.value;
            });

        return value;
    }

    get loansValue() {
        if (!this.netWorthStats)
            return 0;

        return this.netWorthStats.loansValue;
    }

    getAssetsValues = (categoryId: number) => {
        if (!this.netWorthStats)
            return 0

        var value = 0;

        this.netWorthStats.assetsValues
            .forEach(item => {
                if(item.assetCategoryId === categoryId)
                value += item.value;
            });

        return value;
    }

    loadNetWorthStats = async () => {
        try {
            const response = await agent.Stats.netWorthStats();
            runInAction(() => this.netWorthStats = response)
        } catch (error) {
            console.log(error);
        }
    }

    updateNetWorthStats = async (loans: boolean = true, assets: boolean = true) => {
        try {
            const response = await agent.Stats.netWorthStats(loans, assets);

            runInAction(() => {
                if (loans)
                    this.setLoansValue(response.loansValue);
                if (assets)
                    this.setAssetsValues(response.assetsValues);
            })
        } catch (error) {
            console.log(error);
        }
    }
    
    private setLoansValue = (value: number) => {
        if (this.netWorthStats)
            this.netWorthStats.loansValue = value;
    }

    private setAssetsValues  = (value: { assetCategoryId: number; value: number; }[]) => {
        if (this.netWorthStats)
            this.netWorthStats.assetsValues = value;
    }

    //#endregion

    //#region Balance Value Over Time

    get balanceValueOverTimeSettingsHasInitialValues() {
        return JSON.stringify(this.balanceValueOverTimeSettings) 
            === JSON.stringify(initialBalanceValueOverTimeSettings)
    }


    loadBalanceValueOverTime = async () => {
        this.balanceValueOverTimeLoaded = false;
        try {
            const response = await agent.Stats.accountBalanceOverTime(
                    this.balanceValueOverTimeSettings.period, 
                    this.balanceValueOverTimeSettings.accountIds.map(a => Number(a.value)),
                    dayjs(this.balanceValueOverTimeSettings.startDate).toDate(), 
                    dayjs(this.balanceValueOverTimeSettings.endDate).toDate()
                );
            runInAction(() => {
                response.startDate = dayjs(response.startDate).toDate(); 
                response.endDate = dayjs(response.endDate).toDate(); 
                this.balanceValueOverTime = response;
                this.balanceValueOverTimeLoaded = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    setBalanceValueOverTimeSettings = async (settings: BalanceValueOverTimeSettings) => {
        this.balanceValueOverTimeSettings = settings;
        await this.loadBalanceValueOverTime();
    }

    resetBalanceValueOverTimeSettings = async () => {
        this.balanceValueOverTimeSettings = initialBalanceValueOverTimeSettings;
        await this.loadBalanceValueOverTime();
    }

    //#endregion

    //#region Net Worth Value Over Time

    loadNetWorthValueOverTime = async () => {
        this.loadedNetWorthValueOverTime = false;
        try {
            const response = await agent.Stats.netWorthValueOverTime(this.netWorthChartPeriod);
            runInAction(() => {
                response.startDate = dayjs(response.startDate).toDate(); 
                response.endDate = dayjs(response.endDate).toDate(); 
                this.netWorthValueOverTime = response;
                this.loadedNetWorthValueOverTime = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    setNetWorthChartPeriod = (period: NetWorthChartPeriod) => {
        this.netWorthChartPeriod = period;
    }

    //#endregion
}