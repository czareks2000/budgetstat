import { ExpandMore } from '@mui/icons-material'
import { Accordion, AccordionDetails, AccordionSummary, Box, Divider, List, Typography } from '@mui/material'
import { formatAmount } from '../../../app/utils/FormatAmount'
import AccountItem from './AccountItem'
import CategoryIcon from '../../../components/common/CategoryIcon'
import { useStore } from '../../../app/stores/store'
import { observer } from 'mobx-react-lite'
import { useState } from 'react'
import DeleteAccountDialog from '../../accounts/DeleteAccountDialog'

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
                        <CategoryIcon iconId={1} fontSize="small" sx={{mr: 1}}/>
                        <Typography>Accounts</Typography>
                    </Box>
                    <Typography sx={{mr: 2}} fontWeight={700}>
                        {formatAmount(totalBalance)} {defaultCurrency?.symbol}
                    </Typography>
                </Box>
            </AccordionSummary>
            <Divider/>
            <AccordionDetails>
                <List disablePadding>
                    {accounts.map((account) => 
                        <AccountItem key={account.id} 
                            account={account}
                            openDeleteDialog={handleOpenDeleteDialog} />     
                    )}
                </List>      
            </AccordionDetails>
        </Accordion>
    </>
  )
})
