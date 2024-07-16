import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import RequireAuth from "./RequireAuth";
import ServerError from "../../pages/errors/ServerError";
import NotFound from "../../pages/errors/NotFound";
import Accounts from "../../pages/accounts/Accounts";
import Budgets from "../../pages/budgets/Budgets";
import Calendar from "../../pages/calendar/Calendar";
import Home from "../../pages/home/Home";
import ImportExport from "../../pages/importexport/ImportExport";
import Loans from "../../pages/loans/Loans";
import NetWorth from "../../pages/networth/NetWorth";
import Preferences from "../../pages/preferences/Preferences";
import Stats from "../../pages/stats/Stats";
import Transactions from "../../pages/transactions/Transactions";
import Login from "../../pages/login/Login";
import CreateBudget from "../../pages/budgets/CreateBudget";
import EditBudget from "../../pages/budgets/EditBudget";
import CreateAccount from "../../pages/accounts/CreateAccount";
import EditAccount from "../../pages/accounts/EditAccount";
import CreateLoan from "../../pages/loans/CreateLoan";
import CounterpartyDetails from "../../pages/loans/CounterpartyDetails";
import LoanDetails from "../../pages/loans/LoanDetails";
import EditLoan from "../../pages/loans/EditLoan";
import CreateAsset from "../../pages/networth/CreateAsset";
import EditAsset from "../../pages/networth/EditAsset";
import AssetDetails from "../../pages/networth/AssetDetails";
import PlannedTransactions from "../../pages/transactions/PlannedTransactions";
import CreateTransaction from "../../pages/transactions/CreateTransaction";
import EditTransaction from "../../pages/transactions/EditTransaction";
import AccountTransactions from "../../pages/transactions/AccountTransactions";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            {element: <RequireAuth />, children: [
                {path: 'home', element: <Home />},
                {path: 'stats', element: <Stats />},
                {path: 'calendar', element: <Calendar />},

                {path: 'accounts', element: <Accounts />},
                {path: 'accounts/create', element: <CreateAccount />},
                {path: 'accounts/:id/edit', element: <EditAccount />},
                {path: 'accounts/:id/transactions', element: <AccountTransactions />},
                
                {path: 'transactions', element: <Transactions />},
                {path: 'transactions/planned', element: <PlannedTransactions />},
                {path: 'transactions/create', element: <CreateTransaction />},
                {path: 'transactions/:id/edit', element: <EditTransaction />},

                {path: 'budgets', element: <Budgets />},
                {path: 'budgets/create', element: <CreateBudget />},
                {path: 'budgets/:id/edit', element: <EditBudget />},

                {path: 'loans', element: <Loans />},
                {path: 'loans/create', element: <CreateLoan />},
                {path: 'loans/:id/edit', element: <EditLoan />},
                {path: 'loans/counterparty/:id', element: <CounterpartyDetails />},
                {path: 'loans/:id', element: <LoanDetails />},
                
                {path: 'net-worth', element: <NetWorth />},
                {path: 'assets/create', element: <CreateAsset />},
                {path: 'assets/:id/edit', element: <EditAsset />},
                {path: 'assets/:id', element: <AssetDetails />},

                {path: 'import-export', element: <ImportExport />},
                {path: 'preferences', element: <Preferences />},
                
                {path: 'not-found', element: <NotFound />},
            ]},
            {path: 'login', element: <Login />},
            {path: 'server-error', element: <ServerError />},
            {path: '*', element: <NotFound />}
        ]
    }
]

export const router = createBrowserRouter(routes);