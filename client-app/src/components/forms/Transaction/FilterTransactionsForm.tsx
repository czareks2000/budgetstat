import { observer } from "mobx-react-lite";
import { Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers, FormikState } from "formik";
import * as Yup from "yup";
import { useStore } from "../../../app/stores/store";
import { enumToOptions } from "../../../app/models/Option";
import SelectInput from "../../formInputs/SelectInput";

import dayjs from "dayjs";
import MyDatePicker from "../../formInputs/MyDatePicker";
import { TransactionType, TransactionTypeFilter } from "../../../app/models/enums/TransactionType";
import { TransactionParamsFormValues } from "../../../app/models/Transaction";
import MultipleSelectWithChceckBoxes from "../../formInputs/MultipleSelectWithChceckBoxes";
import CategoryGroupedInput from "../../formInputs/CategoryGroupedInput";

export default observer(function FilterTransactionsForm() {
    const {
        accountStore: {accountsNamesAsOptions},
        categoryStore: {getCategoriesAsOptions},
        transactionStore: {setTransactionParams, transactionParamsFormValues, resetTransactionParams, filterHasInitialValues } } = useStore()
    
    const validationSchema = Yup.object({
        startDate: Yup.date()
            .required('Start date is required')
            .test('start-before-end', 'Start date cannot be after end date', function(value) {
                const { endDate } = this.parent;
                return !endDate || value <= endDate;
            }),
        endDate: Yup.date()
            .required('End date is required')
            .max(dayjs().add(1, 'day').startOf('day').toDate(), 'End date cannot be in the future')
    });

    const handleFilterTransactionsFormSubmit = (
        params: TransactionParamsFormValues, 
        helpers: FormikHelpers<TransactionParamsFormValues>
    ) => {

        setTransactionParams(params).then(() => {
            helpers.setSubmitting(false);
            helpers.resetForm({values: {...params}});
        })
    }

    const handleReset = (resetForm: (nextState?: Partial<FormikState<TransactionParamsFormValues>>) => void) => {
        if(!filterHasInitialValues)
            resetTransactionParams();            

        resetForm();
    }

    return (
        <>
            <Formik
                key={Number(filterHasInitialValues)}
                initialValues={transactionParamsFormValues}
                validationSchema={validationSchema}
                onSubmit={handleFilterTransactionsFormSubmit}>
            {({ isValid, dirty, isSubmitting, values, resetForm }) => (
                <Form>
                    <Stack spacing={2}>
                        {/* Start Date */}
                        <MyDatePicker 
                            defaultValue={dayjs().add(-30, 'days')}
                            label="Start Date" 
                            name={"startDate"}/>

                        {/* End Date */}
                        <MyDatePicker 
                            defaultValue={dayjs()}
                            label="End Date" 
                            name={"endDate"}/>

                        {/* Transaction Types */}
                        <SelectInput
                            label="Transaction Type" name={"type"}
                            options={enumToOptions(TransactionTypeFilter)} />

                        {/* Accounts */}
                        <MultipleSelectWithChceckBoxes 
                            label="Accounts" name={"accountIds"}
                            placeholder="All"
                            options={accountsNamesAsOptions}/>

                        {/* Expense Categories */}
                        {(values.type === TransactionTypeFilter.All || 
                        values.type === TransactionTypeFilter.Expense) &&
                        <CategoryGroupedInput label="Expense Categories" name={"expenseCategoryIds"}
                            placeholder="All" shrinkLabel
                            options={getCategoriesAsOptions(TransactionType.Expense)} />
                        }

                        {/* Income Categories */}
                        {(values.type === TransactionTypeFilter.All || 
                        values.type === TransactionTypeFilter.Income) &&
                        <CategoryGroupedInput label="Income Categories" name={"incomeCategoryIds"}
                            placeholder="All" shrinkLabel
                            options={getCategoriesAsOptions(TransactionType.Income)} />
                        }

                        {/* Button */}
                        <Stack spacing={2}>
                            {((filterHasInitialValues || dirty ) && isValid )&& 
                            <LoadingButton
                                color="primary"
                                variant="contained"
                                type="submit"
                                fullWidth
                                disabled={!(dirty && isValid) || isSubmitting}
                                loading={isSubmitting}>
                                Filter
                            </LoadingButton>}
                            {((!filterHasInitialValues && !dirty && !isSubmitting) || !isValid) && 
                            <Button
                                color="info"
                                variant="contained"
                                fullWidth
                                onClick={() => handleReset(resetForm)}>
                                Reset filter
                            </Button>}
                        </Stack>
                    </Stack>
                </Form>
            )}
            </Formik>
        </>
    )
})