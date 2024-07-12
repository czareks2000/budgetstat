import NoDecorationLink from '../../../components/common/NoDecorationLink'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import { Add, PendingActions } from '@mui/icons-material'
import { router } from '../../../app/router/Routes'

const LoansCard = () => {
  
    const handleAddButtonClick = () => {
        router.navigate(`/loans/create?fromLocation=net-worth`);
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
                        onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleAddButtonClick();
                        }}>
                        <Add />
                    </IconButton> 
                </Box>
            </Box>
            
            <Typography variant="h5" color={'error'}>-3 000 zł</Typography>
        </CardContent>
    </Card>
    } />
  )
}

export default LoansCard
