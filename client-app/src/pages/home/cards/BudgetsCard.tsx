import { Box, Divider, List, Paper, Stack, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import { useStore } from '../../../app/stores/store';
import { NoteAlt } from '@mui/icons-material';

export default observer(function BudgetsCard() {
  const {
      budgetStore: {},
  } = useStore();

  return (
    <Paper>
        <Stack>
            <Box display={'flex'} p={2}>
                <NoteAlt />
                <Typography ml={1}>
                    Budgets
                </Typography>
            </Box>
        <Divider/>
            {true &&
            <List disablePadding>
                {}
            </List>}
            <Box p={2}>lista podsumowanych budżetów current/total z podziałem na 3 periods, procentowe wykorzystanie budżetów na pasku progresu</Box> 
        </Stack>
    </Paper>
  )
})