import { Box, Divider, Paper, Stack } from "@mui/material"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import CreateAssetForm from "../../components/forms/Asset/CreateAssetForm"
import { router } from "../../app/router/Routes"

const CreateAsset = () => {
  
  const handleGoBack = () => {
    router.navigate('/net-worth');
  }
  
  return (
    <>
      <ResponsiveContainer content={
          <Stack spacing={2}>
            <Divider>Create Asset</Divider>
            <Paper>
                <Box p={2}>
                    <CreateAssetForm 
                      onGoBack={handleGoBack}/>
                </Box>
            </Paper>
          </Stack>
      }/>
    </>
  )
}

export default CreateAsset
