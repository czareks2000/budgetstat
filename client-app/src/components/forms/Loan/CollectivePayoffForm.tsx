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
import { Loan } from "../../../app/models/Loan";
import { Option } from "../../../app/models/Option";

interface Props {
    loans: Loan[];
    counterpartyId: number;
}

export default observer(function CollectivePayoffForm({loans, counterpartyId}: Props) {
    const {
        accountStore: {getAccountsByCurrencyAsOptions, getAccountCurrency},
        loanStore: {collectivePayoff, selectSummaries} }= useStore();
    
    const validationSchema = Yup.object({
        accountId: Yup.string().required('Choose account'),
        amount: Yup.number()
            .required('Amount is required')
            .positive('The amount must be positive'),
        date: Yup.date()
            .typeError('Invalid date format')
            .required('Repayment date is required')
            .max(dayjs().add(1, 'day').startOf('day').toDate(), 'Repayment date cannot be in the future'),
        loanType: Yup.number().required('Choose which type of loans you want to repay'),
    });

    const handleCreateLoanFormSubmit = (payoff: CollectivePayoffValues, helpers: FormikHelpers<CollectivePayoffValues>) => {
        const transformedValues: CollectivePayoffValues = {
            ...payoff,
            date: dayjs(payoff.date).toDate()
        }
        
        collectivePayoff(counterpartyId, transformedValues).then(() => {
            selectSummaries(counterpartyId);
            helpers.resetForm();
        }).catch((err) => {
            helpers.setErrors({
                amount: err
            });
            helpers.setSubmitting(false);
        });
    }

    const getLoanTypeOptions = (loans: Loan[]) => {
        let seen = new Set();
        return loans
        .map(loan => loan.loanType)
        .map(type => ({
            value: type,
            text: `${LoanType[type]}s`
        }))
        .filter(item => {
            const duplicate = seen.has(item.value);
            seen.add(item.value);
            return !duplicate;
        });  
    }
    
    let loanCurrencies = [...new Set(loans.map(l => l.currencyId))];

    let accountOptions: Option[] = []

    loanCurrencies.forEach((currencyId) => {
        accountOptions = [...accountOptions, ...getAccountsByCurrencyAsOptions(currencyId)];
    })

    const initialValues: CollectivePayoffValues = {
        amount: null,
        accountId: "",
        date: dayjs(),
        loanType: getLoanTypeOptions(loans)[0].value
    }
    
    return (
        <>
            <Formik
                key={getLoanTypeOptions(loans)[0].value}
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleCreateLoanFormSubmit}>
            {({ isValid, dirty, isSubmitting, values }) => (
                <Form>
                    <Stack spacing={2}>
                        {/* LoanType */}
                        <SelectInput
                            label="Which type of loans you want to repay" name={"loanType"}
                            options={getLoanTypeOptions(loans)} />
                            
                        {/* Account */}
                        <SelectInput
                            label="Account" name={"accountId"}
                            options={accountOptions} />

                        {/* Amount */}
                        <NumberInput label="Amount" name={"amount"}
                            adornment adornmentPosition="end" 
                            adormentText={getAccountCurrency(values.accountId)?.symbol} />
                            
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