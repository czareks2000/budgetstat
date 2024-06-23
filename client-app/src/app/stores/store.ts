import { createContext, useContext } from "react";
import CommonStore from "./commonStore";
import UserStore from "./userStore";
import AccountStore from "./accountStore";

interface Store {
    commonStore: CommonStore;
    userStore: UserStore;
    accountStore: AccountStore;
}

export const store: Store = {
    commonStore: new CommonStore(),
    userStore: new UserStore(),
    accountStore: new AccountStore()
}

export const StoreContext = createContext(store);

export function useStore() {
    return useContext(StoreContext);
}