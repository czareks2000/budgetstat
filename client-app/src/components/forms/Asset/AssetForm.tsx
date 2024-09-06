import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { Button, Grid2, Stack } from "@mui/material";
import SelectInput from "../../formInputs/SelectInput";
import { useStore } from "../../../app/stores/store";
import NumberInput from "../../formInputs/NumberInput";
import { AssetCreateUpdateValues } from "../../../app/models/Asset";
import MyDatePicker from "../../formInputs/MyDatePicker";
import dayjs from "dayjs";

interface Props {
    initialValues: AssetCreateUpdateValues;
    onSubmit: (budget: AssetCreateUpdateValues, formikHelpers: FormikHelpers<AssetCreateUpdateValues>) => void;
    onGoBack: () => void;
    submitText: string;
    editMode?: boolean;
}

export default observer(function AssetForm({initialValues, onSubmit, onGoBack, submitText, editMode}: Props) {
    const {
        currencyStore: {currenciesAsOptions},
        assetStore: {assetCategoriesAsOptions}
    } = useStore();

    const dateValidationSchema = () => {
        if (editMode)
            return Yup.date()
            .typeError('Invalid date format')
            .notRequired()
        else
            return Yup.date()
            .typeError('Invalid date format')
            .required('Date is required')
            .max(dayjs().add(1, 'day').startOf('day').toDate(), 'Date cannot be in the future')
    }

    const validationSchema = Yup.object({
        assetCategoryId: Yup.string().required('Category is required'),
        name: Yup.string().required('Name is required'),
        description: Yup.string().notRequired(),
        assetValue: Yup.number().required('Asset value is required')
                        .min(0, 'Asset value must be greater than or equal to 0'),
        currencyId: Yup.string().required('Currency is required'),
        date: dateValidationSchema(),
    });
    
    return (
      <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, formikHelpers) => onSubmit(values, formikHelpers)}
        >
        {({ isValid, dirty, isSubmitting }) => {
        return(
            <Form>
                <Stack spacing={2}>
                    {/* Category */}
                    <SelectInput label="Category" name="assetCategoryId" 
                        options={assetCategoriesAsOptions}/>

                    {/* Name */}
                    <TextInput label="Name" name="name"/>

                    <Stack direction={"row"} display="flex" spacing={2}>
                        <Grid2 size={"grow"}>
                            {/* Asset value */}
                            <NumberInput label={editMode ? "Current Value" : "Value"} name="assetValue" fullWidth/>
                        </Grid2>
                        <Grid2 size={'auto'}>
                            {/* CurrencyId */}
                            <SelectInput label="Currency" name="currencyId" 
                                options={currenciesAsOptions}
                                minWidth={120}/>
                        </Grid2>
                    </Stack>

                    {/* Date */}
                    {!editMode &&
                    <MyDatePicker 
                            defaultValue={dayjs()}
                            label="Asset value at" 
                            name={"date"}/>}

                    {/* Description */}
                    <TextInput label="Description" name="description"/>
                   
                    {/* Buttons */}
                     <Stack direction={'row'} spacing={2}>
                        <Button 
                            color="error"
                            variant="contained"
                            fullWidth
                            onClick={onGoBack}>
                            Cancel
                        </Button>
                        <LoadingButton 
                            color="success" 
                            variant="contained" 
                            fullWidth 
                            type="submit" 
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
