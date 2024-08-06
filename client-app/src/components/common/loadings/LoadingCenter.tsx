import { Box, CircularProgress } from '@mui/material'

const LoadingCenter = () => {
  return (
    <Box display={'flex'} justifyContent={'center'}>
        <Box mt={5}>
        <CircularProgress />
        </Box>
    </Box>
  )
}

export default LoadingCenter