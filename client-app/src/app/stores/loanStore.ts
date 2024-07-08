import { makeAutoObservable, runInAction } from "mobx";
import { GroupedLoan, Loan, LoanCreateValues } from "../models/Loan";
import { Counterparty, CounterpartyCreateValues } from "../models/Counterparty";
import { LoanStatus } from "../models/enums/LoanStatus";
import agent from "../api/agent";
import { Option } from "../models/Option";
import { AxiosError } from "axios";
import { store } from "./store";
import { LoanType } from "../models/enums/LoanType";
import { convertToDate } from "../utils/ConvertToDate";
import { PayoffCreateValues } from "../models/Payoff";

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
        loan.loanDate = convertToDate(loan.loanDate);
        loan.repaymentDate = convertToDate(loan.repaymentDate);

        loan.payoffs.forEach(payoff => {
            payoff.date = convertToDate(payoff.date);
        });

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

    get groupedLoansByCounterpartyAndCurrency(): GroupedLoan[] {
        const groupedLoansMap = new Map<string, GroupedLoan>();

        this.loansInProgressRegistry.forEach(loan => {
            const key = `${loan.counterpartyId}-${loan.currencyId}`;
            const existingGroup = groupedLoansMap.get(key);

            const currentAmountAdjustment = loan.loanType === LoanType.Credit ? loan.currentAmount : -loan.currentAmount;
            const fullAmountAdjustment = loan.loanType === LoanType.Credit ? loan.fullAmount : -loan.fullAmount;

            if (existingGroup) {
                existingGroup.currentAmount += currentAmountAdjustment;
                existingGroup.fullAmount += fullAmountAdjustment;
                existingGroup.nearestRepaymentDate = 
                    new Date(Math.min(existingGroup.nearestRepaymentDate.getTime(), loan.repaymentDate.getTime()));
            } else {
                groupedLoansMap.set(key, {
                    counterpartyId: loan.counterpartyId,
                    currencyId: loan.currencyId,
                    currentAmount: currentAmountAdjustment,
                    fullAmount: fullAmountAdjustment,
                    nearestRepaymentDate: loan.repaymentDate
                });
            }
        });

        return Array.from(groupedLoansMap.values());
    }

    getCounterpartyGroupedLoans = (counterpartyId: number): GroupedLoan[] => {
        return this.groupedLoansByCounterpartyAndCurrency.filter(gl => gl.counterpartyId === counterpartyId);
    }

    getCounterpartyLoans = (counterpartyId: number,
        type: LoanType, 
        status: LoanStatus = LoanStatus.InProgress): Loan[] => {
        
        if (status === LoanStatus.InProgress)
        {
            return Array.from(this.loansInProgressRegistry.values())
                .filter(l => l.counterpartyId === counterpartyId)
                .filter(l => l.loanType === type);
        }
        else if (status === LoanStatus.PaidOff)
        {
            return Array.from(this.loansPaidOffRegistry.values())
                .filter(l => l.counterpartyId === counterpartyId)
                .filter(l => l.loanType === type);
        }
        
        return []
    }

    getLoanById = (loanId: number): Loan | undefined => {
        if (this.loansInProgressRegistry.has(loanId)) {
            return this.loansInProgressRegistry.get(loanId);
        } else if (this.loansPaidOffRegistry.has(loanId)) {
            return this.loansPaidOffRegistry.get(loanId);
        }
        return undefined;
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

    createPayoff = async (loanId: number, payoff: PayoffCreateValues) => {
        try {
            const updatedLoan = await agent.Loans.createPayoff(loanId, payoff);
            runInAction(() => {
                this.setLoan(updatedLoan);
                store.accountStore.loadAccount(updatedLoan.accountId);
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

    createCounterparty = async (counterparty: CounterpartyCreateValues) => {
        try {
            var cp = await agent.Loans.createCounterparty(counterparty);
            runInAction(() => this.counterparties.push(cp))
        } catch (error) {
            console.log(error);
        }
    }
}