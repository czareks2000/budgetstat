import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import FloatingAddButton from "../../components/common/FloatingAddButton"
import { router } from "../../app/router/Routes"
import { Box, Divider, Stack } from "@mui/material"
import CounterpartySummaryItem from "./CounterpartySummaryItem"
import { useStore } from "../../app/stores/store"
import NoDecorationLink from "../../components/common/NoDecorationLink"

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
                <NoDecorationLink
                    key={`${summary.counterpartyId}-${summary.currencyId}`}
                    to={`/loans/counterparty/${summary.counterpartyId}`}
                    content={
                    <CounterpartySummaryItem summary={summary}/>
                }/>
                )}
                <Box p={2}>
                pogrupowane loans względem counterparty i względem walut (bilans ile kto komu winien ), 
                po kliknięciu przechodzimy do szczegółów (counterparty/:id)<br/><br/>
                w jakiś sposób odróznić jak uzytkownik jest winien komuś a jak ktoś użytkownikowi (na czerwono lub zielono kółko procentowe)<br/><br/>
                łączny blians pożyczek będzie w networth<br/><br/>
                </Box>
            </Stack>
        }/>
        </>
    )
})