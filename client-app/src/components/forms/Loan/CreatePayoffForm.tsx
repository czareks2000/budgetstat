import { observer } from "mobx-react-lite";
import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import NumberInput from "../../formInputs/NumberInput";
import { useStore } from "../../../app/stores/store";
import SelectInput from "../../formInputs/SelectInput";

import dayjs from "dayjs";
import MyDatePicker from "../../formInputs/MyDatePicker";
import TextInput from "../../formInputs/TextInput";
import { PayoffCreateValues } from "../../../app/models/Payoff";


export default observer(function CratePayoffForm() {
    const {
        accountStore: {getAccountsByCurrencyAsOptions, getAccountCurrency},
        loanStore: {getLoanCurrencyId, createPayoff, selectedLoan: loan}} = useStore();
    
    if (!loan) return <></>

    const validationSchema = Yup.object({
        accountId: Yup.string().required('Choose account'),
        amount: Yup.number()
            .required('Amount is required')
            .positive('The amount must be positive'),
        date: Yup.date()
            .typeError('Invalid date format')
            .required('Repayment date is required')
            .max(dayjs().add(1, 'day').startOf('day').toDate(), 'Repayment date cannot be in the future')
            .min(dayjs(loan.loanDate).startOf('day').toDate(), 'Repayment date cannot be before loan date'),
        description: Yup.string().notRequired()
    });

    const initialValues: PayoffCreateValues = {
        amount: null,
        accountId: "",
        date: dayjs(),
        description: ""
    }

    const accountsOptions = getAccountsByCurrencyAsOptions(getLoanCurrencyId(loan.id) as number);

    const handleCreateLoanFormSubmit = (payoff: PayoffCreateValues, helpers: FormikHelpers<PayoffCreateValues>) => {
        const transformedValues: PayoffCreateValues = {
            ...payoff,
            date: dayjs(payoff.date).toDate()
        }
        
        createPayoff(loan.id, transformedValues).then(() => {
            helpers.resetForm();
        }).catch((err) => {
            helpers.setErrors({
                amount: err
            });
            helpers.setSubmitting(false);
        });
    }
    
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleCreateLoanFormSubmit}>
            {({ isValid, dirty, isSubmitting, values }) => (
                <Form>
                    <Stack spacing={2}>
                        {/* Account */}
                        <SelectInput
                            label="Account" name={"accountId"}
                            options={accountsOptions} />

                        {/* Amount */}
                        <NumberInput label="Amount" name={"amount"}
                            adornment adornmentPosition="end" 
                            adormentText={getAccountCurrency(values.accountId)?.symbol} />
                            
                        {/* Date */}
                        <MyDatePicker 
                            defaultValue={dayjs()}
                            label="Date" 
                            name={"date"}/>

                        {/* Description */}
                        <TextInput label="Description" name="description" />

                        {/* Buttons */}
                        <LoadingButton
                            color="success"
                            variant="contained"
                            type="submit"
                            fullWidth
                            disabled={!(dirty && isValid) || isSubmitting}
                            loading={isSubmitting}>
                            Confirm
                        </LoadingButton>
                    </Stack>
                </Form>
            )}
            </Formik>
        </>
    )
})