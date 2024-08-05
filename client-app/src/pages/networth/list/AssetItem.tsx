import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, ListItem, ListItemText } from '@mui/material'
import { formatAmount } from '../../../app/utils/FormatAmount'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { Asset } from '../../../app/models/Asset';
import { router } from '../../../app/router/Routes';

interface Props {
    asset: Asset;
    openDeleteDialog: () => void;
}

export default observer(function AssetItem({asset, openDeleteDialog}: Props) {
    const {
        currencyStore: {getCurrencySymbol},
        assetStore: {selectAsset}
    } = useStore();

    const handleDeleteButtonClick = () => {
        selectAsset(asset.id);
        openDeleteDialog();
    }

    const handleEditButtonClick = () => {
        selectAsset(asset.id);
        router.navigate(`/net-worth/assets/${asset.id}/edit`)
    }

    return (
    <ListItem 
        secondaryAction={
        <Box>
            <IconButton
                sx={{mr: "0px" }} 
                edge={"end"} aria-label="edit" 
                onClick={handleEditButtonClick}>
                <Edit/>
            </IconButton>
            <IconButton 
                edge={"end"} aria-label="delete" 
                onClick={handleDeleteButtonClick}>
                <Delete/>
            </IconButton>
        </Box>
        }>
        <ListItemText 
            primary={asset.name}
            secondary={<i>{formatAmount(asset.assetValue)} {getCurrencySymbol(asset.currencyId)}</i>}/>
    </ListItem>  
  )
})
