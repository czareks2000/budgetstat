import { Box, Paper } from "@mui/material"
import { AssetCreateUpdateValues } from "../../../app/models/Asset"
import { observer } from "mobx-react-lite"
import AssetForm from "../../../components/forms/Asset/AssetForm"
import { FormikHelpers } from "formik"
import { useStore } from "../../../app/stores/store"
import LoadingWithLabel from "../../../components/common/loadings/LoadingWithLabel"
import dayjs from "dayjs"

interface Props {
  onCancel: () => void;
}

export default observer(function EditAsset({onCancel}: Props) {
  const {assetStore: {updateAsset, selectedAsset, selectAsset}} = useStore();

  if (!selectedAsset) return <LoadingWithLabel/>

  const handleOnSubmit = (asset: AssetCreateUpdateValues, formikHelpers: FormikHelpers<AssetCreateUpdateValues>) => {
    updateAsset(selectedAsset!.id, asset)
        .then(() => {
            formikHelpers.resetForm({values: asset});
            selectAsset(selectedAsset!.id);
        });
  }

  const initialValues: AssetCreateUpdateValues = {
    assetCategoryId: selectedAsset.assetCategoryId,
    name: selectedAsset.name,
    description: selectedAsset.description || "",
    assetValue: selectedAsset.assetValue,
    currencyId: selectedAsset.currencyId,
    date: dayjs(),
  }
  
  return (
    <Paper>
        <Box p={2}>
            <AssetForm
              editMode
              initialValues={initialValues} 
              onSubmit={handleOnSubmit}
              onGoBack={onCancel}
              submitText="Save"/>
        </Box>
    </Paper>
  )
})
