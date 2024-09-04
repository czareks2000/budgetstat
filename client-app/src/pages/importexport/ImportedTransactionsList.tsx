import { Box, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material'
import { observer } from 'mobx-react-lite'
import dayjs from 'dayjs';
import { useStore } from '../../app/stores/store';
import { formatAmount } from '../../app/utils/FormatAmount';
import CategoryIcon from '../../components/common/CategoryIcon';
import { Clear } from '@mui/icons-material';
import { useState } from 'react';
import { TransactionRowItem, TransactionToDelete } from '../../app/models/Transaction';
import DeleteTransactionDialog from '../transactions/dialogs/DeleteTransactionDialog';

export default observer(function ImportedTransactionsList() {
  const {
      fileStore: {importedTransactions},
      transactionStore: {amountColor},
      accountStore: {getAccountName},
    } = useStore();


    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const [transactionToDelete, setTransactionToDelete] = useState<TransactionToDelete | undefined>(undefined);

    const handleDeleteButtonClick = (transaction: TransactionRowItem) => {
        setTransactionToDelete({
            index: transaction.id, 
            transactionId: transaction.transactionId, 
            type: transaction.amount.type,
            category: transaction.category.name,
            categoryId: transaction.category.id,
            amount: transaction.amount.value,
            currencySymbol: transaction.amount.currencySymbol,
            toAccountId: transaction.accountId
        })
        setOpenDeleteDialog(true);
    }

  return (<>
    <DeleteTransactionDialog 
            open={openDeleteDialog} setOpen={setOpenDeleteDialog}
            transaction={transactionToDelete} />
    <List disablePadding sx={{p: 1}}>
        {importedTransactions.map(transaction =>
            <ListItem
                key={transaction.id} 
                secondaryAction={
                    <Box display={'flex'} alignItems={"center"}>
                        <Typography mr={3} color={amountColor(transaction.amount.type)}>
                            {formatAmount(transaction.amount.value)} {transaction.amount.currencySymbol}
                        </Typography>
                        <IconButton 
                            edge={"end"} aria-label="delete" 
                            onClick={() => handleDeleteButtonClick(transaction)}>
                            <Clear />
                        </IconButton>
                    </Box>}
                >
                <ListItemText 
                    primary={
                    <Box component={"span"} display={'flex'} justifyItems={'center'}>
                        <CategoryIcon iconId={transaction.category.iconId} fontSize='small'/>
                        <Typography ml={1}>{transaction.category.name}</Typography>
                    </Box>}
                    secondary={<i>{transaction.accountId ? getAccountName(transaction.accountId): '(deleted)'} - {dayjs(transaction.date).format('DD.MM.YYYY')}</i>}/>
            </ListItem>
        )}
    </List>
    </>
  )
})