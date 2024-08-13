import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, Stack } from "@mui/material";
import { useStore } from "../../../app/stores/store";
import { CategoryFormValues } from "../../../app/models/Category";
import { TransactionType } from "../../../app/models/enums/TransactionType";
import { CategoryType } from "../../../app/models/enums/CategoryType";
import SelectInput from "../../formInputs/SelectInput";
import { enumToOptions } from "../../../app/models/Option";
import IconPicker from "../../formInputs/icon-picker/IconPicker";
import { Option } from "../../../app/models/Option";

interface Props {
    initialValues: CategoryFormValues;
    onSubmit: (values: CategoryFormValues, helpers: FormikHelpers<CategoryFormValues>) => void;
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

    const categoryTypeOptions: Option[] = [
        {
            value: CategoryType.Main,
            text: "Main category"
        },
        {
            value: CategoryType.Sub,
            text: "Subcategory"
        },
    ]
    
    return (
      <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={onSubmit}
        >
        {({ isValid, dirty, isSubmitting, values, setFieldValue }) => {
        return(
            <Form>
                <Stack spacing={2}>

                    {/* Transaction Type */}
                    <SelectInput
                            disabled={editMode}
                            label="Transaction Type" name={"transactionType"}
                            fullWidth
                            options={enumToOptions(TransactionType)
                            .filter(o => o.value !== TransactionType.Transfer)} />

                    <Stack direction={'row'} spacing={2} alignItems={'top'}>
                            
                        {/* Category Type */}
                        <Grid item xs>
                            <SelectInput
                                disabled={editMode}
                                label="Category Type" name={"categoryType"}
                                fullWidth
                                options={categoryTypeOptions} />  
                        </Grid>

                        {values.categoryType === CategoryType.Sub &&
                        <Grid item xs={'auto'} pt={2}>
                            of
                        </Grid>}

                        {/* Main Income category */}
                        {(values.categoryType === CategoryType.Sub && values.transactionType === TransactionType.Expense) &&
                        <Grid item xs>
                            <SelectInput
                                disabled={editMode}
                                fullWidth
                                label="Main Category" name={"mainExpenseCategoryId"}
                                options={mainExpenseCategoriesAsOptions} />
                        </Grid>
                        }

                        {/* Main Expense category */}
                        {(values.categoryType === CategoryType.Sub && values.transactionType === TransactionType.Income) &&
                        <Grid item xs>
                            <SelectInput
                                disabled={editMode}
                                fullWidth
                                label="Main Category" name={"mainIncomeCategoryId"}
                                options={mainIncomeCategoriesAsOptions} />
                        </Grid>}

                    </Stack>

                    {/* Name */}
                    <TextInput label="Name" fullWidth name="name"/>
                    
                    {/* Icon Picker */}
                    <IconPicker
                            name={"iconId"}
                            value={values.iconId}
                            onChange={iconId => setFieldValue('iconId', iconId)}
                        />
                   
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