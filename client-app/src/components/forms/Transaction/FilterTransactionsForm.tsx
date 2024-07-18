import { observer } from "mobx-react-lite";
import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers } from "formik";
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
        transactionStore: {setTransactionParams, transactionParamsFormValues } } = useStore()
    
    const validationSchema = Yup.object({
        
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

    return (
        <>
            <Formik
                initialValues={transactionParamsFormValues}
                validationSchema={validationSchema}
                onSubmit={handleFilterTransactionsFormSubmit}>
            {({ isValid, dirty, isSubmitting, values }) => (
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
                        <LoadingButton
                            color="primary"
                            variant="contained"
                            type="submit"
                            fullWidth
                            disabled={!(dirty && isValid) || isSubmitting}
                            loading={isSubmitting}>
                            Filter
                        </LoadingButton>
                    </Stack>
                </Form>
            )}
            </Formik>
        </>
    )
})