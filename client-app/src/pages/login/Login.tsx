import { Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import LoginForm from "../../components/forms/LoginForm"

export default observer(function Login() {
    return (
        <Stack
            direction="column"
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1, height: "100vh" }}
        >
            <Typography variant="h4" mb={4}>Login to BudgetStat</Typography>
            <LoginForm />
        </Stack>
    )
})