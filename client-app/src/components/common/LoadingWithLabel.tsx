import { Box, CircularProgress, Divider } from '@mui/material'

const LoadingWithLabel = () => {
  return (<>
        <Divider>Loading...</Divider>
        <Box display={'flex'} justifyContent={'center'}>
            <CircularProgress />
        </Box>
    </>
  )
}

export default LoadingWithLabel
