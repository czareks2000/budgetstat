import { observer } from "mobx-react-lite";
import { LoanCreateValues } from "../../../app/models/Loan";
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
import CategoryGroupedInput from "../../formInputs/CategoryGroupedInput";
import { TransactionParams } from "../../../app/models/Transaction";

export default observer(function FilterTransactionsForm() {
    const {
        accountStore: {accountsAsOptions},
        categoryStore: {expenseCategoriesAsOptions},
        transactionStore: {loadTransactions, transactionParams } } = useStore()
    
    const validationSchema = Yup.object({
        
    });

    const handleFilterTransactionsFormSubmit = (params: TransactionParams, helpers: FormikHelpers<TransactionParams>) => {
        const transformedValues: TransactionParams = {
            ...params,
            startDate: dayjs(params.startDate).toDate(),
            endDate: dayjs(params.endDate).toDate(),
        }
        
        loadTransactions();

        helpers.setSubmitting(false);
    }
    

    return (
        <>
            <Formik
                initialValues={transactionParams}
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
                            label="Transaction Types" name={"types"}
                            options={enumToOptions(TransactionTypeFilter)} />

                        {/* Account */}
                        <SelectInput
                            label="Accounts" name={"accountIds"}
                            options={accountsAsOptions} />

                        {/* Categories */}
                        <CategoryGroupedInput label="Categories" name={"categories"} options={expenseCategoriesAsOptions} />

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