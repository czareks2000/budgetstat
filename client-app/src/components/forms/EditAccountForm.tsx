import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { AccountFormValues } from "../../app/models/Account";
import { Button, Stack } from "@mui/material";

interface Props {
    initialValues: AccountFormValues;
    onSubmit: (account: AccountFormValues) => void;
    toggleEditForm: (state: boolean) => void;
}

export default observer(function EditAccountForm({initialValues, onSubmit, toggleEditForm}: Props) {
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        desription: Yup.string().notRequired()
    });
    
    return (
      <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={(values) => onSubmit(values)}
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
                            onClick={() => toggleEditForm(false)}>
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