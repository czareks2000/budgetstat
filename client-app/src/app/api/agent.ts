import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { ChangePasswordFormValues, User, UserFormValues } from "../models/User";
import { Account, AccountFormValues } from "../models/Account";
import { AccountStatus } from "../models/enums/AccountStatus";
import { PlannedTransactionCreateValues, Transaction, TransactionCreateValues, TransactionUpdateValues } from "../models/Transaction";
import { Budget, BudgetDto } from "../models/Budget";
import { Currency } from "../models/Currency";
import { CategoryCreateValues, CategoryUpdateValues, MainCategory } from "../models/Category";
import { Transfer, TransferCreateUpdateValues } from "../models/Transfer";
import { Counterparty, CounterpartyCreateValues } from "../models/Counterparty";
import { Loan, LoanCreateValues, LoanUpdateValues } from "../models/Loan";
import { PayoffCreateValues } from "../models/Payoff";
import { LoanStatus } from "../models/enums/LoanStatus";
import { Icon } from "../models/Icon";
import { Asset, AssetCategory, AssetCreateUpdateValues } from "../models/Asset";

const sleep = (delay: number) => {
    return new Promise((resolve) => {
        setTimeout(resolve, delay);
    })
}

axios.defaults.baseURL = import.meta.env.VITE_API_URL;

axios.interceptors.response.use(async response => {
    if (import.meta.env.DEV) await sleep(500);
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
            else
                router.navigate('/');               
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
    current: () => 
        requests.get<User>('/auth'),
    login: (user: UserFormValues) => 
        requests.post<User>('/auth/login', user),
    register: (user: UserFormValues) => 
        requests.post<User>('/auth/register', user),
    changePassword: (values: ChangePasswordFormValues) => 
        requests.post<void>('/auth/changepassword/', values)
}

const Accounts = {
    list: () => 
        requests.get<Account[]>('/accounts'),
    create: (account: AccountFormValues) => 
        requests.post<Account>('/accounts', account),
    update: (accountId: number, account: AccountFormValues) => 
        requests.put<Account>(`/accounts/${accountId}`, account),
    changeStatus: (accountId: number, newStatus: AccountStatus) => 
        requests.patch<void>(`/accounts/${accountId}/${newStatus}`, {}),
    delete: (accountId: number, deleteRelatedTransactions: boolean) => 
        requests.del<void>(`/accounts/${accountId}?deleteRelatedTransactions=${deleteRelatedTransactions}`)
}

const Transactions = {
    createTransaction: (accountId: number, transaction: TransactionCreateValues) => 
        requests.post<Transaction>(`/account/${accountId}/transactions`, transaction),
    createPlanned: (accountId: number, transaction: PlannedTransactionCreateValues) => 
        requests.post<Transaction[]>(`/account/${accountId}/transactions/planned`, transaction),
    createTransfer: (transfer: TransferCreateUpdateValues) =>
        requests.post<Transfer>("/transfers", transfer),
    toggleConsidered: (transactionId: number) => 
        requests.patch<boolean>(`/transactions/${transactionId}/considered`, {}),
    deleteTransaction: (transactionId: number) => 
        requests.del<void>(`/transactions/${transactionId}`),
    deleteTransfer: (transferId: number) =>
        requests.del<void>(`/transfers/${transferId}`),
    updateTransaction: (transactionId: number, transaction:TransactionUpdateValues) => 
        requests.put<Transaction>(`/transactions/${transactionId}`, transaction),
    updateTransfer: (transferId: number, transfer: TransferCreateUpdateValues) =>
        requests.put<Transfer>(`/transfers/${transferId}`, transfer),
    confirmTransaction: (transactionId: number) => 
        requests.patch<void>(`/transactions/${transactionId}/confirm`, {})
}

const Budgets = {
    one: (budgetId: number) => 
        requests.get<Budget>(`/budgets/${budgetId}`),
    list: () => 
        requests.get<Budget[]>('/budgets'),
    create: (budget: BudgetDto) => 
        requests.post<Budget>('/budgets', budget),
    update: (budgetId: number, budget: BudgetDto) => 
        requests.put<Budget>(`/budgets/${budgetId}`, budget),
    delete: (budgetId: number) => 
        requests.del<void>(`/budgets/${budgetId}`)
}

const Currencies = {
    list: () => 
        requests.get<Currency[]>('/currencies'),
}

const Categories = {
    all: () => 
        requests.get<MainCategory[]>('/categories'),
    create: (category: CategoryCreateValues) => 
        requests.post<MainCategory>('/categories', category),
    update: (categoryId: number, category: CategoryUpdateValues) => 
        requests.put<MainCategory>(`/categories/${categoryId}`, category),
    delete: (categoryId: number) => 
        requests.del<void>(`/categories/${categoryId}`)
}

const Loans = {
    createCounterparty: (counterparty: CounterpartyCreateValues) => 
        requests.post<Counterparty>('/counterparty', counterparty),
    createLoan: (loan: LoanCreateValues) =>
        requests.post<Loan>('/loans', loan),
    createPayoff: (loanId: number, payoff: PayoffCreateValues) => 
        requests.post<Loan>(`/loans/${loanId}/payoff`, payoff),
    updateLoan: (loanId: number, loan: LoanUpdateValues) => 
        requests.put<Loan>(`/loans/${loanId}`, loan),
    getCounterparties: () =>
        requests.get<Counterparty[]>('/counterparties'),
    getLoans: (loanStatus: LoanStatus) =>
        requests.get<Loan[]>(`/loans?loanStatus=${loanStatus}`),
    deleteCounterparty: (counterpartyId: number) => 
        requests.del<void>(`/counterparty/${counterpartyId}`),
    deleteLoan: (loanId: number) => 
        requests.del<void>(`/loans/${loanId}`),
    deletePayoff: (payoffId: number) => 
        requests.del<void>(`/payoff/${payoffId}`),
}

const Icons = {
    list: () => 
        requests.get<Icon[]>('/icons'),
}

const Assets = {
    getAssetCategories: () =>
        requests.get<AssetCategory[]>('/assets/categories'),
    list: () =>
        requests.get<Asset[]>('/assets'),
    create: (asset: AssetCreateUpdateValues) =>
        requests.post<Asset>('/assets', asset),
    delete: (assetId: number) => 
        requests.del<void>(`/assets/${assetId}`),
    update: (assetId: number, asset: AssetCreateUpdateValues) =>
        requests.post<Asset>(`/assets/${assetId}`, asset),
}

const agent = {
    Auth,
    Accounts,
    Transactions,
    Budgets,
    Currencies,
    Categories,
    Loans,
    Icons,
    Assets
}

export default agent;