import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, ListItem, ListItemText } from '@mui/material'
import { formatAmount } from '../../../app/utils/FormatAmount'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { Asset } from '../../../app/models/Asset';

interface Props {
    asset: Asset;
}

export default observer(function AssetItem({asset}: Props) {
    const {currencyStore: {getCurrencySymbol}} = useStore();

  return (
    <ListItem 
        secondaryAction={
        <Box>
            <IconButton
                sx={{mr: "0px" }} 
                edge={"end"} aria-label="edit" 
                onClick={() => console.log(asset.id)}>
                <Edit/>
            </IconButton>
            <IconButton 
                edge={"end"} aria-label="delete" 
                onClick={() => console.log(asset.id)}>
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
