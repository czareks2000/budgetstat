import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../../components/common/ResponsiveContainer"
import { Divider, List, Paper, Stack } from "@mui/material"
import { router } from "../../../app/router/Routes"
import FloatingAddButton from "../../../components/common/FloatingAddButton"
import FloatingGoBackButton from "../../../components/common/FloatingGoBackButton"
import { useStore } from "../../../app/stores/store"
import PlannedTransactionListItem from "./PlannedTransactionListItem"
import PlannedTransactionListWithPagination from "./PlannedTransactionListWithPagination"

export default observer(function PlannedTransactions() {
    const {
        transactionStore: {plannedTransactions, plannedTransactionsToConfirm
    }} = useStore();
    
    const handleAddButtonClick = () => {
        router.navigate('/transactions/planned/create');
    }

    const handleGoBack = () => {
        router.navigate('/transactions');
    }

    return ( 
        <>
            <FloatingGoBackButton onClick={handleGoBack} position={1}/>
            <FloatingAddButton onClick={handleAddButtonClick}/>
            <ResponsiveContainer content={
                <Stack spacing={2}>
                    {plannedTransactionsToConfirm.length > 0 && <>
                    <Divider>Confirm Transactions</Divider>
                    <Paper>
                        <List disablePadding>
                            {plannedTransactionsToConfirm.map(transaction => 
                                <PlannedTransactionListItem 
                                    key={transaction.id}
                                    showConfirmAction 
                                    transaction={transaction}
                                />  
                            )}
                        </List>
                    </Paper></>}
                    {plannedTransactions.length > 0 ?
                    <Divider>Planned Transactions</Divider>
                    :
                    <Divider>You have no planned transactions</Divider>
                    }   
                    <PlannedTransactionListWithPagination 
                        transactions={plannedTransactions} />
                </Stack>
            } />
        </>
        )
})