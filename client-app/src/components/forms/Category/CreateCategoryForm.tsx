import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import { useStore } from "../../../app/stores/store";
import dayjs from "dayjs";
import { CategoryCreateValues } from "../../../app/models/Category";
import { TransactionType } from "../../../app/models/enums/TransactionType";

interface Props {
    onCancel: () => void;
}

export default observer(function CreateCategoryForm({onCancel}: Props) {
    const {} = useStore();

    const validationSchema = Yup.object({
        name: Yup.string().required('Name is required'),
        balance: Yup.number().required('Balance is required')
                        .min(0, 'Balance must be greater than or equal to 0'),
        currencyId: Yup.string().required('Currency is required'),
        date: Yup.date()
            .required('Date is required')
            .max(dayjs().add(1, 'day').startOf('day').toDate(), 'Date cannot be in the future'),
        description: Yup.string().notRequired()
    });

    const initialValues: CategoryCreateValues = {
        name: "",
        iconId: 0,
        type: TransactionType.Expense,
        isMain: true
    }

    const handleSubmit = (values: CategoryCreateValues) => {

    }
    
    return (
      <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
        >
        {({ isValid, dirty, isSubmitting }) => {
        return(
            <Form>
                <Stack spacing={2}>
                    {/* Name */}
                    <TextInput label="Name" name="name"/>
                   
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