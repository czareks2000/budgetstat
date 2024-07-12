import { Add, Home } from '@mui/icons-material'
import { Box, Card, CardContent, IconButton, Typography } from '@mui/material'
import { router } from '../../../app/router/Routes'

const AssetsCard = () => {

    const handleAddButtonClick = () => {
        router.navigate('/assets/create');
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
                <Typography variant="h5">300 000 zł</Typography>
            </CardContent>
        </Card>
    )
}

export default AssetsCard
