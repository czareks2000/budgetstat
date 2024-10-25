import { Add, ExpandMore, Wallet } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, IconButton, List, Typography } from '@mui/material'
import { formatAmount } from '../../../app/utils/FormatAmount'
import AccountItem from './AccountItem'
import { useStore } from '../../../app/stores/store'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import DeleteAccountDialog from '../../accounts/DeleteAccountDialog'
import { AccountStatus } from '../../../app/models/enums/AccountStatus'
import { router } from '../../../app/router/Routes'

interface Props {
    index: number;
    expanded: boolean;
    handleToggle: (index: number) => void;
}

export default observer(function AccountGroup({index, expanded, handleToggle}: Props) {
    const { 
        accountStore: {accounts, totalBalance, selectedAccount},
        currencyStore: {defaultCurrency}
    } = useStore();
    
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    }

    const handleAddButtonClick = () => {
        router.navigate(`/accounts/create`);
    }

    return (
    <>
        <DeleteAccountDialog key={selectedAccount?.id} 
                open={openDeleteDialog} setOpen={setOpenDeleteDialog}/>
        <Accordion 
            expanded={expanded}
            onChange={() => handleToggle(index)}>
            <AccordionSummary
            expandIcon={<ExpandMore />}
            aria-controls={`accounts-assets`}
            id={`accounts-assets`}
            >
                <Box display="flex" justifyContent="space-between" alignItems="center" width="100%">
                    <Box display="flex" alignItems="center">
                        <Wallet fontSize="small" sx={{mr: 1}}/>
                        <Typography>Accounts</Typography>
                    </Box>
                    <Typography sx={{mr: 2}} fontWeight={700}>
                        {formatAmount(totalBalance)} {defaultCurrency?.symbol}
                    </Typography>
                </Box>
            </AccordionSummary>
            <Divider/>
            {accounts.filter(a => a.status === AccountStatus.Visible).length > 0 &&<>
            <AccordionDetails>
                <List disablePadding>
                    {accounts.filter(a => a.status === AccountStatus.Visible)
                    .map((account) => 
                        <AccountItem key={account.id} 
                            account={account}
                            openDeleteDialog={handleOpenDeleteDialog} />     
                    )}
                </List>      
            </AccordionDetails>
            <Divider/></>}
            <Box display={'flex'} justifyContent={'center'} py={1}>
                <IconButton 
                    aria-label="add" 
                    onClick={handleAddButtonClick}>
                    <Add/>
                </IconButton>
            </Box>  
        </Accordion>
    </>
  )
})
