import { Divider, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import FloatingAddButton from "../../components/common/FloatingAddButton"
import { router } from "../../app/router/Routes"

export default observer(function Transactions() {
    
    const handleAddButtonClick = () => {
        router.navigate('/transactions/create');
    }
    
    return ( 
    <>
        <FloatingAddButton onClick={handleAddButtonClick}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Transactions</Divider>
            </Stack>
        } />
    </>
    )
})