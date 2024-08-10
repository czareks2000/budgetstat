import { Fade, List, Pagination, Paper, Stack } from "@mui/material";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import LoadingCenter from "../../../components/common/loadings/LoadingCenter";
import AssetValuesListItem from "./AssetValuesListItem";
import { useState } from "react";


export default observer(function AssetValueHistoryWithPagination() {
  const {
    assetStore: {
      selectedAssetValues, assetValuesLoaded},
  } = useStore();

  const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = selectedAssetValues.slice(indexOfFirstItem, indexOfLastItem);

    const handlePageChange = (_: React.ChangeEvent<unknown>, page: number) => {
        setCurrentPage(page);
    };

  return (
    <>
        {!assetValuesLoaded && <LoadingCenter />}

        <Fade in={assetValuesLoaded} appear={false}>
          
            <Stack spacing={2}>
              <Paper>
                <List disablePadding>
                  {currentItems.map((value, index) => 
                      <AssetValuesListItem 
                        key={value.id}
                        assetValue={value} index={index} />                    
                  )}
                </List>
              </Paper>
              {selectedAssetValues.length > itemsPerPage &&
              <Pagination
                  count={Math.ceil(selectedAssetValues.length / itemsPerPage)}
                  page={currentPage}
                  onChange={handlePageChange}/>}
            </Stack>
          
        </Fade>
    </>
  )
})