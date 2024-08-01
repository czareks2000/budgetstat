import axios, { AxiosError, AxiosResponse } from "axios";
import { router } from "../router/Routes";
import { store } from "../stores/store";
import { ChangePasswordFormValues, User, UserFormValues } from "../models/User";
import { Account, AccountFormValues } from "../models/Account";
import { AccountStatus } from "../models/enums/AccountStatus";
import { PlannedTransaction, PlannedTransactionCreateValues, Transaction, TransactionCreateValues, TransactionFormValues, TransactionParams, TransactionRowItem, TransactionUpdateValues } from "../models/Transaction";
import { Budget, BudgetDto } from "../models/Budget";
import { Currency } from "../models/Currency";
import { CategoryCreateValues, CategoryUpdateValues, MainCategory } from "../models/Category";
import { Transfer, TransferCreateUpdateValues } from "../models/Transfer";
import { Counterparty, CounterpartyCreateValues } from "../models/Counterparty";
import { Loan, LoanCreateValues, LoanUpdateValues } from "../models/Loan";
import { CollectivePayoffValues, PayoffCreateValues } from "../models/Payoff";
import { LoanStatus } from "../models/enums/LoanStatus";
import { Icon } from "../models/Icon";
import { Asset, AssetCategory, AssetCreateUpdateValues } from "../models/Asset";
import { IncomesAndExpensesDataSetItem, IncomesExpensesValue, LabelValueItem, NetWorthStats, ValueOverTime } from "../models/Stats";
import { ChartPeriod } from "../models/enums/periods/ChartPeriod";
import { TransactionType } from "../models/enums/TransactionType";
import { NetWorthChartPeriod } from "../models/enums/periods/NetWorthChartPeriod";
import { ExtendedChartPeriod } from "../models/enums/periods/ExtenedChartPeriod";
import { AvgChartPeriod } from "../models/enums/periods/AvgChartPeriod";
import { CategoryType } from "../models/enums/CategoryType";
import { ForecastPeriod } from "../models/enums/periods/ForecastPeriod";

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
    one: (accountId: number) => 
        requests.get<Account>(`/accounts/${accountId}`),
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
        requests.post<number>(`/account/${accountId}/transactions`, transaction),
    createPlanned: (accountId: number, transaction: PlannedTransactionCreateValues) => 
        requests.post<PlannedTransaction[]>(`/account/${accountId}/transactions/planned`, transaction),
    createTransfer: (transfer: TransferCreateUpdateValues) =>
        requests.post<Transfer>("/transfers", transfer),
    toggleConsidered: (transactionId: number) => 
        requests.patch<boolean>(`/transactions/${transactionId}/considered`, {}),
    deleteTransaction: (transactionId: number) => 
        requests.del<void>(`/transactions/${transactionId}`),
    deleteTransfer: (transferId: number) =>
        requests.del<number>(`/transfers/${transferId}`),
    updateTransaction: (transactionId: number, transaction:TransactionUpdateValues) => 
        requests.put<Transaction>(`/transactions/${transactionId}`, transaction),
    updateTransfer: (transferId: number, transfer: TransferCreateUpdateValues) =>
        requests.put<Transfer>(`/transfers/${transferId}`, transfer),
    confirmTransaction: (transactionId: number) => 
        requests.patch<void>(`/transactions/${transactionId}/confirm`, {}),
    list: (params: TransactionParams) => {

        let urlParams = `?StartDate=${params.startDate.toISOString()}&EndDate=${params.endDate.toISOString()}`;

        if (params.types.length > 0) {
            params.types.forEach(type => {
                urlParams += `&Types=${type}`;
            });
        }

        if (params.accountIds.length > 0) {
            params.accountIds.forEach(id => {
                urlParams += `&AccountIds=${id}`;
            });
        }
    
        if (params.categoryIds.length > 0) {
            params.categoryIds.forEach(id => {
                urlParams += `&CategoryIds=${id}`;
            });
        }

        return requests.get<TransactionRowItem[]>(`/transactions${urlParams}`);
    },
    getTransactionFormValues: (transactionId: number, type: TransactionType) => 
        requests.get<TransactionFormValues>(`/transactions/${transactionId}?type=${type}`),
    getPlannedTransactions: () =>
        requests.get<PlannedTransaction[]>('transactions/planned'),
        
}

const Budgets = {
    one: (budgetId: number) => 
        requests.get<Budget>(`/budgets/${budgetId}`),
    getAll: () => 
        requests.get<Budget[]>('/budgets/all'),
    list: (categoryId: number) => 
        requests.get<Budget[]>(`/budgets?categoryId=${categoryId}`),
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
    currentExchangeRate: (inputCurrencyCode: string, outputCurrencyCode: string) =>
        requests.get<number>(`/exchangerate/${inputCurrencyCode}/${outputCurrencyCode}`)
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
    colectivePayoff: (counterpartyId: number, payoff: CollectivePayoffValues) => 
        requests.post<Loan[]>(`/counterparty/${counterpartyId}/payoff`, payoff),
    updateLoan: (loanId: number, loan: LoanUpdateValues) => 
        requests.put<Loan>(`/loans/${loanId}`, loan),
    getCounterparties: () =>
        requests.get<Counterparty[]>('/counterparties'),
    getLoan: (loanId: number) =>
        requests.get<Loan>(`/loans/${loanId}`),
    getLoans: (loanStatus: LoanStatus, counterpartyId: number) =>
        requests.get<Loan[]>(`/loans?loanStatus=${loanStatus}&counterpartyId=${counterpartyId}`),
    deleteCounterparty: (counterpartyId: number) => 
        requests.del<void>(`/counterparty/${counterpartyId}`),
    deleteLoan: (loanId: number) => 
        requests.del<void>(`/loans/${loanId}`),
    deletePayoff: (payoffId: number) => 
        requests.del<Loan>(`/payoff/${payoffId}`),
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
        requests.put<Asset>(`/assets/${assetId}`, asset),
}

const Settings = {
    setDefaultCurrency: (currencyId: number) =>
        requests.patch<Currency>(`/settings?defaultCurrency=${currencyId}`, {})
}

const Stats = {
    netWorthStats: (loans: boolean = true, assets: boolean = true) =>
        requests.get<NetWorthStats>(`/stats/networthstats?loans=${loans}&assets=${assets}`),
    netWorthValueOverTime: (period: NetWorthChartPeriod) =>
        requests.get<ValueOverTime>(`/stats/networthovertime/${period}`),
    currentMothIncome: () =>
        requests.get<IncomesExpensesValue>('/stats/currentmonthincome'),
    avgMonthlyIncomesAndExpensesLastYear: () =>
        requests.get<IncomesExpensesValue>('/stats/avgmonthlyincomesandexpenseslastyear'),
    accountBalanceOverTime: (period: ChartPeriod, accountIds?: number[], startDate?: Date, endDate?: Date) => {

        let urlParams = '';
        
        if (period === ChartPeriod.Custom)
            urlParams =`startDate=${startDate!.toISOString()}&endDate=${endDate!.toISOString()}`;

        if (accountIds && accountIds.length > 0) {
            accountIds.forEach(id => {
                urlParams += `&accountIds=${id}`;
            });
        }
        
        return requests.get<ValueOverTime>(`/stats/balanceovertime/${period}?${urlParams}`);
    },
    incomesAndExpensesOverTime: (period: ExtendedChartPeriod, accountIds?: number[], customDate?: Date, 
        incomeCategoryIds?: number[], expenseCategoryIds?: number[]) => {

        let urlParams = '';

        if (period === ExtendedChartPeriod.CustomMonth ||
            period === ExtendedChartPeriod.CustomYear)
            urlParams =`customDate=${customDate!.toISOString()}`;

        if (accountIds && accountIds.length > 0) {
            accountIds.forEach(id => {
                urlParams += `&accountIds=${id}`;
            });
        }

        if (incomeCategoryIds && incomeCategoryIds.length > 0) {
            incomeCategoryIds.forEach(id => {
                urlParams += `&incomeCategoryIds=${id}`;
            });
        }

        if (expenseCategoryIds && expenseCategoryIds.length > 0) {
            expenseCategoryIds.forEach(id => {
                urlParams += `&expenseCategoryIds=${id}`;
            });
        }

        return requests.get<IncomesAndExpensesDataSetItem[]>(`/stats/incomesandexpensesovertime/${period}?${urlParams}`);
    },
    avgTransactionsValuesByCategories: (transactionType: TransactionType, period: AvgChartPeriod, 
        categoryType: CategoryType, mainCategoryId?: number,
        startDate?: Date, endDate?: Date, accountIds?: number[]) => {
        
        let urlParams = `&transactionType=${transactionType}&categoryType=${categoryType}`;

        if (categoryType === CategoryType.Sub)
            urlParams += `&mainCategoryId=${mainCategoryId}`

        if (period === AvgChartPeriod.Custom)
            urlParams +=`&startDate=${startDate!.toISOString()}&endDate=${endDate!.toISOString()}`;

        if (accountIds && accountIds.length > 0) {
            accountIds.forEach(id => {
                urlParams += `&accountIds=${id}`;
            });
        }

        return requests.get<LabelValueItem[]>(`/stats/avgmonthlytransactionsvalues/${period}?${urlParams}`)
    },
    balanceOverTimeForecast: (period: ForecastPeriod, accountIds?: number[]) => {

        let urlParams = '';

        if (accountIds && accountIds.length > 0) {
            accountIds.forEach(id => {
                urlParams += `&accountIds=${id}`;
            });
        }

        return requests.get<ValueOverTime>(`/stats/balanceovertimeforecast/${period}?${urlParams}`)
    }
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
    Assets,
    Settings,
    Stats
}

export default agent;