import { Form, Formik } from "formik";
import { observer } from "mobx-react-lite"
import * as Yup from "yup";
import TextInput from "../../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { Button, Stack } from "@mui/material";
import SelectInput from "../../formInputs/SelectInput";
import { useStore } from "../../../app/stores/store";
import NumberInput from "../../formInputs/NumberInput";
import { AssetCreateUpdateValues } from "../../../app/models/Asset";
import { router } from "../../../app/router/Routes";

interface Props {
    onGoBack: () => void;
}

export default observer(function CreateAssetForm({onGoBack}: Props) {
    const {currencyStore: {currenciesAsOptions}} = useStore();

    const validationSchema = Yup.object({
        assetCategoryId: Yup.string().required('Category is required'),
        name: Yup.string().required('Name is required'),
        description: Yup.string().notRequired(),
        assetValue: Yup.number().required('Asset value is required')
                        .min(0, 'Asset value must be greater than or equal to 0'),
        currencyId: Yup.string().required('Currency is required'),
    });

    const initialValues: AssetCreateUpdateValues = {
        assetCategoryId: "",
        name: "",
        description: "",
        assetValue: null,
        currencyId: ""
    }

    const handleOnSubmit = (asset: AssetCreateUpdateValues) => {
        console.log(asset);

        onGoBack();
    }
    
    return (
      <>
        <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleOnSubmit}
        >
        {({ isValid, dirty, isSubmitting }) => {
        return(
            <Form>
                <Stack spacing={2}>
                    {/* Category */}
                    <TextInput label="Category" name="assetCategoryId"/>

                    {/* Name */}
                    <TextInput label="Name" name="name"/>

                    {/* Asset value */}
                    <NumberInput label="AssetValue" name="assetValue"/>
                    {/* CurrencyId */}
                    <SelectInput label="Currency" name="currencyId" options={currenciesAsOptions}/>

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
