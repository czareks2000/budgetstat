import { makeAutoObservable, runInAction } from "mobx";
import { Budget } from "../models/Budget";
import agent from "../api/agent";
import { BudgetPeriod } from "../models/enums/BudgetPeriod";

export default class BudgetStore {
    budgetsRegistry = new Map<number, Budget>();
    budgetsLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    clearStore = () => {
        this.budgetsRegistry.clear();
        this.budgetsLoaded = false;
    }

    private setBudget = (budget: Budget) => {
        this.budgetsRegistry.set(budget.id, budget);
    }

    private getBudget = (id: number) => {
        return this.budgetsRegistry.get(id);
    }

    get weeklyBudgets() {
        return Array.from(this.budgetsRegistry.values())
            .filter(b => b.period === BudgetPeriod.Week);
    }

    get monthlyBudgets() {
        return Array.from(this.budgetsRegistry.values())
            .filter(b => b.period === BudgetPeriod.Month);
    }

    get annualBudgets() {
        return Array.from(this.budgetsRegistry.values())
            .filter(b => b.period === BudgetPeriod.Year);
    }

    refreshBudgets = async (categoryId: number) => {
        // pobiera z bazy budżety, który dotyczy danej kategorii

        // sprawdzić lokalnie który budżet dotyczy danej kategorii
        // nastepnie pobrać z bazy budget o danym id
    }

    loadBudgets = async () => {
        try {
            const budgets = await agent.Budgets.list();
            budgets.forEach(budget => this.setBudget(budget));
            runInAction(() => this.budgetsLoaded = true)      
        } catch (error) {
            console.log(error);
        } 
    }

}