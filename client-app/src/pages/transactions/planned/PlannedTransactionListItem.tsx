import { Box, IconButton, ListItem, ListItemText } from '@mui/material'
import CategoryIcon from '../../../components/common/CategoryIcon'
import { formatAmount } from '../../../app/utils/FormatAmount'
import { observer } from 'mobx-react-lite'
import { Check, Clear } from '@mui/icons-material'
import { convertToString } from '../../../app/utils/ConvertToString'
import { PlannedTransaction } from '../../../app/models/Transaction'
import { useStore } from '../../../app/stores/store'
import { TransactionType } from '../../../app/models/enums/TransactionType'

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
        
    const handleDeleteButtonClick = () => {
        deletePlannedTransaction(transaction.id);
    }

    const handleConfirmButtonClick = () => {
        confirmTransaction(transaction.id);
    }

    const fontColor = transaction.category.type === TransactionType.Income ? 'success.main' : 'error.main';

    return (
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
    )
})