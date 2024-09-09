import { Grid2, Stack } from "@mui/material"
import { observer } from "mobx-react-lite"
import { useStore } from "../../app/stores/store";
import Wrapper from "../../app/layout/Wrapper";
import ForgotPasswordForm from "../../components/forms/Auth/ForgotPasswordForm";

export default observer(function ForgotPassword() {
    const {userStore: {}} = useStore();

    return (
    <Wrapper content={
        <Grid2 container display={'flex'} justifyContent="center" alignItems="center" height={'100vh'} >
            <Grid2 p={2} width={'400px'}>
                <Stack>
                    <ForgotPasswordForm />
                </Stack>
            </Grid2>
        </Grid2>
    }
    />
    )
})