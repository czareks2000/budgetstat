import { observer } from "mobx-react-lite"
import { Box, CircularProgress, Divider } from "@mui/material"
import { useStore } from "../../../app/stores/store"
import { useParams } from "react-router-dom"
import { LoanType } from "../../../app/models/enums/LoanType"
import { LoanStatus } from "../../../app/models/enums/LoanStatus"
import LoanItem from "../LoanItem"
import { useEffect } from "react"

export default observer(function CounterpartyPaidoffLoans() {
    const {loanStore: {getCounterpartyLoans, loadLoans, loansPaidOffLoaded, counterpartyLoansLoaded}} = useStore()

    const {id} = useParams();

    useEffect(() => {
        if (!counterpartyLoansLoaded.includes(Number(id)))
            loadLoans(LoanStatus.PaidOff, Number(id));
    }, [loadLoans, counterpartyLoansLoaded])

    const credits = getCounterpartyLoans(Number(id), LoanType.Credit, LoanStatus.PaidOff);
    const debts = getCounterpartyLoans(Number(id), LoanType.Debt, LoanStatus.PaidOff);
    
    return (
        <>
            {loansPaidOffLoaded ? 
            <>
                {credits.length == 0 && debts.length == 0 &&
                <Divider>There is no history</Divider>
                }
                {credits.length > 0 &&
                <Divider>Credits history</Divider>}
                {credits.map((loan) => 
                    <LoanItem key={loan.id} loan={loan}/>
                )}
                {debts.length > 0 &&
                <Divider>Debts history</Divider>}
                {debts.map((loan) => 
                    <LoanItem key={loan.id} loan={loan} detailsAction/>
                )}
            </>
            :
            <>
                <Divider>Loading...</Divider>
                <Box display={'flex'} justifyContent={'center'}>
                    <CircularProgress />
                </Box>
            </>
            }
        </>
    )
})