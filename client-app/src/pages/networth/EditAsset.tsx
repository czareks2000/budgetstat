import { Box, Divider, Paper, Stack } from "@mui/material"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { router } from "../../app/router/Routes"
import { AssetCreateUpdateValues } from "../../app/models/Asset"
import { observer } from "mobx-react-lite"
import AssetForm from "../../components/forms/Asset/AssetForm"
import { FormikHelpers } from "formik"
import { useStore } from "../../app/stores/store"

export default observer(function EditAsset() {
  const {assetStore: {updateAsset, selectedAsset}} = useStore();

  if (!selectedAsset) return <></>

  const handleGoBack = () => {
    router.navigate('/net-worth');
  }

  const handleOnSubmit = (asset: AssetCreateUpdateValues, formikHelpers: FormikHelpers<AssetCreateUpdateValues>) => {
    updateAsset(selectedAsset!.id, asset)
        .then(() => {
            formikHelpers.resetForm();
            handleGoBack();
        });
  }

  const initialValues: AssetCreateUpdateValues = {
    assetCategoryId: selectedAsset.assetCategoryId,
    name: selectedAsset.name,
    description: selectedAsset.description,
    assetValue: selectedAsset.assetValue,
    currencyId: selectedAsset.currencyId
  }
  
  return (
    <>
      <ResponsiveContainer content={
          <Stack spacing={2}>
            <Divider>Edit Asset</Divider>
            <Paper>
                <Box p={2}>
                    <AssetForm
                      initialValues={initialValues} 
                      onSubmit={handleOnSubmit}
                      onGoBack={handleGoBack}
                      submitText="Save"/>
                </Box>
            </Paper>
          </Stack>
      }/>
    </>
  )
})
