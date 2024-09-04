import { Box, Divider, Paper, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { AccountFormValues } from "../../app/models/Account";
import { useStore } from "../../app/stores/store";
import EditAccountForm from "../../components/forms/Account/EditAccountForm";
import { router } from "../../app/router/Routes";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect } from "react";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";
import LoadingWithLabel from "../../components/common/loadings/LoadingWithLabel";
import { FormikHelpers } from "formik";

export default observer(function EditAccount() {
    const [searchParams] = useSearchParams();
    const redirect = searchParams.get('redirect');
    
    const {
        accountStore: {
            updateAccount, selectedAccount, selectAccount, deselectAccount
        }
    } = useStore();
    
    function handleUpdate(updatedAccount: AccountFormValues, formikHelpers: FormikHelpers<AccountFormValues>): void {
        updateAccount(selectedAccount!.id, updatedAccount)
            .then(() => router.navigate(redirect === 'assets' ? '/net-worth' : '/accounts'))
            .catch(error => {
                formikHelpers.setErrors({
                  name: error
                });
                formikHelpers.setSubmitting(false);
            });
    }

    const handleCancel = () => {
        deselectAccount();
        router.navigate(redirect === 'assets' ? '/net-worth' : '/accounts');
    }

    const {id} = useParams();
    useEffect(() => {
        if (id) 
            selectAccount(parseInt(id));
        else
            router.navigate('/not-found');
    }, [id, selectAccount])

    if (!selectedAccount) return <LoadingWithLabel/>

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