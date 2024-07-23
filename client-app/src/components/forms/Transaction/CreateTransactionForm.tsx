import { observer } from "mobx-react-lite";
import { LoanCreateValues } from "../../../app/models/Loan";
import { Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers } from "formik";
import { LoanType } from "../../../app/models/enums/LoanType";
import * as Yup from "yup";
import NumberInput from "../../formInputs/NumberInput";
import { useStore } from "../../../app/stores/store";
import { enumToOptions } from "../../../app/models/Option";
import SelectInput from "../../formInputs/SelectInput";

import dayjs from "dayjs";
import MyDatePicker from "../../formInputs/MyDatePicker";
import TextInput from "../../formInputs/TextInput";
import { router } from "../../../app/router/Routes";
import { TransactionFormValues } from "../../../app/models/Transaction";
import { TransactionType } from "../../../app/models/enums/TransactionType";

interface Props {
    accountId?: string | null;
}

export default observer(function CreateTransactionForm({accountId}: Props) {
    const {
        accountStore: {accountsAsOptions, getAccountCurrency},
        transactionStore: {}} = useStore();
    
    const validationSchema = Yup.object({

    });

    const initialValues: TransactionFormValues = {
        type: TransactionType.Expense,
        categoryId: "",
        accountId: ""
    }

    const onCancel = () => {
        router.navigate('/transactions');
    }

    const handleSubmit = () => {

    }

    
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
            {({ isValid, dirty, isSubmitting, values }) => (
                <Form>
                    <Stack spacing={2}>
                        {/* Transaction Type */}
                        <SelectInput
                            label="Transaction Type" name={"type"}
                            options={enumToOptions(TransactionType)} />

                        {/* Account */}
                        <SelectInput
                            label="Account" name={"accountId"}
                            options={accountsAsOptions} />

                        {/* Amount */}
                        <NumberInput label="Amount" name={"fullAmount"}
                            adornment adornmentPosition="end" 
                            adormentText={getAccountCurrency(values.accountId)?.symbol} />

                        {/* Transaction Date */}
                        <MyDatePicker 
                            defaultValue={dayjs()}
                            label="Date" 
                            name={"date"}/>

                        {/* Description */}
                        <TextInput label="Description" name="description" />

                        {/* Buttons */}
                        <Stack direction={'row'} spacing={2}>
                            <Button
                                color="error"
                                variant="contained"
                                fullWidth
                                onClick={onCancel}>
                                Cancel
                            </Button>
                            <LoadingButton
                                color="success"
                                variant="contained"
                                type="submit"
                                fullWidth
                                disabled={!(dirty && isValid) || isSubmitting}
                                loading={isSubmitting}>
                                Create
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </Form>
            )}
            </Formik>
        </>
    )
})