import { Box, Divider, Stack } from "@mui/material";
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import EditAsset from "./details/EditAsset";
import FloatingGoBackButton from "../../components/common/fabs/FloatingGoBackButton";
import { observer } from "mobx-react-lite";
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { router } from "../../app/router/Routes";
import LoadingWithLabel from "../../components/common/loadings/LoadingWithLabel";
import { useStore } from "../../app/stores/store";
import DeleteAssetDialog from "./dialogs/DeleteAssetDialog";
import ButtonGroupMenu from "./details/ButtonGroupMenu";
import CreateAssetValue from "./details/CreateAssetValue";
import AssetValueHistoryWithPagination from "./details/AssetValueHistoryWithPagination";
import CategoryIcon from "../../components/common/CategoryIcon";
import AssetValueOverTimeLineChart from "./charts/AssetValueOverTimeLineChart";

interface Props {
  editView?: boolean;
}

export default observer(function AssetDetails({editView}: Props) {
  const {
    assetStore: {
      selectedAsset, selectAsset, deselectAsset, 
      loadAssetValues, loadAssetValueOverTime, getAssetCategoryIconId},
  } = useStore();

  const [selectedPage, setSeletedPage] = useState(editView ? 'edit' : 'history');

  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  const {id} = useParams();
    useEffect(() => {
        if (id)
        {
          selectAsset(parseInt(id));
          loadAssetValues(parseInt(id));
          loadAssetValueOverTime(parseInt(id));
        } 
          else
            router.navigate('/not-found');
    }, [id, selectAsset])

    if (!selectedAsset) return <LoadingWithLabel/>

  const handleGoBack = () => {
    router.navigate('/net-worth');
    deselectAsset();
  }

  return (
    <>
        <FloatingGoBackButton onClick={handleGoBack} />
        <ResponsiveContainer content={
          <Stack spacing={2}>
            
            <Divider>
              <Box display={"flex"} alignItems={'center'} gap={1}>
                <CategoryIcon iconId={getAssetCategoryIconId(selectedAsset.assetCategoryId)}/>
                {selectedAsset.name}
              </Box>
            </Divider>
            
            <AssetValueOverTimeLineChart />

            <ButtonGroupMenu 
              selectedPage={selectedPage} setSeletedPage={setSeletedPage} 
              setOpenDeleteDialog={setOpenDeleteDialog} />

            {selectedPage === 'history' && 
              <AssetValueHistoryWithPagination />
            }

            {selectedPage === 'addValue' && 
              <CreateAssetValue onCancel={() => setSeletedPage('history')}/>
            }

            {selectedPage === 'edit' && 
              <EditAsset onCancel={() => setSeletedPage('history')}/>
            }

            <DeleteAssetDialog 
              key={selectedAsset?.id} redirect
              open={openDeleteDialog} setOpen={setOpenDeleteDialog}/>
            
          </Stack>
        }/>
    </>
  )
})


