import { RouteObject, createBrowserRouter } from "react-router-dom";
import App from "../layout/App";
import RequireAuth from "./RequireAuth";
import ServerError from "../../pages/errors/ServerError";
import NotFound from "../../pages/errors/NotFound";
import Accounts from "../../pages/accounts/Accounts";
import Budgets from "../../pages/budgets/Budgets";
import Home from "../../pages/home/Home";
import ImportExport from "../../pages/importexport/ImportExport";
import Loans from "../../pages/loans/Loans";
import NetWorth from "../../pages/networth/NetWorth";
import Preferences from "../../pages/preferences/Preferences";
import Stats from "../../pages/stats/Stats";
import Transactions from "../../pages/transactions/Transactions";
import CreateBudget from "../../pages/budgets/CreateBudget";
import EditBudget from "../../pages/budgets/EditBudget";
import CreateAccount from "../../pages/accounts/CreateAccount";
import EditAccount from "../../pages/accounts/EditAccount";
import CreateLoan from "../../pages/loans/CreateLoan";
import CounterpartyDetails from "../../pages/loans/CounterpartyDetails";
import LoanDetails from "../../pages/loans/LoanDetails";
import EditLoan from "../../pages/loans/EditLoan";
import CreateAsset from "../../pages/networth/CreateAsset";
import AssetDetails from "../../pages/networth/AssetDetails";
import PlannedTransactions from "../../pages/transactions/planned/PlannedTransactions";
import CreateTransaction from "../../pages/transactions/CreateTransaction";
import EditTransaction from "../../pages/transactions/EditTransaction";
import CreatePlannedTransactions from "../../pages/transactions/planned/CreatePlannedTransactions";
import Forbidden from "../../pages/errors/Forbidden";
import Unauthorised from "../../pages/errors/Unauthorised";
import ManageCategories from "../../pages/preferences/ManageCategories";
import CreateCategory from "../../pages/preferences/CreateCategory";
import EditCategory from "../../pages/preferences/EditCategory";
import ChangePassword from "../../pages/preferences/ChangePassword";
import ResetPassword from "../../pages/auth/ResetPassword";
import ForgotPassword from "../../pages/auth/ForgotPassword";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            {element: <RequireAuth />, children: [
                {path: '', element: <Home />},
                {path: 'home', element: <Home />},
                {path: 'stats', element: <Stats />},

                {path: 'accounts', element: <Accounts />},
                {path: 'accounts/create', element: <CreateAccount />},
                {path: 'accounts/:id/edit', element: <EditAccount />},
                
                {path: 'transactions', element: <Transactions />},
                {path: 'transactions/planned', element: <PlannedTransactions />},
                {path: 'transactions/planned/create', element: <CreatePlannedTransactions />},
                {path: 'transactions/create', element: <CreateTransaction />},
                {path: 'transactions/:type/:id/edit', element: <EditTransaction />},

                {path: 'budgets', element: <Budgets />},
                {path: 'budgets/create', element: <CreateBudget />},
                {path: 'budgets/:id/edit', element: <EditBudget />},

                {path: 'loans', element: <Loans />},
                {path: 'loans/counterparty', element: <Loans />},
                {path: 'loans/create', element: <CreateLoan />},
                {path: 'loans/:id/edit', element: <EditLoan />},
                {path: 'loans/counterparty/:id', element: <CounterpartyDetails />},
                {path: 'loans/:id', element: <LoanDetails />},
                
                {path: 'net-worth', element: <NetWorth />},
                {path: 'net-worth/assets/create', element: <CreateAsset />},
                {path: 'net-worth/assets/:id/edit', element: <AssetDetails editView/>},
                {path: 'net-worth/assets/:id', element: <AssetDetails />},

                {path: 'import-export', element: <ImportExport />},

                {path: 'preferences', element: <Preferences />},
                {path: 'preferences/categories', element: <ManageCategories />},
                {path: 'preferences/categories/create', element: <CreateCategory />},
                {path: 'preferences/categories/:id/edit', element: <EditCategory />},
                {path: 'preferences/change-password', element: <ChangePassword />},
                
                {path: 'not-found', element: <NotFound />},
                {path: 'forbidden', element: <Forbidden />},
                {path: 'unauthorised', element: <Unauthorised />},
                {path: 'server-error', element: <ServerError />},
                {path: '*', element: <NotFound />}
            ]},
        ]
    },
    {path: '/reset-password', element: <ResetPassword />},
    {path: '/forgot-password', element: <ForgotPassword />},
]

export const router = createBrowserRouter(routes);