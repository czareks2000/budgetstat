import { Grid2, Stack } from "@mui/material"
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
        <Grid2 container display={'flex'} justifyContent="center" alignItems="center" height={'100vh'} >
            <Grid2 p={2} width={'400px'}>
                <Stack>
                    <ResetPasswordForm token={token!} email={email!}/>
                </Stack>
            </Grid2>
        </Grid2>
    }
    />
    )
})