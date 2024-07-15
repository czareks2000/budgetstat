import { Delete, Edit } from '@mui/icons-material'
import { Box, IconButton, ListItem, ListItemText } from '@mui/material'
import { formatAmount } from '../../../app/utils/FormatAmount'
import { observer } from 'mobx-react-lite'
import { Account } from '../../../app/models/Account';
import { useStore } from '../../../app/stores/store';
import { router } from '../../../app/router/Routes';

interface Props {
    account: Account;
    openDeleteDialog: () => void;
}

export default observer(function AccountItem({account, openDeleteDialog}: Props) {
    const {accountStore: {selectAccount}} = useStore();
    
    const handleDeleteButtonClick = () => {
        selectAccount(account.id);
        openDeleteDialog();
    }

    const handleEditButtonClick = () => {
        selectAccount(account.id);
        router.navigate(`/accounts/${account.id}/edit?redirect=assets`)
    }
    
    return (
    <ListItem 
        secondaryAction={
        <Box >
            <IconButton 
                sx={{mr: "0px" }} 
                edge={"end"} aria-label="edit" 
                onClick={handleEditButtonClick}>
                <Edit/>
            </IconButton>
            <IconButton 
                edge={"end"} aria-label="delete" 
                onClick={handleDeleteButtonClick}>
                <Delete/>
            </IconButton>
        </Box>
        }>
        <ListItemText 
            primary={account.name}
            secondary={<i>{formatAmount(account.balance)} {account.currency.symbol}</i>}/>
    </ListItem>    
  )
})