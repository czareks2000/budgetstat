import { makeAutoObservable, runInAction } from "mobx";
import { Budget, BudgetDto, BudgetSummary } from "../models/Budget";
import agent from "../api/agent";
import { BudgetPeriod } from "../models/enums/BudgetPeriod";
import { router } from "../router/Routes";

export default class BudgetStore {
    budgetsRegistry = new Map<number, Budget>();
    selectedBudget: Budget | undefined = undefined;
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

    get weeklyBudgetsSummary() {
        return this.getBudgetsSummary(this.weeklyBudgets);
    }

    get monthlyBudgets() {
        return Array.from(this.budgetsRegistry.values())
            .filter(b => b.period === BudgetPeriod.Month);
    }

    get monthlyBudgetsSummary() {
        return this.getBudgetsSummary(this.monthlyBudgets);
    }

    get annualBudgets() {
        return Array.from(this.budgetsRegistry.values())
            .filter(b => b.period === BudgetPeriod.Year);
    }

    get annualBudgetsSummary() {
        return this.getBudgetsSummary(this.annualBudgets);
    }

    private getBudgetsSummary = (budgets: Budget[]) => {
        const summary: BudgetSummary = {
            percentage: 0,
            progressValue: 0,
            currentAmount: 0,
            fullAmount: 0
        }

        budgets.forEach(budget => {
            summary.fullAmount += budget.convertedAmount;
            summary.currentAmount += budget.currentAmount;
        })

        if (summary.fullAmount > 0)
        {
            summary.percentage = summary.currentAmount / summary.fullAmount * 100;
            summary.progressValue = Math.min((summary.currentAmount / summary.fullAmount * 100), 100);
        }

        return summary;
    }

    startDate = (period: BudgetPeriod) => {
        const now = new Date();
        let start;

        switch (period) {
            case BudgetPeriod.Week:
                start = new Date(now.setDate(now.getDate() - now.getDay() + 1)); // Monday as the first day of the week
                break;
            case BudgetPeriod.Month:
                start = new Date(now.getFullYear(), now.getMonth(), 1);
                break;
            case BudgetPeriod.Year:
                start = new Date(now.getFullYear(), 0, 1);
                break;
            default:
                return null;
        }

        const dd = String(start.getDate()).padStart(2, '0');
        const mm = String(start.getMonth() + 1).padStart(2, '0'); // January is 0
        const yyyy = start.getFullYear();

        return `${dd}.${mm}.${yyyy}`;
    }

    endDate = (period: BudgetPeriod) => {
        const now = new Date();
        let end;

        switch (period) {
            case BudgetPeriod.Week:
                end = new Date(now.setDate(now.getDate() - now.getDay() + 7)); // Sunday as the last day of the week
                break;
            case BudgetPeriod.Month:
                end = new Date(now.getFullYear(), now.getMonth() + 1, 0); // Last day of the current month
                break;
            case BudgetPeriod.Year:
                end = new Date(now.getFullYear(), 11, 31); // December 31st of the current year
                break;
            default:
                return null;
        }

        const dd = String(end.getDate()).padStart(2, '0');
        const mm = String(end.getMonth() + 1).padStart(2, '0'); // January is 0
        const yyyy = end.getFullYear();

        return `${dd}.${mm}.${yyyy}`;
    }

    progressColor = (percentage: number) => {
        if (percentage < 90) {
            return "success";
        } else if (percentage >= 90 && percentage < 100) {
            return "warning";
        } else {
            return "error";
        }
    }

    progressValue = (budget: Budget) => {
        return Math.min((budget.currentAmount / budget.convertedAmount * 100), 100);
    }

    refreshBudgets = async (categoryId: number) => {
        try {
            const budgets = await agent.Budgets.list(categoryId);
            runInAction(() => {
                budgets.forEach((budget) => {
                    this.setBudget(budget);
                })
            })
        } catch (error) {
            console.log(error);
        }
    }

    selectBudget = (budgetId: number) => {
        this.selectedBudget = this.getBudget(budgetId);
        if(!this.selectedBudget)
            router.navigate('/not-found');
    }
    
    deselectBudget = () => {
        this.selectedBudget = undefined;
    }

    loadBudgets = async () => {
        try {
            const budgets = await agent.Budgets.getAll();
            budgets.forEach(budget => this.setBudget(budget));
            runInAction(() => this.budgetsLoaded = true)      
        } catch (error) {
            console.log(error);
        } 
    }

    createBudget = async (budget: BudgetDto) => {
        try {
            const createdBudget = await agent.Budgets.create(budget);

            runInAction(() => {
                this.setBudget(createdBudget);
            });    
        } catch (error) {
            console.log(error);
        }
    }

    deleteBudget = async (budgetId: number) => {
        try {
            await agent.Budgets.delete(budgetId);

            runInAction(() => {
                this.budgetsRegistry.delete(budgetId);
                this.deselectBudget();
            });     
        } catch (error) {
            console.log(error);
        } 
    }

    updateBudget = async (budgetId: number, budget: BudgetDto) => {
        try {
            const updatedBudget = await agent.Budgets.update(budgetId, budget);
        
            runInAction(() => {
                this.setBudget(updatedBudget);
                this.deselectBudget();
            });    
        } catch (error) {
            console.log(error);
        }
    }
}