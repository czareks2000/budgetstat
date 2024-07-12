import { Accordion, AccordionDetails, AccordionSummary, Box } from '@mui/material'
import IconComponent from '../../../components/common/CategoryIcon'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store'
import { formatAmount } from '../../../app/utils/FormatAmount'
import { ExpandMore } from '@mui/icons-material'
import { useState } from 'react'

export default observer(function AssetList()  {
    const { 
        assetStore: {assets, getAssetCategoryIconId, assetCategories},
        currencyStore: {getCurrencySymbol}
    } = useStore();

    // Tablica stanów, gdzie każdy element odpowiada stanowi otwarcia dla danego Accordionu
    const [expanded, setExpanded] = useState(new Array(assetCategories.length).fill(false));

    const handleToggle = (index: number) => {
        const newExpanded = [...expanded];
        newExpanded[index] = !newExpanded[index];
        setExpanded(newExpanded);
    };

    return (
        <Box>
            {assetCategories.map((category, index) =>
                <Accordion 
                    key={category.id}
                    expanded={expanded[index]}
                    onChange={() => handleToggle(index)}>
                    <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls={`${category.name}-assets`}
                    id={`${category.name}-assets`}
                    >
                        <Box  display={'flex'}>
                            <IconComponent iconId={getAssetCategoryIconId(category.id)} fontSize="small" sx={{mr: 1}}/>
                            <>{category.name}</>
                        </Box>
                    </AccordionSummary>
                    <AccordionDetails>
                    {assets.map((asset) => 
                    <>
                        {category.id === asset.assetCategoryId &&
                        <Box key={asset.id}>
                            <Box>{asset.name} {formatAmount(asset.assetValue)} {getCurrencySymbol(asset.currencyId)}</Box>
                        </Box>}
                    </>
                    )}      
                    </AccordionDetails>
                </Accordion>
            )}
        </Box>
    )
})
