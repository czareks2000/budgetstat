import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Stack } from "@mui/material";
import { useStore } from "../../../app/stores/store";
import { CategoryCreateFormValues } from "../../../app/models/Category";
import { TransactionType } from "../../../app/models/enums/TransactionType";
import { CategoryType } from "../../../app/models/enums/CategoryType";
import SelectInput from "../../formInputs/SelectInput";
import { enumToOptions } from "../../../app/models/Option";
import { router } from "../../../app/router/Routes";

interface Props {
    categoryType?: CategoryType;
    transactionType?: TransactionType;
    mainCategoryId?: number;
    onCancel: () => void;
}

export default observer(function CreateCategoryForm({onCancel, categoryType, transactionType, mainCategoryId }: Props) {
    const {categoryStore: {mainExpenseCategoriesAsOptions, mainIncomeCategoriesAsOptions, createCategory}} = useStore();

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

    const initialValues: CategoryCreateFormValues = {
        categoryType: categoryType || CategoryType.Main,
        transactionType: transactionType || TransactionType.Expense,
        name: "",
        iconId: 1,
        mainExpenseCategoryId: (categoryType === CategoryType.Sub && transactionType === TransactionType.Expense ) 
            ? mainCategoryId || "" : "",
        mainIncomeCategoryId: (categoryType === CategoryType.Sub && transactionType === TransactionType.Income ) 
            ? mainCategoryId || "" : "",
    }

    const handleSubmit = (values: CategoryCreateFormValues) => {
        const type = values.transactionType === TransactionType.Expense ? 'expense' : 'income';

        createCategory(values).then(() => {
            router.navigate(`/preferences/categories?type=${type}`);
        });
    }
    
    return (
      <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
        {({ isValid, dirty, isSubmitting, values }) => {
        return(
            <Form>
                <Stack spacing={2}>

                    <Box display={'flex'} gap={2}>
                        {/* Category Type */}
                        <SelectInput
                            label="Category Type" name={"categoryType"}
                            fullWidth
                            options={enumToOptions(CategoryType)} />

                        {/* Transaction Type */}
                        <SelectInput
                            label="Transaction Type" name={"transactionType"}
                            fullWidth
                            options={enumToOptions(TransactionType)
                            .filter(o => o.value !== TransactionType.Transfer)} />
                    </Box>

                    {/* Main Income category */}
                    {(values.categoryType === CategoryType.Sub && values.transactionType === TransactionType.Expense) &&
                    <SelectInput
                        label="Main Category" name={"mainExpenseCategoryId"}
                        options={mainExpenseCategoriesAsOptions} />}

                    {/* Main Expense category */}
                    {(values.categoryType === CategoryType.Sub && values.transactionType === TransactionType.Income) &&
                    <SelectInput
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
                            color="success" 
                            variant="contained" 
                            fullWidth 
                            type="submit" 
                            disabled={!(dirty && isValid) || isSubmitting}
                            loading={isSubmitting}>
                            Create
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