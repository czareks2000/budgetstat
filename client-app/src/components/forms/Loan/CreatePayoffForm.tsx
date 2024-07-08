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
import { PayoffCreateValues } from "../../../app/models/Payoff";

interface Props {
    loanId: number;
    onSubmit: () => void;
    onCancel: () => void;
}

export default observer(function CratePayoffForm({loanId, onSubmit, onCancel}: Props) {
    const {
        accountStore: {accountsAsOptions, getAccountCurrencySymbol},
        loanStore: {createPayoff}} = useStore();
    
    const validationSchema = Yup.object({
        accountId: Yup.string().required('Choose account'),
        amount: Yup.number()
            .required('Amount is required')
            .positive('The amount must be positive'),
        date: Yup.date()
            .required('Repayment date is required')
            .min(dayjs().startOf('day').toDate(), 'Repayment date cannot be in the future'),
            //dodać ze nie moze być starsze nic loan.loandate
        description: Yup.string().notRequired()
    });

    const initialValues: PayoffCreateValues = {
        amount: null,
        accountId: "",
        date: dayjs(),
        description: ""
    }

    const handleCreateLoanFormSubmit = (payoff: PayoffCreateValues, helpers: FormikHelpers<PayoffCreateValues>) => {
        const transformedValues: PayoffCreateValues = {
            ...payoff,
            date: dayjs(payoff.date).toDate()
        }
        
        createPayoff(loanId, transformedValues).then(() => {
            onSubmit();
        }).catch((err) => {
            helpers.setErrors({
                amount: err
            });
            helpers.setSubmitting(false);
            helpers.resetForm();
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
                        {/* tutaj zmienić ze mogą być wybrane tyko konta z odpowiednią walutą */}
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
                            Create
                        </LoadingButton>
                    </Stack>
                </Form>
            )}
            </Formik>
        </>
    )
})