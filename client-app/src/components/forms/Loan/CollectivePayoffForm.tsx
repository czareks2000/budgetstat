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
import { CollectivePayoffValues } from "../../../app/models/Payoff";
import { LoanType } from "../../../app/models/enums/LoanType";
import { enumToOptions } from "../../../app/models/Option";

interface Props {
    counterpartyId: number;
}

export default observer(function CollectivePayoffForm({counterpartyId}: Props) {
    const {
        accountStore: {accountsAsOptions, getAccountCurrencySymbol},
        loanStore: {collectivePayoff} }= useStore();
    
    const validationSchema = Yup.object({
        accountId: Yup.string().required('Choose account'),
        amount: Yup.number()
            .required('Amount is required')
            .positive('The amount must be positive'),
        date: Yup.date()
            .required('Repayment date is required')
            .max(dayjs().add(1, 'day').startOf('day').toDate(), 'Repayment date cannot be in the future'),
        loanType: Yup.number().required('Choose which type of loans you want to repay'),
    });

    const initialValues: CollectivePayoffValues = {
        amount: null,
        accountId: "",
        date: dayjs(),
        loanType: LoanType.Credit
    }

    const handleCreateLoanFormSubmit = (payoff: CollectivePayoffValues, helpers: FormikHelpers<CollectivePayoffValues>) => {
        const transformedValues: CollectivePayoffValues = {
            ...payoff,
            date: dayjs(payoff.date).toDate()
        }
        
        collectivePayoff(counterpartyId, transformedValues).then(() => {
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
                        {/* LoanType */}
                        <SelectInput
                            label="Which type of loans you want to repay" name={"loanType"}
                            options={enumToOptions(LoanType, true)} />
                            
                        {/* Account */}
                        <SelectInput
                            label="Account" name={"accountId"}
                            options={accountsAsOptions} />

                        {/* Amount */}
                        <NumberInput label="Amount" name={"amount"}
                            adornment adornmentPosition="end" 
                            adormentText={getAccountCurrencySymbol(values.accountId)} />
                            
                        {/* Date */}
                        <MyDatePicker 
                            defaultValue={dayjs()}
                            label="Date" 
                            name={"date"}/>

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