import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import AccountStore from "./accountStore";
import CurrencyStore from "./currencyStore";
import BudgetStore from "./budgetStore";
import CategoryStore from "./categoryStore";
import LoanStore from "./loanStore";
import AssetStore from "./assetStore";
import TransactionStore from "./transactionStore";
import StatsStore from "./statsStore";
import FileStore from "./fileStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    accountStore: AccountStore;
    currencyStore: CurrencyStore;
    budgetStore: BudgetStore;
    categoryStore: CategoryStore;
    loanStore: LoanStore;
    assetStore: AssetStore;
    transactionStore: TransactionStore;
    statsStore: StatsStore;
    fileStore: FileStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    accountStore: new AccountStore(),
    currencyStore: new CurrencyStore(),
    budgetStore: new BudgetStore(),
    categoryStore: new CategoryStore(),
    loanStore: new LoanStore(),
    assetStore: new AssetStore(),
    transactionStore: new TransactionStore(),
    statsStore: new StatsStore(),
    fileStore: new FileStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}