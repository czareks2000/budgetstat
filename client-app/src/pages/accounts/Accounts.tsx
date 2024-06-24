import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import { Grid, Stack } from "@mui/material";

import AccountsList from "./AccountsList";
import CreateAccount from "./CreateAccount";

export default observer(function Accounts() {
    const {accountStore: {accounts}} = useStore();

    return (
        <Grid container spacing={2}>
            <Grid item xs={12} lg={6}>
                <Stack spacing={2}>
                    <AccountsList accounts={accounts} />
                </Stack>
            </Grid>
            <Grid item xs={12} lg={6}>
                <Stack spacing={2}>
                    <CreateAccount />
                </Stack>
            </Grid>
        </Grid>
    )
})