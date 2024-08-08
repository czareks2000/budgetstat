import { Add, ExpandMore } from '@mui/icons-material';
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, IconButton, List, Typography } from '@mui/material'
import CategoryIcon from '../../../components/common/CategoryIcon';
import { useStore } from '../../../app/stores/store';
import { observer } from 'mobx-react-lite';
import { formatAmount } from '../../../app/utils/FormatAmount';
import { Fragment } from 'react/jsx-runtime';
import AssetItem from './AssetItem';
import { AssetCategory } from '../../../app/models/Asset';
import { useState } from 'react';
import DeleteAssetDialog from '../dialogs/DeleteAssetDialog';
import { router } from '../../../app/router/Routes';

interface Props {
    index: number;
    expanded: boolean;
    handleToggle: (index: number) => void;
    category: AssetCategory;
}

export default observer(function AssetGroup({index, expanded, handleToggle, category}: Props) {
    const { 
        assetStore: {assets, getAssetCategoryIconId, selectedAsset},
        currencyStore: {defaultCurrency},
        statsStore: {getAssetsValues}
    } = useStore();

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    }

    const handleAddButtonClick = () => {
        router.navigate(`/net-worth/assets/create?categoryId=${category.id}`);
    }

    return (
    <>
        <DeleteAssetDialog 
            key={selectedAsset?.id} 
            open={openDeleteDialog} setOpen={setOpenDeleteDialog} />
        <Accordion 
            expanded={expanded}
            onChange={() => handleToggle(index)}>
            <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`-assets`}
            id={`${category.name}-assets`}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Box display="flex" alignItems="center">
                        <CategoryIcon iconId={getAssetCategoryIconId(category.id)} fontSize="small" sx={{mr: 1}}/>
                        <Typography>{category.name}</Typography>
                    </Box>
                    <Typography sx={{mr: 2}} fontWeight={700}>
                        {formatAmount(getAssetsValues(category.id))} {defaultCurrency?.symbol}
                    </Typography>
                </Box>
            </AccordionSummary>
            <Divider/>
            {assets.filter(a => a.assetCategoryId === category.id).length > 0 &&<>
            <AccordionDetails sx={{p: 2}}>
                <List disablePadding>
                {assets.map((asset) => 
                <Fragment key={asset.id}>
                    {category.id === asset.assetCategoryId &&
                        <AssetItem asset={asset} openDeleteDialog={handleOpenDeleteDialog}/>
                    }
                </Fragment>                 
                )}
                </List>
            </AccordionDetails>
            <Divider/></>}
            <Box display={'flex'} justifyContent={'center'} py={1}>
                <IconButton 
                    aria-label="add" 
                    onClick={handleAddButtonClick}>
                    <Add/>
                </IconButton>
            </Box>  
        </Accordion>
    </>
  )
})
