import { Box, Divider, Paper, Stack } from "@mui/material"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { router } from "../../app/router/Routes"
import { AssetCreateUpdateValues } from "../../app/models/Asset"
import { observer } from "mobx-react-lite"
import AssetForm from "../../components/forms/Asset/AssetForm"
import { FormikHelpers } from "formik"
import { useStore } from "../../app/stores/store"

export default observer(function CreateAsset() {
  const {assetStore: {createAsset}} = useStore();

  const handleGoBack = () => {
    router.navigate('/net-worth');
  }

  const handleOnSubmit = (asset: AssetCreateUpdateValues, formikHelpers: FormikHelpers<AssetCreateUpdateValues>) => {
    createAsset(asset)
        .then(() => {
            formikHelpers.resetForm();
            handleGoBack();
        });
  }

  const initialValues: AssetCreateUpdateValues = {
    assetCategoryId: "",
    name: "",
    description: "",
    assetValue: null,
    currencyId: ""
}
  
  return (
    <>
      <ResponsiveContainer content={
          <Stack spacing={2}>
            <Divider>Create Asset</Divider>
            <Paper>
                <Box p={2}>
                    <AssetForm
                      initialValues={initialValues} 
                      onSubmit={handleOnSubmit}
                      onGoBack={handleGoBack}
                      submitText="Create"/>
                </Box>
            </Paper>
          </Stack>
      }/>
    </>
  )
})
