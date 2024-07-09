import { observer } from "mobx-react-lite";
import { Loan, LoanUpdateValues } from "../../../app/models/Loan";
import { Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";
import NumberInput from "../../formInputs/NumberInput";
import { useStore } from "../../../app/stores/store";

import dayjs from "dayjs";
import MyDatePicker from "../../formInputs/MyDatePicker";
import TextInput from "../../formInputs/TextInput";

interface Props {
    loan: Loan;
    onSubmit: () => void;
    onCancel: () => void;
}

export default observer(function EditLoanForm({loan, onSubmit, onCancel}: Props) {
    const {
        accountStore: {getAccountCurrencySymbol},
        loanStore: {updateLoan}} = useStore();
    
    const validationSchema = Yup.object({
        fullAmount: Yup.number()
            .required('Amount is required')
            .positive('The amount must be positive'),
        repaymentDate: Yup.date()
            .required('Repayment date is required')
            .min(dayjs().startOf('day').toDate(), 'Repayment date cannot be in the past'),
        description: Yup.string().notRequired()
    });

    const initialValues: LoanUpdateValues = {
        fullAmount: loan.fullAmount,
        repaymentDate: dayjs(loan.repaymentDate),
        description: ""
    }

    const handleCreateLoanFormSubmit = (updatedloan: LoanUpdateValues, helpers: FormikHelpers<LoanUpdateValues>) => {
        const transformedValues: LoanUpdateValues = {
            ...updatedloan,
            repaymentDate: dayjs(updatedloan.repaymentDate).toDate()
        }
        
        updateLoan(loan.id, transformedValues).then(() => {
            onSubmit();
        }).catch((err) => {
            helpers.setErrors({
                fullAmount: err
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
            {({ isValid, dirty, isSubmitting }) => (
                <Form>
                    <Stack spacing={2}>
                        {/* Amount */}
                        <NumberInput label="Amount" name={"fullAmount"}
                            adornment adornmentPosition="end" 
                            adormentText={getAccountCurrencySymbol(loan.accountId)} />
                            
                        {/* Repayment Date */}
                        <MyDatePicker 
                            defaultValue={dayjs().add(7, 'days')}
                            label="Repayment Date" 
                            name={"repaymentDate"}/>

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
                                Save
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </Form>
            )}
            </Formik>
        </>
    )
})