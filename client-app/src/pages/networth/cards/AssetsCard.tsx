import { Add, Home } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import { router } from '../../../app/router/Routes'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store'
import { formatAmount } from '../../../app/utils/FormatAmount'

export default observer(function AssetsCard()  {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {assetsValue},
        accountStore: {totalBalance}
    } = useStore();

    const handleAddButtonClick = () => {
        router.navigate('/net-worth/assets/create');
    }

    return (
        <Card>
            <CardContent>
                <Box display={'flex'} justifyContent="space-between">
                    <Box display={'flex'}>
                        <Home sx={{mt: '3px', mr: 1}}/>
                        <Typography variant="h6" gutterBottom>
                            Assets 
                        </Typography>
                    </Box>
                    <Box sx={{mt: '-3px', mr: '-3px'}}>
                        <IconButton 
                            aria-label="add"
                            size="small"
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                handleAddButtonClick();
                            }}>
                            <Add />
                        </IconButton> 
                    </Box>
                </Box>
                <Typography variant="h5">
                    {formatAmount(assetsValue + totalBalance)} {defaultCurrency?.symbol}
                </Typography>
            </CardContent>
        </Card>
    )
})