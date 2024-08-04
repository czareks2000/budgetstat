import { observer } from "mobx-react-lite";
import { Button, Divider, FormControlLabel, Stack, Switch } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers } from "formik";
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
import CategoryGroupedInput from "../../formInputs/CategoryGroupedInput";
import { useEffect } from "react";

interface Props {
    initialValues: TransactionFormValues;
    onSubmit: (values: TransactionFormValues, helpers: FormikHelpers<TransactionFormValues>, initialValues: TransactionFormValues) => void;
    submitText: string;
    editMode?: boolean;
}

export default observer(function TransactionForm({initialValues, onSubmit, submitText, editMode}: Props) {
    const {
        accountStore: {accountsAsOptions, getAccountCurrency, isTheSameCurrency},
        currencyStore: {getCurrentExchangeRate, currentExchangeRate},
        categoryStore: {getCategoriesAsOptions}} = useStore();

    const validationSchema = Yup.object({
        type: Yup.string().required('Transaction type is required'),
        accountId: Yup.string().when('type', {
            is: (val: TransactionType) => val != TransactionType.Transfer,
            then: schema => schema.required('Account is required')
        }),
        fromAccountId: Yup.string().nullable().when('type', {
            is: (val: TransactionType) => val == TransactionType.Transfer,
            then: schema => schema.required('Account is required').test(
                'toAccountId',
                'The source account must be different from the target account',
                function(value) {
                    const { toAccountId } = this.parent;
                    return value != toAccountId;
                }
            )
        }),
        toAccountId: Yup.string().nullable().when('type', {
            is: (val: TransactionType) => val == TransactionType.Transfer,
            then: schema => schema.required('Account is required').test(
                'toAccountId',
                'The target account must be different from the source account',
                function(value) {
                    const { fromAccountId } = this.parent;
                    return value != fromAccountId;
                }
            )
        }),
        incomeCategoryId: Yup.mixed().nullable().when('type', {
            is: (val: TransactionType) => val == TransactionType.Income,
            then: schema => schema.required('Category is required').nonNullable('Category is required')
        }),
        expenseCategoryId: Yup.mixed().nullable().when('type', {
            is: (val: TransactionType) => val == TransactionType.Expense,
            then: schema => schema.required('Category is required').nonNullable('Category is required')
        }),
        amount: Yup.number().nullable().when('type', {
            is: (val: TransactionType) => val != TransactionType.Transfer,
            then: schema => schema.required('Amount is required').positive('Amount must be positive')
        }),
        fromAmount: Yup.number().nullable().when('type', {
            is: (val: TransactionType) => val == TransactionType.Transfer,
            then: schema => schema.required('Amount is required').positive('Amount must be positive')
        }),
        toAmount: Yup.number().nullable().when(['type', 'fromAccountId', 'toAccountId'], {
            is: (type: TransactionType, fromAccountId: number, toAccountId: number) => 
                type == TransactionType.Transfer && 
                !isTheSameCurrency(fromAccountId, toAccountId),
            then: schema => schema.required('Amount is required').positive('Amount must be positive')
        }),
        date: Yup.date()
            .required('Date is required')
            .max(dayjs().add(1, 'day').startOf('day').toDate(), 'Date cannot be in the future'),
        description: Yup.string(),
        considered: Yup.boolean()
    });

    const onCancel = () => {
        router.navigate('/transactions');
    }

    const handleSubmit = (values: TransactionFormValues, helpers: FormikHelpers<TransactionFormValues>) => {
        let transformedValues: TransactionFormValues | null = null;
        
        if (values.type === TransactionType.Transfer && 
            isTheSameCurrency(values.fromAccountId, values.toAccountId))
        {
            transformedValues = {
                ...values,
                toAmount: values.fromAmount
            }
        }

        onSubmit(transformedValues || values, helpers, initialValues);
    }

    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={handleSubmit}>
                {({ isValid, dirty, isSubmitting, values, handleChange, setFieldValue }) => {
                    useEffect(() => {
                        if (values.type === TransactionType.Transfer && 
                            !isTheSameCurrency(values.fromAccountId, values.toAccountId) && 
                            values.toAccountId !== '' && values.fromAccountId !== '')
                        {
                            getCurrentExchangeRate(
                                getAccountCurrency(values.fromAccountId)!.code, 
                                getAccountCurrency(values.toAccountId)!.code
                            );
                        }
                    },[values.type, values.toAccountId, values.fromAccountId, getCurrentExchangeRate, currentExchangeRate]);

                    useEffect(() => {           
                        if (values.type === TransactionType.Transfer && dirty &&
                            !isTheSameCurrency(values.fromAccountId, values.toAccountId) &&
                            values.fromAmount && currentExchangeRate) {
                            setFieldValue('toAmount', (values.fromAmount * currentExchangeRate).toFixed(2));
                        }
                    }, [values.fromAmount, values.fromAccountId, values.toAccountId, currentExchangeRate, setFieldValue]);

                    return (
                    <Form>
                        <Stack spacing={2}>

                            {/* Transaction Type */}
                            {!editMode &&
                            <SelectInput
                                label="Transaction Type" name={"type"}
                                options={enumToOptions(TransactionType)} />}

                            {/* Account */}
                            {(values.type !== TransactionType.Transfer) &&
                            <SelectInput
                                label="Account" name={"accountId"}
                                options={accountsAsOptions} />
                            }

                            {/* Amount */}
                            {(values.type !== TransactionType.Transfer) &&
                            <NumberInput label="Amount" name={"amount"}
                                adornment adornmentPosition="end" 
                                adormentText={getAccountCurrency(values.accountId)?.symbol} />
                            }

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

                            {(values.type === TransactionType.Transfer) &&
                            <>
                                {/* From Account */}
                                <SelectInput
                                    label="From" name={"fromAccountId"}
                                    options={accountsAsOptions} />
                                {/* To Account */}
                                <SelectInput
                                    label="To" name={"toAccountId"}
                                    options={accountsAsOptions} />
                                
                                {/* From Amount */}
                                <NumberInput 
                                    label={
                                        (!isTheSameCurrency(values.fromAccountId, values.toAccountId)&& 
                                        values.toAccountId !== '' && values.fromAccountId !== '') ? 
                                        `Amount in ${getAccountCurrency(values.fromAccountId)!.code}` : "Amount"
                                    } 
                                    name={"fromAmount"}
                                    adornment adornmentPosition="end" 
                                    adormentText={getAccountCurrency(values.fromAccountId)?.symbol} />
                                {/* To Amount */}
                                {(!isTheSameCurrency(values.fromAccountId, values.toAccountId) && 
                                    values.toAccountId !== '' && values.fromAccountId !== '') &&
                                <NumberInput label={`Amount in ${getAccountCurrency(values.toAccountId)!.code}`} name={"toAmount"}
                                    adornment adornmentPosition="end"
                                    helperText={`1 ${getAccountCurrency(values.fromAccountId)?.code} ≈ 
                                    ${currentExchangeRate} 
                                    ${getAccountCurrency(values.toAccountId)?.code}`}
                                    adormentText={getAccountCurrency(values.toAccountId)?.symbol}/>
                                }
                            </>}

                            {/* Transaction Date */}
                            <MyDatePicker 
                                defaultValue={dayjs()}
                                label="Date" 
                                name={"date"}/>

                            {/* Description */}
                            {values.type !== TransactionType.Transfer &&
                            <TextInput label="Description" name="description" />}
                            
                            {/* Considered */}
                            {values.type !== TransactionType.Transfer && <>
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
                            <Divider/></>}

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
                                    color={submitText === "Create"? "success" :"primary"}
                                    variant="contained"
                                    type="submit"
                                    fullWidth
                                    disabled={!(dirty && isValid) || isSubmitting}
                                    loading={isSubmitting}>
                                    {submitText}
                                </LoadingButton>
                            </Stack>
                        </Stack>
                    </Form>)}
                }
            </Formik>
        </>
    )
})