import { Box, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import Wrapper from "../../app/layout/Wrapper";
import { useSearchParams } from "react-router-dom";
import ResetPasswordForm from "../../components/forms/Auth/ResetPasswordForm";

export default observer(function ResetPassword() {
    const {userStore: {}} = useStore();

    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");
    const email = searchParams.get("email");

    return (
    <Wrapper content={
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1, height: "100vh" }}
        >
            <Box p={2}>
                <Stack>
                    <ResetPasswordForm token={token!} email={email!}/>
                </Stack>
            </Box>
        </Stack>
    }
    />
    )
})