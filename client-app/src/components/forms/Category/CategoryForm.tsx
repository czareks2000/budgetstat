import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack } from "@mui/material";
import { useStore } from "../../../app/stores/store";
import { CategoryFormValues } from "../../../app/models/Category";
import { TransactionType } from "../../../app/models/enums/TransactionType";
import { CategoryType } from "../../../app/models/enums/CategoryType";
import SelectInput from "../../formInputs/SelectInput";
import { enumToOptions } from "../../../app/models/Option";

interface Props {
    initialValues: CategoryFormValues;
    onSubmit: (values: CategoryFormValues) => void;
    onCancel: () => void;
    editMode?: boolean;
}

export default observer(function CategoryForm({onSubmit, onCancel, initialValues, editMode}: Props) {
    const {categoryStore: {mainExpenseCategoriesAsOptions, mainIncomeCategoriesAsOptions}} = useStore();

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        categoryType: Yup.string().required('Category type is required'),
        transactionType: Yup.string().required('Category type is required'),
        iconId: Yup.string().required('Icon is required'),
        mainExpenseCategoryId: Yup.string().nullable().when(['categoryType', 'transactionType'], {
            is: (categoryType: CategoryType, transactionType: TransactionType) => 
                categoryType == CategoryType.Sub && transactionType == TransactionType.Expense,
            then: schema => schema.required('Main category is required')
        }),
        mainIncomeCategoryId: Yup.string().nullable().when(['categoryType', 'transactionType'], {
            is: (categoryType: CategoryType, transactionType: TransactionType) => 
                categoryType == CategoryType.Sub && transactionType == TransactionType.Income,
            then: schema => schema.required('Main category is required')
        }),
    });
    
    return (
      <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
        {({ isValid, dirty, isSubmitting, values }) => {
        return(
            <Form>
                <Stack spacing={2}>

                    <Box display={'flex'} gap={2}>
                        {/* Transaction Type */}
                        <SelectInput
                            disabled={editMode}
                            label="Transaction Type" name={"transactionType"}
                            fullWidth
                            options={enumToOptions(TransactionType)
                            .filter(o => o.value !== TransactionType.Transfer)} />
                        {/* Category Type */}
                        <SelectInput
                            disabled={editMode}
                            label="Category Type" name={"categoryType"}
                            fullWidth
                            options={enumToOptions(CategoryType)} />
                    </Box>

                    {/* Main Income category */}
                    {(values.categoryType === CategoryType.Sub && values.transactionType === TransactionType.Expense) &&
                    <SelectInput
                        disabled={editMode}
                        label="Main Category" name={"mainExpenseCategoryId"}
                        options={mainExpenseCategoriesAsOptions} />}

                    {/* Main Expense category */}
                    {(values.categoryType === CategoryType.Sub && values.transactionType === TransactionType.Income) &&
                    <SelectInput
                        disabled={editMode}
                        label="Main Category" name={"mainIncomeCategoryId"}
                        options={mainIncomeCategoriesAsOptions} /> }

                    {/* Name */}
                    <TextInput label="Name" name="name"/>

                    {/* Icon */}
                    <TextInput label="Icon select" name="iconId"/>
                   
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
                            color={editMode ? "primary" : "success"} 
                            variant="contained" 
                            fullWidth 
                            type="submit" 
                            disabled={!(dirty && isValid) || isSubmitting}
                            loading={isSubmitting}>
                            {editMode ? "Save" : "Create"}
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