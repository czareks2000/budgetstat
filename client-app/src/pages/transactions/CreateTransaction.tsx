import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, Paper, Stack } from "@mui/material"
import TransactionForm from "../../components/forms/Transaction/TransactionForm"
import { useStore } from "../../app/stores/store"
import { TransactionFormValues } from "../../app/models/Transaction"
import { TransactionType } from "../../app/models/enums/TransactionType"
import dayjs from "dayjs"
import { FormikHelpers } from "formik"
import { router } from "../../app/router/Routes"

export default observer(function CreateTransaction() {
    const {transactionStore: {createTransaction}} = useStore();
    
    const initialValues: TransactionFormValues = {
        type: TransactionType.Expense,
        accountId: "",
        fromAccountId: "",
        toAccountId: "",
        incomeCategoryId: null,
        expenseCategoryId: null,
        amount: null,
        fromAmount: null,
        toAmount: null,
        date: dayjs(),
        description: "",
        considered: true
    }

    const handleCreate = (values: TransactionFormValues, helpers: FormikHelpers<TransactionFormValues>) => {
        createTransaction(values).then(() => {
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
                    <Divider>Create Transaction</Divider>
                    <Paper>
                        <Box p={2}>
                            <TransactionForm 
                                initialValues={initialValues}
                                onSubmit={handleCreate}
                                submitText="Create"/>
                        </Box>
                    </Paper>
                </Stack>
            } />
        </>
        )
})