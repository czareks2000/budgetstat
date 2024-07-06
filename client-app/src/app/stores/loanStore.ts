import { makeAutoObservable, runInAction } from "mobx";
import { Loan, LoanCreateValues } from "../models/Loan";
import { Counterparty } from "../models/Counterparty";
import { LoanStatus } from "../models/enums/LoanStatus";
import agent from "../api/agent";
import { Option } from "../models/Option";
import { AxiosError } from "axios";
import { store } from "./store";

export default class LoanStore {
    loansInProgressRegistry = new Map<number, Loan>();
    loansInProgressLoaded = false;

    loansPaidOffRegistry = new Map<number, Loan>();
    loansPaidOffLoaded = false;
    
    selectedLoan: Loan | undefined = undefined; 

    counterparties: Counterparty[] = [];
    counterpartiesLoaded = false;

    constructor() {
        makeAutoObservable(this);
    }

    clearStore = () => {
        this.loansInProgressRegistry.clear();
        this.loansInProgressLoaded = false;

        this.loansPaidOffRegistry.clear();
        this.loansPaidOffLoaded = false;

        this.selectedLoan = undefined;

        this.counterparties = [];
        this.counterpartiesLoaded = false;
    }

    private setLoan = (loan: Loan) => {
        if (loan.loanStatus === LoanStatus.InProgress)
            this.loansInProgressRegistry.set(loan.id, loan);
        else if (loan.loanStatus === LoanStatus.PaidOff)
            this.loansPaidOffRegistry.set(loan.id, loan);
    }

    loadLoans = async (loanStatus: LoanStatus) => {
        this.setLoadedLoansFlag(loanStatus, false);
        try {
            const loans = await agent.Loans.getLoans(loanStatus);
            runInAction(() => {
                loans.forEach(loan => this.setLoan(loan));
                this.setLoadedLoansFlag(loanStatus, true);
            })
        } catch (error) {
            console.log(error);
        }
    }

    private setLoadedLoansFlag = (status: LoanStatus, state: boolean) => {
        if (status === LoanStatus.InProgress)
            this.loansInProgressLoaded = state;
        else if (status === LoanStatus.PaidOff)
            this.loansPaidOffLoaded = state;
    }

    createLoan = async (loan: LoanCreateValues) => {
        try {
            const newLoan = await agent.Loans.createLoan(loan);
            runInAction(() => {
                this.setLoan(newLoan);
                store.accountStore.loadAccount(newLoan.accountId);
            })
        } catch (error) {
            console.log(error);
            throw (error as AxiosError).response!.data;
        }
    }

    loadCounterparties = async () => {
        this.counterpartiesLoaded = false;
        try {
            const counterparties = await agent.Loans.getCounterparties();
            runInAction(() => {
                this.counterparties = counterparties;
                this.counterpartiesLoaded = true;
            })
        } catch (error) {
            console.log(error);
        }
    }

    get counterpartiesAsOptions(): Option[] {
        return this.counterparties.map(cp => ({
            value: cp.id,
            text: cp.name
        }))
    }
}