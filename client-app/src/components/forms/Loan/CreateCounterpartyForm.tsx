import { observer } from "mobx-react-lite";
import { Stack } from "@mui/material";
import { LoadingButton } from "@mui/lab";
import { Form, Formik } from "formik";
import * as Yup from "yup";

import { CounterpartyCreateValues } from "../../../app/models/Counterparty";
import TextInput from "../../formInputs/TextInput";

interface Props {
    onSubmit: (loan: CounterpartyCreateValues) => void;
}

export default observer(function CrateCounterpartyForm({onSubmit}: Props) {
    
    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
    });

    const initialValues: CounterpartyCreateValues = {
        name: ""
    }
    
    return (
        <>
            <Formik
                initialValues={initialValues}
                validationSchema={validationSchema}
                onSubmit={(values) => {onSubmit(values)}}>
            {({ isValid, dirty, isSubmitting }) => (
                <Form>
                    <Stack spacing={2}>
                        {/* Name */}
                        <TextInput label="Counterparty name" name={"name"}/>
                            
                        {/* Button */}
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
                </Form>
            )}
            </Formik>
        </>
    )
})