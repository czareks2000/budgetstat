import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { ChangePasswordFormValues, User, UserFormValues } from "../models/User";
import { Account, AccountFormValues } from "../models/Account";
import { AccountStatus } from "../models/enums/AccountStatus";
import { Transaction } from "../models/Transaction";
import { Budget } from "../models/Budget";
import { Currency } from "../models/Currency";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.response.use(async response => {
    if (import.meta.env.DEV) await sleep(0);
    return response;
}, (error: AxiosError) => {
    const {data, status, config} = error.response as AxiosResponse;
    switch (status) {
        case 400:
            if (config.method === 'get' && Object.hasOwnProperty.bind(data.errors)('id')) {
                router.navigate('/not-found');
            }

            if (data.errors) {
                const modalStateErrors = [];
                for (const key in data.errors) {
                    if (data.errors[key]) {
                        modalStateErrors.push(data.errors[key])
                    }
                }
                throw modalStateErrors.flat();
            } else {
                //store.commonStore.setError(data);
            }
            break;
        case 401:
            if (store.userStore.isLoggedIn)
                router.navigate('/unauthorised');
            break;
        case 403:
            router.navigate('/forbidden')
            break;
        case 404:
            router.navigate('/not-found');
            break;
        case 500:
            store.commonStore.setServerError(data);
            router.navigate('/server-error');
            break;
    }
    return Promise.reject(error);
})

const responseBody = <T> (response: AxiosResponse<T>) => response.data;

axios.interceptors.request.use(config => {
    const token = store.commonStore.token;
    if (token && config.headers) config.headers.Authorization = `Bearer ${token}`;
    return config;
})

const requests = {
    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
    post: <T> (url: string, body: object) => axios.post<T>(url, body).then(responseBody),
    put: <T> (url: string, body: object) => axios.put<T>(url, body).then(responseBody),
    patch: <T> (url: string, body: object) => axios.patch<T>(url, body).then(responseBody),
    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

const Auth = {
    current: () => requests.get<User>('/auth'),
    login: (user: UserFormValues) => requests.post<User>('/auth/login', user),
    register: (user: UserFormValues) => requests.post<User>('/auth/register', user),
    changePassword: (values: ChangePasswordFormValues) => requests.post<void>('/auth/changepassword/', values)
}

const Accounts = {
    list: () => requests.get<Account[]>('/accounts'),
    create: (account: AccountFormValues) => requests.post<Account>('/accounts', account),
    update: (accountId: number, account: AccountFormValues) => requests.put<Account>(`/accounts/${accountId}`, account),
    changeStatus: (accountId: number, newStatus: AccountStatus) => requests.patch<void>(`/accounts/${accountId}/${newStatus}`, {}),
    delete: (accountId: number, deleteRelatedTransactions: boolean) => 
        requests.del<void>(`/accounts/${accountId}?deleteRelatedTransactions=${deleteRelatedTransactions}`)
}

const Transactions = {
    create: (accountId: number, transaction: Transaction) => requests.post<number>(`/account/${accountId}/transactions`, transaction),
    toggleConsidered: (transactionId: number) => requests.patch<boolean>(`/transactions/${transactionId}/considered`, {}),
    delete: (transactionId: number) => requests.del<void>(`/transactions/${transactionId}`)
}

const Budgets = {
    list: () => requests.get<Budget[]>('/budgets'),
    create: (budget: Budget) => requests.post<number>('/budgets', budget),
    update: (budgetId: number, budget: Budget) => requests.put<Budget>(`/budgets/${budgetId}`, budget),
    delete: (budgetId: number) => requests.del<void>(`/budgets/${budgetId}`)
}

const Currencies = {
    list: () => requests.get<Currency[]>('/currencies'),
}

const agent = {
    Auth,
    Accounts,
    Transactions,
    Budgets,
    Currencies
}

export default agent;