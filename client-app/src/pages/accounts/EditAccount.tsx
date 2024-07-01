import { Box, Divider, Paper, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { AccountFormValues } from "../../app/models/Account";
import { useStore } from "../../app/stores/store";
import EditAccountForm from "../../components/forms/Account/EditAccountForm";
import { router } from "../../app/router/Routes";
import { useParams } from "react-router-dom";
import { useEffect } from "react";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";

export default observer(function EditAccount() {
    const {
        accountStore: {
            updateAccount, selectedAccount, selectAccount, deselectAccount
        }
    } = useStore();
    
    function handleUpdate(updatedAccount: AccountFormValues): void {
        updateAccount(selectedAccount!.id, updatedAccount)
            .then(() => router.navigate('/accounts'));
    }

    const handleCancel = () => {
        deselectAccount();
        router.navigate('/accounts');
    }

    const {id} = useParams();
    useEffect(() => {
        if (id) selectAccount(parseInt(id));
    }, [id, selectAccount])

    if (!selectedAccount) return <></>

    const initialValues: AccountFormValues = {
        name: selectedAccount.name,
        description: selectedAccount.description,
    }
    
    return (
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Edit Account</Divider>
                <Paper>
                    <Box p={2}>
                        <EditAccountForm 
                            key={selectedAccount?.id} 
                            onSubmit={handleUpdate} 
                            onCancel={handleCancel}
                            initialValues={initialValues}/>
                    </Box>
                </Paper>
            </Stack>
        }/>
    )
})