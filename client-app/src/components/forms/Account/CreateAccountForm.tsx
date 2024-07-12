import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { AccountFormValues } from "../../../app/models/Account";
import { Button, Grid, Stack } from "@mui/material";
import SelectInput from "../../formInputs/SelectInput";
import { useStore } from "../../../app/stores/store";
import NumberInput from "../../formInputs/NumberInput";

interface Props {
    onSubmit: (account: AccountFormValues, formikHelpers: FormikHelpers<AccountFormValues>) => void;
    onCancel: () => void;
}

export default observer(function CreateAccountForm({onSubmit, onCancel}: Props) {
    const {currencyStore: {currenciesAsOptions}} = useStore();

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        balance: Yup.number().required('Balance is required')
                        .min(0, 'Balance must be greater than or equal to 0'),
        currencyId: Yup.string().required('Currency is required'),
        description: Yup.string().notRequired()
    });

    const initialValues: AccountFormValues = {
        name: "",
        balance: null,
        currencyId: "",
        description: ""
    }
    
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
                    {/* Name */}
                    <TextInput label="Name" name="name"/>

                    <Stack direction={"row"} display="flex" spacing={2}>
                        <Grid item xs>
                            {/* Balance */}
                            <NumberInput label="Balance" name="balance" fullWidth/>

                        </Grid>
                        <Grid item xs={'auto'}>
                            {/* CurrencyId */}
                            <SelectInput label="Currency" name="currencyId" 
                                options={currenciesAsOptions}
                                minWidth={120}/>
                        </Grid>
                    </Stack>

                    {/* Description */}
                    <TextInput label="Description" name="description"/>
                   
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