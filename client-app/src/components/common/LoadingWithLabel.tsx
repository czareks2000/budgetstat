import { Box, CircularProgress, Divider } from '@mui/material'

const LoadingWithLabel = () => {
  return (<>
        <Divider>Loading...</Divider>
        <Box display={'flex'} justifyContent={'center'}>
          <Box mt={5} mr={1}>
            <CircularProgress />
          </Box>
        </Box>
    </>
  )
}

export default LoadingWithLabel
