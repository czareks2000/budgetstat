import { observer } from "mobx-react-lite";
import * as Yup from 'yup';
import { Form, Formik } from "formik";
import { useStore } from "../../../app/stores/store";
import TextInput from "../../formInputs/TextInput";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { useState } from "react";
import { router } from "../../../app/router/Routes";

interface Props {
    token: string;
    email: string;
}


export default observer(function ResetPasswordForm({token, email}: Props) {
    const [showConfirmation, setShowConfirmation] = useState(false);

    const {userStore} = useStore();

    return (
    <>
        {showConfirmation ? 
        <>
            <Typography variant="h5" mb={4} align="center">Confirmation</Typography>
            <Paper>
                <Box p={2}>
                    <Stack spacing={2} width={400}>
                        <Typography py={1} textAlign={'center'}>
                            Your password has been changed successfully.
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
            <Typography variant="h5" mb={4} align="center">Reset your password</Typography>
            <Paper>
                <Box p={2}>
                    <Formik
                        initialValues={{
                            token: token,
                            email: email,
                            newPassword: '',
                            confirmNewPassword: '',
                            error: null
                        }}
                        onSubmit={(values, {setErrors, setSubmitting}) => {
                            userStore.resetPassword(values).then(() => {
                                setShowConfirmation(true);
                            }).catch(() =>{
                                setErrors({error: 'Reset password link is invalid or expired'});
                                setSubmitting(false);
                            });
                        } 
                        }
                        validationSchema={Yup.object({
                            newPassword: 
                                Yup.string().required('New password is required')
                                .min(4, 'Password must be at least 4 characters')
                                .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
                                .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
                                .matches(/\d/, 'Password must contain at least one digit')
                                .matches(/[\W_]/, 'Password must contain at least one special character'),
                            confirmNewPassword: Yup.string().required('Confirm password')
                                .oneOf([Yup.ref('newPassword')], 'Your passwords do not match.')
                        })}
                    >
                    {({handleSubmit, isSubmitting, isValid, dirty, errors}) => ( 
                        <Form
                            onSubmit={handleSubmit} 
                            autoComplete="off"
                        >   
                            <Stack spacing={2} width={400}>
                                <TextInput 
                                    label="New password"
                                    name="newPassword" type="password" />
                                <TextInput 
                                    label="Confirm password"
                                    name="confirmNewPassword" type="password"/>

                                {errors.error &&
                                <Typography color={'error'}>
                                    {errors.error}
                                </Typography>}

                                <LoadingButton 
                                    color="primary" 
                                    variant="contained" 
                                    fullWidth 
                                    type="submit" 
                                    disabled={!isValid || !dirty || isSubmitting}
                                    loading={isSubmitting}>
                                    Submit
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