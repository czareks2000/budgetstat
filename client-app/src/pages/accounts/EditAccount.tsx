import { Box, Paper } from "@mui/material"
import { observer } from "mobx-react-lite"
import { Account, AccountFormValues } from "../../app/models/Account";
import { useStore } from "../../app/stores/store";
import EditAccountForm from "../../components/forms/EditAccountForm";

interface Props {
    account: Account;
    toggleEditForm: (state: boolean) => void;
}

export default observer(function EditAccount({account, toggleEditForm}: Props) {
    const {accountStore: {updateAccount, selectedAccount}} = useStore();
    
    // create
    function handleUpdate(updatedAccount: AccountFormValues): void {
        updateAccount(account.id, updatedAccount)
            .then(() => toggleEditForm(false));
    }

    const initialValues: AccountFormValues = {
        name: account.name,
        description: account.description,
    }
    
    return (
        <Paper>
            <Box p={2}>
                <EditAccountForm 
                    key={selectedAccount?.id} 
                    onSubmit={handleUpdate} 
                    toggleEditForm={toggleEditForm} 
                    initialValues={initialValues}/>
            </Box>
        </Paper>
    )
})