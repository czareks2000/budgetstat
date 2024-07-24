import { Alert, Box, IconButton, ListItem, ListItemText, Snackbar } from '@mui/material'
import CategoryIcon from '../../../components/common/CategoryIcon'
import { formatAmount } from '../../../app/utils/FormatAmount'
import { observer } from 'mobx-react-lite'
import { Check, Clear } from '@mui/icons-material'
import { convertToString } from '../../../app/utils/ConvertToString'
import { PlannedTransaction } from '../../../app/models/Transaction'
import { useStore } from '../../../app/stores/store'
import { TransactionType } from '../../../app/models/enums/TransactionType'
import { useState } from 'react'

interface Props {
    transaction: PlannedTransaction;
    showConfirmAction?: boolean;
}

export default observer(function PlannedTransactionListItem({transaction, showConfirmAction}: Props) {
    const {
        accountStore: {getAccountName},
        currencyStore: {getCurrencySymbol},
        transactionStore: {deletePlannedTransaction, confirmTransaction}
    } = useStore();
        
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");

    const handleClose = (_: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway')
          return;
    
        setOpen(false);
    };

    const handleDeleteButtonClick = () => {
        deletePlannedTransaction(transaction.id);
    }

    const handleConfirmButtonClick = () => {
        confirmTransaction(transaction.id)
        .catch((err) => {
            setMessage(err);
            setOpen(true);
        });
    }

    const fontColor = transaction.category.type === TransactionType.Income ? 'success.main' : 'error.main';

    return (<>
        <Snackbar
            open={open}
            autoHideDuration={6000}
            onClose={handleClose}
            message={message}>
            <Alert
                onClose={handleClose}
                severity="error"
                variant="filled"
                sx={{ width: '100%' }}
            >
                {message}
            </Alert>
        </Snackbar>
        <ListItem 
            secondaryAction={
            <Box display={"flex"} alignItems={"center"} p={1}>
                <Box component={"span"} mt={'1px'} mr={2}>
                    {convertToString(transaction.date, 'DD.MM.YYYY')}
                </Box>
                {showConfirmAction &&
                <IconButton
                    sx={{mr: "0px" }} 
                    edge={"end"} aria-label="confirm" 
                    onClick={handleConfirmButtonClick}>
                    <Check/>
                </IconButton>}
                <IconButton 
                    edge={"end"} aria-label="delete" 
                    onClick={handleDeleteButtonClick}>
                    <Clear/>
                </IconButton>
            </Box>
            }>
            <Box p={1}>
            <ListItemText 
                primary={<>
                    <Box component={"span"} display={'flex'} mb={1}>
                        <CategoryIcon
                            iconId={transaction.category.iconId} 
                            fontSize="small" 
                            sx={{mt: '1px', mr: 1}}/>
                        <Box component={"span"} mr={1}>
                            {transaction.category.name}:
                        </Box>
                        <Box 
                            component={"span"} mr={1}
                            fontWeight={500}
                            color={fontColor}
                            >
                            {formatAmount(transaction.amount)} {getCurrencySymbol(transaction.currencyId)}
                        </Box>
                    </Box>
                </>}
                secondary={<i>{getAccountName(transaction.accountId)} - {transaction.description || "(no description)"}</i>}/>
            </Box>
        </ListItem>
    </>
    )
})