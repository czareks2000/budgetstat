import { Button, Link as MuiLink, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import LoginForm from "../../components/forms/LoginForm"
import { useStore } from "../../app/stores/store";
import { Link } from "react-router-dom";

export default observer(function Login() {
    const {userStore} = useStore();

    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1, height: "100vh" }}
        >
            {!userStore.isLoggedIn || userStore.logging ?
                <>
                    <Typography variant="h4" mb={4}>Login to BudgetStat</Typography>
                    <LoginForm />
                </>
            :
                <>
                    <Typography variant="h4" mb={4}>Welcome to BudgetStat</Typography>
                    <MuiLink component={Link} to='home' underline='none' color='inherit'>
                        <Button variant="contained">Go to dashboard</Button>
                    </MuiLink>
                </>
            }
        </Stack>
    )
})