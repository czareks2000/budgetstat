import { Box, Divider, Paper, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import CreateAccountForm from "../../components/forms/Account/CreateAccountForm"
import { AccountFormValues } from "../../app/models/Account";
import { FormikHelpers } from "formik";
import { useStore } from "../../app/stores/store";
import ResponsiveContainer from "../../components/common/ResponsiveContainer";
import { router } from "../../app/router/Routes";

export default observer(function CreateAccount() {
  const {accountStore: {createAccount}} = useStore();
  
  // create
  function handleCreate(account: AccountFormValues, formikHelpers: FormikHelpers<AccountFormValues>): void {
    createAccount(account).then(() => {
        router.navigate('/accounts');
        formikHelpers.resetForm();
    }).catch(error => {
        formikHelpers.setErrors({
          name: error
        });
        formikHelpers.setSubmitting(false);
    });
  }

  const handleCancel = () => {
    router.navigate('/accounts');
  }
  
  return (
    <ResponsiveContainer content={
        <Stack spacing={2}>
            <Divider>Create Account</Divider>
            <Paper>
              <Box p={2}>
                <CreateAccountForm onSubmit={handleCreate} onCancel={handleCancel}/>
              </Box>
            </Paper>
        </Stack>
    }/>
  )
})
