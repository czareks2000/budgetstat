import { observer } from "mobx-react-lite";
import { Button, Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik, FormikHelpers } from "formik";
import * as Yup from "yup";

import { CounterpartyCreateValues } from "../../../app/models/Counterparty";
import TextInput from "../../formInputs/TextInput";
import { useStore } from "../../../app/stores/store";

interface Props {
    cancelButton?: boolean;
    onCancel: () => void;
}

export default observer(function CrateCounterpartyForm({cancelButton, onCancel}: Props) {
    const {loanStore: {createCounterparty}} = useStore();

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
    });

    const initialValues: CounterpartyCreateValues = {
        name: ""
    }

    const handleSubmit = (cp: CounterpartyCreateValues, 
        helpers: FormikHelpers<CounterpartyCreateValues>) => 
    {
        createCounterparty(cp).then(() =>{
            helpers.resetForm();
        })
    }
    
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values, helpers) => {handleSubmit(values, helpers)}}>
            {({ isValid, dirty, isSubmitting }) => (
                <Form>
                    <Stack spacing={2}>
                        {/* Name */}
                        <TextInput label="Counterparty name" name={"name"}/>
                            
                        {/* Buttons */}
                        <Stack direction={'row'} spacing={2}>
                            {cancelButton && 
                            <Button
                                color="error"
                                variant="contained"
                                fullWidth
                                onClick={onCancel}>
                                Cancel
                            </Button>}
                            <LoadingButton
                                color="success"
                                variant="contained"
                                type="submit"
                                fullWidth
                                disabled={!(dirty && isValid) || isSubmitting}
                                loading={isSubmitting}>
                                Create
                            </LoadingButton>
                        </Stack>
                    </Stack>
                </Form>
            )}
            </Formik>
        </>
    )
})