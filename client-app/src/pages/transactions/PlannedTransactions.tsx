import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Divider, Stack } from "@mui/material"
import { router } from "../../app/router/Routes"
import FloatingAddButton from "../../components/common/FloatingAddButton"
import FloatingGoBackButton from "../../components/common/FloatingGoBackButton"

export default observer(function PlannedTransactions() {
    
    const handleAddButtonClick = () => {
        router.navigate('/transactions/create?planned=true');
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
                    <Divider>Planned Transactions</Divider>
                </Stack>
            } />
        </>
        )
})