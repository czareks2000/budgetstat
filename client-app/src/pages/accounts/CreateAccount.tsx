import { Box, Divider, Paper } from "@mui/material"
import { observer } from "mobx-react-lite"
import CreateAccountForm from "../../components/forms/CreateAccountForm"
import { AccountFormValues } from "../../app/models/Account";
import { FormikHelpers } from "formik";
import { useStore } from "../../app/stores/store";

export default observer(function CreateAccount() {
  const {accountStore: {createAccount}} = useStore();
  
  // create
  function handleCreate(account: AccountFormValues, formikHelpers: FormikHelpers<AccountFormValues>): void {
    createAccount(account).then(() => {
        formikHelpers.resetForm();
    });
}
  
  return (
    <Paper>
      <Box p={2}>
        <CreateAccountForm onSubmit={handleCreate}/>
      </Box>
    </Paper>
  )
})
