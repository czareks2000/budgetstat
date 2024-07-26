import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, Paper, Stack } from "@mui/material"
import TransactionForm from "../../components/forms/Transaction/TransactionForm"
import { FormikHelpers } from "formik"
import { TransactionFormValues } from "../../app/models/Transaction"
import { TransactionType } from "../../app/models/enums/TransactionType"
import { router } from "../../app/router/Routes"
import { useStore } from "../../app/stores/store"
import { useParams } from "react-router-dom"
import { useEffect } from "react"
import LoadingWithLabel from "../../components/common/LoadingWithLabel"

export default observer(function EditTransaction() {
    const {transactionStore: {
        updateTransaction, transactionFormValues, loadTransactionFormValues, loadingFormValues
    }} = useStore();

    const {id, type} = useParams();

    useEffect(() => {
        if(id)
            loadTransactionFormValues(Number(id), Number(type));
    }, [id, type, loadTransactionFormValues])
    
    if (loadingFormValues || !transactionFormValues) return <LoadingWithLabel />

    const handleUpdate = (values: TransactionFormValues, helpers: FormikHelpers<TransactionFormValues>, initialValues: TransactionFormValues) => {
        updateTransaction(Number(id), values, initialValues).then(() => {
            router.navigate('/transactions');
        }).catch((err) => {
            if (values.type === TransactionType.Transfer)
                helpers.setErrors({
                    fromAmount: err
                });
            else
                helpers.setErrors({
                    amount: err
                });
            helpers.setSubmitting(false);
        });
    }
    
    return ( 
        <>
            <ResponsiveContainer content={
                <Stack spacing={2}>
                    <Divider>Edit {TransactionType[Number(type)]}</Divider>
                    <Paper>
                        <Box p={2}>
                        <TransactionForm 
                            key={Number(transactionFormValues)}
                            editMode
                            initialValues={transactionFormValues!} 
                            onSubmit={handleUpdate} 
                            submitText={"Save"} />
                        </Box>
                    </Paper>
                </Stack>
            } />
        </>
        )
})