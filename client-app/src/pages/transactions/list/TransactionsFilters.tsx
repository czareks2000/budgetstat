import { Box, Paper } from '@mui/material'
import FilterTransactionsForm from '../../../components/forms/Transaction/FilterTransactionsForm'

const TransactionsFilters = () => {
  return (
    <Paper>
        <Box p={2}>
            <FilterTransactionsForm />
        </Box>
    </Paper>
  )
}

export default TransactionsFilters
