import { Box, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import Wrapper from "../../app/layout/Wrapper";
import ForgotPasswordForm from "../../components/forms/Auth/ForgotPasswordForm";

export default observer(function ForgotPassword() {
    const {userStore: {}} = useStore();

    return (
    <Wrapper content={
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1, height: "100vh" }}
        >
            <Box p={2}>
                <Stack>
                    <ForgotPasswordForm />
                </Stack>
            </Box>
        </Stack>
    }
    />
    )
})