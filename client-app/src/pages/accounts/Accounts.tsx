import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import { Divider, Grid, Stack } from "@mui/material";

import AccountsList from "./AccountsList";
import CreateAccount from "./CreateAccount";
import { useState } from "react";
import EditAccount from "./EditAccount";
import DeleteAccountDialog from "./DeleteAccountDialog";

export default observer(function Accounts() {
    const {accountStore: {accounts, selectedAccount}} = useStore();

    const [showCreateForm, setShowCreateForm] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);

    const toggleEditForm = (state: boolean) => {
        setShowCreateForm(!state);
        setShowEditForm(state);
    }

    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

    const handleOpenDeleteDialog = () => {
        setOpenDeleteDialog(true);
        toggleEditForm(false);
    }

    return (
        <>
            <DeleteAccountDialog key={selectedAccount?.id} open={openDeleteDialog} setOpen={setOpenDeleteDialog}/>
            <Grid container spacing={2}>
                <Grid item xs={12} lg={6}>
                    <Stack spacing={2}>
                        <Divider>Accounts</Divider>
                        <AccountsList 
                            accounts={accounts} 
                            toggleEditForm={toggleEditForm} 
                            openDeleteDialog={handleOpenDeleteDialog}/>
                    </Stack>
                </Grid>
                <Grid item xs={12} lg={6}>
                    <Stack spacing={2}>
                        {showCreateForm && <>
                            <Divider>Create Account</Divider>
                            <CreateAccount />
                        </>}
                        {showEditForm && <>
                            <Divider>Edit Account</Divider>
                            <EditAccount toggleEditForm={toggleEditForm} account={selectedAccount!}/>
                        </>}
                    </Stack>
                </Grid>
            </Grid>
        </>
    )
})