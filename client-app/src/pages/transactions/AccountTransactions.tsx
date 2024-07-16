import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Divider, Stack } from "@mui/material"
import FloatingGoBackButton from "../../components/common/FloatingGoBackButton"
import { router } from "../../app/router/Routes"
import FloatingAddButton from "../../components/common/FloatingAddButton"
import { useParams } from "react-router-dom"

export default observer(function AccountTransaction() {
    
    const {id} = useParams();

    const handleAddButtonClick = () => {
        router.navigate(`/transactions/create?accountId=${Number(id)}`);
    }

    const handleGoBack = () => {
        router.navigate('/accounts');
    }
    
    return ( 
    <>
        <FloatingGoBackButton onClick={handleGoBack} position={1}/>
        <FloatingAddButton onClick={handleAddButtonClick}/>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Account Transactions</Divider>
            </Stack>
        } />
    </>
    )
})