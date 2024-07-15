import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store'

import { useState } from 'react'

import AccountGroup from './AccountGroup'
import AssetGroup from './AssetGroup'

export default observer(function AssetList()  {
    const { 
        assetStore: {assetCategories},
    } = useStore();

    // Tablica stanów, gdzie każdy element odpowiada stanowi otwarcia dla danego Accordionu
    const [expanded, setExpanded] = useState(new Array(assetCategories.length + 1).fill(false));

    const handleToggle = (index: number) => {
        const newExpanded = [...expanded];
        newExpanded[index] = !newExpanded[index];
        setExpanded(newExpanded);
    };

    return (
        <>
            <AccountGroup 
                index={0} 
                expanded={expanded[0]} 
                handleToggle={handleToggle}/>
            {assetCategories.map((category, index) =>
                <AssetGroup 
                    key={category.id} 
                    index={index + 1} 
                    expanded={expanded[index + 1]} 
                    handleToggle={handleToggle} 
                    category={category}/>
            )}
        </>
    )
})
