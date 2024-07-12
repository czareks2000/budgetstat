import { Balance } from '@mui/icons-material'
import { Box, Card, CardContent, Typography } from '@mui/material'

const NetWorthCard = () => {
  return (
    <Card>
        <CardContent>
            <Box display={'flex'}>
                <Balance sx={{mt: '3px', mr: 1}}/>
                <Typography variant="h6" gutterBottom>
                    Net worth
                </Typography>
            </Box>
            <Typography variant="h5" color={'primary'}>297 000 zł</Typography>
        </CardContent>
    </Card>
  )
}

export default NetWorthCard
