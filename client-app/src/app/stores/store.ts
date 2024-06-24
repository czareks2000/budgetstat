import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import AccountStore from "./accountStore";
import CurrencyStore from "./currencyStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    accountStore: AccountStore;
    currencyStore: CurrencyStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    accountStore: new AccountStore(),
    currencyStore: new CurrencyStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}