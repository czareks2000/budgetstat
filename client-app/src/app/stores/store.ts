import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import AccountStore from "./accountStore";
import CurrencyStore from "./currencyStore";
import BudgetStore from "./budgetStore";
import CategoryStore from "./categoryStore";
import LoanStore from "./loanStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    accountStore: AccountStore;
    currencyStore: CurrencyStore;
    budgetStore: BudgetStore;
    categoryStore: CategoryStore;
    loanStore: LoanStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    accountStore: new AccountStore(),
    currencyStore: new CurrencyStore(),
    budgetStore: new BudgetStore(),
    categoryStore: new CategoryStore(),
    loanStore: new LoanStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}