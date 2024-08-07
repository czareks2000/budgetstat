import { observer } from "mobx-react-lite"
import ResponsiveContainer from "../../components/common/ResponsiveContainer"
import { Box, Divider, Paper, Stack } from "@mui/material"
import ChangePasswordForm from "../../components/forms/Auth/ChangePasswordForm"

export default observer(function ChangePassword() {
    return (
    <>
        <ResponsiveContainer content={
            <Stack spacing={2}>
                <Divider>Change password</Divider>
                <Paper>
                    <Box p={2}>
                        <ChangePasswordForm />
                    </Box>
                </Paper>
            </Stack>
        } 
        />
    </>
    )
})