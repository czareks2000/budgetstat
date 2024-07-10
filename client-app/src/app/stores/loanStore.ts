import { makeAutoObservable, runInAction } from "mobx";
import { GroupedLoan, Loan, LoanCreateValues, LoanUpdateValues } from "../models/Loan";
import { Counterparty, CounterpartyCreateValues } from "../models/Counterparty";
import { LoanStatus } from "../models/enums/LoanStatus";
import agent from "../api/agent";
import { Option } from "../models/Option";
import { AxiosError } from "axios";
import { store } from "./store";
import { LoanType } from "../models/enums/LoanType";
import { convertToDate } from "../utils/ConvertToDate";
import { CollectivePayoffValues, PayoffCreateValues } from "../models/Payoff";

export default class LoanStore {
    loansInProgressRegistry = new Map<number, Loan>();
    loansInProgressLoaded = false;

    loansPaidOffRegistry = new Map<number, Loan>();
    loansPaidOffLoaded = false;

    counterpartyLoansLoaded: number[] = [];
    
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
        this.counterpartyLoansLoaded= [];

        this.selectedLoan = undefined;

        this.counterparties = [];
        this.counterpartiesLoaded = false;
    }

    selectLoan = async (loanId: number) => {
        try {
            const loan = this.getLoanById(loanId);

            if (loan) {
                this.selectedLoan = loan;
                return;
            }

            const loanFromDb = await agent.Loans.getLoan(loanId);
            runInAction(() => {
                this.setLoan(loanFromDb);
                this.selectedLoan = loanFromDb;
            })   

        } catch (error) {
            console.log(error);
        }
    }
    
    deselectLoan = () => {
        this.selectedLoan = undefined;
    }

    private setLoan = (loan: Loan) => {
        loan.loanDate = convertToDate(loan.loanDate);
        loan.repaymentDate = convertToDate(loan.repaymentDate);

        loan.payoffs.forEach(payoff => {
            payoff.date = convertToDate(payoff.date);
        });

        if (loan.loanStatus === LoanStatus.InProgress)
        {
            this.loansPaidOffRegistry.delete(loan.id);
            this.loansInProgressRegistry.set(loan.id, loan);
        }
        else if (loan.loanStatus === LoanStatus.PaidOff)
        {
            this.loansInProgressRegistry.delete(loan.id);
            this.loansPaidOffRegistry.set(loan.id, loan);
        }
    }

    private removeLoan = (loanId: number) => {
        const loan = this.getLoanById(loanId);
        
        if(!loan) return;
        
        store.accountStore.loadAccount(loan.accountId);
        this.loansPaidOffRegistry.delete(loanId);
        this.loansInProgressRegistry.delete(loanId);
    }

    loadLoans = async (loanStatus: LoanStatus, counterpartyId: number = 0) => {
        this.setLoadedLoansFlag(loanStatus, false);
        try {
            const loans = await agent.Loans.getLoans(loanStatus, counterpartyId);
            runInAction(() => {
                loans.forEach(loan => this.setLoan(loan));
                this.setLoadedLoansFlag(loanStatus, true);
                this.setPaidOffLoansLoaded(loanStatus, counterpartyId);
            })
        } catch (error) {
            console.log(error);
        } 
    }

    private setPaidOffLoansLoaded = (loanStatus: LoanStatus, counterpartyId: number) => {
        if (loanStatus === LoanStatus.PaidOff)
            this.counterpartyLoansLoaded.push(counterpartyId);
    }

    getLoanCurrencyId = (loanId: number) => {
        return this.getLoanById(loanId)?.currencyId;
    }

    get groupedLoansByCounterpartyAndCurrency(): GroupedLoan[] {
        const groupedLoansMap = new Map<string, GroupedLoan>();

        this.loansInProgressRegistry.forEach(loan => {
            const key = `${loan.counterpartyId}-${loan.currencyId}`;
            const existingGroup = groupedLoansMap.get(key);

            const currentAmountAdjustment = loan.loanType === LoanType.Credit ? loan.currentAmount : -loan.currentAmount;
            const fullAmountAdjustment = loan.loanType === LoanType.Credit ? loan.fullAmount : -loan.fullAmount;

            let remainingAmount = fullAmountAdjustment - currentAmountAdjustment;

            if (existingGroup) {
                existingGroup.currentAmount += currentAmountAdjustment;
                existingGroup.fullAmount += fullAmountAdjustment;
                existingGroup.nearestRepaymentDate = 
                    new Date(Math.min(existingGroup.nearestRepaymentDate!.getTime(), loan.repaymentDate.getTime()));

                remainingAmount = existingGroup.fullAmount - existingGroup.currentAmount;
                existingGroup.loanType = remainingAmount >= 0 ? LoanType.Credit : LoanType.Debt;
            } else {
                groupedLoansMap.set(key, {
                    counterpartyId: loan.counterpartyId,
                    currencyId: loan.currencyId,
                    currentAmount: currentAmountAdjustment,
                    fullAmount: fullAmountAdjustment,
                    nearestRepaymentDate: loan.repaymentDate,
                    loanType: remainingAmount >= 0 ? LoanType.Credit : LoanType.Debt
                });
            }
        });

        // Add default GroupedLoan for counterparties without any loans
        this.counterparties.forEach(counterparty => {
            const hasLoans = Array.from(groupedLoansMap.values()).some(group => group.counterpartyId === counterparty.id);
            if (!hasLoans) {
                const defaultCurrencyId = store.currencyStore.defaultCurrency!.id;
                const key = `${counterparty.id}-${defaultCurrencyId}`;
                groupedLoansMap.set(key, {
                    counterpartyId: counterparty.id,
                    currencyId: defaultCurrencyId,
                    currentAmount: 0,
                    fullAmount: 0,
                    nearestRepaymentDate: null,
                    loanType: LoanType.Credit
                });
            }
        });

        return Array.from(groupedLoansMap.values()).sort((a,b) => {
            const remainingAmountA = Math.abs(a.fullAmount - a.currentAmount);
            const remainingAmountB = Math.abs(b.fullAmount - b.currentAmount);
    
            return remainingAmountB -remainingAmountA;
        });
    }

    getCounterpartyGroupedLoans = (counterpartyId: number): GroupedLoan[] => {
        var summaries = this.groupedLoansByCounterpartyAndCurrency.filter(gl => gl.counterpartyId === counterpartyId);
        return summaries;
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

    collectivePayoff = async (counterpartyId: number, payoff: CollectivePayoffValues) => {
        try {
            const updatedLoans = await agent.Loans.colectivePayoff(counterpartyId, payoff);
            runInAction(() => {
                updatedLoans.forEach(loan => {
                    this.setLoan(loan);
                    store.accountStore.loadAccount(loan.accountId);
                });
            })
        } catch (error) {
            console.log(error);
            throw (error as AxiosError).response!.data;
        }
    }

    updateLoan = async (loanId: number, loan: LoanUpdateValues) => {
        try {
            const updatedLoan = await agent.Loans.updateLoan(loanId, loan);
            runInAction(() => {
                this.setLoan(updatedLoan);
                store.accountStore.loadAccount(updatedLoan.accountId);
            })
        } catch (error) {
            console.log(error);
            throw (error as AxiosError).response!.data;
        }
    }

    deleteLoan = async (loanId: number) => {
        try {
            await agent.Loans.deleteLoan(loanId);
            runInAction(() => {
                this.removeLoan(loanId);
            })
        } catch (error) {
            console.log(error);
        }
    }

    createPayoff = async (loanId: number, payoff: PayoffCreateValues) => {
        try {
            const updatedLoan = await agent.Loans.createPayoff(loanId, payoff);
            runInAction(() => {
                this.setLoan(updatedLoan);
                store.accountStore.loadAccount(updatedLoan.accountId);
                this.selectedLoan = updatedLoan;
            })
        } catch (error) {
            console.log(error);
            throw (error as AxiosError).response!.data;
        }
    }

    deletePayoff = async (payoffId: number) => {
        try {
            const updatedLoan = await agent.Loans.deletePayoff(payoffId);
            runInAction(() => {
                this.setLoan(updatedLoan);
                store.accountStore.loadAccount(updatedLoan.accountId);
                this.selectedLoan = updatedLoan;
            });
        } catch (error) {
            console.log(error);
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