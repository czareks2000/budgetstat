import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import FloatingAddButton from "../../components/common/FloatingAddButton"
import { router } from "../../app/router/Routes"
import { Divider, Stack } from "@mui/material"
import CounterpartySummaryItem from "./counterparty/CounterpartySummaryItem"
import { useStore } from "../../app/stores/store"

export default observer(function Loans() {
    const {loanStore: {groupedLoansByCounterpartyAndCurrency}} = useStore();

    const handleAddButtonClick = () => {
        router.navigate('/loans/create');
    }
    
    return (
        <>
        <FloatingAddButton onClick={handleAddButtonClick}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Loans summary</Divider>
                {groupedLoansByCounterpartyAndCurrency.map((summary) => 
                    <CounterpartySummaryItem summary={summary} detailsAction/>
                )}
            </Stack>
        }/>
        </>
    )
})