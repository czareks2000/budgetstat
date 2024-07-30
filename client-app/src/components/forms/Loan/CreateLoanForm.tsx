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

interface Props {
    counterpartyId: string | null;
    onCancel: () => void;
}

export default observer(function CrateLoanForm({counterpartyId, onCancel}: Props) {
    const {
        accountStore: {accountsAsOptions, getAccountCurrency},
        loanStore: {createLoan, counterpartiesAsOptions}} = useStore();
    
    const validationSchema = Yup.object({
        loanType: Yup.number().required('Choose loan type'),
        accountId: Yup.string().required('Choose account'),
        fullAmount: Yup.number()
            .required('Amount is required')
            .positive('The amount must be positive'),
        counterpartyId: Yup.string().required('Choose counterparty'),
        loanDate: Yup.date()
            .typeError('Invalid date format')
            .required('Repayment date is required')
            .max(dayjs().add(1, 'days').startOf('day').toDate(), 'Loan date cannot be in the future'),
        repaymentDate: Yup.date()
            .typeError('Invalid date format')
            .required('Repayment date is required')
            .min(dayjs().startOf('day').toDate(), 'Repayment date cannot be in the past'),
        description: Yup.string().notRequired()
    });

    const initialValues: LoanCreateValues = {
        loanType: LoanType.Credit,
        accountId: "",
        fullAmount: null,
        counterpartyId: counterpartyId || "",
        loanDate: dayjs(),
        repaymentDate: dayjs().add(7, 'days'),
        description: ""
    }

    const handleCreateLoanFormSubmit = (loan: LoanCreateValues, helpers: FormikHelpers<LoanCreateValues>) => {
        const transformedValues: LoanCreateValues = {
            ...loan,
            repaymentDate: dayjs(loan.repaymentDate).toDate()
        }
        
        createLoan(transformedValues).then(() => {
            router.navigate(`/loans/counterparty/${loan.counterpartyId}?currencyId=${getAccountCurrency(loan.accountId)?.id}`);
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
            {({ isValid, dirty, isSubmitting, values }) => (
                <Form>
                    <Stack spacing={2}>
                        {/* LoanType */}
                        <SelectInput
                            label="Loan Type" name={"loanType"}
                            options={enumToOptions(LoanType)} />

                        {/* Account */}
                        <SelectInput
                            label="Account" name={"accountId"}
                            options={accountsAsOptions} />

                        {/* Amount */}
                        <NumberInput label="Amount" name={"fullAmount"}
                            adornment adornmentPosition="end" 
                            adormentText={getAccountCurrency(values.accountId)?.symbol} />

                        {/* Counterparty */}
                        <SelectInput
                            label="Counterparty" name={"counterpartyId"}
                            options={counterpartiesAsOptions} />

                        {/* Loan Date */}
                        <MyDatePicker 
                            defaultValue={dayjs()}
                            label="Loan Date" 
                            name={"loanDate"}/>

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