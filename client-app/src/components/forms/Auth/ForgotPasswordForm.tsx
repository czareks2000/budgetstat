import { observer } from "mobx-react-lite"
import { useStore } from "../../../app/stores/store";
import { ErrorMessage, Form, Formik } from "formik";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import LoadingButton from '@mui/lab/LoadingButton';
import TextInput from "../../formInputs/TextInput";
import { useState } from "react";
import { router } from "../../../app/router/Routes";

export default observer(function ForgotPasswordForm() {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const {userStore} = useStore();
    
    return (
        <>
        {showConfirmation ? 
        <>
        <Typography variant="h5" mb={4} align="center">Confirmation</Typography>
        <Paper>
            <Box p={2}>
                <Stack spacing={2}>
                    <Typography py={1} textAlign={'center'}>
                        A link to reset your password has been sent to the provided email address. Please check your inbox.
                    </Typography>
                    <Button 
                        color="primary" 
                        variant="contained" 
                        fullWidth 
                        onClick={() => router.navigate('/')}>
                        Go to login page
                    </Button>
                </Stack> 
            </Box>
        </Paper>
        </>
        :
        <>
            <Typography variant="h5" mb={4} align="center">Forgot password?</Typography>
            <Paper>
                <Box p={2}>
                    <Formik
                        initialValues={{email: '', error: null}}
                        onSubmit={(values, {setErrors}) => 
                            userStore.forgotPassword(values.email)
                            .then(() => 
                                setShowConfirmation(true))
                            .catch(() => 
                                setErrors({error: 'Invalid email'}))
                        }   
                    >
                        {({handleSubmit, isSubmitting, dirty}) => (
                            <Form 
                                onSubmit={handleSubmit} 
                                autoComplete="off"
                            >     
                                <Stack spacing={2}>
                                    <Paper>
                                        <TextInput label="Email address" name="email" fullWidth />
                                    </Paper>
                                    <Typography color={'error'}>
                                        <ErrorMessage 
                                            name="error"
                                            component="span"
                                        />
                                    </Typography>
                                    <LoadingButton 
                                        color="primary" 
                                        variant="contained" 
                                        fullWidth 
                                        type="submit" 
                                        disabled={isSubmitting || !dirty}
                                        loading={isSubmitting}>
                                        Send email
                                    </LoadingButton>
                                </Stack>              
                            </Form>
                        )}
                    </Formik>
                </Box>
            </Paper>
            <Box mt={2}>
                <Typography
                    onClick={() => router.navigate('/')}
                    sx={{cursor: "pointer"}}
                    color={'primary'}>
                    Remember your password? Sign In
                </Typography>
            </Box>
        </>}
        </>
    )
})