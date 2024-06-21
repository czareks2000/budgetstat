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
import Settings from "../../pages/settings/Settings";
import Stats from "../../pages/stats/Stats";
import Transactions from "../../pages/transactions/Transactions";

export const routes: RouteObject[] = [
    {
        path: '/',
        element: <App/>,
        children: [
            {element: <RequireAuth />, children: [
                {path: 'accounts', element: <Accounts />},
                {path: 'budgets', element: <Budgets />},
                {path: 'calendar', element: <Calendar />},
                {path: 'home', element: <Home />},
                {path: 'import-export', element: <ImportExport />},
                {path: 'loans', element: <Loans />},
                {path: 'net-worth', element: <NetWorth />},
                {path: 'preferences', element: <Preferences />},
                {path: 'settings', element: <Settings />},
                {path: 'stats', element: <Stats />},
                {path: 'transactions', element: <Transactions />},
                {path: 'not-found', element: <NotFound />},
            ]},
            {path: 'server-error', element: <ServerError />},
            {path: '*', element: <NotFound />}
        ]
    }
]

export const router = createBrowserRouter(routes);