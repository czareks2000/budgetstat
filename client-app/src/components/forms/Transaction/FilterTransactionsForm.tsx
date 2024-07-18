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
import { TransactionTypeFilter } from "../../../app/models/enums/TransactionType";
import { TransactionParamsFormValues } from "../../../app/models/Transaction";
import MultipleSelectWithChceckBoxes from "../../formInputs/MultipleSelectWithChceckBoxes";

export default observer(function FilterTransactionsForm() {
    const {
        accountStore: {accountsNamesAsOptions},
        categoryStore: {},
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
            {({ isValid, dirty, isSubmitting }) => (
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

                        {/* Categories */}
                        {/* <CategoryGroupedInput label="Categories" name={"categories"} options={expenseCategoriesAsOptions} /> */}

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