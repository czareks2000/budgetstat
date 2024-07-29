import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import { Divider, Stack } from "@mui/material";

import AccountsList from "./AccountsList";
import { useState } from "react";
import DeleteAccountDialog from "./DeleteAccountDialog";
import FloatingAddButton from "../../components/common/FloatingAddButton";
import { router } from "../../app/router/Routes";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";

export default observer(function Accounts() {
    const {accountStore: {accounts, selectedAccount}} = useStore();

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
    }

    const handleAddButtonClick = () => {
        router.navigate('/accounts/create');
    }

    return (
        <>
            <DeleteAccountDialog key={selectedAccount?.id} 
                open={openDeleteDialog} setOpen={setOpenDeleteDialog}/>
            <FloatingAddButton onClick={handleAddButtonClick}/>
            <ResponsiveContainer content={
                <Stack spacing={2}>
                    {accounts.length > 0 ? 
                        <Divider>Accounts</Divider>
                    :
                        <Divider>You have no accounts</Divider>
                    }
                    <AccountsList 
                        accounts={accounts}
                        openDeleteDialog={handleOpenDeleteDialog}/>
                </Stack>
            } />
        </>
    )
})