import { observer } from "mobx-react-lite";
import { Button, Divider, FormControlLabel, Grid, Stack, Switch } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik } from "formik";
import * as Yup from "yup";
import NumberInput from "../../formInputs/NumberInput";
import { useStore } from "../../../app/stores/store";
import { enumToOptions } from "../../../app/models/Option";
import SelectInput from "../../formInputs/SelectInput";

import dayjs from "dayjs";
import MyDatePicker from "../../formInputs/MyDatePicker";
import TextInput from "../../formInputs/TextInput";
import { router } from "../../../app/router/Routes";
import { PlannedTransactionFormValues } from "../../../app/models/Transaction";
import { TransactionType } from "../../../app/models/enums/TransactionType";
import CategoryGroupedInput from "../../formInputs/CategoryGroupedInput";
import { Period } from "../../../app/models/enums/periods/Period";

export default observer(function CreatePlannedTransactionsForm() {
    const {
        accountStore: {accountsAsOptions, getAccountCurrency},
        transactionStore: {createPlannedTransactions},
        categoryStore: {getCategoriesAsOptions}} = useStore();

    const validationSchema = Yup.object({
        type: Yup.string()
            .required('Transaction type is required'),
        amount: Yup.number()
            .required('Amount is required')
            .positive('Amount must be positive'),
        accountId: Yup.string()
            .required('Account is required'),
        incomeCategoryId: Yup.mixed().nullable().when('type', {
            is: (val: TransactionType) => val == TransactionType.Income,
            then: schema => schema.required('Category is required').nonNullable('Category is required')
        }),
        expenseCategoryId: Yup.mixed().nullable().when('type', {
            is: (val: TransactionType) => val == TransactionType.Expense,
            then: schema => schema.required('Category is required').nonNullable('Category is required')
        }),
        startDate: Yup.date()
            .typeError('Invalid date format')
            .required('Date is required')
            .min(dayjs().startOf('day').toDate(), 'Start date cannot be in the past'),
        description: Yup.string(),
        considered: Yup.boolean(),
        repeatsEvery: Yup.number()
            .integer('Integer required')
            .required('Minimum 1')
            .positive('Minimum 1'),
        period: Yup.string()
            .required('Transaction type is required'),
        numberOfTimes: Yup.number()
            .integer('Integer required')
            .required('Minimum 1')
            .positive('Minimum 1'),
    });

    const initialValues: PlannedTransactionFormValues = {
        type: TransactionType.Expense,
        accountId: "",
        amount: null,
        expenseCategoryId: null,
        incomeCategoryId: null,
        startDate: dayjs(),
        description: "",
        considered: true,
        repeatsEvery: 1,
        period: Period.Month,
        numberOfTimes: 1
    }

    const onCancel = () => {
        router.navigate('/transactions/planned');
    }

    const handleSubmit = (values: PlannedTransactionFormValues) => {
        createPlannedTransactions(values).then(() => {
            router.navigate('/transactions/planned');
        })
    }

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {({ isValid, dirty, isSubmitting, values, handleChange }) => {
                    return (
                    <Form>
                        <Stack spacing={2}>
                            {/* Transaction Type */}
                            <SelectInput
                                label="Transaction Type" name={"type"}
                                options={enumToOptions(TransactionType)
                                .filter(o => o.value !== TransactionType.Transfer)} />

                            {/* Account */}
                            <SelectInput
                                label="Account" name={"accountId"}
                                options={accountsAsOptions} />

                            {/* Amount */}
                            <NumberInput label="Amount" name={"amount"}
                                adornment adornmentPosition="end" 
                                adormentText={getAccountCurrency(values.accountId)?.symbol} />

                            {/* Expense Categories */}
                            {(values.type === TransactionType.Expense) &&
                            <CategoryGroupedInput label="Category" name={"expenseCategoryId"}
                                options={getCategoriesAsOptions(TransactionType.Expense)} />
                            }

                            {/* Income Categories */}
                            {(values.type === TransactionType.Income) &&
                            <CategoryGroupedInput label="Category" name={"incomeCategoryId"}
                                options={getCategoriesAsOptions(TransactionType.Income)} />
                            }

                            {/* Description */}
                            {values.type !== TransactionType.Transfer &&
                            <TextInput label="Description" name="description" />}

                            {/* Start Date */}
                            <MyDatePicker 
                                defaultValue={dayjs()}
                                label="Start From" 
                                name={"startDate"}/>  

                            <Stack direction={'row'} display={'flex'} spacing={2} alignItems={'top'}>
                                <Grid item xs={'auto'}  pt={2}>
                                    Repeats every
                                </Grid>
                                <Grid item xs>
                                    {/* Repeats Every */}
                                    <NumberInput
                                        label="Interval"
                                        fullWidth name={"repeatsEvery"} />
                                </Grid>
                                <Grid item xs={'auto'}>
                                    {/* Period */}
                                    <SelectInput 
                                        name={"period"}
                                        options={enumToOptions(Period, values.repeatsEvery ? values.repeatsEvery > 1 : false)} />
                                </Grid>
                                <Grid item xs={'auto'}  pt={2}>
                                    X
                                </Grid>
                                <Grid item xs>
                                    {/* Number of times */}
                                    <NumberInput 
                                        label="Times" fullWidth name={"numberOfTimes"} />
                                </Grid>
                            </Stack>                   
                            
                            {/* Considered */}
                            <Divider/>
                            <FormControlLabel 
                                label="Include in analysis"
                                labelPlacement="end"
                                control={
                                    <Switch
                                    id="considered"
                                    name="considered"
                                    checked={values.considered}
                                    onChange={handleChange}
                                    />}
                            />
                            <Divider/>

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
                                    color={"primary"}
                                    variant="contained"
                                    type="submit"
                                    fullWidth
                                    disabled={!(dirty && isValid) || isSubmitting}
                                    loading={isSubmitting}>
                                    Save
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    </Form>)}
                }
            </Formik>
        </>
    )
})