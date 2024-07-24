import { Box, Divider, Paper, Stack } from "@mui/material"
import ResponsiveContainer from "../../../components/common/ResponsiveContainer"
import CreatePlannedTransactionsForm from "../../../components/forms/Transaction/CreatePlannedTransactionsForm"

const CreatePlannedTransactions = () => {
  return (
    <>
      <ResponsiveContainer content={
          <Stack spacing={2}>
              <Divider>Create Planned Transactions</Divider>
              <Paper>
                  <Box p={2}>
                      <CreatePlannedTransactionsForm />
                  </Box>
              </Paper>
          </Stack>
      } />
  </>
  )
}

export default CreatePlannedTransactions
