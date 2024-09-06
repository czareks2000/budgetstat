import NoDecorationLink from '../../../components/common/NoDecorationLink'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import { Add, PendingActions } from '@mui/icons-material'
import { router } from '../../../app/router/Routes'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store'
import { formatAmount } from '../../../app/utils/FormatAmount'

export default observer(function LoansCard() {
    const {
        currencyStore: {defaultCurrency},
        statsStore: {loansValue},
    } = useStore();
    
    const handleAddButtonClick = () => {
        router.navigate(`/loans/create?fromLocation=net-worth`);
    }

    const amountColor = (amount: number) => {
        if (amount < 0)
            return 'error'
        else if (amount > 0)
            return 'success.main'
    }
  
    return (
    <NoDecorationLink to={"/loans"} content={
        <Card>
        <CardContent>
            <Box display={'flex'} justifyContent="space-between">
                <Box display={'flex'}>
                    <PendingActions sx={{mt: '3px', mr: 1}}/> 
                    <Typography variant="h6" gutterBottom>
                        Loans 
                    </Typography>
                </Box>
                <Box sx={{mt: '-3px', mr: '-3px'}}>
                    <IconButton 
                        aria-label="add"
                        size="small"
                        onClick={(e: any) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddButtonClick();
                        }}>
                        <Add />
                    </IconButton> 
                </Box>
            </Box>
            
            <Typography variant="h5" color={amountColor(loansValue)}>
                {formatAmount(loansValue)} {defaultCurrency?.symbol}
            </Typography>
        </CardContent>
    </Card>
    } />
  )
})