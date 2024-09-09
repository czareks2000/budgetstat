import { Box, CircularProgress, Grid2, Paper, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import LoginForm from "../../components/forms/Auth/LoginForm"
import { useState } from "react";
import RegisterForm from "../../components/forms/Auth/RegisterForm";
import { useStore } from "../../app/stores/store";
import { router } from "../../app/router/Routes";

export default observer(function Auth() {
    const {currencyStore: {currenciesLoaded}} = useStore();

    const [showLoginForm, setShowLoginForm] = useState(true);

    return (
        <Grid2 container display={'flex'} justifyContent="center" alignItems="center" height={'100vh'} >
            <Grid2 p={2} width={'400px'}>
                <Stack>
                    {showLoginForm ? 
                    <>
                        <Typography variant="h5" mb={4} align="center">Sign in to BudgetStat</Typography>
                        <Paper>
                            <Box p={2}>
                                <LoginForm />
                            </Box>
                        </Paper>
                        <Box mt={2} display={'flex'} justifyContent={'space-between'}>
                            <Typography
                                onClick={() => setShowLoginForm(false)}
                                sx={{cursor: "pointer"}}
                                color={'primary'}>
                                Sign up to BudgetStat
                            </Typography>
                            <Typography
                                onClick={() => router.navigate('/forgot-password')}
                                sx={{cursor: "pointer"}}
                                color={'primary'}>
                                Forgot password
                            </Typography>
                        </Box>
                    </> : <>
                        <Typography variant="h5" mb={4} align="center">Sign up to BudgetStat</Typography>
                        {currenciesLoaded ? 
                        <Paper>
                            <Box p={2}>
                                <RegisterForm />
                            </Box>
                        </Paper>
                        : 
                        <Box display={'flex'} justifyContent={'center'} my={5}>
                            <CircularProgress />
                        </Box>
                        }
                        <Box mt={2}>
                            <Typography
                                onClick={() => setShowLoginForm(true)}
                                sx={{cursor: "pointer"}}
                                color={'primary'}>
                                Alredy have an account? Sign In
                            </Typography>
                        </Box>
                    </> 
                    }
                </Stack>
            </Grid2>
        </Grid2>
    )
})