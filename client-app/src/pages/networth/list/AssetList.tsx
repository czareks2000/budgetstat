import { Box, Paper } from '@mui/material'
import IconComponent from '../../../components/common/CategoryIcon'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store'
import { formatAmount } from '../../../app/utils/FormatAmount'

export default observer(function AssetList()  {
    const { 
        assetStore: {assets, getAssetCategoryIconId},
        currencyStore: {getCurrencySymbol}
    } = useStore();

    return (
        <Paper>
            <Box p={2}>
                {assets.map((asset) => 
                    <Box key={asset.id} display={'flex'}>
                        <IconComponent iconId={getAssetCategoryIconId(asset.assetCategoryId)} fontSize="small" sx={{mr: 1}}/>
                        <>{asset.name}: {formatAmount(asset.assetValue)} {getCurrencySymbol(asset.currencyId)}</>
                    </Box>
                )}
            </Box>
        </Paper>
    )
})
