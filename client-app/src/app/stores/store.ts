import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import AccountStore from "./accountStore";
import CurrencyStore from "./currencyStore";
import BudgetStore from "./budgetStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    accountStore: AccountStore;
    currencyStore: CurrencyStore;
    budgetStore: BudgetStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    accountStore: new AccountStore(),
    currencyStore: new CurrencyStore(),
    budgetStore: new BudgetStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}