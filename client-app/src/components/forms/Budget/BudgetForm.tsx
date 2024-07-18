import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import { useStore } from "../../../app/stores/store";
import { BudgetFormValues, BudgetDto } from "../../../app/models/Budget";
import { BudgetPeriod } from "../../../app/models/enums/BudgetPeriod";
import SelectInput from "../../formInputs/SelectInput";
import { enumToOptions } from "../../../app/models/Option";
import NumberInput from "../../formInputs/NumberInput";
import CategoryGroupedInput from "../../formInputs/CategoryGroupedInput";
import { CategoryOption } from "../../../app/models/Category";
import { TransactionType } from "../../../app/models/enums/TransactionType";

interface Props {
    initialValues: BudgetFormValues;
    onSubmit: (budget: BudgetDto, formikHelpers: FormikHelpers<BudgetFormValues>) => void;
    onCancel: () => void;
    submitText: string;
    currencySymbol: string;
}

export default observer(function BudgetForm({initialValues, onSubmit, onCancel, submitText, currencySymbol}: Props) {
    const {
        categoryStore: {getCategoriesAsOptions}} = useStore();

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        categories: Yup.array()
            .min(1, 'You must select at least one category'),
        period: Yup.number().required('Period is required'),
        amount: Yup.number()
            .required('Amount is required')
            .positive('The amount must be positive'),
    });

    return (
      <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, formikHelpers) => {
                const transformedValues: BudgetDto = {
                    ...values,
                    categoryIds: values.categories.map((category: CategoryOption) => category.id),
                };
                onSubmit(transformedValues, formikHelpers);
            }}
        >
        {({ isValid, dirty, isSubmitting }) => {
        return(
            <Form>
                <Stack spacing={2}>
                    {/* Name */}
                    <TextInput label="Name" name="name"/>

                    {/* Period */}
                    <SelectInput 
                        label="Period" name={"period"} 
                        options={enumToOptions(BudgetPeriod)} />

                    {/* Categories */}
                    <CategoryGroupedInput label="Categories" name={"categories"} options={getCategoriesAsOptions(TransactionType.Expense)} />

                    {/* Amount */}
                    <NumberInput label="Amount" name="amount" 
                        adornment adornmentPosition="end" adormentText={currencySymbol}/>

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
                            color="primary" 
                            variant="contained" 
                            type="submit" 
                            fullWidth
                            disabled={!(dirty && isValid) || isSubmitting}
                            loading={isSubmitting}>
                            {submitText}
                        </LoadingButton>
                    </Stack>
                </Stack>
            </Form>
        )
        }}
        </Formik>
      </>
    )
  })