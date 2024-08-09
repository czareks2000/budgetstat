import { observer } from "mobx-react-lite";
import { Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers, FormikState } from "formik";
import * as Yup from "yup";
import { useStore } from "../../../app/stores/store";
import { Option, enumToOptions } from "../../../app/models/Option";
import SelectInput from "../../formInputs/SelectInput";

import dayjs from "dayjs";
import MyDatePicker from "../../formInputs/MyDatePicker";
import { TransactionType, TransactionTypeFilter } from "../../../app/models/enums/TransactionType";
import { TransactionParamsFormValues } from "../../../app/models/Transaction";
import MultipleSelectWithChceckBoxes from "../../formInputs/MultipleSelectWithChceckBoxes";
import CategoryGroupedInput from "../../formInputs/CategoryGroupedInput";
import { ChartPeriod } from "../../../app/models/enums/periods/ChartPeriod";
import { useEffect } from "react";

export default observer(function FilterTransactionsForm() {
    const {
        accountStore: {accountsNamesAsOptions},
        categoryStore: {getCategoriesAsOptions},
        transactionStore: {setTransactionParams, transactionParamsFormValues, resetTransactionParams, filterHasInitialValues } } = useStore()
    
    const validationSchema = Yup.object({
        startDate: Yup.date()
            .typeError('Invalid date format')
            .required('Start date is required')
            .test('start-before-end', 'Start date cannot be after end date', function(value) {
                const { endDate } = this.parent;
                return !endDate || value <= endDate;
            }),
        endDate: Yup.date()
            .typeError('Invalid date format')
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

    const periodOptions: Option[] = [
        {
            value: ChartPeriod.Last7Days,
            text: "Last 7 days"
        },
        {
            value: ChartPeriod.Last30Days,
            text: "Last 30 days"
        },
        {
            value: ChartPeriod.LastYear,
            text: "Last year"
        },
        {
            value: ChartPeriod.Last5Years,
            text: "Last 5 years"
        },
        {
            value: ChartPeriod.Custom,
            text: "Custom"
        },
    ]

    return (
        <>
            <Formik
                key={Number(filterHasInitialValues)}
                initialValues={transactionParamsFormValues}
                validationSchema={validationSchema}
                onSubmit={handleFilterTransactionsFormSubmit}>
            {({ isValid, dirty, isSubmitting, values, resetForm, setFieldValue }) => { 

                useEffect(() => {
                    let startDate, endDate;
                    const today = dayjs().startOf('day').add(12,'hours');
                    switch (values.period) {
                        case ChartPeriod.Last7Days:
                            startDate = today.subtract(7, 'days').toDate();
                            endDate = today.toDate();
                            break;
                        case ChartPeriod.Last30Days || ChartPeriod.Custom:
                            startDate = today.subtract(30, 'days').toDate();
                            endDate = today.toDate();
                            break;
                        case ChartPeriod.LastYear:
                            startDate = today.subtract(1, 'year').toDate();
                            endDate = today.toDate();
                            break;
                        case ChartPeriod.Last5Years:
                            startDate = today.subtract(5, 'years').toDate();
                            endDate = today.toDate();
                            break;
                        default:
                            break;
                    }

                    if (startDate && endDate) {
                        setFieldValue('startDate', dayjs(startDate));
                        setFieldValue('endDate', dayjs(endDate));
                    }
                }, [values.period, setFieldValue]);
                
                return(
                    <Form>
                        <Stack spacing={2}>
                            {/* Period */}
                            <SelectInput
                                label="Period" name={"period"}
                                options={periodOptions} />

                            {values.period === ChartPeriod.Custom &&
                            <>
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
                            </>}

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
                                placeholder="All" shrinkLabel multiple
                                options={getCategoriesAsOptions(TransactionType.Expense, true)} />
                            }

                            {/* Income Categories */}
                            {(values.type === TransactionTypeFilter.All || 
                            values.type === TransactionTypeFilter.Income) &&
                            <CategoryGroupedInput label="Income Categories" name={"incomeCategoryIds"}
                                placeholder="All" shrinkLabel multiple
                                options={getCategoriesAsOptions(TransactionType.Income, true)} />
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
            }
            </Formik>
        </>
    )
})