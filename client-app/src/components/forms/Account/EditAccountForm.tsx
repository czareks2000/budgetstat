import { Form, Formik, FormikHelpers } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { AccountFormValues } from "../../../app/models/Account";
import { Button, Stack } from "@mui/material";

interface Props {
    initialValues: AccountFormValues;
    onSubmit: (account: AccountFormValues, formikHelpers: FormikHelpers<AccountFormValues>) => void;
    onCancel: () => void;
}

export default observer(function EditAccountForm({initialValues, onSubmit, onCancel}: Props) {
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        description: Yup.string().notRequired()
    });
    
    return (
      <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values, helpers) => onSubmit(values, helpers)}
        >
        {({ isValid, dirty, isSubmitting }) => {
        return(
            <Form>
                <Stack spacing={2}>
                    {/* Name */}
                    <TextInput label="Name" name="name"/>
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
                            color="primary" 
                            variant="contained" 
                            type="submit" 
                            fullWidth
                            disabled={!(dirty && isValid) || isSubmitting}
                            loading={isSubmitting}>
                            Save
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