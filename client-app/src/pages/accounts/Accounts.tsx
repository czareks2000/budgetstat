import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import { Grid, Stack } from "@mui/material";

import AccountsList from "./AccountsList";
import CreateAccount from "./CreateAccount";
import { useState } from "react";
import EditAccount from "./EditAccount";

export default observer(function Accounts() {
    const {accountStore: {accounts, selectedAccount}} = useStore();
    const [showCreateForm, setShowCreateForm] = useState(true);
    const [showEditForm, setShowEditForm] = useState(false);

    const toggleEditForm = (state: boolean) => {
        setShowCreateForm(!state);
        setShowEditForm(state);
    }

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
                <Stack spacing={2}>
                    <AccountsList accounts={accounts} toggleEditForm={toggleEditForm}/>
                </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
                <Stack spacing={2}>
                    {showCreateForm && <CreateAccount />}
                    {showEditForm && <EditAccount toggleEditForm={toggleEditForm} account={selectedAccount!}/>}
                </Stack>
            </Grid>
        </Grid>
    )
})