import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, Stack } from "@mui/material";
import SelectInput from "../../formInputs/SelectInput";
import { useStore } from "../../../app/stores/store";
import NumberInput from "../../formInputs/NumberInput";
import MyDatePicker from "../../formInputs/MyDatePicker";
import dayjs from "dayjs";
import { AssetValueCreateValues } from "../../../app/models/Asset";

interface Props {
    initialValues: AssetValueCreateValues;
    onSubmit: (budget: AssetValueCreateValues, formikHelpers: FormikHelpers<AssetValueCreateValues>) => void;
    onGoBack: () => void;
}

export default observer(function CreateAssetValueForm({initialValues, onSubmit, onGoBack}: Props) {
    const {
        currencyStore: {currenciesAsOptions},
    } = useStore();

    const validationSchema = Yup.object({
        value: Yup.number().required('Asset value is required')
                        .min(0, 'Asset value must be greater than or equal to 0'),
        currencyId: Yup.string().required('Currency is required'),
        date: Yup.date()
            .typeError('Invalid date format')
            .required('Date is required')
            .max(dayjs().add(1, 'day').startOf('day').toDate(), 'Date cannot be in the future')
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
                    <Stack direction={"row"} display="flex" spacing={2}>
                        <Grid item xs>
                            {/* Asset value */}
                            <NumberInput label={"Value"} name="value" fullWidth/>
                        </Grid>
                        <Grid item xs={'auto'}>
                            {/* CurrencyId */}
                            <SelectInput label="Currency" name="currencyId" 
                                options={currenciesAsOptions}
                                minWidth={120}/>
                        </Grid>
                    </Stack>

                    {/* Date */}
                    <MyDatePicker 
                        defaultValue={dayjs()}
                        label="Asset value at" 
                        name={"date"}/>
                   
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
                            Add
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