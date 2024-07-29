import { Box, CircularProgress, Paper, Stack, Typography } from "@mui/material"
import { observer } from "mobx-react-lite"
import LoginForm from "../../components/forms/Auth/LoginForm"
import { useState } from "react";
import RegisterForm from "../../components/forms/Auth/RegisterForm";
import { useStore } from "../../app/stores/store";

export default observer(function Auth() {
    const {currencyStore: {currenciesLoaded}} = useStore();

    const [showLoginForm, setShowLoginForm] = useState(true);

    return (
        
        <Stack
            justifyContent="center"
            alignItems="center"
            sx={{ width: 1, height: "100vh" }}
        >
            <Box p={2}>
                <Stack>
                    {showLoginForm ? <>
                        <Typography variant="h5" mb={4} align="center">Sign in to BudgetStat</Typography>
                        <Paper>
                            <Box p={2}>
                                <LoginForm />
                            </Box>
                        </Paper>
                        <Box mt={2}>
                            <Typography
                                onClick={() => setShowLoginForm(false)}
                                sx={{cursor: "pointer"}}
                                color={'primary'}>
                                Don't have an account? Sign Up
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
            </Box>
        </Stack>
       
    )
})