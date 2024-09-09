import { Box, Paper } from "@mui/material"
import { AssetValueCreateValues } from "../../../app/models/Asset"
import { observer } from "mobx-react-lite"
import { FormikHelpers } from "formik"
import { useStore } from "../../../app/stores/store"
import LoadingWithLabel from "../../../components/common/loadings/LoadingWithLabel"
import dayjs from "dayjs"
import CreateAssetValueForm from "../../../components/forms/Asset/CreateAssetValueForm"

interface Props {
  onCancel: () => void;
}

export default observer(function CreateAssetValue({onCancel}: Props) {
  const {
    assetStore: {createAssetValue, selectedAsset, selectAsset},
    } = useStore();

  if (!selectedAsset) return <LoadingWithLabel/>

  const handleOnSubmit = (assetValue: AssetValueCreateValues, formikHelpers: FormikHelpers<AssetValueCreateValues>) => {
    createAssetValue(selectedAsset!.id, assetValue)
        .then(() => {
            formikHelpers.resetForm();
            selectAsset(selectedAsset!.id);
        });
  }

  const initialValues: AssetValueCreateValues = {
    value: null,
    currencyId: selectedAsset.currencyId,
    date: dayjs(),
  }
  
  return (
    <Paper>
        <Box p={2}>
            <CreateAssetValueForm
              initialValues={initialValues} 
              onSubmit={handleOnSubmit}
              onGoBack={onCancel}/>
        </Box>
    </Paper>
  )
})